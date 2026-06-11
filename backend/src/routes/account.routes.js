const express = require("express")
const { authMiddleware } = require("../middleware/auth.middleware")
const router = express.Router();
const accountController = require("../controllers/account.controller")

router.post("/", authMiddleware, accountController.createAccountController)

router.get("/", authMiddleware, accountController.getUserAccountsController)
router.get("/:accountId/balance", authMiddleware, accountController.getAccountBalanceController)




module.exports = router