# Deployment Guide

## 1. Backend setup

1. Copy `Backend/.env.example` to `Backend/.env`.
2. Fill required values:
   - `DB_CONNECT`
   - `JWT_SECRET`
   - `MAPBOX_TOKEN`
   - `CORS_ORIGIN` (comma-separated frontend origins)
3. Install dependencies and run:
   - `npm --prefix Backend install`
   - `npm --prefix Backend start`

Backend health check:
- `GET /health` should return `{ "status": "ok" }`.

## 2. Frontend setup

1. Copy `Frontend/.env.example` to `Frontend/.env`.
2. Set:
   - `VITE_BASE_URL` to backend public URL.
   - `VITE_MAPBOX_TOKEN`.
3. Install and build:
   - `npm --prefix Frontend install`
   - `npm --prefix Frontend run build`

To preview production build locally:
- `npm --prefix Frontend run preview`

## 3. Recommended deploy flow

1. Deploy backend first.
2. Update `VITE_BASE_URL` with backend deployed URL.
3. Build and deploy frontend static `Frontend/dist`.

## 4. Verified checks in this repo

- `npm --prefix Frontend run lint` passes.
- `npm --prefix Frontend run build` passes.
- Backend modules load successfully via Node runtime check.
