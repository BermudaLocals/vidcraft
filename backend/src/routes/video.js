const router    = require("express").Router();
const auth      = require("../middleware/auth");
const Generator = require("../services/videoGenerator");
const Video     = require("../models/Video");
const fs        = require("fs");
const path      = require("path");
const gen       = new Generator();

router.post("/generate", auth, async (req, res) => {
  try {
    const { content, options } = req.body;
    if (!content) return res.status(400).json({ message: "Content required" });
    const result = await gen.generateVideoFromContent(content, options || {});
    const videoRecord = await Video.create({
      title: content.title || "Generated Video",
      script: result.script,
      videoPath: path.basename(result.videoPath),
      duration: result.duration,
      status: "completed",
      sourceContent: content,
      options: options || {},
      user: req.user.id
    });
    res.json({ ...videoRecord.toObject(), videoPath: path.basename(result.videoPath) });
  } catch (e) { console.error(e); res.status(500).json({ message: "Server error" }); }
});

router.get("/", auth, async (req, res) => {
  try { res.json(await Video.find({ user: req.user.id }).sort({ createdAt: -1 })); }
  catch { res.status(500).json({ message: "Server error" }); }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const video = await Video.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!video) return res.status(404).json({ message: "Not found" });
    const fp = path.join(__dirname, "../../temp/videos", video.videoPath);
    if (fs.existsSync(fp)) fs.unlinkSync(fp);
    res.json({ message: "Deleted" });
  } catch { res.status(500).json({ message: "Server error" }); }
});

module.exports = router;
