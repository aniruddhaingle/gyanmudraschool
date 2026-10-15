# Gyan Mudra Academy Website

The website of Gyan Mudra Academy, Palsud (Barwani): a React + Express + MongoDB (MERN)
app with online admissions, a festival photo gallery, and a private admin panel.

## Features

**Public website**

- Home, About, Admissions, Gallery, and Leadership pages, designed for phones first
- Online admission form with a student photo; large phone photos are shrunk in the
  browser before upload
- Gallery of school events; each album gets a matching festival look (Diwali, Holi,
  Independence Day, Sports Day, and more)
- Fast loading: photos are served as small WebP files sized for each screen
- Page titles, sitemap, robots.txt, and WhatsApp/Facebook link previews

**Admin panel** (`/admin`)

- See admission enquiries, call families with one tap, and mark each one
  New, Contacted, Admitted, or Rejected
- A popup announces enquiries that arrived since your last visit
- Publish, edit, and delete gallery events and photos; the album theme is detected
  automatically from the event name (English or Hindi) and can be changed
- Stays logged in across page refreshes for 2 hours

## Tech stack

| Part | Built with |
|---|---|
| Frontend | React 18, React Router 7, Vite 6 |
| Backend | Node.js, Express 4 |
| Database | MongoDB (Mongoose), photos stored in GridFS |

## Requirements

- Node.js 20 or newer
- A MongoDB database: [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier works)
  or MongoDB installed locally

## Getting started

On Windows, use `npm.cmd` in PowerShell as shown below (plain `npm` may be blocked by
PowerShell's script policy). On macOS/Linux, use `npm` and `cp` instead.

```bash
npm.cmd install
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env
npm.cmd run dev
```

- Website: http://localhost:5173
- API: http://localhost:5000

Before admissions and the admin panel will work, fill in `backend/.env`
(see [Configuration](#configuration)). The backend restarts by itself when its code
changes; the website reloads by itself.

## Configuration

All server settings live in `backend/.env`. Never commit this file.

| Setting | What it is |
|---|---|
| `NODE_ENV` | `development` on your computer, `production` on the live server |
| `PORT` | Port for the server (default `5000`) |
| `MONGODB_URI` | Your MongoDB connection string |
| `JWT_SECRET` | A long random secret (at least 32 characters) for admin logins |
| `ADMIN_EMAIL` | Email address for the admin login |
| `ADMIN_PASSWORD_HASH` | The admin password, stored as a bcrypt hash (see below) |
| `CLIENT_ORIGIN` | Address the website is opened from, e.g. `https://www.yourschool.in` |
| `PUBLIC_SITE_URL` | Public address of the site, used for link previews and the sitemap |

**Creating the admin password hash.** From the `backend` folder, run this with your
chosen password, then paste the output into `ADMIN_PASSWORD_HASH`:

```bash
node -e "console.log(require('bcryptjs').hashSync('your-password-here', 12))"
```

The admin account is created the first time the server starts with these settings.
After that, changing `ADMIN_PASSWORD_HASH` does **not** change the password of the
existing account; to change it, update `passwordHash` on that user in the `adminusers`
collection (or use a new `ADMIN_EMAIL`, which creates a new admin).

**Generating a JWT secret:**

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

`frontend/.env` has one optional setting, `VITE_API_BASE_URL`. Leave it blank when the
Express server also serves the website (the normal setup).

## Deploying to production

The Express server serves both the API and the built website from one address.

1. On the server, set `backend/.env` with `NODE_ENV=production` and real values for
   every setting above. The server refuses to start in production if any required
   setting is missing.
2. Build and start:

   ```bash
   npm install --include=dev
   npm run build
   npm start
   ```

   `--include=dev` is needed because the build tools (Vite) are development
   dependencies, and many hosts skip those when `NODE_ENV=production`.

3. **Use HTTPS.** In production the admin login cookie only works over `https://`.
4. **MongoDB Atlas:** under *Network Access*, allow your server's IP address.
5. Turn on database backups in Atlas: admissions and gallery photos are stored only
   in the database.

> GitHub Pages can only host static files, so it cannot run this site (the admission
> form, gallery uploads, and admin panel need the Express server). Use a Node.js host
> such as a VPS, Render, or Railway.

If you host the website and API on different addresses, set `VITE_API_BASE_URL` to the
API address and add the website address to `CLIENT_ORIGIN` (comma-separated). Both must
be on the same site, e.g. `www.yourschool.in` and `api.yourschool.in`; unrelated domains
will stop admin login from working.

## Adding or replacing photos

Site photos are optimized before they are served:

1. Put the original photo in `frontend/image-sources/` (keep the same file name to
   replace an existing one).
2. Run:

   ```bash
   npm.cmd --prefix frontend run images
   ```

   This writes small WebP versions to `frontend/public/images/`.
3. Reference it in the code as `/images/<name>.webp`.

Gallery photos uploaded through the admin panel need none of this; they are stored in
the database automatically.

## Scripts

```bash
npm.cmd run dev           # website + API, both reload on changes
npm.cmd run dev:frontend  # website only
npm.cmd run dev:backend   # API only
npm.cmd run build         # build the website for production
npm.cmd run start         # start the production server
npm.cmd run lint          # check code in both apps
npm.cmd --prefix frontend run images   # optimize photos in image-sources/
```

## Project structure

```text
frontend/
  image-sources/   Full-size original photos (not served; run `npm run images`)
  public/          Optimized images, icons, built-in gallery albums
  scripts/         Image optimizer
  src/
    components/    Layout, gallery manager, dialogs
    data/          School content and festival themes
    effects/       Animation helpers
    pages/         Home, About, Admissions, Gallery, Leadership, Admin
    sections/      Home page sections
    services/      API calls
    utils/         Image helpers
backend/
  src/
    middleware/    Login checks, uploads, errors
    models/        Admissions, gallery events, admin users
    routes/        API endpoints
    utils/         Photo storage, validation
```

## API overview

| Method | Path | Who |
|---|---|---|
| POST | `/api/admissions` | Public: submit an admission enquiry |
| GET | `/api/gallery/events` | Public: list gallery events |
| GET | `/api/uploads/:id` | Public: gallery photo |
| POST | `/api/admin/login` | Admin login |
| GET | `/api/admin/session` | Admin: check login |
| GET | `/api/admin/admissions` | Admin: list enquiries |
| PATCH | `/api/admin/admissions/:id` | Admin: change an enquiry's status |
| POST | `/api/admin/admissions/seen` | Admin: dismiss the new-enquiries popup |
| GET | `/api/admin/admissions/:id/photo` | Admin: student photo |
| POST / PATCH / DELETE | `/api/gallery/events[/:id]` | Admin: manage gallery events |
| GET | `/api/health` | Server and database status |

## Security

- Security headers (Helmet), allowed-origin list (CORS), and request size limits
- Rate limits on the API, admin login, and admission form
- Admin login uses an HTTP-only cookie (HTTPS-only in production)
- All input is validated on the server; database queries are sanitized
- Uploads must be real JPG, PNG, or WebP images within size limits
- Student photos are private: only a logged-in admin can view them; public photo
  links work only for photos in published gallery events
