# UniConnect Frontend Workflow Guide

## Section A - Auth Pages

### A1 - Landing / Login Page
- Route: /
- Visible to: logged-out users only
- Redirect authenticated users to /home

#### Hero Section
- Logo
- Headline
- Subheading
- Buttons: Get Started, Login

#### Features Section
- 3-4 cards:
- Event Discovery
- Founder's Launchpad
- Campus Networking
- Smart Recommendations

#### Login Form
- Email
- Password with show/hide
- Forgot Password link
- Login button
- Error state
- Sign-up link

#### Sign Up Form
- Full name
- Email
- Password with strength indicator
- Confirm password
- University
- Year of study
- Role selector cards:
- Student
- Founder
- Event Manager
- Interest tags multi-select
- Sign Up button
- Terms checkbox

### A2 - Forgot Password
- Route: /forgot-password
- Visible to: logged-out users
- Email field
- Send Reset Link button
- Success state with confirmation and email shown
- Error state if no account found

### A3 - Reset Password
- Route: /reset-password/:token
- Visible to: anyone with valid reset link
- New password + confirm password
- Password strength indicator
- Success: redirect to login after 3 seconds
- Error: expired link message + link to forgot-password

### A4 - Email Verification
- Route: /verify-email/:token
- Visible to: new users from verification email
- Loading spinner state
- Success state with checkmark + Go to Home button
- Error state for invalid/expired token + resend button

### A5 - Onboarding Flow
- Route: /onboarding
- Visible to: new users on first login only

#### Step 1 of 3 - Welcome
- Greeting with first name
- Short explanation
- Let's Get Started button

#### Step 2 of 3 - Interests
- Tag chip grid
- Minimum 3 tags required
- Continue disabled until minimum met
- Skip link

#### Step 3 of 3 - Profile
- University
- Year of study
- Bio (160 chars)
- LinkedIn
- GitHub
- Avatar upload
- Finish Setup redirects to /home
- Skip also redirects to /home

## Section B - Core Authenticated Pages

### Shared Navbar
- Visible on all Section B pages onwards
- Logo links to /home
- Search bar with live grouped dropdown (events, users, startups)
- Enter key navigates to /search
- Notification bell with unread badge
- Avatar dropdown:
- My Profile
- Settings
- Logout

### B1 - Homepage / Feed
- Route: /home
- Visible to: all logged-in users

#### Left Sidebar (Desktop)
- Avatar
- Name
- Role badge
- University
- Follower/following counts
- Nav links
- Interest tags

#### Main Feed
- Upcoming Events Banner (next 7 days)
- Infinite scroll with card types:
- Event Card
- Post-Event Highlight Card
- Startup Spotlight Card
- Society Update Card

#### Right Sidebar
- Recommended events
- Active societies
- Suggested people

### B2 - Search Results
- Route: /search?q=...
- Visible to: all logged-in users
- Tabs: All, Events, People, Startups
- Filter bar per tab:
- Events: tag/date/society/type
- People: role/university
- Startups: domain/role
- Empty state if no results

### B3 - Event Discovery
- Route: /events
- Visible to: all logged-in users
- Create Event button for Event Managers only
- Search + filters:
- Tag
- Date range
- Society
- Event type
- Status (upcoming/ongoing/past)
- Grid/List toggle (default grid)
- Pagination or infinite scroll

### B4 - Create / Edit Event Form
- Routes:
- /events/create
- /events/:id/edit
- Visible to: Event Managers only

#### Form Areas
- Basic info
- Date and location
- Media upload
- Tags
- Capacity and registration
- Sub-roles/segments (optional)

#### Actions
- Save Draft
- Publish
- Cancel
- Edit mode adds Unpublish and Delete

### B5 - Event Detail Page
- Route: /events/:id
- Visible to: all logged-in users

#### Header
- Cover banner
- Title
- Society + follow button
- Tags
- Like
- Share

#### Info Block
- Date/time
- Venue
- Event type
- Organizer
- Capacity bar
- Registration deadline

#### Registration States
- Default: Register Now
- Full: Join Waitlist
- Registered: You're Registered + Cancel
- Waitlisted: position + Leave Waitlist
- Closed: Registration Closed label

#### Content Sections
- Full description
- Segment list
- Media gallery with lightbox
- Post-event highlights (past events)
- Rating (attended users only after event)
- Threaded comments (2 levels)

#### Event Manager Controls
- Edit Event
- Delete Event
- Manage Registrations
- CSV export
- Post Highlight
- Manage Sub-Roles

### B6 - User Profile Page
- Route: /profile/:id
- Visible to: all logged-in users

#### Header
- Cover photo
- Avatar
- Name
- Role badge
- Verified badge
- University
- Bio
- External links
- Tags
- Stats
- Edit Profile or Follow + Message buttons

#### Tabs
- Activity
- Events
- Startups
- Liked Posts (owner only)

#### Followers / Following Modal
- Searchable list
- Follow/unfollow per row

### B7 - Profile Edit Page
- Route: /profile/edit
- Visible to: own profile only
- Avatar change/remove with crop
- Cover photo change/remove with crop
- Basic info and bio
- Role read-only
- LinkedIn/GitHub with URL validation
- Interest tags (minimum 3)
- Privacy toggles
- Save Changes (disabled if no changes)
- Cancel with unsaved warning

## Section C - Startup Hub

### C1 - Startup Listing
- Route: /startups
- Visible to: all users
- Post button visible to Founders only
- Search + filters:
- Domain
- Required role
- Status
- Cards include name, founder, tagline, tags, roles, likes, View Pitch

### C2 - Create / Edit Startup Form
- Routes:
- /startups/create
- /startups/:id/edit
- Visible to: Founders only

