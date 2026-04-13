const mongoose = require("mongoose");
const SocialAccountSchema = new mongoose.Schema({
  platform:     { type: String, enum: ["youtube","tiktok","instagram","twitter"], required: true },
  accountId:    { type: String, required: true },
  accountName:  { type: String, required: true },
  accessToken:  { type: String, required: true },
  refreshToken: String,
  user:         { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt:    { type: Date, default: Date.now }
});
module.exports = mongoose.model("SocialAccount", SocialAccountSchema);
