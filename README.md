# Portfolio — editable, live, deployable

A full-stack personal portfolio where **only you** can edit the contents, and edits propagate to every visitor's browser in real time over a websocket.

- **Frontend** — React + Vite + Tailwind, deploys to **Vercel**
- **Backend** — Node + Express + Socket.io + MongoDB (Atlas), deploys to **Render**
- **Auth** — JWT, a single admin user bootstrapped from env vars on first boot
- **Sections** — Home, Skills, Projects, Experience, Certificates & Achievements
- **Admin powers** — add, edit, delete, and drag-to-rearrange items; changes broadcast live

```
portfolio/
├── backend/   → Render
└── frontend/  → Vercel
```

---

## 1. Provision a free MongoDB database

1. Create a free account at <https://www.mongodb.com/cloud/atlas/register>.
2. Create a free **M0** cluster.
3. Under **Database Access**, create a user with a password.
4. Under **Network Access**, add `0.0.0.0/0` (anywhere) so Render can connect.
5. Click **Connect → Drivers → Node.js**, copy the connection string. Swap in your password, and add `/portfolio` before the `?`:

```
mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority
```

Keep this — it's your `MONGODB_URI`.

---

## 2. Deploy the backend to Render

1. Push this repo to GitHub.
2. Go to <https://dashboard.render.com/new/web>, connect your repo, and select the **`backend/`** folder as the root.
3. Render auto-detects Node. If asked:
   - **Build command:** `npm install`
   - **Start command:** `npm start`
4. Add these environment variables:

| Key | Value |
| --- | --- |
| `MONGODB_URI` | (from step 1) |
| `JWT_SECRET` | any long random string — e.g. `openssl rand -hex 48` |
| `ADMIN_USERNAME` | the username you want to log in with |
| `ADMIN_PASSWORD` | a strong password (used **only** on first boot to create the admin user) |
| `CORS_ORIGINS` | leave blank for now; we'll fill it after Vercel deploys |

5. Deploy. Once live, note the URL (e.g. `https://portfolio-backend-xxxx.onrender.com`). Visit `/api/health` to confirm it returns `{ ok: true, ... }`.

> The first boot creates an admin user from `ADMIN_USERNAME` / `ADMIN_PASSWORD`. After that, those env vars are **ignored** — change your password from the UI-invoked `/api/auth/change-password` endpoint or by editing the `users` collection directly if you get locked out.

---

## 3. Deploy the frontend to Vercel

1. Go to <https://vercel.com/new>, import the same repo.
2. Set the **Root Directory** to `frontend/`.
3. Framework preset: **Vite**. Build command `npm run build`, output `dist`.
4. Add one environment variable:

| Key | Value |
| --- | --- |
| `VITE_API_URL` | your Render URL from step 2, e.g. `https://portfolio-backend-xxxx.onrender.com` |

5. Deploy. You'll get a URL like `https://my-portfolio.vercel.app`.

---

## 4. Close the CORS loop

Back in Render → your backend service → **Environment**, set:

```
CORS_ORIGINS = https://my-portfolio.vercel.app
```

Add multiple comma-separated origins if you're also running locally or have a custom domain:

```
CORS_ORIGINS = https://my-portfolio.vercel.app,https://www.yoursite.com,http://localhost:5173
```

Redeploy the backend. Done.

---

## 5. Sign in & start editing

1. Open your Vercel URL.
2. Click **Sign in** top-right, use the `ADMIN_USERNAME` / `ADMIN_PASSWORD` you set in Render.
3. You'll now see **Edit / Delete / Drag** controls on every card when you hover, plus an **Add** button at the top of each section. The Home page gets an **Edit home** button.
4. Every save emits a websocket event so **every connected browser** — yours, a recruiter's, a friend's — refreshes that section immediately. No page reload.

---

## Local development

```bash
# in one terminal
cd backend
cp .env.example .env        # fill in the values
npm install
npm run dev                 # http://localhost:4000

# in another terminal
cd frontend
cp .env.example .env        # VITE_API_URL=http://localhost:4000
npm install
npm run dev                 # http://localhost:5173
```

---

## The shape of the data

Every list item has an `order: Number` field. Reorder hits `PUT /api/<resource>/reorder` with a `{ ids: [...] }` payload in the new order, and the server rewrites `order` for each one in a single pass. See `backend/routes/crud.js` for the pattern — it's used by Skills, Projects, Experience, and Certificates. Home is a singleton doc at `GET /api/home` / `PUT /api/home`.

## The five card templates

Each section has a genuinely distinct layout, not just a color swap:

- **Home** — magazine-style hero with asymmetric two-column layout
- **Skills** — horizontal rows with a proficiency bar and category label
- **Projects** — editorial split: large image left, headline + summary + tech + links right
- **Experience** — timeline with a date rail and dotted vertical rule
- **Certificates** — compact card with a circular seal in the corner

All of them share the same edit affordances (drag handle / edit / delete) through the `EditShell` wrapper.

---

## Free-tier notes

- Render's free web services **sleep after 15 min of inactivity**. The first request after waking takes ~30 seconds. Upgrade to a paid plan (`$7/mo`) if you don't want this.
- MongoDB Atlas M0 is free forever, 512 MB. Way more than a portfolio will ever need.
- Vercel Hobby is free and has generous bandwidth.
