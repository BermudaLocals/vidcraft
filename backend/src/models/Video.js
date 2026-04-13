const mongoose = require("mongoose");
const VideoSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  script:      { type: String, required: true },
  videoPath:   { type: String, required: true },
  thumbnail:   String,
  duration:    { type: Number, required: true },
  status:      { type: String, enum: ["processing","completed","failed"], default: "processing" },
  sourceContent: mongoose.Schema.Types.Mixed,
  options: { style: String, voice: String, includeSubtitles: Boolean, backgroundColor: String, textColor: String },
  user:        { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt:   { type: Date, default: Date.now }
});
module.exports = mongoose.model("Video", VideoSchema);
