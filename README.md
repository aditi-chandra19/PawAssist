<img width="355" height="464" alt="image" src="https://github.com/user-attachments/assets/8a9ea4d5-66dd-48c2-8e63-31930816543d" />

PawAssist is a full-stack pet care platform that helps pet parents manage everyday care, health records, bookings, rewards, and support from one polished dashboard.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

## Live Project

- Frontend: [paw-assist.vercel.app](https://paw-assist.vercel.app/)
- Backend health: [pawassist-api.onrender.com/api/health](https://pawassist-api.onrender.com/api/health)

## Overview

PawAssist is designed as an all-in-one digital care companion for pet owners. The product combines service discovery, booking flows, pet profile management, a wallet experience, insurance, community content, and care tracking inside a single application.

The current hosted stack uses:

- `Vercel` for the frontend
- `Render` for the API
- `MongoDB Atlas` for persistence

## Core Features

- Direct phone-based sign up and login flow
- Personalized dashboard with pets, bookings, rewards, and reminders
- Pet profile creation and management
- Grooming, vet, training, and emergency service discovery
- Booking flows with provider context
- Health insights and care timeline views
- Wallet, rewards, and insurance sections
- Community, chat, and AI assistant style interfaces
- Responsive UI for desktop and mobile

## Product Highlights

### Unified Care Experience

PawAssist brings appointments, health updates, reminders, payments, and support into one interface so users do not need to jump between different services.

### Resilient Frontend and Backend

The application is built with graceful fallback behavior in mind:

- the frontend prefers the live backend when available
- the frontend can fall back to demo data in local or degraded scenarios
- the backend prefers MongoDB when available
- the backend can fall back to an in-memory store in non-production development flows

### Deployment-Ready Structure

The repository is organized for straightforward frontend and backend hosting with dedicated deployment configuration for Vercel and Render.

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | Component-based UI |
| Vite | Development server and production build |
| React Router DOM | Client-side routing |
| Zustand | Session and app state management |
| Axios | API client |
| React Icons | UI icons |
| Plain CSS | Styling and layout |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express 5 | API server |
| Mongoose | MongoDB ODM |
| MongoDB Atlas | Hosted database |

## Architecture

PawAssist follows a split frontend and backend architecture:

1. The React frontend handles routing, UI state, and user interactions.
2. The Express API handles authentication, user data, pets, bookings, and overview payloads.
3. MongoDB stores persistent user, pet, and booking data in production.
4. Local fallback paths keep development and preview environments usable.

## Project Structure

```text
PawAssist/
|-- client/                     React + Vite frontend
|   |-- public/                Static assets
|   |-- src/
|   |   |-- assets/            Images and local media
|   |   |-- components/        Reusable UI components
|   |   |-- pages/             Route-level screens
|   |   |-- routes/            App routing
|   |   |-- services/          API calls and fallback logic
|   |   |-- store/             Zustand stores
|   |   |-- App.jsx            App entry shell
|   |   `-- main.jsx           Frontend bootstrap
|   |-- package.json
|   `-- vercel.json            SPA rewrite config for Vercel
|-- server/                    Node.js + Express backend
|   |-- config/                Environment and DB config
|   |-- data/                  Repository layer and fallback store
|   |-- middleware/            Auth and rate limiting
|   |-- models/                Mongoose models
|   |-- routes/                API routes
|   |-- server.js              Backend entry point
|   `-- package.json
|-- render.yaml                Render Blueprint config
|-- DEPLOYMENT.md              Deployment guide
`-- README.md
```

## Local Development

### Prerequisites

- Node.js 18 or newer
- npm
- MongoDB optional for development

### Start the backend

```bash
cd server
npm install
npm start
```

Backend default:

- `http://localhost:5001`

### Start the frontend

```bash
cd client
npm install
npm run dev
```

Frontend default:

- `http://localhost:5173`

### Windows shortcut

From the project root:

```bat
start-pawassist.bat
```

## Environment Variables

Example env files:

- `server/.env.example`
- `client/.env.example`
- `client/.env.production.example`

### Server

Typical production server variables:

```env
PORT=10000
MONGODB_URI=your-mongodb-uri
MONGODB_DB=pawassist
CORS_ORIGIN=https://your-frontend-domain
AUTH_TOKEN_SECRET=your-long-random-secret
AUTH_TOKEN_TTL_SECONDS=43200
NODE_ENV=production
```

### Client

Typical frontend production variable:

```env
VITE_API_BASE_URL=https://your-api-domain/api
```

Important:

- never commit real `.env` files
- use the example files as templates
- see [DEPLOYMENT.md](./DEPLOYMENT.md) for the full hosted deployment checklist

## Deployment

Recommended deployment setup:

- frontend on `Vercel`
- backend on `Render`
- database on `MongoDB Atlas`

This repository already includes:

- [client/vercel.json](./client/vercel.json)
- [render.yaml](./render.yaml)
- [DEPLOYMENT.md](./DEPLOYMENT.md)

## API Highlights

Primary routes currently used by the application:

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Service and database health |
| POST | `/api/auth/login` | Direct login with phone number |
| POST | `/api/auth/register` | Create account and session |
| GET | `/api/auth/me` | Get current authenticated user |
| GET | `/api/app/overview` | Dashboard overview payload |
| GET | `/api/pets` | List pets |
| POST | `/api/pets` | Create pet |
| GET | `/api/bookings` | List bookings |
| POST | `/api/bookings` | Create booking |

Note:

- the backend root URL does not serve a homepage, so `Cannot GET /` on the API root is expected

## Current Status

What is already production-ready:

- deployed frontend
- deployed backend
- MongoDB-backed persistence
- direct phone-based login and registration
- Vercel and Render deployment configuration

Areas still suited for future polish:

- stronger production auth identity flow
- automated testing and CI
- role-based dashboards for providers/admins
- payment gateway integration
- real-time notifications and messaging

## Roadmap

- Add stronger authentication and account recovery flows
- Introduce payment and checkout support
- Expand emergency tracking and live status updates
- Add richer AI-backed care support
- Improve analytics, testing, and CI/CD coverage
- Add Docker support and more formal environment promotion flows


<<<<<<< Updated upstream
=======
This repository currently does not include a root `LICENSE` file. Add one if you want GitHub to display project licensing explicitly.
>>>>>>> Stashed changes
