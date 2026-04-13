const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/User");

const sign = (user) => jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: "7d" });

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (await User.findOne({ email })) return res.status(400).json({ message: "User already exists" });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, provider: "email" });
    res.status(201).json({ token: sign(user), user: { id: user._id, name, email, avatar: user.avatar } });
  } catch (e) { res.status(500).json({ message: "Server error" }); }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(400).json({ message: "Invalid credentials" });
    res.json({ token: sign(user), user: { id: user._id, name: user.name, email, avatar: user.avatar } });
  } catch (e) { res.status(500).json({ message: "Server error" }); }
});

router.post("/verify", async (req, res) => {
  try {
    const payload = jwt.verify(req.body.token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select("-password");
    res.json({ user });
  } catch { res.status(401).json({ message: "Invalid token" }); }
});

router.get("/google", passport.authenticate("google", { scope: ["profile","email"] }));
router.get("/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${sign(req.user)}`)
);

module.exports = router;
