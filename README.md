> Drivebase migration branch: see [migration setup, authentication and rollout notes](DRIVEBASE_MIGRATION.md). The previous setup below describes the original deployment.

# Portfolio

An editable personal portfolio with React, Express and MongoDB. Visitors read published content; an admin manages it through the same interface. Socket.IO broadcasts content changes to connected browsers.

## Features

- Home, skills, projects, education/experience and certificates.
- Admin login with bcrypt password hashing and signed JWT bearer tokens.
- Add, edit, delete and drag to reorder content.
- Public live updates, reconnect refresh and REST-response updates when the socket is unavailable.
- Responsive navigation and light/dark presentation.

Profile and certificate file previews are browser-local snapshots. They do not upload to a shared media service. Use the public profile image URL and public certificate image URL fields for images visible to all visitors. Existing browser-local certificate snapshots need to be hosted and linked once; this update cannot recover files from another browser. Project links and social links accept HTTP/HTTPS URLs.

## Design and image performance

The slate-and-teal theme shares tokens across light/dark modes, cards, navigation and editors. Layout inspiration: [Alirazahaider/web-dev-portfolio](https://github.com/Alirazahaider/web-dev-portfolio), a small community portfolio; the implementation is original and retains this app's React/Vite architecture and editable content.

The bundled profile photo has 240px and 480px WebP variants (8KB/25KB versus the 158KB original). Responsive image selection, high fetch priority and reserved dimensions improve profile loading. Certificate images load lazily, decode asynchronously, retain their full image without cropping, and show a fallback if unavailable. Use compressed WebP images on a cacheable CDN for public URLs; arbitrary external images cannot be resized by Vite. Browser-local image imports are resized and compressed to WebP. Route and home/login editor code is split so it loads when needed; system fonts remove external font requests.

Deploy both the Vercel frontend and Render backend for the new certificate `imageUrl` field. Domain setup remains a separate Vercel/DNS change.

## Architecture

```text
React/Vite -> Axios public/admin APIs -> Express -> Mongoose/MongoDB
           <- Socket.IO public content events <- authorized content writes
```

The shared CRUD router serves four ordered collections. Home is one document keyed by `slug: home`; reading missing home content returns defaults without creating a document. Public APIs and socket events expose published portfolio content, including contact details you choose to publish. User/password documents have no public collection API.

```text
frontend/src/  pages, cards/editors, shared API, auth and live-data hooks
backend/       app/server, routes, models, middleware and API tests
```

## Run locally

Use Node.js 22.12+ and a disposable local MongoDB database or your Atlas database.

```bash
npm --prefix backend ci
npm --prefix frontend ci
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
npm --prefix backend run dev
```

Run `npm --prefix frontend run dev` in another terminal and open http://localhost:5173. PowerShell can use `Copy-Item` for the example files. Generate a JWT secret with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.

| Backend variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string; keep it server-side |
| `JWT_SECRET` | Generated secret with at least 32 characters |
| `ADMIN_USERNAME`, `ADMIN_PASSWORD` | Create the first admin only; initial password 12+ characters, maximum 72 UTF-8 bytes |
| `CORS_ORIGINS` | Comma-separated frontend origins; localhost defaults for development, required in production |
| `PORT` | Local default 4000; hosting supplies it |
| `NODE_ENV` | Set `production` on Render |

Set frontend `VITE_API_URL` to the backend origin, without `/api`. Vite embeds it during the build; server credentials must never use a `VITE_` prefix.

## Admin and API behavior

Click Admin login, then use Add/Edit/Delete/Drag controls. Bootstrap credentials do not overwrite an existing administrator. Password change is available through `POST /api/auth/change-password` with the bearer token and `{ currentPassword, newPassword }`; the current UI has no password-change form.

JWTs expire after 24 hours and live in browser localStorage. Password changes increment a stored token version to invalidate existing sessions; sign in again afterward. Protected requests verify the current stored user and role. Login failures are throttled per IP. Treat prevention of injected browser scripts as part of protecting bearer tokens.

| Public reads | Admin writes |
| --- | --- |
| `GET /api/home` | `PUT /api/home` |
| `GET /api/skills`, `/projects`, `/experience`, `/certificates` | `POST /api/<section>`, `PUT /api/<section>/:id`, `DELETE /api/<section>/:id` |
| `GET /api/health` | `PUT /api/<section>/reorder` with unique `{ ids: [...] }` |

Editable fields come from the content schema. IDs, order metadata, timestamps and operators cannot be supplied as content updates; Mongoose validation runs on updates. Reorder validates document IDs and uses one bulk operation; it is not a multi-document transaction. The Socket.IO channel is public and broadcasts published content, not private admin actions.

## Verification

```bash
npm --prefix backend test
npm --prefix frontend run build
npm --prefix backend audit --omit=dev
npm --prefix frontend audit --omit=dev
```

API tests start a real local HTTP server with mocked model calls. They cover protected writes, roles, bcrypt login, malformed input, JWT expiry/tampering, password-change revocation, read-only defaults, reorder/broadcast behavior, origin rejection and login throttling. They do not prove Atlas connectivity or full MongoDB integration. No production database is needed for these tests.

## Deployment

Vercel: root `frontend/`, Vite preset, build `npm run build`, output `dist`, and build-time `VITE_API_URL`. The existing SPA rewrite supports direct links such as `/projects`.

Render: root `backend/`, build `npm ci --omit=dev`, start `npm start`, health `/api/health`, Node.js 22 and backend environment above. The root package wrapper also supports the existing root-based Render service; changing its root is optional. Restrict database access to the deployment's outbound addresses where available. Never commit the URI, bootstrap password or signing secret.

Health is process liveness, not an end-to-end visitor/admin test. A frontend build does not prove that hosting, MongoDB or Socket.IO work together. Docker/Kubernetes are unnecessary for this site's current size.

## Engineering lessons

- Enforce admin access on the API even when the UI hides edit controls.
- Check current identity and invalidate sessions after changing a password.
- Keep shared CRUD/list helpers where they remove real repetition.
- Reconcile REST responses as well as public socket broadcasts.
- Distinguish published content and shared media from browser-local previews.

## Resume-aligned content and interface

The current design keeps the slate-and-teal palette in light and dark themes, with responsive top navigation, a portrait-led introduction, featured projects, education, skills, and credentials. Admin editing and Socket.IO updates remain available. A PDF exported from the supplied resume is bundled under `frontend/public/resume/`; an optional public resume URL and LeetCode profile can be changed in Edit home.

`content/resume.json` records the resume-derived content. The explicit `backend/scripts/sync-resume.cjs` utility synchronizes it through the authenticated admin API, preserves unrelated records and existing media, and does not run on server startup. Supply `PORTFOLIO_API_URL`, `PORTFOLIO_ADMIN_USERNAME`, and `PORTFOLIO_ADMIN_PASSWORD` only in the process environment. Run it intentionally when importing a new resume; ordinary content editing continues through the admin interface.
