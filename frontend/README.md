# Frontend

This folder contains the user-facing application for UniConnect.

## Suggested structure
- `src/components` - reusable UI components
- `src/pages` - page-level views and routes
- `src/layouts` - shared page shells and wrappers
- `src/services` - API client and data access helpers
- `src/hooks` - reusable React hooks
- `src/utils` - shared frontend utilities
- `src/assets` - images, icons, and static media

## Scope
- Homepage and activity feed
- Event discovery and detail pages
- Profiles and profile editing
- Startup Hub pages
- Admin panel views and dashboards

## Implemented in this baseline

### Run
- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Build: `npm run build`
- Tests: `npm test`

### Local development order
1. Start MongoDB on `mongodb://localhost:27017/uniconnect`
2. Start the backend from `../backend` with `npm run dev`
3. Start the frontend from this folder with `npm run dev`

### Notes
- The frontend uses a Vite proxy for `/api` requests to `http://localhost:5000`
- In Codespaces, use the forwarded Vite URL shown in the terminal
- For broader network access, run `npm run dev -- --host 0.0.0.0`

### Routes included
- `/home`
- `/settings`
- `/notifications`

### Section E covered (Settings)
- Account tab: change email flow (current password + verification code)
- Password & Security tab: password change + logout other devices
- Notifications tab: all listed toggles + master email toggle
- Privacy tab: listed privacy toggles + mentions visibility select

### Section F covered (Notifications)
- Notifications page with filter tabs and mark-all-as-read action
- Notification rows include avatar, text, thumbnail, timestamp, unread indicator
- Navbar bell dropdown with recent notifications, mark-all-read, and view-all link

### Section G covered (Shared components)
- Shared components scaffolded under `src/components`
- Prop and usage docs available in `src/components/README.md`
