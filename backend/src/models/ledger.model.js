const mongoose = require("mongoose")

const ledgerSchema = new mongoose.Schema({
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "account",
    required: [true, "Ledger entry must be associated with an account"],
    index: true
  },
  amount: {
    type: Number,
    required: [true, "Ledger entry must have an amount"],
    immutable: true
  },
  amount: {
    type: Number,
    required: [true, "Ledger entry must have an amount"],
    immutable: true
  },
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "transaction",
    required: [true, "Ledger entry must be associated with a transaction"], 
    index: true,
    immutable: true
  },
  type: {
    type: String,
    enum: {
      values: ["DEBIT", "CREDIT"],
      message: "Ledger entry type must be either DEBIT or CREDIT"
    },
    required: [true, "Ledger entry must have a type"],
    immutable: true
  }
}, {
  timestamps: true
})

function preventLedgerEntryUpdate(next) {
  throw new Error("Ledger entries cannot be updated once created");
} 

ledgerSchema.pre("findOneAndUpdate", preventLedgerEntryUpdate);
ledgerSchema.pre("findOneAndReplace", preventLedgerEntryUpdate);
ledgerSchema.pre("findOneAndDelete", preventLedgerEntryUpdate);
ledgerSchema.pre("updateOne", preventLedgerEntryUpdate);
ledgerSchema.pre("deleteOne", preventLedgerEntryUpdate); 
ledgerSchema.pre("remove", preventLedgerEntryUpdate);
ledgerSchema.pre("updateMany", preventLedgerEntryUpdate);
ledgerSchema.pre("deleteMany", preventLedgerEntryUpdate);

const ledgerModel = mongoose.model("ledger", ledgerSchema);
module.exports = ledgerModel;

