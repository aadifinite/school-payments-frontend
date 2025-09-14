# School Payments Frontend

A Vite + React + Tailwind dashboard that connects to the backend API.

## Requirements
- Node 18+
- Backend running at `http://localhost:4000/api` (configurable)

## Setup
1. Copy this folder as `school-payments-frontend`.
2. Create `.env` from example:
```
cp .env.example .env
```
Update `VITE_API_URL` if needed.
3. Install dependencies:
```
npm install
```
4. Run:
```
npm run dev
```
5. Build:
```
npm run build
npm run preview
```

## Features
- Dashboard with pagination, multi-select status, school filter, date range, sorting.
- Transactions by School page.
- Transaction Status Check with modal results.
- URL-persisted filters for shareable views.
- Dark mode toggle.
- Responsive, Tailwind-based UI.
- Axios instance reads `VITE_API_URL`.

## Deploy
- Works on Netlify/Vercel. Add environment variable `VITE_API_URL`.

## Screenshots
_Add screenshots here._
