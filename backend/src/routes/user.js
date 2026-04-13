const router = require("express").Router();
const auth   = require("../middleware/auth");
const User   = require("../models/User");

router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch { res.status(500).json({ message: "Server error" }); }
});

router.put("/profile", auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, { $set: req.body }, { new: true }).select("-password");
    res.json(user);
  } catch { res.status(500).json({ message: "Server error" }); }
});

router.get("/settings", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("settings");
    res.json(user.settings);
  } catch { res.status(500).json({ message: "Server error" }); }
});

router.put("/settings", auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, { $set: { settings: req.body } }, { new: true }).select("settings");
    res.json(user.settings);
  } catch { res.status(500).json({ message: "Server error" }); }
});

module.exports = router;
