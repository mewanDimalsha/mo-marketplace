# MO Marketplace

A full-stack marketplace application with product management, variant handling, and JWT authentication.

**Live Demo:** https://mo-marketplace.vercel.app  
**API:** https://mo-api.railway.app  
**Swagger Docs:** https://mo-api.railway.app/api

---

## Quick Start (Docker — recommended)

Prerequisites: Docker and Docker Compose installed.

```bash
git clone https://github.com/yourusername/mo-marketplace.git
cd mo-marketplace
cp .env.example .env        # add your Cloudinary credentials
docker-compose up --build
```

| Service  | URL                       |
| -------- | ------------------------- |
| Frontend | http://localhost          |
| API      | http://localhost:3000     |
| Swagger  | http://localhost:3000/api |

---

## Manual Setup

### Prerequisites

- Node.js v20+
- PostgreSQL 15+
- Docker (optional)

### Database

```bash
docker run --name mo-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=mo_marketplace \
  -p 5432:5432 -d postgres:15
```

### Backend

```bash
cd mo-marketplace-api
cp .env.example .env        # fill in values
npm install
npm run start:dev
```

### Frontend

```bash
cd mo-marketplace-web
cp .env.example .env        # set VITE_API_URL
npm install
npm run dev
```

---

## Architecture

- **Backend:** Node.js, Express, PostgreSQL, JWT, Cloudinary
- **Frontend:** React, Vite, Tailwind CSS, React Router, Materail UI
- **Authentication:** JWT with refresh tokens
- **Image Storage:** Cloudinary
- **API Documentation:** Swagger
- **Deployment:** Vercel (frontend), Railway (backend)

### Backend Structure

src/
auth/ JWT auth — register, login, refresh, logout
products/ Products + variants CRUD
uploads/ Cloudinary image upload
common/ Global exception filter

### Frontend Structure

src/
api/ Axios client + API functions
store/ AuthContext — global auth state
pages/ 4 pages — List, Detail, Create, Login/Register
components/
auth/ LoginForm, RegisterForm
products/ VariantSelector, QuickBuyModal, AddVariantForm
ui/ Reusable — Navbar, PageWrapper, StatusChip, etc.
hooks/ useFetch — reusable data fetching

---

## Key Features

- **JWT dual-token auth** — access token (15min) + refresh token (7d)
- **Silent token refresh** — axios interceptor transparently refreshes expired tokens
- **combination_key** — normalizes color/size/material to prevent duplicate variants
- **Image upload** — Cloudinary integration with instant local preview
- **Redirect after login** — user returns to intended page after authenticating
- **Out of stock UI** — variant chips disabled with strikethrough
- **Optimistic UI** — stock updates instantly after Quick Buy without refetch
- **Skeleton loaders** — professional loading states on all pages
- **Search** — client-side product filtering by name and description

---

## API Endpoints

| Method | Endpoint                         | Auth | Description                 |
| ------ | -------------------------------- | ---- | --------------------------- |
| POST   | /auth/register                   | ❌   | Register new user           |
| POST   | /auth/login                      | ❌   | Login — returns both tokens |
| POST   | /auth/refresh                    | ✅   | Refresh access token        |
| POST   | /auth/logout                     | ✅   | Invalidate refresh token    |
| GET    | /products                        | ❌   | List all products           |
| GET    | /products/:id                    | ❌   | Get product with variants   |
| POST   | /products                        | ✅   | Create product              |
| POST   | /products/:id/variants           | ✅   | Add variant                 |
| POST   | /products/variants/:id/quick-buy | ❌   | Purchase — decrements stock |
| POST   | /uploads/image                   | ✅   | Upload image to Cloudinary  |

Full interactive docs: `/api` (Swagger UI)

---

## Edge Cases Handled

| Case                     | Handling                                                                   |
| ------------------------ | -------------------------------------------------------------------------- |
| Duplicate variant        | Service returns 409 with clear message. DB unique constraint as safety net |
| Out of stock             | Variant chip disabled + strikethrough in UI. API returns 409               |
| Invalid inputs           | Zod on frontend + class-validator on backend — two layers                  |
| Expired token            | Axios interceptor silently refreshes then retries original request         |
| Unauthenticated purchase | Redirected to login with return URL. Lands back on product after login     |
| Invalid UUID in URL      | ParseUUIDPipe returns 400 before service is called                         |

---

## Architecture Decisions

**Why NestJS over Express?**  
Module system enforces clean separation of concerns. Built-in DI, guards, pipes, and Swagger integration reduce boilerplate significantly.

**Why dual JWT tokens?**  
Access token (15min) limits damage window if stolen. Refresh token (7d) keeps users logged in. Token rotation on every refresh invalidates stolen refresh tokens.

**Why combination_key normalized?**  
"Red/M/Cotton" and "red/m/cotton" represent the same variant. Lowercasing and trimming before joining prevents duplicate variants that are semantically identical.

**Why class-validator on backend AND Zod on frontend?**  
Defense in depth. Frontend validation gives instant feedback. Backend validation is the security gate — never trust client input.

**Why Cloudinary over storing files locally?**  
Local filesystem breaks on serverless deployments. Cloudinary provides CDN, automatic optimization, and persistent storage.

**Why HS256 over RS256 for JWT?**  
Single server architecture — no need for asymmetric keys. RS256 is needed when multiple independent services verify tokens without sharing a secret.

---

## Security Trade-offs

- Tokens stored in localStorage for simplicity. Production should use HttpOnly cookies to prevent XSS token theft
- `synchronize: true` used for dev convenience. Production should use TypeORM migrations
- Single user role — no admin/buyer separation. Production would add RBAC
- Confirm password validated on frontend only — never sent to API

---

## Assumptions

- Single user role — any authenticated user can create products
- No payment processing — Quick Buy simulates purchase by decrementing stock
- No order history — purchases are not persisted beyond stock decrement
- Email verification skipped — registration immediately grants access
- No pagination or filtering on product list — assumed small dataset for demo
- Image upload limited to one image per variant for simplicity
