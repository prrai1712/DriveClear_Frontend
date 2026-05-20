# Deploy DriveClear Frontend on Vercel

This is a **standalone frontend GitHub repo**. Connect it directly to Vercel — **no Root Directory** setting.

Deploy backend first: [DriveClear_Backend](https://github.com/prrai1712/DriveClear_Backend) → [DEPLOY.md](https://github.com/prrai1712/DriveClear_Backend/blob/main/DEPLOY.md)

---

## Step 1 — Push to GitHub

See [GITHUB.md](./GITHUB.md) if not pushed yet.

---

## Step 2 — Import on Vercel

1. https://vercel.com/new → import **DriveClear_Frontend** repo
2. **Root Directory**: leave **empty**
3. Framework: **Next.js** (auto-detected)

---

## Step 3 — Environment variables

| Variable | Value |
|----------|--------|
| `NEXT_PUBLIC_API_URL` | `https://YOUR-SERVICE.onrender.com/api/v1` |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Console |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | e.g. `driveclear-82af6.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `driveclear-82af6` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase |
| `NEXT_PUBLIC_API_PAYLOAD_ENCRYPTION_ENABLED` | `true` |
| `NEXT_PUBLIC_API_PAYLOAD_ENCRYPTION_KEY` | Same as backend |

---

## Step 4 — Deploy & connect

1. Deploy → copy URL e.g. `https://driveclear-xxx.vercel.app`
2. Render → `CORS_ALLOWED_ORIGINS` = that URL → redeploy backend
3. Firebase → Authorized domains → add Vercel domain

---

## Local dev

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_API_PAYLOAD_ENCRYPTION_ENABLED=false
```

Clone backend repo as sibling (`../DriveClear_Backend`), run it on port 8000, then `npm run dev`.
