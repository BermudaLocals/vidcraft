const mongoose = require("mongoose");
const ScheduledPostSchema = new mongoose.Schema({
  video:       { type: mongoose.Schema.Types.ObjectId, ref: "Video", required: true },
  platforms:   [{ type: String, enum: ["youtube","tiktok","instagram","twitter"] }],
  caption:     { type: String, required: true },
  scheduledAt: { type: Date, required: true },
  status:      { type: String, enum: ["scheduled","posted","failed"], default: "scheduled" },
  results:     [{ platform: String, success: Boolean, url: String, error: String, postedAt: Date }],
  user:        { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt:   { type: Date, default: Date.now }
});
module.exports = mongoose.model("ScheduledPost", ScheduledPostSchema);
