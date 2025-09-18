# Disaster Management System - Backend (Node.js + Express + MongoDB)

Express + Mongoose API for disasters, users, volunteers, alerts, geo-queries, and route planning. Includes JWT auth, CORS, dotenv, and global error handling.

## Tech
- Express.js
- MongoDB + Mongoose (2dsphere indexes)
- JWT (optional route protection)
- CORS, dotenv, morgan, cookie-parser
- OpenRouteService for routing

## Setup
1) Install
- cd backend
- npm install

2) Configure env in `config/config.env`
```
PORT=4000
MONGO_URI=your_mongodb_uri
FRONTEND_URL=http://localhost:5173
JWT_SECRET_KEY=your_jwt_secret
JWT_EXPIRES=7d
COOKIE_EXPIRE=7
ORS_API_KEY=your_ors_api_key
```

3) Run
- npm run dev

## Directory (MVC)
- `models/`: User, Disaster, Volunteer, Admin, UserLocation (TTL)
- `controllers/`: auth, user, disaster, volunteer, alert, route, admin
- `routes/`: auth, users, disasters, volunteers, alerts, route, admin
- `middleware/`: `authMiddleware.js`, `errorMiddleware.js`
- `config/`: `db.js`, `config.env`
- `server.js`, `app.js`

## Data Models (high-level)
- User:
  - name, email, phone, password (optional), status (safe|emergency|critical|dead)
  - location: GeoJSON Point { type: "Point", coordinates: [lng, lat] }
  - 2dsphere index
- Disaster:
  - type, description, location (GeoJSON Point), radius, active
  - 2dsphere index
- Volunteer:
  - name, email, phone, location (GeoJSON), assignedUsers[], available
  - 2dsphere index
- UserLocation:
  - email, location (GeoJSON), createdAt with TTL (auto-delete after 1 day)

## Core Features
- Users
  - Register with GeoJSON location
  - Update location and status
  - Track location pings every minute (TTL history)
  - Query users inside a disaster radius
- Disasters
  - Create (JWT protected), list active, get by ID, end/remove
- Volunteers
  - Register, update location, assign users, list assigned users
- Alerts
  - Send alert to users inside disaster area (returns targeted users list)
- Routes
  - Get directions via OpenRouteService (`profile` optional: driving-car, foot-walking, etc.)
- Auth
  - Register/login/logout, get profile
  - JWT optional protection for admin/privileged actions

## API Quick Reference

### Auth
- POST `/api/auth/register`  (accepts phone, location)
- POST `/api/auth/login`
- GET `/api/auth/logout`
- GET `/api/auth/me`  (JWT)

### Users
- POST `/api/users/register`
- POST `/api/users/location`
- POST `/api/users/status`
- POST `/api/users/track`  (minute pings; auto-purged history)
- GET `/api/users/nearby/:disasterId`

### Disasters
- POST `/api/disasters`  (JWT)
- GET `/api/disasters`
- GET `/api/disasters/:id`
- DELETE `/api/disasters/:id`  (JWT)

### Volunteers
- POST `/api/volunteers/register`
- POST `/api/volunteers/location`
- POST `/api/volunteers/assign`
- GET `/api/volunteers/tasks/:id`

### Alerts
- POST `/api/alerts/send`

### Routes
- GET `/api/route?from=lat,lng&to=lat,lng&profile=driving-car`

## GeoJSON format
- Always send: `{ "type": "Point", "coordinates": [lng, lat] }`

## Notes
- Ensure `MONGO_URI` and `ORS_API_KEY` are set.
- Use `Authorization: Bearer <token>` for protected routes (e.g., disaster create/delete, admin).
- UserLocation TTL cleans historical pings after 24 hours.

<!-- If you want, I can add GET endpoints to list current location and recent ping history:
- GET `/api/users/current?email=...`
- GET `/api/users/locations?email=...&limit=10` -->
