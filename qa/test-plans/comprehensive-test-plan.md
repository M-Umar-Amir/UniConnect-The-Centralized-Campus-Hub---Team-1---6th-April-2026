# UniConnect Comprehensive Test Plan

## Document Information
- **Project**: UniConnect - The Centralized Campus Hub
- **Test Plan Version**: 1.0
- **Date**: April 17, 2026
- **Scope**: Full-stack testing covering frontend UI, backend APIs, and integration points

---

## 1. Test Plan Overview

### 1.1 Objectives
- Ensure all interactive UI elements function correctly
- Validate backend API endpoints respond with correct data
- Verify user authentication and authorization flows
- Confirm database operations and data persistence
- Test error handling and edge cases

### 1.2 Scope
- **Frontend**: React components, routing, UI interactions, form validation
- **Backend**: Express routes, Mongoose models, authentication, notifications
- **Database**: MongoDB operations, data integrity
- **Integration**: API communication, token handling

### 1.3 Out of Scope
- Performance/load testing (future phase)
- Security penetration testing (separate phase)
- Cross-browser compatibility beyond Chromium (Playwright limitation)
- Mobile device testing (future phase)

---

## 2. Test Strategy

### 2.1 Testing Approach
- **Unit Testing**: Vitest for isolated component and function testing
- **Component Testing**: React Testing Library for UI component behavior
- **E2E Testing**: Playwright for full user workflows
- **API Testing**: Supertest for endpoint validation
- **Manual Testing**: Browser-based validation of critical paths

### 2.2 Test Phases
1. **Phase 1**: Unit tests for core components and functions
2. **Phase 2**: Integration tests for API + database operations
3. **Phase 3**: E2E tests for complete user workflows
4. **Phase 4**: Regression tests on each build

---

## 3. Test Coverage Areas

### 3.1 Frontend Testing
#### Authentication Pages (Section A)
- Login/Signup form validation
- Password strength indicators
- Email verification flow
- Forgot password reset
- Onboarding step navigation

#### Core Pages (Section B)
- HomePage feed and sidebar navigation
- SearchResultsPage filtering and results
- EventsPage listing and detail views
- EventDetailPage registration and interactions
- ProfilePage display and navigation
- SettingsPage form submission

#### Startup Hub (Section C)
- StartupListing with filters
- StartupDetailPage form operations
- Collaboration request flow
- Update creation and management

#### Admin Pages (Section D)
- DashboardPage stats display
- UserManagementPage filters and actions
- ContentModerationPage workflow
- TagManagementPage CRUD operations

#### Navigation & Shared Components
- Navbar logo/search/notifications/profile (HIGH PRIORITY)
- Sidebar navigation links
- Modal dialogues and confirmations
- Toast notifications

### 3.2 Backend Testing
#### Authentication API
- POST /api/auth/register (account creation)
- POST /api/auth/login (user authentication)
- PATCH /api/auth/change-password
- GET /api/auth/verify-email

#### User API
- GET /api/users (list all)
- GET /api/users/me (current user profile)
- GET /api/users/:id (user detail)
- PATCH /api/users/me (update profile)
- POST /api/users/follow/:id
- DELETE /api/users/follow/:id

#### Notifications API
- GET /api/notifications (list all)
- GET /api/notifications/recent
- PATCH /api/notifications/:id/read
- PATCH /api/notifications/read-all

#### Events API
- GET /api/events (list with filters)
- POST /api/events (create event)
- GET /api/events/:id (detail)
- PATCH /api/events/:id (update)
- DELETE /api/events/:id
- POST /api/events/:id/register

#### Startups API
- GET /api/startups
- POST /api/startups
- GET /api/startups/:id
- PATCH /api/startups/:id
- DELETE /api/startups/:id

#### Admin API
- GET /api/admin/stats
- GET /api/admin/users (moderation)
- PATCH /api/admin/users/:id (take action)
- POST /api/admin/content/flag
- DELETE /api/admin/content/:id

### 3.3 Database Testing
- User document CRUD operations
- Event document creation and queries
- Notification record creation and status updates
- Data validation on create/update
- Cascade delete behaviors

---

## 4. Test Cases by Feature

### 4.1 Navbar (HIGH PRIORITY - FIXED)
- [TC-NAV-001] Logo navigates to /home
- [TC-NAV-002] Notifications button opens dropdown
- [TC-NAV-003] Profile menu shows on avatar click
- [TC-NAV-004] Search input filters and navigates
- [TC-NAV-005] Search suggestion click navigates with query
- [TC-NAV-006] Mark all as read closes unread count
- [TC-NAV-007] Profile menu → My Profile navigates
- [TC-NAV-008] Profile menu → Settings navigates
- [TC-NAV-009] Profile menu → Admin Panel shows (role=admin)
- [TC-NAV-010] Logout clears token and redirects

