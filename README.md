# âš¡ VidCraft â€” UGC Automation SaaS

Scrape trending content â†’ Generate AI videos â†’ Auto-post to all platforms.

## Quick Start (Local)

```bash
# 1. Clone & install
cd backend  && npm install
cd ../frontend && npm install

# 2. Configure env
cp backend/.env.example  backend/.env
cp frontend/.env.example frontend/.env
# Fill in your API keys

# 3. Run (Docker)
docker-compose up --build

# 4. Open http://localhost:3000
```

## Deploy to Railway

1. Push this repo to GitHub
2. Create a new project on [Railway](https://railway.app)
3. Add services: Backend, Frontend, MongoDB, Redis
4. Set environment variables from `.env.example`
5. Add `RAILWAY_TOKEN` to GitHub Secrets
6. Push to `main` â€” GitHub Actions deploys automatically

## Required API Keys

| Service | Purpose |
|---------|---------|
| OpenAI | Script generation + TTS voiceover |
| Google OAuth | Sign in with Google |
| YouTube, TikTok, Instagram, Twitter | Social posting |

## Stack

- **Backend**: Node.js Â· Express Â· MongoDB Â· Redis Â· Puppeteer Â· FFmpeg
- **Frontend**: React 18 Â· React Router
- **AI**: OpenAI GPT-4 Â· TTS-1
- **Infra**: Docker Â· Railway Â· GitHub Actions
