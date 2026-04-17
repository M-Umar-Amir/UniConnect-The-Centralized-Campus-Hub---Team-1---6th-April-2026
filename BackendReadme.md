# UniConnect Backend Handoff for Frontend Team

This document is for frontend integration. It covers backend run steps, auth usage, and API contracts.

## 1) Run Backend Locally

### Prerequisites
- Node.js 18+
- npm
- MongoDB on localhost:27017

### Start MongoDB (Docker)
```bash
docker run -d --name uniconnect-mongo -p 27017:27017 mongo:7
# if container already exists
docker start uniconnect-mongo
```

### Start backend
```bash
cd backend
npm install
npm run dev
```

### Run tests
```bash
cd backend
npm test
```

## 2) Base URL and Auth

- Base URL: `http://localhost:5000`
- Send JWT in header for protected routes:

```http
Authorization: Bearer <token>
```

- Frontend token storage key currently used: `uniconnect_token`

## 3) Health Endpoints

- `GET /`
- `GET /health`

## 4) Auth Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PATCH /api/auth/change-password`
- `POST /api/auth/change-email/request`
- `POST /api/auth/change-email/verify`
- `POST /api/auth/logout-others`

## 5) User Endpoints

- `PATCH /api/users/me/profile`
- `PATCH /api/users/me/notifications`
- `PATCH /api/users/me/privacy`
- `POST /api/users/:userId/follow`
- `DELETE /api/users/:userId/follow`
- `POST /api/users/me/saved-events/:eventId`
- `DELETE /api/users/me/saved-events/:eventId`

## 6) Notification Endpoints

- `GET /api/notifications`
- `GET /api/notifications/recent?limit=8`
- `PATCH /api/notifications/read-all`
- `PATCH /api/notifications/:notificationId/read`

## 7) Post/Like/Comment Endpoints

Base: `/api/posts`

- `GET /api/posts`
- `POST /api/posts`
- `GET /api/posts/:postId`
- `PATCH /api/posts/:postId`
- `DELETE /api/posts/:postId`
- `POST /api/posts/:postId/likes`
- `DELETE /api/posts/:postId/likes`
- `POST /api/posts/:postId/comments`
- `GET /api/posts/:postId/comments`
- `PATCH /api/posts/:postId/comments/:commentId`
- `DELETE /api/posts/:postId/comments/:commentId`
- `POST /api/posts/:postId/report`

## 8) Events Endpoints

- `GET /api/events`
- `GET /api/events/:eventId/posts`
- `GET /api/events/:eventId/highlights`
- `POST /api/events/:eventId/highlights`

## 9) Upload Endpoints

Base: `/api/uploads`

- `POST /api/uploads/images`
- `POST /api/uploads/video`
- `POST /api/uploads/avatar`
- `DELETE /api/uploads`

## 10) Error Response Shape

```json
{
  "success": false,
  "message": "Error message"
}
```

## 11) Demo Login

```bash
cd backend
npm run seed:demo
```

- Email: `amina.khan@uniconnect.test`
- Password: `password123`

## 12) Frontend Notes

- In Codespaces, use relative `/api` calls through Vite proxy.
- Avoid hardcoding `http://localhost:5000` in browser-facing code.
- Handle `401` and `403` globally in frontend API client.
# UniConnect Backend Handoff for Frontend Team

This document is for frontend integration. It covers how to run backend, auth token usage, and endpoint contracts currently available.

## 1) Backend Run Commands

### Prerequisites
- Node.js 18+
- npm
- MongoDB running on localhost:27017

### Start MongoDB with Docker
```bash
docker run -d --name uniconnect-mongo -p 27017:27017 mongo:7
# if container already exists
docker start uniconnect-mongo
```

### Install and Run Backend
```bash
cd backend
npm install
npm run dev
```

### Run Backend Tests
```bash
cd backend
npm test
```

## 2) Base URL and Auth

- Backend base URL: `http://localhost:5000`
- Frontend should send JWT in Authorization header:

```http
Authorization: Bearer <token>
```

- Token is returned by login/register.
- Frontend localStorage key currently used in app: `uniconnect_token`

## 3) Health and Service Checks

### GET /
Returns service and DB state.

### GET /health
Returns readiness state:
- `status: true` means backend is healthy
- includes `database` and `cloudinary` status

