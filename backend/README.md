# focusSync — Backend

This folder contains the backend API for the focusSync project.

## Overview
Node/Express server providing authentication (register/login/OTP verification), user/session models, and supporting services (email, cloudinary).

## Prerequisites
- Node.js (16+ recommended)
- npm
- MongoDB (local or hosted)

## Environment
Copy the example file and fill real values:

```bash
cp .env.example .env
# then edit .env
```

Important variables (see `.env.example`):
- `PORT` — server port
- `MONGO_URI` — MongoDB connection string
- `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET` — JWT secrets
- `EMAIL_USER`, `CLIENT_ID`, `CLIENT_SECRET`, `REFRESH_TOKEN` — Email (OAuth2) settings
- `CLIENT_URL` — frontend URL (used for redirects)
- Cloudinary keys if used: `CLOUD_NAME`, `CLOUD_API_KEY`, `CLOUD_API_SECRET`

## Install
From the `backend` folder:

```bash
npm install
```

## Run
Development (auto-restart with nodemon if installed globally):

```bash
npm run dev
# or
node server.js
```

Production (example):

```bash
NODE_ENV=production node server.js
```

## Endpoints
See `backend/routes/auth.routes.js` for auth routes (register, login, verify, resend-otp, etc.).

## Notes
- The frontend expects the backend server URL at `frontend/src/context/Usercontext.jsx` (default: `http://localhost:8000`).
- Keep `.env` out of source control. Use `.env.example` for reference only.

## Contributing
Open an issue or submit a PR with tests and a clear description of changes.

## License
Specify license as appropriate.
