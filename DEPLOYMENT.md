# PawAssist Deployment Checklist

## Vercel + Render Setup

This repo is now prepared for:

- Vercel hosting the React frontend from `client/`
- Render hosting the Node/Express API from `server/`
- MongoDB hosted separately, typically on MongoDB Atlas

Tracked deploy config in this repo:

- `client/vercel.json`
- `render.yaml`

Important:

- Render does not provide a managed MongoDB service for this app, so use a hosted MongoDB URI such as MongoDB Atlas for `MONGODB_URI`.
- Vercel should be configured with `client` as the project root directory.
- Render should use the Blueprint in `render.yaml` or you can mirror the same settings manually in the dashboard.

## Vercel Frontend

Create a Vercel project from this repository with these settings:

- Framework preset: `Vite`
- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`

Set this environment variable in Vercel:

```env
VITE_API_BASE_URL=https://your-render-service.onrender.com/api
```

Why `client/vercel.json` exists:

- PawAssist uses React Router with browser history routes like `/login` and `/app/dashboard`
- Vercel needs a rewrite to `/index.html` so direct visits to those routes do not return 404

## Render Backend

Create the backend as a Render Web Service from this repository, or use the included `render.yaml`.

If you configure it manually, use:

- Runtime: `Node`
- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Health check path: `/api/health`

Render environment variables:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=your-mongodb-atlas-uri
MONGODB_DB=pawassist
CORS_ORIGIN=https://your-vercel-domain.vercel.app
AUTH_TOKEN_SECRET=generate-a-long-random-secret
AUTH_TOKEN_TTL_SECONDS=43200
```

Notes:

- `PORT=10000` matches Render's default web service port
- `CORS_ORIGIN` must match your deployed frontend origin exactly
- In production, the API will fail fast if MongoDB is missing or unreachable
- After you add a custom frontend domain, update `CORS_ORIGIN` to that exact URL

## Recommended Go-Live Order

1. Create a MongoDB Atlas database and copy the connection string.
2. Deploy the backend to Render with the production environment variables.
3. Open `https://your-render-service.onrender.com/api/health` and confirm the response shows `"database":"mongodb"`.
4. Deploy the frontend to Vercel with `VITE_API_BASE_URL` pointing at the Render API.
5. Update `CORS_ORIGIN` on Render to your final Vercel domain if it changed after deployment.
6. Test login, dashboard, bookings, pets, profile, and refresh-on-route behavior.

## Secret Safety

- Never commit real `.env` files.
- This repo already ignores:
  - `.env`
  - `client/.env`
  - `server/.env`
  - `.env.local`
  - `.env.*`
- Only commit example files such as:
  - `client/.env.example`
  - `client/.env.production.example`
  - `server/.env.example`

## Step 1: Prepare Server Environment

Create `server/.env` on the server only.

Use `server/.env.example` as the base:

```env
PORT=5001
MONGODB_URI=your-production-mongodb-uri
MONGODB_DB=pawassist
CORS_ORIGIN=https://your-frontend-domain.example
AUTH_TOKEN_SECRET=replace-with-a-long-random-secret
AUTH_TOKEN_TTL_SECONDS=43200
NODE_ENV=production
```

Notes:

- `AUTH_TOKEN_SECRET` should be a long random string.
- `CORS_ORIGIN` should be your exact frontend domain.
- In production, the server now fails fast if MongoDB is missing or unreachable.

## Step 2: Prepare Client Environment

Create `client/.env.production` only in your deployment environment or CI.

Use `client/.env.production.example` as the base:

```env
VITE_API_BASE_URL=https://your-api-domain.example/api
```

For `Vercel + Render`, this should be your Render API URL, for example:

```env
VITE_API_BASE_URL=https://pawassist-api.onrender.com/api
```

## Step 3: Install Dependencies

### Server

```bash
cd server
npm install
```

### Client

```bash
cd client
npm install
```

## Step 4: Build Frontend

```bash
cd client
npm run build
```

## Step 5: Start Backend in Production

```bash
cd server
node server.js
```

Recommended:

- Run behind a process manager such as PM2, systemd, Render, Railway, or your host's managed runtime.
- Terminate HTTPS at your hosting platform or reverse proxy.

## Step 6: Manual Go-Live QA

Test these flows from the deployed frontend URL:

- Login and register
- OTP request and verification
- Dashboard loads without hanging
- Main promo cards open the correct pages
- Provider selection to booking flow
- Grooming to booking flow
- Pet add, edit, delete
- Booking confirm flow
- Wallet add money, rewards, and statement actions
- Insurance plan selection and claim modal
- Notifications and settings tabs
- Profile save and password change

## Step 7: Production Safety Checks

- Confirm `server/.env` is not tracked by git.
- Confirm `client/.env.production` is not tracked by git.
- Confirm MongoDB is connected by checking `/api/health`.
- Confirm CORS only allows your frontend origin.
- Confirm HTTPS is enabled on both frontend and backend-facing routes.
- Confirm direct navigation to frontend routes such as `/login` and `/app/dashboard` does not 404 on Vercel.

## Quick Git Safety Commands

Run these before pushing:

```bash
git check-ignore -v server/.env client/.env .env client/.env.production
git status
git ls-files | findstr /I ".env"
```

Expected:

- real `.env` files should be ignored
- only example env files should appear as tracked

## Final Release Gate

Deploy only when all of these are true:

- frontend build succeeds
- backend starts with production env
- `/api/health` returns `database: "mongodb"`
- main user flows are manually verified
- no real secrets appear in `git status` or tracked files
