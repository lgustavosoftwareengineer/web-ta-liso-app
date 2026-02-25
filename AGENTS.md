# AGENTS.md

## Cursor Cloud specific instructions

### Overview

Tá Liso is a Vue 3 + Vite + TypeScript personal finance web app (Brazilian Portuguese). It requires a FastAPI backend API (`lgustavosoftwareengineer/api-ta-liso-app`) for full functionality.

### Services

| Service | How to start | Port | Notes |
|---------|-------------|------|-------|
| PostgreSQL 16 | `sudo dockerd &>/tmp/dockerd.log &` then `sudo docker compose up -d db` (in `api-ta-liso-app/`) | 5432 | Credentials: `postgres/postgres`, DB: `taliso` |
| Backend API | `alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload` (in `api-ta-liso-app/`) | 8000 | Requires `.env` and running PostgreSQL. Add `$HOME/.local/bin` to PATH. |
| Frontend dev | `npm run dev` (in repo root) | 5173 | Requires `.env` with `VITE_API_URL` and `VITE_API_KEY` |

### Backend setup (api-ta-liso-app)

The backend repo must be cloned to `/workspace/api-ta-liso-app`. It requires:
- `pip install -r requirements.txt python-dotenv` (note: `python-dotenv` is not in requirements.txt but is imported by `app/config.py`)
- A `.env` file with: `DATABASE_URL`, `JWT_SECRET_KEY`, `API_KEY`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`. Set `AWS_SECRETS_NAME=` (empty) to skip AWS Secrets Manager.
- Docker daemon must be started with `sudo dockerd &>/tmp/dockerd.log &` before `docker compose up -d db`.
- Run `alembic upgrade head` before starting the API server.

### API code generation

Before type-checking or building the frontend, run `npm run gen:api` (orval). This generates TypeScript API client code from the backend's OpenAPI spec into `src/api/generated/`. The backend must be running for this to work.

### Authentication in dev

The login flow sends a 6-digit code via email (Resend). Without valid Resend credentials, the email send fails but the code is still saved to the database. Retrieve it with:
```
sudo docker exec api-ta-liso-app-db-1 psql -U postgres -d taliso -c "SELECT token FROM login_tokens ORDER BY expires_at DESC LIMIT 1;"
```
Then call `POST /api/auth/verify-code` with `{"email":"...","code":"..."}` to get a JWT.

### Standard commands (see README.md)

- Lint: `npm run lint`
- Tests: `npm run test:unit -- --run`
- Type-check: `npm run type-check`
- Build: `npm run build`
- Backend tests: `python3 -m pytest tests/ -v` (in `api-ta-liso-app/`, uses in-memory SQLite, no PostgreSQL needed)

### Docker in nested containers

Docker in Cursor Cloud VMs requires `fuse-overlayfs` storage driver and `iptables-legacy`. The daemon config at `/etc/docker/daemon.json` must have `{"storage-driver": "fuse-overlayfs"}`.
