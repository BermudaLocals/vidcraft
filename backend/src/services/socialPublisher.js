const axios    = require("axios");
const fs       = require("fs");
const FormData = require("form-data");

class SocialPublisher {
  async publishToMultiplePlatforms(videoPath, caption, platforms, userApiKeys) {
    const results = [];
    for (const p of platforms) {
      try { results.push(await this.publishToPlatform(p, videoPath, caption, userApiKeys)); }
      catch (e) { results.push({ success: false, platform: p, error: e.message }); }
    }
    return results;
  }

  async publishToPlatform(platform, videoPath, caption, keys) {
    switch (platform) {
      case "youtube":   return this.publishToYouTube(videoPath, caption, keys.youtube);
      case "tiktok":    return this.publishToTikTok(videoPath, caption, keys.tiktok);
      case "instagram": return this.publishToInstagram(videoPath, caption, keys.instagram);
      case "twitter":   return this.publishToTwitter(videoPath, caption, keys.twitter);
      default: throw new Error(`Unsupported platform: ${platform}`);
    }
  }

  async publishToYouTube(videoPath, caption, token) {
    const form = new FormData();
    form.append("file", fs.createReadStream(videoPath));
    form.append("metadata", JSON.stringify({ snippet: { title: caption.substring(0,100), description: caption, tags: ["shorts","viral"] }, status: { privacyStatus: "public" } }));
    const r = await axios.post("https://www.googleapis.com/upload/youtube/v3/videos?part=snippet,status&uploadType=multipart", form, { headers: { ...form.getHeaders(), Authorization: `Bearer ${token}` } });
    return { success: true, platform: "youtube", videoId: r.data.id, url: `https://www.youtube.com/watch?v=${r.data.id}` };
  }

  async publishToTikTok(videoPath, caption, token) {
    const form = new FormData();
    form.append("video", fs.createReadStream(videoPath));
    form.append("caption", caption);
    const r = await axios.post("https://open-api.tiktok.com/share/video/upload/", form, { headers: { ...form.getHeaders(), Authorization: `Bearer ${token}` } });
    return { success: true, platform: "tiktok", videoId: r.data.data.video_id, url: r.data.data.share_url };
  }

  async publishToInstagram(videoPath, caption, token) {
    const create = await axios.post("https://graph.facebook.com/v18.0/me/media", { media_type: "REELS", video_url: videoPath, caption, share_to_feed: true }, { headers: { Authorization: `Bearer ${token}` } });
    const id = create.data.id;
    let status = "IN_PROGRESS";
    while (status === "IN_PROGRESS") {
      await new Promise(r => setTimeout(r, 3000));
      const s = await axios.get(`https://graph.facebook.com/v18.0/${id}`, { headers: { Authorization: `Bearer ${token}` }, params: { fields: "status_code" } });
      status = s.data.status_code;
    }
    if (status !== "FINISHED") throw new Error("Instagram processing failed");
    const pub = await axios.post("https://graph.facebook.com/v18.0/me/media_publish", { creation_id: id }, { headers: { Authorization: `Bearer ${token}` } });
    return { success: true, platform: "instagram", mediaId: pub.data.id };
  }

  async publishToTwitter(videoPath, caption, token) {
    const init = await axios.post("https://upload.twitter.com/1.1/media/upload.json", { command: "INIT", media_type: "video/mp4", total_bytes: fs.statSync(videoPath).size }, { headers: { Authorization: `Bearer ${token}` } });
    const mediaId = init.data.media_id_string;
    const data  = fs.readFileSync(videoPath);
    const chunk = 5 * 1024 * 1024;
    for (let i = 0, seg = 0; i < data.length; i += chunk, seg++) {
      await axios.post("https://upload.twitter.com/1.1/media/upload.json", data.slice(i, i + chunk), { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }, params: { command: "APPEND", media_id: mediaId, segment_index: seg } });
    }
    await axios.post("https://upload.twitter.com/1.1/media/upload.json", { command: "FINALIZE", media_id: mediaId }, { headers: { Authorization: `Bearer ${token}` } });
    const tweet = await axios.post("https://api.twitter.com/1.1/statuses/update.json", { status: caption, media_ids: mediaId }, { headers: { Authorization: `Bearer ${token}` } });
    return { success: true, platform: "twitter", tweetId: tweet.data.id_str, url: `https://twitter.com/i/status/${tweet.data.id_str}` };
  }
}

module.exports = SocialPublisher;
