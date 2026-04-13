const ffmpeg = require("fluent-ffmpeg");
const path   = require("path");
const fs     = require("fs");
const { v4: uuidv4 } = require("uuid");
const OpenAI = require("openai");

class VideoGenerator {
  constructor() {
    this.openai    = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    this.outputDir = path.join(__dirname, "../../temp/videos");
    if (!fs.existsSync(this.outputDir)) fs.mkdirSync(this.outputDir, { recursive: true });
  }

  async generateVideoFromContent(content, options = {}) {
    const { duration = 30, voice = "alloy", backgroundColor = "#000000", textColor = "#FFFFFF" } = options;
    const script    = await this.generateScript(content);
    const audioPath = await this.generateVoiceover(script, voice);
    const videoPath = await this.createVideoWithText(script, audioPath, duration, backgroundColor, textColor);
    return { videoPath, script, duration };
  }

  async generateScript(content) {
    const r = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a viral short-form video scriptwriter. Keep scripts under 60 words, punchy and engaging." },
        { role: "user",   content: `Write a 30-second video script about: ${JSON.stringify(content)}` }
      ],
      max_tokens: 200
    });
    return r.choices[0].message.content;
  }

  async generateVoiceover(script, voice) {
    const r = await this.openai.audio.speech.create({ model: "tts-1", voice, input: script });
    const audioPath = path.join(this.outputDir, `${uuidv4()}.mp3`);
    fs.writeFileSync(audioPath, Buffer.from(await r.arrayBuffer()));
    return audioPath;
  }

  createVideoWithText(script, audioPath, duration, bg, fg) {
    return new Promise((resolve, reject) => {
      const videoPath = path.join(this.outputDir, `${uuidv4()}.mp4`);
      const safeText  = script.replace(/['"\\:]/g, " ").substring(0, 200);
      ffmpeg()
        .input(`color=c=${bg}:size=1080x1920:duration=${duration}`)
        .inputFormat("lavfi")
        .input(audioPath)
        .complexFilter([
          { filter: "drawtext", options: {
            text: safeText, fontsize: 48, fontcolor: fg,
            x: "(w-text_w)/2", y: "(h-text_h)/2",
            shadowcolor: "black@0.5", shadowx: 2, shadowy: 2, line_spacing: 10
          }}
        ])
        .outputOptions(["-t", duration, "-pix_fmt", "yuv420p", "-shortest"])
        .output(videoPath)
        .on("end", () => resolve(videoPath))
        .on("error", reject)
        .run();
    });
  }
}

module.exports = VideoGenerator;
