# Drivebase migration

This branch replaces MongoDB storage with the database-scoped Drivebase document API. The existing Express routes, admin password hashes, ObjectIds and Socket.IO events are preserved. Mongoose supplies schema validation and casting without opening a MongoDB connection.

The new frontend target is https://suhaeb-shaik-portfolio.vercel.app. Data import and backend credentials are required before publishing this branch there. The existing main deployment remains separate.

## Server configuration

Copy backend/.env.example and set DRIVEBASE_API_URL, DRIVEBASE_DATABASE_ID and DRIVEBASE_API_KEY using the portfolio entry in the private Drivebase connection bundle. Never expose the key in VITE variables. Set JWT_SECRET, CORS_ORIGINS and, only for an empty user collection, ADMIN_USERNAME and ADMIN_PASSWORD. Import the existing users collection to retain its admin password.

Run npm ci in backend and frontend, npm test --prefix backend, and npm run build --prefix frontend. Run backend/server.js on Render and publish frontend/dist on Vercel with VITE_API_URL set to the new Render origin.

## Data and rollback

Export only the portfolio source database, preserving document IDs, timestamps and password hashes. Convert its collections to Drivebase documents, using each document's \_id as the document ID. Home uses homes; the remaining collections are users, skills, projects, experiences and certificates. Keep exports encrypted and outside Git. Verify record counts and IDs after import.

The server caches reads for ten seconds and serializes collection mutations within one instance. Use one Render instance. Drivebase currently limits each database to 10 MiB. Store database files in a Drive folder with Restricted sharing. Existing media URLs remain external.

Source MongoDB data and the original deployment are retained for rollback. This is a snapshot migration; writes to the old site after import are not mirrored.
