# focusSync

Monorepo containing frontend and backend for the focusSync project (Virtual Assistant / Jarvis-style UI).

This repository contains two main folders:

- `backend/` — Node.js + Express API (authentication, OTP email verification, sessions)
- `frontend/` — React + Vite UI with TailwindCSS

---

## Quick start (development)

1. Install dependencies for both projects:

```bash
# from repo root
cd backend
npm install

# in a new shell
cd frontend
npm install
```

2. Prepare backend environment:

```bash
# copy example env and edit
cp backend/.env.example backend/.env
# (On Windows PowerShell use: copy backend\.env.example backend\.env)
# then edit backend/.env with real values (Mongo URI, email/OAuth keys, JWT secrets)
```

3. Run both services (in separate terminals):

```bash
# terminal 1
cd backend
npm run dev

# terminal 2
cd frontend
npm run dev
```

Open the frontend at the URL Vite reports (usually `http://localhost:5173`). The frontend is configured to talk to the backend at `http://localhost:8000` by default in `frontend/src/context/Usercontext.jsx`.

---

## Build for production

```bash
# frontend
cd frontend
npm run build
npm run preview

# backend (example)
cd backend
NODE_ENV=production node server.js
```

---

## Environment variables
See `backend/.env.example` for the full list of required backend environment variables (MongoDB URI, JWT secrets, email/OAuth credentials, Cloudinary keys, etc.).

The frontend reads backend URL from `frontend/src/context/Usercontext.jsx` by default; you can change it or inject at build time.

---

## Project structure

- `backend/`
  - `app.js`, `server.js` — express app and server entry
  - `routes/` — API routes (auth.routes.js)
  - `controller/` — controller logic (auth.controller.js)
  - `models/` — mongoose models
  - `services/` — email, cloudinary, other services
  - `.env.example` — example env file

- `frontend/`
  - `src/` — React app
  - `src/pages` — auth UI pages (Register, Login, VerifyEmail)
  - `src/context/Usercontext.jsx` — backend URL config
  - `index.css` — Tailwind import and base styles

---

## Notes & tips
- Keep `.env` files out of source control. Use `.env.example` as a template.
- If using Gmail OAuth for sending emails, ensure the refresh token and client secrets are valid and the callback/redirect URI matches the Google Console settings.
- You can change ports in `backend/.env` and update `frontend/src/context/Usercontext.jsx` accordingly.

---

If you want, I can:
- add a root-level `docker-compose.yml` to run frontend, backend, and a MongoDB service together
- add a startup script that launches both dev servers concurrently
- add env validation at backend startup to fail fast when required vars are missing

