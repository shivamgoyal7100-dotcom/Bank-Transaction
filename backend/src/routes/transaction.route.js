const express = require("express")
const { authMiddleware, authSystemUserMiddleware } = require("../middleware/auth.middleware")
const transactionController = require("../controllers/transaction.controller")

const transactionRoutes = express.Router();

transactionRoutes.post("/", authMiddleware, transactionController.createTransaction)
transactionRoutes.post("/system/initial-funds", authSystemUserMiddleware, transactionController.createInitialFundsTransaction)
transactionRoutes.get('/history', authMiddleware, transactionController.getUserTransactions)
transactionRoutes.get('/:id', authMiddleware, transactionController.getTransactionById)

module.exports = transactionRoutes;