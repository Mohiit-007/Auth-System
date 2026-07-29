# focusSync

---

## Authentication

The backend implements a full authentication system used by the frontend. Key features:

- Access & Refresh tokens: the API issues short-lived access tokens and long-lived refresh tokens (JWT). Refresh tokens are stored in secure cookies and used to obtain new access tokens without requiring re-login.
- Email verification & OTP: registration triggers an OTP sent to the user's email; the `VerifyEmail` flow validates the OTP before allowing access.
- Nodemailer (OAuth2): outgoing emails are sent using a Nodemailer setup with OAuth2 (Google) credentials. Configure `EMAIL_USER`, `CLIENT_ID`, `CLIENT_SECRET`, and `REFRESH_TOKEN` in the backend `.env`.
- Google Auth: an OAuth2 sign-in flow is supported for login/registration; configure `CLIENT_ID`, `CLIENT_SECRET`, and `REDIRECT_URI`.

See `backend/controller/auth.controller.js`, `backend/services/email.js`, and `backend/routes/auth.routes.js` for implementation details.

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
