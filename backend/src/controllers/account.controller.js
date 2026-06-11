const accountModel = require("../models/account.model")


async function createAccountController(req,res){
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized access. User session invalid.",
      })
    }
    const account = await accountModel.create({
      userId: user._id,
    })
    return res.status(201).json({
      account,
    })
  } catch (err) {
    return res.status(500).json({
      message: "Failed to create account.",
      error: err.message,
    })
  }
}

async function getUserAccountsController(req,res){

  const accounts =await accountModel.find({userId:req.user._id}) 
  res.status(200).json({
    accounts
  })
}
async function getAccountBalanceController(req,res){
  const {accountId} =req.params;
  const account = await accountModel.findOne({
   _id:accountId,
   userId:req.user._id
})
   if(!account){
    return res.status(404).json({
      message:"Account not found"
    })
   }
   const balance = await account.getBalance();
   res.status(200).json({
    accountId: account._id,
    balance: balance
   })
}

module.exports = {
  createAccountController,
  getUserAccountsController,
  getAccountBalanceController
}