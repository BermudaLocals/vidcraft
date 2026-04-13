const router        = require("express").Router();
const auth          = require("../middleware/auth");
const SocialAccount = require("../models/SocialAccount");
const ScheduledPost = require("../models/ScheduledPost");
const Video         = require("../models/Video");
const Publisher     = require("../services/socialPublisher");
const path          = require("path");
const pub           = new Publisher();

router.get("/accounts", auth, async (req, res) => {
  try { res.json(await SocialAccount.find({ user: req.user.id })); }
  catch { res.status(500).json({ message: "Server error" }); }
});

router.post("/connect", auth, async (req, res) => {
  try {
    const { platform, accountId, accountName, accessToken, refreshToken } = req.body;
    const existing = await SocialAccount.findOne({ user: req.user.id, platform });
    if (existing) {
      Object.assign(existing, { accountId, accountName, accessToken, refreshToken });
      await existing.save(); return res.json(existing);
    }
    res.json(await SocialAccount.create({ user: req.user.id, platform, accountId, accountName, accessToken, refreshToken }));
  } catch { res.status(500).json({ message: "Server error" }); }
});

router.delete("/:platform", auth, async (req, res) => {
  try {
    await SocialAccount.findOneAndDelete({ user: req.user.id, platform: req.params.platform });
    res.json({ message: "Disconnected" });
  } catch { res.status(500).json({ message: "Server error" }); }
});

router.post("/publish", auth, async (req, res) => {
  try {
    const { videoId, caption, platforms, scheduledAt } = req.body;
    const video = await Video.findOne({ _id: videoId, user: req.user.id });
    if (!video) return res.status(404).json({ message: "Video not found" });

    if (scheduledAt) {
      const post = await ScheduledPost.create({ video: videoId, platforms, caption, scheduledAt, user: req.user.id });
      return res.json({ scheduled: true, post });
    }

    const accounts = await SocialAccount.find({ user: req.user.id, platform: { $in: platforms } });
    const keys = {};
    accounts.forEach(a => { keys[a.platform] = a.accessToken; });
    const videoPath = path.join(__dirname, "../../temp/videos", video.videoPath);
    const results = await pub.publishToMultiplePlatforms(videoPath, caption, platforms, keys);
    res.json(results);
  } catch (e) { console.error(e); res.status(500).json({ message: "Server error" }); }
});

router.get("/scheduled", auth, async (req, res) => {
  try { res.json(await ScheduledPost.find({ user: req.user.id }).sort({ scheduledAt: 1 }).populate("video")); }
  catch { res.status(500).json({ message: "Server error" }); }
});

module.exports = router;
