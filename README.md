# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Vercel Deployment Instructions

## Requirements
- Ensure `tailwind.config.js` and `postcss.config.js` are present and valid.
- Static assets should be in the `public` folder.
- Use Vite build scripts: `npm run build`.

## Deploy Steps
1. Push your frontend code to a GitHub repository.
2. Go to [vercel.com](https://vercel.com/) and import your repo.
3. Set build command to `npm run build` and output directory to `dist`.
4. Environment variables (if any) should be set in Vercel dashboard.

## Troubleshooting
- If TailwindCSS styles are missing, check `tailwind.config.js` content paths.
- Ensure all dependencies are installed: `npm install`.
- For custom domains, configure in Vercel dashboard.

## Useful Links
- [Vercel Docs](https://vercel.com/docs)
- [Vite Docs](https://vitejs.dev/guide/static-deploy.html)
- [TailwindCSS Docs](https://tailwindcss.com/docs/installation)




# Uber Clone (MERN + Vite)

Full-stack ride-hailing clone built with a Node/Express API, MongoDB, Socket.IO, and a Vite + React frontend. It supports rider and captain (driver) flows, real-time ride events, and Mapbox-powered geo features.

## Features

- Rider and captain authentication (register/login/logout)
- Ride lifecycle: request, confirm, start (OTP), end, cancel
- Real-time events via Socket.IO (new ride, ride confirmed/started/ended)
- Mapbox utilities: geocoding, distance/time, and suggestions
- Captain availability and live location updates

## Tech Stack

- Backend: Node.js, Express, MongoDB/Mongoose, Socket.IO
- Frontend: React 19, Vite, React Router
- Maps: Mapbox (API + GL)

## Project Structure

```
uberclone1/
|-- Backend/
|   |-- controllers/
|   |-- models/
|   |-- routes/
|   |-- services/
|   |-- app.js
|   |-- server.js
|   `-- .env.example
|-- Frontend/
|   |-- src/
|   |-- index.html
|   |-- vite.config.js
|   `-- .env.example
|-- DEPLOYMENT.md
`-- Readme.md
```

## Requirements

- Node.js 20+ (backend enforces this)
- MongoDB connection string
- Mapbox API token

## Environment Variables

Create `.env` files from the examples.

### Backend (`Backend/.env`)

```env
PORT=3000
DB_CONNECT=mongodb+srv://<username>:<password>@cluster.mongodb.net/<db-name>
JWT_SECRET=replace_with_secure_secret
MAPBOX_TOKEN=replace_with_mapbox_token
CORS_ORIGIN=http://localhost:5173
CAPTAIN_SEARCH_RADIUS_KM=5
```

### Frontend (`Frontend/.env`)

```env
VITE_BASE_URL=http://localhost:3000
VITE_MAPBOX_TOKEN=replace_with_mapbox_token
```

## Local Development

### Backend

```sh
npm --prefix Backend install
npm --prefix Backend run dev
```

API base URL: `http://localhost:3000`

Health check:

```sh
GET /health -> { "status": "ok" }
```

### Frontend

```sh
npm --prefix Frontend install
npm --prefix Frontend run dev
```

App URL: `http://localhost:5173`

## API Overview

Base path: `http://localhost:3000/api`

### Users

- `POST /users/register`
- `POST /users/login`
- `GET /users/profile`
- `GET /users/logout`

### Captains

- `POST /captains/register`
- `POST /captains/login`
- `GET /captains/profile`
- `GET /captains/stats`
- `POST /captains/logout`
- `PATCH /captains/location`
- `PATCH /captains/status`

### Rides

- `POST /rides/create`
- `GET /rides/get-fare`
- `POST /rides/confirm`
- `GET /rides/start-ride`
- `POST /rides/end-ride`
- `POST /rides/cancel-ride`
- `GET /rides/current-ride`

### Maps

- `GET /maps/get-coordinates`
- `GET /maps/get-distance-time`
- `GET /maps/get-suggestions`

## Deployment

For a complete step-by-step guide see `DEPLOYMENT.md`.

### Quick Deploy Flow

1. Backend: copy `Backend/.env.example` to `Backend/.env`, install with `npm --prefix Backend install`, then run `npm --prefix Backend start`.
2. Frontend: copy `Frontend/.env.example` to `Frontend/.env`, set `VITE_BASE_URL` to your backend URL, install with `npm --prefix Frontend install`, build with `npm --prefix Frontend run build`, then deploy `Frontend/dist`.

## Notes

- CORS is configured via `CORS_ORIGIN` (comma-separated list).
- Socket.IO is initialized in `Backend/socket.js`.
