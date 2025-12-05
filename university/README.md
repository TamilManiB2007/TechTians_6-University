# TechTitans_6 University — Portal

Short overview
- A teaching/demo project with a React + Vite frontend and a TypeScript/Express + Mongoose backend.
- Features: Student portal (login/demo mode), facilities pages, virtual 360° tour (Pannellum), basic AI helper utilities (client-side), and backend auth + students endpoints.
- Intended for development and demonstration only.

Repository layout
- /backend — Express + Mongoose server (TypeScript)
  - src/app.ts — server entry
  - src/routes/* — API routes (students, auth, etc.)
  - src/seed.ts — DB seeding helper (creates test accounts)
  - backend/data — sample CSV of seeded credentials
- /src (frontend) — Vite + React app
  - src/pages/StudentPortal.tsx — student portal with demo mode
  - src/pages/Facilities.tsx — facilities + virtual tour UI (Pannellum)
  - src/assets — images & 360 panoramas (see Virtual Tour)
  - index.html — includes small virtual-tour helper modal (legacy)
  - vite.config.ts — dev server proxy to backend (for /api)

Prerequisites
- Node.js (>=16) and npm
- A MongoDB instance — Atlas recommended for production/testing
- (Optional) MongoDB Compass for testing connection

Environment (backend)
- Create backend/.env with at least either:
  - MONGO_URI (full connection string), or
  - MONGO_USER, MONGO_PASS, MONGO_HOST, MONGO_DB
- Optional:
  - PORT (defaults to 4000)
  - JWT_SECRET (for auth tokens)
  - MONGO_CONNECT_RETRIES (retry attempts for seeding)
Example .env:
MONGO_URI=mongodb+srv://user:pass@cluster0.example.mongodb.net/mydb
JWT_SECRET=replace-with-secret
PORT=4000

Environment (frontend)
- Create .env (or use Vite env) with:
VITE_API_BASE=http://localhost:4000
- The frontend defaults to using http://localhost:4000 for API if VITE_API_BASE is not set.

Run (backend)
1. cd backend
2. npm install
3. Start dev server:
   npm run dev
- On startup app will attempt Mongo connection. If connection fails, follow tips printed in console (add your public IP to Atlas Network Access, ensure DB user/password are correct).
- To seed test students:
   npm run seed
  (seed uses MONGO_* or MONGO_URI from .env)

Run (frontend)
1. From repo root (university):
   npm install
2. Start dev server:
   npm run dev
3. Open http://localhost:8080 (default Vite port)

Student portal (dev/demo)
- Login via backend (use seeded credentials from backend/data/students_credentials.csv) or use demo mode:
  - On login form enable "Use demo data" or click "Use Demo Account".
  - Demo token stored as tt6_token = "demo".
- Frontend calls /api/auth/login and /api/auth/me — ensure backend is running and vite proxy (/api -> http://localhost:4000) is configured if using relative API paths.

Virtual 360° Tour (Facilities)
- The Facilities page uses Pannellum for equirectangular 360 viewing.
- Put your 360 images in the frontend assets folder: `src/assets/`
- Recommended naming patterns (the app scans these):
  - pano-main-entrance.jpg
  - pano-library.jpg
  - campus-360-library.jpg
- After adding images restart Vite dev server. Open Facilities → Virtual Tour. The dropdown will list discovered images and the viewer will open the selected panorama.
- If viewer shows "No panorama available":
  - Confirm files are present in src/assets and filenames include `pano` / `360` / `campus` or are images (.jpg/.png/.webp).
  - Restart the dev server to ensure Vite picks up new assets.

Seeding & test credentials
- Seed script creates several test students. Credentials CSV is at:
  backend/data/students_credentials.csv
- If seed fails with network errors, increase MONGO_CONNECT_RETRIES or verify Atlas network access and user credentials.

Troubleshooting (common)
- Mongo connection issues (ECONNRESET / ReplicaSetNoPrimary / Authentication failed):
  - Ensure your public IP is whitelisted in Atlas Network Access (or add 0.0.0.0/0 for testing).
  - Ensure MONGO_URI or MONGO_USER/MONGO_PASS/MONGO_HOST are correct in backend/.env.
  - Test connection with MongoDB Compass.
- Vite import.meta.glob errors:
  - Ensure Vite is running and files are under src/assets.
  - Restart the dev server after adding new asset files.
- Proxy errors in frontend (ECONNREFUSED):
  - Start backend and ensure vite.config.ts proxy target matches backend PORT (default 4000).
- Virtual tour blank:
  - Check browser console for "[Facilities] panoramas resolved:" debug output.
  - Confirm panorama files exist and restart Vite.

Developer notes & TODO
- Consider moving panorama file handling to a CMS or upload API for runtime updates (instead of build-time discovery).
- Backend auth currently returns JWT in body — consider httpOnly cookie approach for security.
- AI assistant is lightweight and client-side; replace with server-side model integration for production.

License / Disclaimer
- This project is a demo/starter. Do not use credentials or secrets in repo. For production, secure environment variables and production-grade auth/session handling.

If you want, I can:
- Add a simple script to upload/validate panoramas.
- Generate sample panorama placeholders into src/assets so Virtual Tour shows content immediately.
- Add a CONTRIBUTING or developers.md with local debug commands.
