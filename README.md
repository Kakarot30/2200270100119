# Test URL Shortener

This repository contains a full-stack URL Shortener project with:

- A Node.js/Express backend microservice
- A React frontend (Material UI)
- A custom logging middleware

## Folder Structure

- `Logging Middleware/` — Reusable logging middleware for both backend and frontend (uses a protected log API with bearer token)
- `Backend Test Submission/` — Node.js/Express microservice for URL shortening and analytics
- `frontend-test-submission/` — React app for the user interface (Material UI, runs on http://localhost:3000)

## Backend Features

- **Shorten URLs:** POST `/shorturls` with `{ url, validity, shortcode }` to create a short link
- **Redirection:** GET `/:shortcode` redirects to the original URL if valid
- **Statistics:** GET `/shorturls/:shortcode` returns click stats and metadata
- **Mandatory Logging:** All API actions/events/errors are logged using the custom middleware
- **In-memory storage** (for demo; replace with DB for production)

## Frontend Features

- **Shorten up to 5 URLs at once** with client-side validation
- **View all shortened URLs** and their expiry
- **Statistics page** for click analytics (placeholder, extend as needed)
- **Material UI** for a modern, responsive UI
- **No direct logic in frontend for shortening/statistics:** All handled via backend API

## Logging Middleware

- Located in `Logging Middleware/loggingMiddleware.js`
- Sends logs to a protected API using a bearer token
- Can be used in both backend and frontend (if needed)

## How to Run

### Backend

1. `cd Backend Test Submission`
2. `npm install`
3. `npm start` (runs on port 3000 by default)

### Frontend

1. `cd frontend-test-submission`
2. `npm install`
3. `npm start` (runs on http://localhost:3000)

### Logging Middleware

- Set your access token in `Logging Middleware/loggingMiddleware.js` or via the `LOG_ACCESS_TOKEN` environment variable.

## .gitignore

- Ignores `node_modules`, build outputs, logs, environment files, and IDE settings.

## Notes

- Do not push `node_modules` or sensitive files to GitHub.
- For a clean repo, follow the `.gitignore` and re-add files as needed.
- For any issues, see the code comments or ask for help!

---

**Developed for test/demo purposes. Replace in-memory storage with a database for production use.**
