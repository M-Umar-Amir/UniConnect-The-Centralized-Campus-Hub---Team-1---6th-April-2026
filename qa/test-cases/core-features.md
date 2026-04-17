# Core Feature Test Cases

## Section A: Authentication & Onboarding

### TC-AUTH-001: User Registration
**Description**: New user can register with valid information
**Preconditions**: User is on signup page, no account exists with email
**Steps**:
1. Enter full name "Test User"
2. Enter email "test@example.com"
3. Enter password "SecurePass123"
4. Confirm password matches
5. Select university
6. Select year of study
7. Select role (Student/Founder/Event Manager)
8. Select minimum 3 interest tags
9. Accept terms checkbox
10. Click "Sign Up"

**Expected Result**: 
- Account created successfully
- User redirected to onboarding or home
- Token stored in localStorage
- Profile data persisted

**Acceptance Criteria**: ✅ PASS/FAIL documented
**Priority**: CRITICAL

---

### TC-AUTH-002: User Login
**Description**: Registered user can login
**Preconditions**: User account exists, user is on login page
**Steps**:
1. Enter email "test@example.com"
2. Enter password "SecurePass123"
3. Click "Login"

**Expected Result**:
- Login successful
- User redirected to home or onboarding
- JWT token stored in localStorage
- User profile loaded

**Acceptance Criteria**: ✅ PASS/FAIL documented
**Priority**: CRITICAL

---

### TC-AUTH-003: Invalid Login Attempt
**Description**: Login fails with wrong password
**Preconditions**: Valid account exists
**Steps**:
1. Enter email "test@example.com"
2. Enter wrong password "WrongPass123"
3. Click "Login"

**Expected Result**:
- Error message displayed
- User stays on login page
- No token created

**Acceptance Criteria**: ✅ PASS/FAIL documented
**Priority**: HIGH

---

### TC-AUTH-004: Password Reset Flow
**Description**: User can reset forgotten password
**Preconditions**: User is on forgot password page
**Steps**:
1. Enter registered email
2. Click "Send Reset Link"
3. Confirm email sent message
4. Go to reset password link (from email)
5. Enter new password
6. Confirm new password
7. Click "Reset Password"

**Expected Result**:
- Password updated in database
- User can login with new password
- Success message displayed

**Acceptance Criteria**: ✅ PASS/FAIL documented
**Priority**: HIGH

---

### TC-AUTH-005: Protected Route Access
**Description**: Unauthenticated user cannot access protected routes
**Preconditions**: User has no token, is on login page
**Steps**:
1. Try to navigate to /home (protected route)
2. Verify redirect

**Expected Result**:
- User redirected to /login
- Cannot access /home, /events, /profile, etc. without token

**Acceptance Criteria**: ✅ PASS/FAIL documented
**Priority**: HIGH

---

## Section B: Navbar & Navigation

### TC-NAV-001: Navbar Logo Navigation
**Description**: Logo link navigates to home
**Preconditions**: User is logged in, on any authenticated page
**Steps**:
1. From /events page, click UniConnect logo
2. Wait for navigation

**Expected Result**:
- Navigated to /home
- Page displays home feed

**Acceptance Criteria**: ✅ PASS/FAIL documented
**Priority**: HIGH
**Status**: FIXED & VERIFIED

---

### TC-NAV-002: Notifications Dropdown Opens
**Description**: Notification bell opens dropdown with recent notifications
**Preconditions**: User is logged in, has notifications
**Steps**:
1. Click notification bell icon in navbar
2. Wait for dropdown to render

**Expected Result**:
- Dropdown opens with notification list
- Each notification shows avatar, text, timestamp
- "View All Notifications" link visible
- "Mark all as read" button visible

**Acceptance Criteria**: ✅ PASS/FAIL documented
**Priority**: HIGH
**Status**: FIXED & VERIFIED

---

### TC-NAV-003: Profile Menu Opens
**Description**: Avatar button opens profile dropdown menu
**Preconditions**: User is logged in
**Steps**:
1. Click avatar/profile button in navbar
2. Wait for menu to render

**Expected Result**:
- Dropdown menu opens
- Shows "My Profile", "Settings", "Admin Panel" (if admin), "Logout"
- Menu has hover states
- Menu persists until click outside

**Acceptance Criteria**: ✅ PASS/FAIL documented
**Priority**: HIGH
**Status**: FIXED & VERIFIED

---