### 4.2 Authentication (CRITICAL)
- [TC-AUTH-001] Register new user with valid data
- [TC-AUTH-002] Register fails with duplicate email
- [TC-AUTH-003] Login with correct credentials
- [TC-AUTH-004] Login fails with wrong password
- [TC-AUTH-005] JWT token stored in localStorage
- [TC-AUTH-006] Protected routes redirect to login
- [TC-AUTH-007] Logout removes token

### 4.3 Events (HIGH PRIORITY)
- [TC-EVT-001] List events with pagination
- [TC-EVT-002] Filter events by date/tag
- [TC-EVT-003] Event detail shows full info
- [TC-EVT-004] Register for event
- [TC-EVT-005] Cancel event registration
- [TC-EVT-006] Join waitlist when full
- [TC-EVT-007] Event creator can edit
- [TC-EVT-008] Event creator can delete

### 4.4 Startups (HIGH PRIORITY - FIXED)
- [TC-STUP-001] List startups with filters
- [TC-STUP-002] View startup detail pitch sections
- [TC-STUP-003] Like startup (FIXED)
- [TC-STUP-004] Share startup link (FIXED)
- [TC-STUP-005] Request to join startup
- [TC-STUP-006] Founder publish update (FIXED)
- [TC-STUP-007] Update like button (FIXED)
- [TC-STUP-008] Update edit/delete (FIXED)
- [TC-STUP-009] Add comment to update (FIXED)

### 4.5 Notifications (MEDIUM)
- [TC-NOT-001] Load recent notifications
- [TC-NOT-002] Mark single notification read
- [TC-NOT-003] Mark all as read
- [TC-NOT-004] Click notification navigates
- [TC-NOT-005] Unread count badge displays

### 4.6 Profile (MEDIUM)
- [TC-PRO-001] Display current user profile
- [TC-PRO-002] Edit profile information
- [TC-PRO-003] Upload profile avatar
- [TC-PRO-004] View other user profile
- [TC-PRO-005] Follow/unfollow user

### 4.7 Settings (MEDIUM)
- [TC-SET-001] Update account email
- [TC-SET-002] Change password
- [TC-SET-003] Toggle notification preferences
- [TC-SET-004] Update privacy settings

---

## 5. Entry and Exit Criteria

### 5.1 Entry Criteria
- Code is merged to main branch
- All unit tests pass
- Backend services are running
- Database is connected and seeded with test data
- Test environment is configured

### 5.2 Exit Criteria
- All test cases executed
- Critical and high priority bugs resolved
- Test coverage ≥ 80% for critical paths
- No blocking issues remain
- Documentation completed

---

## 6. Test Environment

### 6.1 Frontend Environment
- **Framework**: React 18 + Vite
- **Testing Framework**: Vitest 2.0
- **Component Testing**: React Testing Library
- **E2E Framework**: Playwright
- **Browser**: Chromium

### 6.2 Backend Environment
- **Runtime**: Node.js
- **Framework**: Express.js
- **Testing Framework**: Vitest with Supertest
- **Database**: MongoDB (Docker)
- **Port**: 5000

### 6.3 Test Data
- Seeded demo users with different roles
- Sample events and startups
- Pre-created notifications
- Admin user for moderation tests

---

## 7. Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-------------|-----------|
| UI state management errors | High | Medium | Comprehensive unit tests |
| API response delays | Medium | Low | Mock data fallbacks |
| Database connection issues | High | Medium | Connection pooling |
| Authentication token expiry | Medium | Low | Token refresh logic |
| Dropdown/menu clicks | High | FIXED | Ref-based outside-click |

---

## 8. Test Schedule

| Phase | Target Date | Duration |
|-------|------------|----------|
| Unit Tests | Ongoing | 5-10 min |
| Integration Tests | Weekly | 15-30 min |
| E2E Tests | Weekly | 20-40 min |
| Regression Tests | Per release | 30-60 min |

---

## 9. Responsibilities

- **QA Lead**: Test planning, execution, reporting
- **Frontend Dev**: Component testing, fixes
- **Backend Dev**: API testing, database operations
- **DevOps**: Test environment setup and maintenance

---

## 10. Sign-Off

| Role | Name | Date |
|------|------|------|
| QA Lead | TBD | |
| Frontend Lead | TBD | |
| Backend Lead | TBD | |
| Project Manager | TBD | |

---

## 11. Appendices

### 11.1 Related Documents
- Backend API Documentation
- Frontend Component Documentation
- Database Schema Documentation
- Deployment Guide

### 11.2 Tools and Resources
- Playwright: browser automation
- Vitest: unit testing
- Supertest: HTTP assertions
- MongoDB: database
- GitHub Actions: CI/CD
