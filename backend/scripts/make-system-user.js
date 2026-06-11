/* Usage: node scripts/make-system-user.js <USER_ID>

This script marks the user as systemUser and creates an ACTIVE system account
for that user if one doesn't already exist.
*/

require('dotenv').config();
const mongoose = require('mongoose');
const userModel = require('../src/models/user.model');
const accountModel = require('../src/models/account.model');

async function main() {
  const userId = process.argv[2];
  if (!userId) {
    console.error('Usage: node scripts/make-system-user.js <USER_ID>');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('connected to DB');

    const updateResult = await userModel.updateOne({ _id: userId }, { $set: { systemUser: true } });
    console.log('user update result:', updateResult);

    const existing = await accountModel.findOne({ userId: userId, systemUser: true });
    if (existing) {
      console.log('system account already exists:', existing._id.toString());
    } else {
      const acc = await accountModel.create({
        userId: userId,
        systemUser: true,
        status: 'ACTIVE',
        currency: 'INR'
      });
      console.log('created system account:', acc._id.toString());
    }
  } catch (err) {
    console.error('error:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

main();