### TC-NAV-004: Search Input & Navigation
**Description**: Search input finds and navigates to results
**Preconditions**: User is logged in
**Steps**:
1. Click search input in navbar
2. Type "Hackathon"
3. Wait for suggestions dropdown
4. Click suggestion or press Enter

**Expected Result**:
- Search suggestions appear (events, users, startups)
- Click suggestion navigates to /search?q=Hackathon
- Results page displays filtered results

**Acceptance Criteria**: ✅ PASS/FAIL documented
**Priority**: HIGH
**Status**: VERIFIED

---

### TC-NAV-005: My Profile Navigation
**Description**: My Profile menu item navigates to profile page
**Preconditions**: User is logged in
**Steps**:
1. Click avatar button
2. Click "My Profile"

**Expected Result**:
- Navigated to /profile/me
- User's profile data displayed

**Acceptance Criteria**: ✅ PASS/FAIL documented
**Priority**: HIGH
**Status**: VERIFIED

---

### TC-NAV-006: Settings Navigation
**Description**: Settings menu item navigates to settings page
**Preconditions**: User is logged in
**Steps**:
1. Click avatar button
2. Click "Settings"

**Expected Result**:
- Navigated to /settings
- Settings form displayed

**Acceptance Criteria**: ✅ PASS/FAIL documented
**Priority**: HIGH
**Status**: VERIFIED

---

### TC-NAV-007: Logout Function
**Description**: Logout clears session and redirects to login
**Preconditions**: User is logged in
**Steps**:
1. Click avatar button
2. Click "Logout"
3. Confirm logout dialog (if shown)

**Expected Result**:
- User redirected to /login
- Token cleared from localStorage
- Session ended

**Acceptance Criteria**: ✅ PASS/FAIL documented
**Priority**: HIGH
**Status**: VERIFIED

---

## Section C: Events

### TC-EVT-001: Event Listing & Filters
**Description**: User can view list of events with filters
**Preconditions**: User is logged in, events exist in database
**Steps**:
1. Navigate to /events
2. View event grid
3. Use date filter to select future events
4. Use tag filter to select specific tags
5. Observe results update

**Expected Result**:
- Events display in grid/list
- Filters apply correctly
- Results update in real-time
- Pagination or infinite scroll works

**Acceptance Criteria**: ✅ PASS/FAIL documented
**Priority**: HIGH

---

### TC-EVT-002: Event Detail Page
**Description**: Event detail page displays all event information
**Preconditions**: User is logged in, event exists
**Steps**:
1. Click on event card
2. Navigate to /events/:id
3. Verify all sections load

**Expected Result**:
- Event cover image displays
- Event title, date, time, location visible
- Description section shows
- Media gallery displays
- Comments section shows
- Registration section shows appropriate button
- Tags display

**Acceptance Criteria**: ✅ PASS/FAIL documented
**Priority**: HIGH

---

### TC-EVT-003: Register for Event
**Description**: User can register for event
**Preconditions**: User is logged in, event not full, user not registered
**Steps**:
1. On event detail page
2. Click "Register Now" button
3. Wait for response

**Expected Result**:
- Registration successful
- Button changes to "You're Registered"
- "Cancel Registration" button appears
- User added to attendees list

**Acceptance Criteria**: ✅ PASS/FAIL documented
**Priority**: HIGH

---

### TC-EVT-004: Cancel Registration
**Description**: User can cancel event registration
**Preconditions**: User is registered for event
**Steps**:
1. On event detail page
2. Click "Cancel Registration"
3. Confirm dialog

**Expected Result**:
- Registration cancelled
- Button reverts to "Register Now"
- Attendance count decreases

**Acceptance Criteria**: ✅ PASS/FAIL documented
**Priority**: MEDIUM

---

## Section D: Startups

### TC-STUP-001: Startup Listing
**Description**: User can view list of startups with filters
**Preconditions**: User is logged in, startups exist
**Steps**:
1. Navigate to /startups
2. View startup cards
3. Filter by domain/role/status
4. Search for startup

**Expected Result**:
- Startups display in grid
- Filters apply correctly
- Search works
- Results update

**Acceptance Criteria**: ✅ PASS/FAIL documented
**Priority**: HIGH

---

### TC-STUP-002: Startup Detail Page
**Description**: Startup pitch detail displays all information
**Preconditions**: User is logged in, startup exists
**Steps**:
1. Click on startup card
2. Navigate to /startups/:id
3. Verify sections load

**Expected Result**:
- Startup logo/name displays
- Pitch sections show (problem, solution, business model, target)
- Team members listed
- Open roles displayed
- Updates section shows
- Comments section shown

