# focusSync — Frontend

This folder contains the frontend application for focusSync, built with React + Vite and TailwindCSS.

## Overview
Modern UI for the Virtual Assistant (Jarvis) including register, login and OTP verification flows.

## Prerequisites
- Node.js (16+)
- npm

## Install
From the `frontend` folder:

```bash
npm install
```

## Run (development)

```bash
npm run dev
```

Open the app at the address reported by Vite (usually `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

## Environment
The frontend uses a `serverUrl` configured in `frontend/src/context/Usercontext.jsx` by default:

```js
const serverUrl = "http://localhost:8000";
```

If your backend runs on a different URL, update this value or add a small `.env` wrapper to inject it at build time.

## Auth flow
- Register → server sends OTP → user verifies code in the `VerifyEmail` component
- Login will redirect to verify page if email is unverified

## Contributing
Please open issues or PRs — keep UI/UX changes focused and add screenshots where helpful.

## License
Specify license as appropriate.
