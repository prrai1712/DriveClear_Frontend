# Deploy DriveClear Frontend on Vercel

Backend (Railway): `https://driveclearbackend-production.up.railway.app/api/v1`

GitHub repo: **https://github.com/prrai1712/DriveClear_Frontend**

---

## Step 1 — GitHub (done)

Code is on `main`. To push future updates:

```bash
git add .
git commit -m "your message"
git push origin main
```

---

## Step 2 — Import on Vercel

1. Open **https://vercel.com/new**
2. Import **prrai1712/DriveClear_Frontend**
3. **Root Directory**: leave **empty**
4. Framework: **Next.js** (auto-detected)
5. Build settings (already in `vercel.json`):
   - Build: `npm run build`
   - Output: Next.js default

---

## Step 3 — Environment variables (Vercel dashboard)

**Required** (minimum for app + Render API):

| Variable | Value |
|----------|--------|
| `NEXT_PUBLIC_API_URL` | `https://driveclearbackend-production.up.railway.app/api/v1` |

Already set in `vercel.json` — Vercel will pick it up on import.

**Recommended** (Firebase phone auth in production):

| Variable | Where to get it |
|----------|-----------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Console → Project settings → Web app |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | e.g. `driveclear-82af6.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `driveclear-82af6` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase |

**Only if backend encryption is enabled:**

| Variable | Value |
|----------|--------|
| `NEXT_PUBLIC_API_PAYLOAD_ENCRYPTION_ENABLED` | `true` |
| `NEXT_PUBLIC_API_PAYLOAD_ENCRYPTION_KEY` | Same 32-byte base64 key as Railway backend |

If encryption is off on Railway (default), leave encryption vars unset or `false`.

---

## Step 4 — Deploy

1. Click **Deploy**
2. Wait for build (~2–3 min)
3. Copy your URL, e.g. `https://driveclear-frontend.vercel.app`

---

## Step 5 — Connect backend (Railway)

On **Railway** → **Environment Variables**:

```env
CORS_ALLOWED_ORIGINS=https://YOUR-VERCEL-URL.vercel.app,http://localhost:3000
```

**Redeploy** the backend after saving.

### Razorpay (payments)

On Railway, set (or payments will fail with "Payment gateway is not configured"):

```env
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxx
```

---

## Step 6 — Firebase (optional)

Firebase Console → Authentication → Settings → **Authorized domains** → add:

- `YOUR-VERCEL-URL.vercel.app`
- `localhost` (for local dev)

---

## Auto-deploy

Vercel redeploys automatically on every `git push` to `main`.

---

## Local dev

```bash
npm install
npm run dev
```

Uses Railway API via `.env.development`. Override in `.env.local` for local backend on port 8000.
