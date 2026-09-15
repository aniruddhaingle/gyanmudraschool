# Gyan Mudra Academy MERN Website

Production-ready MERN replacement for the legacy HTML/CSS/PHP website.

## Architecture

```text
gyanmudraschool-main/
  frontend/              React + Vite app
    public/              School images and static assets
    src/
      components/        Shared layout/UI primitives
      effects/           UI animation helpers
      sections/          Homepage sections
      pages/             Route-level pages
      services/          API clients
      data/              School content
  backend/               Express + Mongo API
    src/
      middleware/        Auth, upload, error handlers
      models/            Mongoose models
      routes/            API route modules
      utils/             Validation helpers
    uploads/             Legacy local folder (new uploads use MongoDB GridFS)
```

The retired PHP website has been removed. The nested `gyanmudraschool-main/`
directory retains only its protected legacy database configuration and upload
data; neither is part of the React/Express deployment.

## Quick Start

```bash
npm.cmd install
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env
npm.cmd run dev
```

Frontend: `http://localhost:5173`
Backend API: `http://localhost:5000`

Set real values in `backend/.env` before using admissions or admin features:

- `MONGODB_URI`
- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD_HASH`

For a split frontend/API deployment, set `VITE_API_BASE_URL` to the public API
origin and add the frontend origin to `CLIENT_ORIGIN` (comma-separated when
there is more than one). The API refuses to start in production without all
required server configuration.

## Scripts

```bash
npm.cmd run dev          # frontend + backend
npm.cmd run dev:frontend # frontend only
npm.cmd run dev:backend  # backend only
npm.cmd run build        # builds frontend
npm.cmd run start        # starts backend
npm.cmd run lint         # lints both apps
```

## Security Controls

- Helmet security headers
- CORS allowlist with credentials support
- Global API rate limiting
- Stricter login and admission submission rate limits
- Express body size limits
- Mongo query sanitization
- Server-side request validation
- HTTP-only, secure production cookies for admin auth
- File upload type and size restrictions
- No active PHP handlers in the new app runtime
- MongoDB GridFS for deployment-safe admission and gallery image uploads