## 4) Auth APIs

### POST /api/auth/register
Body:
```json
{
  "fullName": "Amina Khan",
  "email": "amina.khan@uniconnect.test",
  "password": "password123",
  "role": "student",
  "university": "University of Central Punjab"
}
```

### POST /api/auth/login
Body:
```json
{
  "email": "amina.khan@uniconnect.test",
  "password": "password123"
}
```

Response includes:
- `token`
- `user`

### GET /api/auth/me
Protected route. Returns current user.

### PATCH /api/auth/change-password
Protected route.

### POST /api/auth/change-email/request
Protected route.

### POST /api/auth/change-email/verify
Protected route.

### POST /api/auth/logout-others
Protected route.

## 5) User/Profile APIs

All routes below require auth.

- `PATCH /api/users/me/profile`
- `PATCH /api/users/me/notifications`
- `PATCH /api/users/me/privacy`
- `POST /api/users/:userId/follow`
- `DELETE /api/users/:userId/follow`
- `POST /api/users/me/saved-events/:eventId`
- `DELETE /api/users/me/saved-events/:eventId`

## 6) Notification APIs

All routes below require auth.

- `GET /api/notifications`
- `GET /api/notifications/recent?limit=8`
- `PATCH /api/notifications/read-all`
- `PATCH /api/notifications/:notificationId/read`

Notes:
- Notification payloads include a `targetUrl` used for frontend navigation.

## 7) Post, Like, Comment APIs

Base: `/api/posts` (auth required)

Main routes:
- `GET /api/posts`
- `POST /api/posts`
- `GET /api/posts/:postId`
- `PATCH /api/posts/:postId`
- `DELETE /api/posts/:postId`
- `POST /api/posts/:postId/likes`
- `DELETE /api/posts/:postId/likes`
- `POST /api/posts/:postId/comments`
- `GET /api/posts/:postId/comments`
- `PATCH /api/posts/:postId/comments/:commentId`
- `DELETE /api/posts/:postId/comments/:commentId`
- `POST /api/posts/:postId/report`

## 8) Events APIs

### Event CRUD and Registration
- `GET /api/events`
- `GET /api/events/:eventId`
- `POST /api/events` (auth, event_manager/admin/society)
- `PATCH /api/events/:eventId` (auth, organizer/admin)
- `DELETE /api/events/:eventId` (auth, organizer/admin)
- `POST /api/events/:eventId/register` (auth)
- `DELETE /api/events/:eventId/register` (auth)

### Event-linked Post APIs
- `GET /api/events/:eventId/posts` (auth)
- `GET /api/events/:eventId/highlights` (auth)
- `POST /api/events/:eventId/highlights` (auth, event_manager/admin)

## 9) Startup Hub APIs

- `GET /api/startups`
- `GET /api/startups/:startupId`
- `POST /api/startups` (auth)
- `POST /api/startups/:startupId/apply` (auth)

## 10) Tags APIs

- `GET /api/tags`
- `POST /api/tags` (auth, admin/event_manager/society)
- `DELETE /api/tags/:name` (auth, admin/event_manager/society)

## 11) Admin APIs

Base: `/api/admin` (auth, admin role)

- `GET /api/admin/users`
- `PATCH /api/admin/users/:userId/block`
- `DELETE /api/admin/users/:userId`
- `GET /api/admin/reports`
- `DELETE /api/admin/events/:eventId`

## 12) Upload APIs

Base: `/api/uploads` (auth)

- `POST /api/uploads/images` (multipart field: `files`)
- `POST /api/uploads/video` (multipart field: `file`)
- `POST /api/uploads/avatar` (multipart field: `file`)
- `DELETE /api/uploads`

## 13) Common Error Format

Most errors return:
```json
{
  "success": false,
  "message": "Error message"
}
```

## 14) Demo Credentials

After seeding:
```bash
cd backend
npm run seed:demo
```

Use:
- Email: `amina.khan@uniconnect.test`
- Password: `password123`

## 15) Frontend Integration Notes

- If frontend is in Codespaces, avoid hardcoded `http://localhost:5000` in browser calls.
- Prefer Vite proxy with relative `/api` requests.
- Always attach JWT for protected endpoints.
- Handle 401 and 403 globally in frontend API client.
