# PawAssist

Your all-in-one pet care companion.

PawAssist is a full-stack pet care web application that brings together everything your pet needs, from routine grooming to emergency ambulance booking, powered by an AI assistant, a smart wallet, and a community experience.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

## Project Overview

PawAssist is a modern pet care platform built with resilience at its core. Pet owners can manage health records, book grooming or veterinary services, request emergency ambulances, view rewards, and access a polished dashboard from a single application.

One of the key ideas in PawAssist is graceful fallback behavior:

- The frontend tries the live backend first
- If the backend is offline, the frontend falls back to local demo data
- If MongoDB is unavailable, the backend falls back to an in-memory store

This keeps the app usable in both real and demo/development environments.

## Features

| Feature | Description |
|---|---|
| Auth Flow | Login and registration with protected app routes |
| Dashboard | Personalized overview of pets, bookings, rewards, and activity |
| Pet Profiles | View and manage pet information |
| Service Booking | Book vet visits, grooming, training, and emergency services |
| Emergency Ambulance | Fast dispatch-oriented emergency booking flow |
| Grooming | Dedicated grooming experience and packages |
| AI Assistant | AI-style guidance and triage support UI |
| Wallet and Rewards | Wallet balance, spending, and reward points |
| Notifications | Booking, reminder, and activity alerts |
| Chat | In-app conversation-style messaging UI |
| Insurance | Insurance plans and coverage overview |
| Community | Pet parent community and posts |
| Profile Management | Edit personal details and preferences |
| Health Tracking | Health insights, care reminders, and milestones |

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite | Build tool and dev server |
| React Router DOM | Client-side routing |
| Zustand | Global state management |
| Axios | API client |
| React Icons | Icons |
| Plain CSS | Styling |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express 5 | API server |
| Mongoose | MongoDB ODM |
| MongoDB | Primary database |

## Architecture

PawAssist uses a layered resilience approach:

1. Frontend calls the backend API when available.
2. If the backend is unreachable, frontend services return fallback demo data.
3. Backend connects to MongoDB when configured and reachable.
4. If MongoDB fails or is not configured, backend uses an in-memory store.

## Folder Structure

```text
PawAssist/
|-- client/                     React + Vite frontend
|   |-- public/                Static assets
|   |-- src/
|   |   |-- assets/            Images and local media
|   |   |-- components/        Reusable UI components
|   |   |-- pages/             Route-level screens
|   |   |-- routes/            App routing and protected routes
|   |   |-- services/          API calls, hooks, fallback logic
|   |   |-- store/             Zustand state store
|   |   |-- styles/            Additional CSS modules/files
|   |   |-- App.jsx            App wrapper
|   |   `-- main.jsx           Frontend entry point
|   |-- package.json
|   `-- vite.config.js
|-- server/                    Node.js + Express backend
|   |-- config/                Environment and DB config
|   |-- data/                  Repository, static data, memory fallback
|   |-- models/                Mongoose models
|   |-- routes/                API route handlers
|   |-- server.js              Backend entry point
|   |-- .env.example
|   `-- package.json
|-- start-pawassist.bat        Starts frontend and backend on Windows
`-- README.md
```

## Setup Instructions

### Prerequisites

- Node.js 18 or higher
- MongoDB optional
- npm

### Backend

```bash
cd server
npm install
node server.js
```

Backend default:

- `http://localhost:5001`

### Frontend

```bash
cd client
npm install
npm run dev
```

Frontend default:

- `http://localhost:5173`

### Run Both on Windows

From the project root:

```bat
start-pawassist.bat
```

This opens two terminals:

- frontend on `http://localhost:5173`
- backend on `http://localhost:5001`

## Environment Variables

Example env files:

- `server/.env.example`
- `client/.env.example`
- `client/.env.production.example`

Important:

- Do not commit real `.env` files.
- Production requires real values for MongoDB, auth secret, frontend origin, and frontend API URL.
- See `DEPLOYMENT.md` for the full production checklist and secret-safety steps.

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check and backend mode |
| POST | `/api/auth/request-otp` | Request login OTP |
| POST | `/api/auth/login-with-otp` | Verify OTP and create session |
| GET | `/api/auth/me` | Get current authenticated user |
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings` | Get bookings |
| GET | `/api/app/overview` | Get dashboard overview data |

## Future Improvements

- Add a real authentication and OTP provider
- Add real-time chat and notifications
- Add maps and live emergency tracking
- Add payment gateway integration
- Add video vet consultations
- Add AI integration using a real LLM backend
- Add tests and CI/CD
- Add Docker support
- Add admin/provider dashboards

## License

This repository currently references MIT-style usage in the README, but no root `LICENSE` file is present yet. Add one if you want GitHub to show the license clearly.
