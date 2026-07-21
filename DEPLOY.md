# LifeCTRL Deployment

## Architecture

| Component | Host | URL |
|-----------|------|-----|
| Frontend (SPA) | Vercel | `www.mylifectrl.com` |
| Backend (API) | Fly.io | `api.mylifectrl.com` |
| Database (SQLite) | Fly.io persistent volume | `/data/lifectrl.db` |
| Uploads | Fly.io persistent volume | `/data/uploads/` |

## Deploy Backend (Fly.io)

### Prerequisites
- Install [Fly CLI](https://fly.io/docs/flyctl/install/): `curl -L https://fly.io/install.sh | sh`
- Login: `fly auth login`

### First Deploy

```bash
# Create the app
fly launch --name lifectrl-api --region iad

# Create persistent volume for database and uploads
fly volumes create data --size 1 --region iad

# Set secrets
fly secrets set OPENAI_API_KEY=sk-...
fly secrets set JWT_SECRET=your-secret-here
fly secrets set DATABASE_URL=/data/lifectrl.db
fly secrets set UPLOADS_DIR=/data/uploads

# Deploy
fly deploy
```

### DNS Setup
Add a CNAME record: `api.mylifectrl.com` → `lifectrl-api.fly.dev`

### Redeploy after code changes
```bash
fly deploy
```

## Deploy Frontend (Vercel)

Vercel auto-deploys from the `main` branch on GitHub. Push changes to trigger a redeploy.

## Environment Variables

| Variable | Where | Purpose |
|----------|-------|---------|
| `OPENAI_API_KEY` | Fly secrets | OpenAI API for AI features |
| `JWT_SECRET` | Fly secrets | JWT signing secret |
| `DATABASE_URL` | Fly secrets | SQLite path (default: `/data/lifectrl.db`) |
| `UPLOADS_DIR` | Fly secrets | File uploads path (default: `/data/uploads`) |
| `CORS_ORIGIN` | Fly secrets | Allowed origin (default: `https://www.mylifectrl.com`) |
