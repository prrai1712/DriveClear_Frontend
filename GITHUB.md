# Push Frontend to GitHub (separate repo)

Use this when the frontend lives in its **own GitHub repository**, separate from the backend.

## 1. Create repo on GitHub

1. Go to https://github.com/new
2. Repository name: `DriveClear_Frontend`
3. **Do not** add README, .gitignore, or license (this folder already has them)
4. Create repository

## 2. Push this folder

From inside `DriveClear_Frontend`:

```bash
git init
git add .
git commit -m "Initial frontend"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/DriveClear_Frontend.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

## 3. Connect Vercel

1. https://vercel.com/new → import **DriveClear_Frontend** repo
2. **Root Directory**: leave **empty** (repo root is the frontend)
3. Framework: **Next.js** (auto-detected)
4. Add environment variables (see [DEPLOY.md](./DEPLOY.md))
5. Deploy

## 4. Local workspace (optional)

For local dev with backend, clone both repos as siblings:

```
your-workspace/
├── DriveClear_Backend/    ← backend repo
└── DriveClear_Frontend/   ← this repo
```

Run backend on port 8000, then `npm run dev` in this folder.
