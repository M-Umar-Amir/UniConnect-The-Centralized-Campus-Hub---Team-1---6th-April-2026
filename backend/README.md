# Backend

This folder contains the server-side API for UniConnect.

## Suggested structure
- `src/config` - environment, app, and database configuration
- `src/controllers` - request handlers
- `src/routes` - route definitions
- `src/models` - data models and schema definitions
- `src/middleware` - auth, validation, and error handling
- `src/services` - business logic and domain workflows
- `src/utils` - shared backend helpers

## Scope
- Authentication and authorization
- User, event, post, like, comment, startup, and notification APIs
- Admin actions, moderation, and analytics

## Implemented in this baseline

### Run
- Install dependencies: `npm install`
- Start server: `npm run start`
- Dev mode: `npm run dev`
- Demo seed: `npm run seed:demo`
- Tests: `npm test`

### Local development order
1. Start MongoDB on `mongodb://localhost:27017/uniconnect`
2. Run the backend from this folder with `npm run dev`
3. Run the frontend from `../frontend` with `npm run dev`

### MongoDB with Docker
If MongoDB is not installed locally, start it with:

```bash
docker run -d \
	--name uniconnect-mongo \
	-p 27017:27017 \
	mongo:7
```

If you already created the container, start it with:

```bash
docker start uniconnect-mongo
```

### Environment variables
- `PORT` (default: `5000`)
- `MONGO_URI` (default: `mongodb://localhost:27017/uniconnect`)
- `JWT_SECRET`
- `JWT_EXPIRES_IN` (default: `7d`)

### Auth endpoints
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PATCH /api/auth/change-password`
- `POST /api/auth/change-email/request`
- `POST /api/auth/change-email/verify`
- `POST /api/auth/logout-others`

### Users endpoints
- `PATCH /api/users/me/profile`
- `PATCH /api/users/me/notifications`
- `PATCH /api/users/me/privacy`
- `POST /api/users/:userId/follow`
- `DELETE /api/users/:userId/follow`
- `POST /api/users/me/saved-events/:eventId`
- `DELETE /api/users/me/saved-events/:eventId`

### Notifications endpoints
- `GET /api/notifications`
- `GET /api/notifications/recent`
- `PATCH /api/notifications/read-all`
- `PATCH /api/notifications/:notificationId/read`

### Member 1 DB-side scope covered
- Users schema with role management (`student`, `founder`, `admin`, `event_manager`)
- Follow/unfollow support via users endpoints
- Saved/bookmarked events in user model + endpoints
- Profile data handling (`fullName`, `university`, `bio`, avatar/cover, links)
- Email validation + uniqueness in schema and auth flows
