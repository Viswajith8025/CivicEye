# Civic Eye

Citizen civic issue reporting platform — report, track, and resolve community problems.

## Stack

- **Frontend:** React 18, Vite 6, Tailwind 4, React Query, Leaflet, PWA
- **Backend:** Express 4, MongoDB, JWT auth, optional S3/SMTP/OpenAI

## Quick start (local dev)

### Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)

### Backend

```bash
cd backend
cp .env.example .env
# For quickest start: USE_MEMORY_DB=true and SEED_DEMO_USERS=true (already in .env.example)
# Set KEY to 32+ random characters
npm install
npm run dev
```

API runs at `http://localhost:5001`. Health check: `GET /health`.

**Demo logins** (when `SEED_DEMO_USERS=true`):

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@civiceye.local | Admin@12345 |
| Citizen | citizen@civiceye.local | Citizen@12345 |

> Data is in-memory when `USE_MEMORY_DB=true` — resets on server restart.

### Frontend

```bash
cd frontend
echo "VITE_API_URL=http://localhost:5001" > .env
npm install
npm run dev
```

App runs at `http://localhost:5173`.

## Docker (beta deploy)

```bash
cp .env.example .env
# Set KEY to a strong random string (32+ chars). Example:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
docker compose up --build
```

| Service | URL |
|---------|-----|
| Web | http://localhost:5173 |
| API | http://localhost:5001 |
| Health | http://localhost:5001/health |

MongoDB is **not** exposed on the host (internal Docker network only).

## Production checklist (beta)

Before exposing to real users:

- [ ] **KEY** — 32+ character random secret; never use defaults
- [ ] **DB_URL** — MongoDB Atlas or managed DB with authentication
- [ ] **FRONTEND_URL** — exact browser origin (e.g. `https://app.yourdomain.com`)
- [ ] **VITE_API_URL** — public API URL used at frontend build time
- [ ] **ALLOWED_ORIGINS** — extra CORS origins if needed (comma-separated)
- [ ] **TLS** — terminate HTTPS at reverse proxy / platform (Render, Railway, nginx)
- [ ] **SMTP** — configure for password reset emails (optional but recommended)
- [ ] **S3** — configure for durable uploads if running multiple API instances
- [ ] Rotate secrets if `.env` was ever committed

## Environment variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `DB_URL` | Yes | MongoDB connection string |
| `KEY` | Yes | JWT signing secret (32+ chars in production) |
| `SALT` | Yes | bcrypt rounds (default 10) |
| `FRONTEND_URL` | Yes | Frontend origin for CORS and email links |
| `ALLOWED_ORIGINS` | No | Extra CORS origins, comma-separated |
| `PORT` | No | API port (default 5001) |
| `SMTP_*` | No | Email delivery |
| `S3_*` | No | Object storage for uploads |
| `OPENAI_API_KEY` | No | AI report summaries |

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | Yes | Backend API base URL (baked in at build) |

## API

- Versioned routes: `/v1/user`, `/v1/complaint`, …
- Legacy aliases: `/user`, `/complaint`, … (same handlers)

## Tests & CI

```bash
cd backend && npm test
cd frontend && npm run lint && npm run build
```

GitHub Actions runs both on push/PR to `main`/`master`.

## Known beta limitations

- JWT stored in browser `localStorage` (acceptable for beta; upgrade to httpOnly cookies for full production)
- Minimal automated integration tests
- PWA icons are placeholders
- No built-in monitoring — add Sentry or similar for production

## License

ISC
