# Blogging Platform with Authentication and Admin Panel

## Tech
- Backend: Node.js, Express, MongoDB (Mongoose), JWT auth
- Frontend: React (Vite), Tailwind CSS, React Router

## Setup

### 1) Backend
From `blog_Platfom/backend`:

1. Create `.env` from `.env.example`
2. Start MongoDB (local or Atlas)
3. Install and run:

```bash
npm install
npm run dev
```

Create an admin user (optional):

```bash
npm run seed:admin
```

Default admin seed creds (if you don't override env vars):
- Email: `admin@example.com`
- Password: `admin12345`

### 2) Frontend
From `blog_Platfom/frontend`:

1. Create `.env` from `.env.example`
2. Install and run:

```bash
npm install
npm run dev
```

Open the app at `http://localhost:5173`.

## Features
- Authentication: signup, login, logout
- Roles: user & admin
- Blog: create/edit/delete posts (users manage their own)
- Admin panel: manage users, delete any post

## Team Work Division (5 members)
- **Member 1 — Backend lead (API + DB)**: Express setup, MongoDB models (`User`, `Post`), JWT auth, post CRUD APIs, role middleware.
- **Member 2 — Admin panel**: Admin dashboard UI, manage users (list/change role/delete), manage posts (view/delete), connect to backend.
- **Member 3 — User module**: Login/Signup UI, profile page, “My posts” page (edit/delete own), create/edit post editor.
- **Member 4 — Public blog UI**: Home feed, single post page, layout/navbar responsiveness, empty states, public API integration.
- **Member 5 — Testing & documentation**: E2E test checklist, seed/admin instructions, README, env variable guide, deployment plan.

## Deployment (Render + Vercel + MongoDB Atlas)

### Backend (Render)
- Push this project to GitHub.
- Render → **New** → **Blueprint** → select your repo (uses `render.yaml`).
- Set Render env vars:
  - **MONGODB_URI**: your MongoDB Atlas URI
  - **JWT_SECRET**: long random string
  - **CORS_ORIGIN**: your Vercel URL (example: `https://your-app.vercel.app`)
- After deploy, open Render Shell and run:

```bash
npm run seed:admin
```

### Frontend (Vercel)
- Vercel → **New Project** → import repo
- Root directory: `frontend`
- Add env var:
  - **VITE_API_URL**: `https://<your-render-backend>/api`
- Deploy


