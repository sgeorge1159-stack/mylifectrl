# LIFECTRL

**Your AI-powered personal chief of staff.** Turn chaos into clarity.

LIFECTRL transforms overwhelming life situations — job loss, moving, financial hardship, career changes, complicated paperwork — into clear, prioritized, step-by-step action plans.

## Tech Stack

- **Frontend:** React 18 + Vite + TypeScript + Tailwind CSS + React Router v6
- **Backend:** Bun + Hono + TypeScript
- **Database:** SQLite (via `bun:sqlite`)
- **AI:** OpenAI API integration

## Project Structure

```
lifectrl/
├── client/               # Vite + React frontend
│   └── src/
│       ├── components/   # Layout, ProtectedRoute
│       ├── config/       # Payment links, Stripe config
│       ├── pages/        # Landing, Dashboard, Plans, Docs, Vault, Kits, Concierge, Auth
│       └── styles/       # Tailwind CSS + custom components
├── server/               # Bun + Hono backend
│   └── src/
│       ├── ai/           # OpenAI plan generator + document analyzer
│       ├── db/           # Database migration, seeding, connection
│       └── index.ts      # All API routes + static file serving
├── shared/               # Shared TypeScript types
└── package.json          # Root workspace scripts
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Optional | OpenAI API key for AI-powered plan generation and document analysis |
| `JWT_SECRET` | Yes | Secret key for signing JWT auth tokens |
| `DATABASE_URL` | No | SQLite database file path (default: `./lifectrl.db`) |
| `PORT` | No | Server port (always uses 3000 in production; 3001 in development) |

Copy `.env.example` to `.env` and fill in your values before running.

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (v1.1+)

### Development

```bash
# Install dependencies
cd lifectrl
bun install && cd client && bun install && cd ../server && bun install && cd ..

# Set up environment
cp .env.example .env
# Edit .env with your API keys

# Run database migration
bun run db:migrate

# Start development servers (frontend :5173, backend :3001)
bun run dev
```

- **Frontend:** http://localhost:5173
- **API:** http://localhost:3001

### Production

```bash
# Build both frontend and backend
bun run build

# Start production server (API + static frontend on port 3000)
PORT=3000 NODE_ENV=production bun run start
```

The production server serves the React SPA and all API endpoints from a single port 3000.

### Clean database

```bash
# Delete existing database and restart
rm -f lifectrl.db lifectrl.db-shm lifectrl.db-wal
PORT=3000 NODE_ENV=production bun run start
# Database auto-migrates and seeds on first request
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/auth/signup` | Create account |
| POST | `/api/auth/login` | Log in |
| POST | `/api/auth/logout` | Log out |
| GET | `/api/plans` | List plans |
| POST | `/api/plans` | Create plan (AI-generated) |
| GET | `/api/plans/:id` | Get plan with tasks and documents |
| GET | `/api/plans/:id/tasks` | List tasks for a plan |
| POST | `/api/plans/:id/tasks` | Add task to plan |
| PATCH | `/api/plans/:id/tasks/:taskId` | Update task |
| GET | `/api/docs` | List documents |
| POST | `/api/docs/upload` | Upload document (multipart) |
| PATCH | `/api/docs/:id` | Update document metadata |
| DELETE | `/api/docs/:id` | Delete document |
| GET | `/api/vault` | List vault items |
| POST | `/api/vault` | Create vault item |
| GET | `/api/vault/timeline` | Combined timeline of vault + documents |
| GET | `/api/vault/stats` | Vault statistics |
| PATCH | `/api/vault/:id` | Update vault item |
| DELETE | `/api/vault/:id` | Delete vault item |
| GET | `/api/kits` | List available kits |
| GET | `/api/kits/purchases` | List user's purchased kits |
| GET | `/api/kits/:id` | Get single kit |
| POST | `/api/kits/:id/purchase` | Purchase a kit |
| POST | `/api/concierge/book` | Book concierge session |
| GET | `/api/concierge/bookings` | List bookings |
| GET | `/api/concierge/bookings/:id` | Get booking detail |
| PATCH | `/api/concierge/bookings/:id` | Update booking |
| PATCH | `/api/concierge/bookings/:id/cancel` | Cancel booking |

All endpoints except `/api/health` and auth routes require `Authorization: Bearer <token>`.

## Frontend Routes

| Path | Page | Auth Required |
|------|------|:---:|
| `/` | Landing page | No |
| `/login` | Login | No |
| `/signup` | Sign up | No |
| `/dashboard` | Dashboard | Yes |
| `/plans` | Action Plans list | Yes |
| `/plans/:id` | Plan detail | Yes |
| `/docs` | Document Studio | Yes |
| `/vault` | LifeVault | Yes |
| `/kits` | Life Kits browse | Yes |
| `/kits/:id` | Kit detail | Yes |
| `/concierge` | Human Concierge | Yes |
| `*` | 404 Not Found | — |

## Design Philosophy

Warm, calming, human-centered design — not cold SaaS. Colors inspired by natural earth tones, with brand accents in warm orange. Typography pairs Inter (clean, readable) with Fraunces (warm, distinctive display face).
