# UniConnect-The-Centralized-Campus-Hub---Team-1---6th-April-2026
Innovelous

UniConnect – Project Proposal | Innovelous Internship Program 2026
Implementation Strategy
Development follows a modular, phase-by-phase approach ensuring each subsystem is
independently testable and scalable before integration.
User Roles & Authentication
Three primary roles will be defined with distinct permissions:
• Event Manager: Full CRUD on events, can assign sub-roles
• Student: Browse, register, like, comment, and rate events
• Founder: All student permissions plus access to Startup Hub
Homepage & Activity Feed
The Homepage is the primary landing surface after login. It is designed to be dynamic,
personalized, and social – similar to a LinkedIn or Instagram feed tailored for campus life.
Feed Components
• Personalized Event Cards: Rendered based on the user's interest tags and past activity
• Upcoming Events Banner: Highlighted section for events happening within 7 days
• Post-Event Highlights: Photos and videos shared after completed events
• Startup Spotlights: Featured founder pitches from the Founder's Launchpad
• Society Updates: Posts from societies and organizations the user follows
Feed Logic
• Tag-matching algorithm surfaces relevant events and posts
• Recency and engagement (likes/comments) influence feed ranking
• Infinite scroll with lazy loading for performance
• Search bar with filters (by tag, date, society, type)
Admin Panel
A dedicated Admin Panel will provide platform administrators with full oversight and control. This
is a separate, protected section of the application accessible only by users with the Admin role.
Admin Dashboard
• Platform-wide analytics: total users, events, registrations, active societies
• Growth charts: new sign-ups over time, event creation trends
• Flagged content queue: posts or comments reported by users
User Management
• View, search, and filter all registered users
• Manually promote or demote user roles (Student → Founder → Manager → Admin)
• Suspend or permanently ban accounts with audit log
User Profile SystemUniConnect – Project Proposal | Innovelous Internship Program 2026
Every user will have a rich, persistent profile that serves as their campus digital identity –
representing both their social involvement and professional interests.
Profile Components
• Avatar & Cover Photo: Uploadable profile and banner images
• Bio & Contact Info: Short bio, university, year of study, LinkedIn/GitHub links
• Interest Tags: Visual tag chips displaying the user's selected interests
• Activity Feed: All public posts, event registrations, and highlights shared by the user
• Events Attended: Chronological list of past event participations with ratings given
• Startup Involvement: Startups the user has created or joined as a co-founder
• Followers / Following: Social graph showing campus connections
Profile Edit
• In-line editing for bio, tags, and links
• Crop-and-upload interface for avatar and cover photo
Social Engagement: Likes & Comments
To foster community interaction, all event posts, highlights, and founder pitches will support
social engagement features.
Like System
• Users can like/unlike any event card, post-event highlight, or startup pitch
• Like count displayed publicly on each post
• Liked posts saved in user's profile for later reference
• Like actions trigger real-time count update (optimistic UI)
Comment System
• Threaded comments: top-level comments with nested replies (up to 2 levels)
• Rich text input: support for @mentions to tag other users
• Comment moderation: authors can delete their own comments; managers can delete on
their events
Event Management System
Core event functionality supports the full lifecycle from creation to archiving.
• Create, Update, Delete events with rich detail pages (date, time, venue, description,
tags, capacity)
• Media upload: photos and videos via drag-and-drop; archived post-event
• Registration system with capacity enforcement and waitlist support
• Post-event highlights: managers can publish a gallery visible on the Homepage feed
• Event rating: attendees rate events (1–5 stars) after the event date passes
• Capacity indicator: real-time registered vs. total seats display
Tag-Based Recommendation Engine
• Events tagged with categories: tech, business, AI, competitions, arts, sports, etc.
• Users select interest tags on signup and can update at any time from their profileUniConnect – Project Proposal | Innovelous Internship Program 2026
• New tags can be added by admins without schema changes
Startup Hub – Founder's Launchpad
• Founders create startup profiles: name, pitch, problem statement, required roles
• Co-founder matching: platform suggests users whose skills/tags match the startup's
needs
• Public pitch page visible to all students; featured on the Homepage feed
• Contact & collaboration requests sent within the platform (no external email needed)
• Startup updates: founders can post progress updates, liked/commented like regular
posts
Feature Summary
Feature Description
Homepage Feed Personalized, tag-driven activity feed
with infinite scroll
Admin Panel Full user, content, and platform
management
User Profiles Digital campus identity with social
graph and history
Like System One-click likes on all posts and events
with real-time count
Comment System Threaded comments with @mentions
and moderation
Notifications In-app alerts for likes, comments,
follows, registrations
Event Management Full CRUD, media, registration,
capacity, ratings
Role-Based Event Mgmt Micro-role hierarchy within each event
Tag Recommendations Dynamic event suggestions based on
user interests
Startup Hub Founder pitches, co-founder matching,
pitch feed
Post-Event Highlights Media gallery published to the feed
after events
Search & Filters Search by tag, society, date, event
type
Slow Connection Mode Text-only fallback for low-bandwidth
environments
Data Export (Admin) CSV/PDF export of user and event
statisticsUniConnect – Project Proposal | Innovelous Internship Program 2026
Database Design
MongoDB collections are designed for horizontal scalability. Key collections and their
relationships:
Core Collections
• Users
• Events
• EventRoles
• Registrations
• Posts
• Comments
• Likes
• Startups
• Notifications
• Reports
API & Backend Structure
API Modules
• /api/auth – Register, login, refresh token, logout
• /api/users – Profile CRUD, follow/unfollow, tag preferences
• /api/events – Event CRUD, registration, capacity check, ratings
• /api/posts – Create/delete highlights and updates, feed retrieval
• /api/likes – Like/unlike with target polymorphism
• /api/comments – comment CRUD, reporting
• /api/startups – Startup profile CRUD, co-founder matching
• /api/notifications – List, mark read, preference update
• /api/admin – User management, moderation, analytics, exports
• /api/tags – Tag list, admin management
Frontend Implementation
Page Structure
• / – Landing / Login page
• /home – Authenticated homepage feed
• /events – Event discovery with filters
• /events/:id – Event detail & registration
• /profile/:id – User profile page
• /profile/edit – Profile editor
• /startups – Founder's Launchpad listingUniConnect – Project Proposal | Innovelous Internship Program 2026
• /startups/:id – Startup detail page
• /admin – Admin Panel (protected, Admin role only)
• /admin/users – User management table
• /admin/content – Content moderation queue
• /admin/analytics – Dashboard with charts
Role Distribution
Role Member(s)
Project Lead Umar
Frontend
Developer
Emaan, Umar
Backend
Developer
Feras, Sarim,
Umar
Database /
Integration
Feras, Sarim,
Umar
QA &
Documentation
Emaan, Umar
Final Deliverables
1. Source Code – Private GitHub repository with full commit history per team member
2. Technical Manual – Architecture decisions, API documentation, and database schema
reference
