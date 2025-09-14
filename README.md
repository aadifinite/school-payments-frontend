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
<img width="1887" height="833" alt="image" src="https://github.com/user-attachments/assets/0911b1dd-bb2a-4a38-9e8d-4d7e06a53d8f" />

<img width="1910" height="952" alt="image" src="https://github.com/user-attachments/assets/a0dcc707-a902-416e-aa8b-50744e05650c" />

<img width="1916" height="403" alt="image" src="https://github.com/user-attachments/assets/73fd3c36-fbda-4f2a-aa72-d77eacfdcbc2" />

<img width="1608" height="602" alt="image" src="https://github.com/user-attachments/assets/b772f8fd-b515-4863-8911-6c9790514b27" />

<img width="1917" height="952" alt="image" src="https://github.com/user-attachments/assets/c75db72c-fa67-4342-808e-1471c13f5840" />


