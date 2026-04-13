const cron          = require("node-cron");
const ScheduledPost = require("../models/ScheduledPost");
const SocialAccount = require("../models/SocialAccount");
const Video         = require("../models/Video");
const User          = require("../models/User");
const Publisher     = require("./socialPublisher");
const fs            = require("fs");
const path          = require("path");

class Scheduler {
  constructor() {
    this.publisher = new Publisher();
    cron.schedule("* * * * *",  () => this.processScheduledPosts());
    cron.schedule("0 2 * * *",  () => this.cleanupOldVideos());
    console.log("Scheduler running");
  }

  async processScheduledPosts() {
    const posts = await ScheduledPost.find({ scheduledAt: { $lte: new Date() }, status: "scheduled" }).populate("video user");
    for (const post of posts) {
      try {
        const accounts = await SocialAccount.find({ user: post.user._id, platform: { $in: post.platforms } });
        const keys = {}; accounts.forEach(a => { keys[a.platform] = a.accessToken; });
        const vp = path.join(__dirname, "../../temp/videos", post.video.videoPath);
        const results = await this.publisher.publishToMultiplePlatforms(vp, post.caption, post.platforms, keys);
        post.results = results;
        post.status  = results.some(r => r.success) ? "posted" : "failed";
        await post.save();
        if (post.status === "posted") await User.findByIdAndUpdate(post.user._id, { $inc: { postsPublished: 1 } });
      } catch (e) {
        post.status = "failed"; post.results = [{ platform: "all", success: false, error: e.message }];
        await post.save();
      }
    }
  }

  async cleanupOldVideos() {
    const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 30);
    const old = await Video.find({ createdAt: { $lt: cutoff } });
    for (const v of old) {
      const fp = path.join(__dirname, "../../temp/videos", v.videoPath);
      if (fs.existsSync(fp)) fs.unlinkSync(fp);
      await v.deleteOne();
    }
    console.log(`Cleaned up ${old.length} old videos`);
  }
}

module.exports = Scheduler;