**Acceptance Criteria**: ✅ PASS/FAIL documented
**Priority**: HIGH

---

### TC-STUP-003: Like Startup
**Description**: User can like startup
**Preconditions**: User is logged in, startup not liked
**Steps**:
1. On startup detail page
2. Click like button (heart icon)

**Expected Result**:
- Like count increments
- Button changes to filled heart
- Like persisted in database

**Acceptance Criteria**: ✅ PASS/FAIL documented
**Priority**: MEDIUM
**Status**: FIXED & VERIFIED

---

### TC-STUP-004: Share Startup
**Description**: User can share startup link
**Preconditions**: User is logged in, on startup detail
**Steps**:
1. Click share button
2. Wait for action

**Expected Result**:
- Link copied to clipboard OR share dialog opens
- Confirmation message shown
- URL is correct

**Acceptance Criteria**: ✅ PASS/FAIL documented
**Priority**: MEDIUM
**Status**: FIXED & VERIFIED

---

### TC-STUP-005: Publish Startup Update
**Description**: Founder can publish update
**Preconditions**: User is founder, logged in
**Steps**:
1. On startup detail page
2. Click "+ Post Update"
3. Enter update title
4. Enter update body
5. Click "Publish"

**Expected Result**:
- Update created
- Added to updates list
- Form cleared
- Update visible to all viewers

**Acceptance Criteria**: ✅ PASS/FAIL documented
**Priority**: HIGH
**Status**: FIXED & VERIFIED

---

### TC-STUP-006: Like Update
**Description**: User can like startup update
**Preconditions**: Updates exist on startup
**Steps**:
1. On update section
2. Click like button on update

**Expected Result**:
- Like count increments
- Visual feedback shown
- Like persisted

**Acceptance Criteria**: ✅ PASS/FAIL documented
**Priority**: MEDIUM
**Status**: FIXED & VERIFIED

---

### TC-STUP-007: Edit Update (Founder Only)
**Description**: Founder can edit their update
**Preconditions**: User is founder, update exists
**Steps**:
1. On update section
2. Click edit icon on own update
3. Modify title/body
4. Click "Save"

**Expected Result**:
- Update edited
- List refreshed
- Changes persisted

**Acceptance Criteria**: ✅ PASS/FAIL documented
**Priority**: MEDIUM
**Status**: FIXED & VERIFIED

---

### TC-STUP-008: Delete Update (Founder Only)
**Description**: Founder can delete their update
**Preconditions**: User is founder, update exists
**Steps**:
1. On update section
2. Click delete icon on own update
3. Confirm dialog

**Expected Result**:
- Update removed
- List refreshed
- Deleted from database

**Acceptance Criteria**: ✅ PASS/FAIL documented
**Priority**: MEDIUM
**Status**: FIXED & VERIFIED

---

### TC-STUP-009: Comment on Update
**Description**: User can comment on update
**Preconditions**: Update exists
**Steps**:
1. On update section
2. Click comment button or focus comment input
3. Enter comment text
4. Press Enter or click Post

**Expected Result**:
- Comment added
- Displays immediately
- Persisted to database

**Acceptance Criteria**: ✅ PASS/FAIL documented
**Priority**: MEDIUM
**Status**: FIXED & VERIFIED

---

## Notifications & Profile

### TC-NOT-001: Mark Notification Read
**Description**: User can mark individual notification as read
**Preconditions**: Unread notification exists
**Steps**:
1. In navbar notification dropdown
2. Click on notification
3. Verify unread dot disappears

**Expected Result**:
- Notification marked as read
- Unread count decrements
- Unread badge updates

**Acceptance Criteria**: ✅ PASS/FAIL documented
**Priority**: MEDIUM

---

### TC-PRO-001: View Profile
**Description**: User can view their profile
**Preconditions**: User is logged in
**Steps**:
1. Navigate to /profile/me
2. Wait for profile data to load

**Expected Result**:
- User's profile displayed
- Avatar, name, bio shown
- Stats (followers, following) shown
- Activity/events/startups tabs shown

**Acceptance Criteria**: ✅ PASS/FAIL documented
**Priority**: HIGH

---

### TC-PRO-002: Edit Profile
**Description**: User can edit profile information
**Preconditions**: User is logged in
**Steps**:
1. Navigate to /profile/edit
2. Modify fields (bio, university, etc.)
3. Click "Save Changes"

**Expected Result**:
- Changes saved
- Profile updated
- User redirected or confirmation shown

**Acceptance Criteria**: ✅ PASS/FAIL documented
**Priority**: HIGH

---
