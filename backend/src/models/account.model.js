const mongoose = require("mongoose");
const ledgerModel = require("./ledger.model")

const accountSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: [true, "Account must be associated with a user"],
    index: true
  },
  status: {
    type: String,
    enum: {
      values: ["ACTIVE", "INACTIVE", "CLOSED"],
      message: "status must be either ACTIVE, INACTIVE or CLOSED"
    },
    default: "ACTIVE"
  },
  currency: {
    type: String,
    required: [true, "Currency is required for creating an account"],
    default: "INR"
  }
  ,
  systemUser: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true
})

accountSchema.index({ userId: 1, status: 1 });

accountSchema.methods.getBalance = async function () {
  const balanceData = await ledgerModel.aggregate([
    { $match: { accountId: this._id } },
    {
      $group: {
        _id: null,
        totalDebit: {
          $sum: {
            $cond: [
              { $eq: ["$type", "DEBIT"] },
              "$amount",
              0
            ]
          }
        },
        totalCredit: {
          $sum: {
            $cond: [
              { $eq: ["$type", "CREDIT"] },
              "$amount",
              0
            ]
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        balance: { $subtract: ["$totalCredit", "$totalDebit"] }
      }
    }
   ])

   if(balanceData.length === 0) {
    return 0;
   }
    return balanceData[0].balance;
}

const accountModel = mongoose.model("account", accountSchema);


module.exports = accountModel;