const mongoose = require("mongoose");

const TempUserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  verificationCode: String,
  createdAt: { type: Date, expires: "10m", default: Date.now }, // Expiry in 10 minutes
});

module.exports = mongoose.model("TempUser", TempUserSchema);
