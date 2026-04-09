# PawAssist Deployment Checklist

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
