const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  email:        { type: String, required: true, unique: true },
  password:     String,
  avatar:       String,
  provider:     { type: String, enum: ["email","google"], default: "email" },
  googleId:     String,
  subscription: { type: String, enum: ["free","pro","enterprise"], default: "free" },
  postsPublished: { type: Number, default: 0 },
  engagementRate: { type: Number, default: 0 },
  apiKeys: { youtube: String, tiktok: String, instagram: String, twitter: String },
  settings: {
    autoPost: { type: Boolean, default: false },
    contentFrequency: { type: Number, default: 1 },
    contentCategories: [String],
    brandVoice: String
  },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model("User", UserSchema);
