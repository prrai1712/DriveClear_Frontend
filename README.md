# DriveClear Frontend

Standalone Next.js app — **its own GitHub repo**, deployed to **Vercel**.

Backend repo: [DriveClear_Backend](https://github.com/prrai1712/DriveClear_Backend) (Render).

## GitHub (separate repo)

This folder is the **frontend repository root**. Push it to its own GitHub repo:

```bash
cd DriveClear_Frontend
git init
git add .
git commit -m "Initial frontend"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/DriveClear_Frontend.git
git push -u origin main
```

See [GITHUB.md](./GITHUB.md) for full steps.

## Local setup

```bash
npm install
cp .env.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
npm run dev
```

Open http://localhost:3000 (backend must run on port 8000).

## Deploy on Vercel

See [DEPLOY.md](./DEPLOY.md) — connect **this repo** directly (no Root Directory needed).
