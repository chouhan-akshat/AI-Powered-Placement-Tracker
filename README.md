<<<<<<< HEAD
# AI-Powered-Placement-Tracker
An AI Powered Placement Tracker helps students prepare with a personalized roadmap, progress tracking, and AI mock interviews. It replaces random study with a structured approach, improving consistency, identifying weak areas, and guiding students to become placement-ready efficiently.
=======
# AI Placement Mentor

Full-stack, AI-assisted placement prep platform: JWT auth, MongoDB, personalized JSON roadmaps, topic resources, timed MCQ tests, OpenAI mentor + mock interview, optional Socket.io, resume analyzer, leaderboard, and admin content tools.

## Folder structure

```
├── client/                 # React (Vite) + Tailwind
│   ├── src/
│   │   ├── components/     # Navbar, Sidebar, Card, Layout, …
│   │   ├── context/        # Auth (JWT)
│   │   ├── pages/
│   │   ├── api.js
│   │   └── App.jsx
│   └── .env.example
├── server/                 # Express + Mongoose + Socket.io
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/       # roadmapGenerator, openaiService
│   │   ├── scripts/seed.js
│   │   ├── app.js
│   │   └── index.js
│   └── .env.example
├── API.md
└── README.md
```

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- OpenAI API key (for mentor, mock interview, resume)

## Setup

### 1. Backend

```bash
cd server
cp .env.example .env
# Edit .env: MONGODB_URI, JWT_SECRET, OPENAI_API_KEY, CLIENT_URL
npm install
npm run seed
npm run dev
```

API default: `http://localhost:5000`

### 2. Frontend

```bash
cd client
cp .env.example .env
# VITE_API_URL=http://localhost:5000/api
# VITE_SOCKET_URL=http://localhost:5000
npm install
npm run dev
```

App default: `http://localhost:5173`

### 3. Admin user (after seed)

Seed creates an admin if not present:

- Email: `admin@mentor.local` (override with `SEED_ADMIN_EMAIL`)
- Password: `admin12345` (override with `SEED_ADMIN_PASSWORD` in `.env` when running seed)

Log in on the client and open **Admin** to add topics/tests.

## Production notes (hackathon → deploy)

- Set strong `JWT_SECRET`, restrict `CLIENT_URL` / CORS, use Atlas + TLS for MongoDB.
- Build client: `cd client && npm run build`; serve `dist/` via CDN or static host.
- Run server with `NODE_ENV=production` and a process manager (PM2, systemd).
- Never commit `.env`; rotate `OPENAI_API_KEY` if leaked.

## Tech stack

| Layer    | Choice                          |
|----------|----------------------------------|
| UI       | React 18, Vite, Tailwind CSS     |
| API      | Express.js, REST, MVC-style      |
| DB       | MongoDB (Mongoose)               |
| Auth     | JWT (Bearer)                     |
| AI       | OpenAI Chat Completions API      |
| Realtime | Socket.io (mock interview opt.) |

Full endpoint list: **API.md**.
>>>>>>> 5cb4e84 (Initial project upload)
