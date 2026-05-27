# DriveClear Frontend

Standalone Next.js app — **its own GitHub repo**, deployed to **Vercel**.

Backend repo: [DriveClear_Backend](https://github.com/prrai1712/DriveClear_Backend) (Railway).

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
cp .env.example .env.local   # optional — .env.development already points at Railway
npm run dev
```

Open http://localhost:3000. By default the app calls the hosted API:

`https://driveclearbackend-production.up.railway.app/api/v1`

To use a **local backend** on port 8000, set in `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## Deploy on Vercel

See [DEPLOY.md](./DEPLOY.md) — connect **this repo** directly (no Root Directory needed).
