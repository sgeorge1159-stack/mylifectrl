# Fly.io Backend Deployment

## Architecture

- **Frontend**: Vercel (`www.mylifectrl.com`) — SPA with API requests proxied to the backend
- **Backend**: Fly.io (`api.mylifectrl.com`) — Hono/Bun API server, port 3000
- **Database**: SQLite on a Fly.io persistent volume mounted at `/data`
- **Uploads**: Stored on the same persistent volume at `/data/uploads`

## Prerequisites

- A [Fly.io](https://fly.io) account
- Fly CLI installed: `curl -L https://fly.io/install.sh | sh` (or see [fly.io/docs/hands-on/install-flyctl](https://fly.io/docs/hands-on/install-flyctl/))

## One-Time Setup

### 1. Login to Fly.io

```bash
fly auth login
```

### 2. Create the Fly.io app

```bash
fly launch --no-deploy
```

When prompted:
- Choose a name (default: `lifectrl-api`) or keep the generated one
- Select a region close to your users
- Say **no** to setting up a Postgres database
- Say **no** to deploying now

### 3. Create the persistent volume

```bash
fly volumes create data --region ord --size 1
```

(Replace `ord` with the region you selected above.)

### 4. Set secrets

```bash
fly secrets set \
  OPENAI_API_KEY=sk-your-openai-key \
  JWT_SECRET=your-random-secret-string
```

### 5. Add DNS record

In your DNS provider (where `mylifectrl.com` is managed), add a CNAME record:

| Type  | Name | Value                          |
|-------|------|--------------------------------|
| CNAME | api  | `<app-name>.fly.dev`           |

Replace `<app-name>` with your Fly.io app name (e.g., `lifectrl-api.fly.dev`).

Note: You'll also need to request a certificate after the DNS propagates (Fly may auto-provision it):

```bash
fly certs create api.mylifectrl.com
```

## Deploy

```bash
fly deploy
```

This builds the Docker image from `server/Dockerfile` and deploys it.

## Verify

```bash
curl https://api.mylifectrl.com/api/health
# Expected: {"ok":true,"data":{"status":"healthy","version":"0.1.0"}}
```

## Environment Variables Reference

| Variable        | Description                          | Default (development)            |
|-----------------|--------------------------------------|----------------------------------|
| `OPENAI_API_KEY`| OpenAI API key for AI features       | (required)                       |
| `JWT_SECRET`    | Secret for signing auth tokens       | `lifectrl-dev-secret-...`        |
| `DATABASE_URL`  | Path to SQLite database              | `/data/lifectrl.db`              |
| `UPLOADS_DIR`   | Directory for uploaded documents     | `/data/uploads`                  |
| `NODE_ENV`      | Environment mode                     | `production`                     |

## Troubleshooting

### Check app status
```bash
fly status
```

### View logs
```bash
fly logs
```

### SSH into the VM
```bash
fly ssh console
```

### Redeploy after secrets change
```bash
fly deploy
```

### Database is empty after deploy
The SQLite database file is stored on the persistent volume at `/data/lifectrl.db`. Tables are auto-created on first request via the migration in `server/src/db/migrate.ts`. If the volume was recreated, the database will be recreated automatically.