#### Fields
- Name
- Tagline (100 chars)
- Logo upload
- Problem statement
- Solution
- Business model
- Target audience
- Domain tags
- Roles needed
- Status

#### Actions
- Save Draft
- Publish Pitch
- Cancel
- Edit mode adds Delete

### C3 - Startup Detail Page
- Route: /startups/:id
- Visible to: all logged-in users

#### Header
- Logo
- Name
- Founder link
- Domain tags
- Status badge
- Like
- Share

#### Pitch Sections
- Problem Statement
- Solution
- Business Model
- Target Audience

#### Team Section
- Team list + open roles chips

#### Collaboration Request
- Non-members: Request to Join
- Founder: Manage Requests

#### Collaboration Requests Modal (Founder)
- Tabs: Pending, Accepted, Declined
- Accept/Decline actions

#### Updates Section
- Founder can post/edit/delete updates
- Updates list supports like/comment

#### Comments
- Same threaded structure as Event Detail

## Section D - Admin Pages

### Shared Admin Sidebar
- Links:
- Dashboard
- User Management
- Content Moderation
- Analytics
- Tag Management
- System Settings
- Back to Main Site link

### D1 - Admin Dashboard
- Route: /admin
- Stats cards:
- Total users
- Events
- Registrations
- Active societies
- Flagged content
- New signups today
- Charts:
- New users over time (line)
- Events created (bar)
- Flagged content preview table (latest 5)

### D2 - User Management
- Route: /admin/users
- Search by name/email
- Filters: role/status/university
- Table columns: avatar, identity, university, role, status, joined, actions
- Actions:
- View profile
- Change role
- Verify
- Suspend
- Ban
- Suspended rows yellow
- Banned rows red

### D3 - Content Moderation
- Route: /admin/content
- Filters by type and status
- Queue table with report metadata
- Actions:
- View full content
- Remove
- Dismiss report
- Warn user
- Ban user
- Full content modal with complete report/action controls
- Broadcast announcement form

### D5 - Tag Management
- Route: /admin/tags
- Table with usage counts and created date
- Actions:
- Inline edit
- Deprecate
- Delete when count is 0
- Add new tag form with duplicate check

### D6 - System Settings
- Route: /admin/settings
- Platform name
- Maintenance mode toggle
- Allow registrations toggle
- Allow event creation toggle
- Feature toggles:
- Startup Hub
- Comments
- Likes
- Notifications
- Slow connection mode
- Save Settings
- Reset to Defaults

## Section E - Settings Page

### E1 - Settings
- Route: /settings
- Visible to: all logged-in users

#### Account Tab
- Email display
- Change Email flow with password confirm + verification
- University editable
- Role read-only
- Link to profile edit

#### Password and Security Tab
- Current password
- New password + strength indicator
- Confirm password
- Update button
- Logout all other devices button

#### Notifications Tab
- Toggle list:
- Likes
- Comments
- Replies
- Follows
- Event registration
- Event updates
- Startup match
- Announcements
- Master email notifications toggle

#### Privacy Tab
- Show events attended
- Show startup involvement
- Public profile
- Allow mentions from
- Show online status

## Section F - Notifications Page

### F1 - Notifications
- Route: /notifications
- Visible to: all logged-in users
- Mark All as Read button when unread exists
- Tabs:
- All
- Likes
- Comments
- Follows
- Events
- Startups
- Announcements
- Rows include avatar, text, thumbnail, timestamp, unread dot
- Clicking marks as read and navigates to target

### Notification Dropdown
- Last 5-8 notifications
- Mark all as read
- View all notifications link

## Section G - Shared Components

Build and document these first for team consistency:
- Navbar
- Admin Sidebar
- Event Card
- Startup Card
- Post-Event Highlight Card
- Comment Thread
- Like Button
- Tag Chip
- Role Badge
- Verified Badge
- Notification Dropdown
- Followers/Following Modal
- Tag Picker Modal
- Confirmation Dialog
- Empty State
- Skeleton Card
- Image Crop Interface
- Lightbox / Media Viewer
- Toast Notifications
- Inline Form Validation

## Component Notes

### Navbar
- Logo
- Search with live dropdown
- Bell
- Avatar menu
- Used on all authenticated pages

### Admin Sidebar
- Left navigation for all /admin routes

### Event Card
- Cover image, title, society, date, venue, tags, capacity bar, like, comment, action button
- Used in feed, events listing, profile, search

### Startup Card
- Name, founder, tagline, domain tags, roles needed, like, View Pitch
- Used in startup listing, feed, search

### Post-Event Highlight Card
- Media, caption, linked event, society, like, comment
- Feed usage

### Comment Thread
- Two-level thread
- Like/reply/report/delete
- Load more behavior
- Used in event and startup detail pages

### Like Button
- Icon + count
- Toggled state
- Optimistic update with revert on API error

### Tag Chip
- Selectable and display-only variants

### Role Badge
- Student, Founder, Event Manager, Admin

### Verified Badge
- Checkmark beside verified user/society names

### Notification Dropdown
- 5-8 items
- Mark all read
- View all link

### Followers / Following Modal
- Search + follow/unfollow rows

### Tag Picker Modal
- Select/deselect chips + Done

### Confirmation Dialog
- Warning title/message
- Red confirm + cancel
- Used for destructive actions

### Empty State
- Illustration, heading, subtext, optional CTA

### Skeleton Card
- Loading placeholder to prevent layout shift

### Image Crop Interface
- Circular or banner crop
- Confirm/Re-crop actions

### Lightbox / Media Viewer
- Full-screen overlay
- Prev/next arrows
- Close action

### Toast Notifications
- Success, Error, Info
- Bottom-right
- Auto-dismiss in 3-4 seconds

### Inline Form Validation
- Red field border + error text under field on blur
