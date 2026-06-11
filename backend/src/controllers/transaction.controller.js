const transactionModel = require("../models/transaction.model")
const ledgerModel = require("../models/ledger.model")
const accountModel = require("../models/account.model")
const emailService = require("../services/mail.service")
const { transactionAlertTemplate } = require("../utils/mail.templates")
const mongoose = require("mongoose")

async function createTransaction(req, res) {
  // validate request body
  const {
    fromAccount,
    toAccount,
    amount,
    idempotencyKey: idempotencyKeyFromBody,
    idempotencykey: idempotencyKeyLower,
  } = req.body
  const idempotencyKey = idempotencyKeyFromBody || idempotencyKeyLower
  const requiredFields = { fromAccount, toAccount, amount, idempotencyKey }
  const missingFields = Object.entries(requiredFields)
    .filter(([, value]) => value === undefined || value === null || value === "")
    .map(([key]) => key)

  if (missingFields.length) {
    return res.status(400).json({
      error: `Missing required fields: ${missingFields.join(", ")}`,
      receivedBody: req.body
    })
  }

  const fromUserAccount = await accountModel.findOne({
    _id: fromAccount,
  })
  const toUserAccount = await accountModel.findOne({
    _id: toAccount,
  })
  if (!fromUserAccount || !toUserAccount) {
    return res.status(404).json({
      error: "One or both accounts not found"
    })
  }

  //validate idempotency key
  const isTransactionAlreadyExists = await transactionModel.findOne({
    idempotencyKey: idempotencyKey
  })

  if (isTransactionAlreadyExists) {
    if (isTransactionAlreadyExists.status === "COMPLETED") {
      return res.status(200).json({
        message: "Transaction already completed",
        transaction: isTransactionAlreadyExists
      })
    }
    if (isTransactionAlreadyExists.status === "PENDING") {
      return res.status(200).json({
        message: "Transaction is still pending",
      })
    }
    if (isTransactionAlreadyExists.status === "FAILED") {
      return res.status(500).json({
        message: "Transaction processing  failed, please retry",
      })
    }
    if (isTransactionAlreadyExists.status === "RESERVED") {
      return res.status(500).json({
        message: "Transaction is in reserved state, please wait",
      })
    }
  }
  //check account status
  if (fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE") {
    return res.status(400).json({
      message: "both fromAccount and toAccount must be active to process transaction "
    })
  }
  //Derive sender balance from ledger 

  const balance = await fromUserAccount.getBalance()

  if (balance < amount) {
    return res.status(400).json({
      message: `Insufficient balance. Current balance is ${balance}. Requested amount is ${amount}`
    })
  }
  try {
    //create transaction (PENDING)
    const session = await mongoose.startSession()
    session.startTransaction()

    const transaction = (await transactionModel.create([{
      fromAccount,
      toAccount,
      amount,
      idempotencyKey,
      status: "PENDING"
    }], { session }))[0]

    const debitEntry = await ledgerModel.create([{
      accountId: fromAccount,
      amount: amount,
      transactionId: transaction._id,
      type: "DEBIT"
    }], { session })

    await (() => {
      return new Promise((resolve) => setTimeout(resolve, 100 * 1000));
    })()
    const creditEntry = await ledgerModel.create([{
      accountId: toAccount,
      amount: amount,
      transactionId: transaction._id,
      type: "CREDIT"
    }], { session })

    await transactrionModel.findOneAndupdate(
      { _id: transaction._id },
      { status: "COMPLETED" },
      { session }
    )

    await session.commitTransaction()
    session.endSession()
  } catch (error) {
   return res.status(400).json({
      message: "Transaction is pending due to an error, please retry after sometime",
      
    })
  }
  //send email notification
  const html = transactionAlertTemplate(req.user.name, { amount, type: "CREDIT", status: "COMPLETED", reference: transaction._id, date: new Date().toLocaleString() })
  await emailService.sendEmail(req.user.email, "Transaction Completed", html)
  return res.status(201).json({
    message: "Transaction completed successfully",
    transaction: transaction
  })

}

async function createInitialFundsTransaction(req, res) {
  const {
    toAccount,
    amount,
    idempotencyKey: idempotencyKeyFromBody,
    idempotencykey: idempotencyKeyLower,
  } = req.body
  const idempotencyKey = idempotencyKeyFromBody || idempotencyKeyLower

  if (!toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message: "toAccount, amount and idempotencyKey are required ",
      receivedBody: req.body
    })
  }

  const existingTransaction = await transactionModel.findOne({
    idempotencyKey,
  })

  if (existingTransaction) {
    if (existingTransaction.status === "COMPLETED") {
      return res.status(200).json({
        message: "Transaction already completed",
        transaction: existingTransaction,
      })
    }
    if (existingTransaction.status === "PENDING") {
      return res.status(200).json({
        message: "Transaction is still pending",
      })
    }
    if (existingTransaction.status === "FAILED") {
      return res.status(500).json({
        message: "Previous transaction failed, please retry",
      })
    }
  }

  const toUserAccount = await accountModel.findOne({
    _id: toAccount,
  })
  if (!toUserAccount) {
    return res.status(404).json({
      message: "toAccount not found"
    })
  }

  const fromUserAccount = await accountModel.findOne({
    systemUser: true,
    userId: req.user._id
  })
  if (!fromUserAccount) {
    return res.status(404).json({
      message: "System account for user not found"
    })
  }

  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const transaction = new transactionModel({
      fromAccount: fromUserAccount._id,
      toAccount,
      amount,
      idempotencyKey,
      status: "PENDING"
    })

    await ledgerModel.create([{
      accountId: fromUserAccount._id,
      amount: amount,
      transactionId: transaction._id,
      type: "DEBIT"
    }, {
      accountId: toAccount,
      amount: amount,
      transactionId: transaction._id,
      type: "CREDIT"
    }], { session })

    transaction.status = "COMPLETED"
    await transaction.save({ session })

    await session.commitTransaction()
    session.endSession()

    return res.status(201).json({
      message: "Transaction completed successfully",
      transaction: transaction
    })
  } catch (err) {
    await session.abortTransaction()
    session.endSession()

    if (err.code === 11000 && err.keyPattern?.idempotencyKey) {
      const duplicate = await transactionModel.findOne({ idempotencyKey })
      return res.status(200).json({
        message: "Transaction already exists",
        transaction: duplicate,
      })
    }

    return res.status(500).json({
      message: "Failed to create initial funds transaction",
      error: err.message,
    })
  }
}

async function getUserTransactions(req, res) {
  try {
    const accounts = await accountModel.find({ userId: req.user._id }).select('_id')
    const accountIds = accounts.map((a) => a._id)

    const transactions = await transactionModel.find({
      $or: [
        { fromAccount: { $in: accountIds } },
        { toAccount: { $in: accountIds } }
      ]
    }).sort({ createdAt: -1 }).populate('fromAccount toAccount')

    return res.status(200).json({ transactions })
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch transactions', error: err.message })
  }
}

async function getTransactionById(req, res) {
  try {
    const { id } = req.params
    const transaction = await transactionModel.findById(id).populate('fromAccount toAccount')
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' })
    }

    const accounts = await accountModel.find({ userId: req.user._id }).select('_id')
    const accountIds = accounts.map((a) => a._id.toString())
    if (!accountIds.includes(transaction.fromAccount._id.toString()) && !accountIds.includes(transaction.toAccount._id.toString())) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    return res.status(200).json({ transaction })
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch transaction', error: err.message })
  }
}

module.exports = {
  createTransaction,
  createInitialFundsTransaction,
  getUserTransactions,
  getTransactionById
}