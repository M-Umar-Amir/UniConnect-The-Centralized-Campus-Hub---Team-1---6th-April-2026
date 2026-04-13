# Shared Components Reference

This file documents the shared components required for Sections E, F, and G.

## Navbar
- File: `src/components/Navbar.jsx`
- Props:
  - `notifications`: list of last 5-8 notifications
  - `unreadCount`: unread count for bell indicator
  - `onMarkAllRead`: callback for dropdown action
  - `onOpenNotification`: callback when user clicks a notification row
- Usage:
```jsx
<Navbar
  notifications={recent}
  unreadCount={unreadCount}
  onMarkAllRead={markAll}
  onOpenNotification={openItem}
/>
```

## AdminSidebar
- File: `src/components/AdminSidebar.jsx`
- Props: none
- Usage: render in `/admin` layouts.

## EventCard
- File: `src/components/EventCard.jsx`
- Props: `event`, `onLike`, `onAction`
- Includes: cover, title, society, date, venue, tags, capacity bar, like/comment/action controls.

## StartupCard
- File: `src/components/StartupCard.jsx`
- Props: `startup`, `onLike`, `onViewPitch`

## PostEventHighlightCard
- File: `src/components/PostEventHighlightCard.jsx`
- Props: `item`, `onLike`, `onOpen`

## CommentThread
- File: `src/components/CommentThread.jsx`
- Props: `comments`, `onLoadMore`, `onLike`, `onReply`, `onReport`, `onDelete`
- Behavior: 2-level threading.

## LikeButton
- File: `src/components/LikeButton.jsx`
- Props: `count`, `liked`, `onToggle`
- Behavior: optimistic UI with automatic rollback on error.

## TagChip
- File: `src/components/TagChip.jsx`
- Props: `label`, `selected`, `selectable`, `onClick`
- Variants: selectable + display-only.

## RoleBadge
- File: `src/components/RoleBadge.jsx`
- Props: `role` (`student`, `founder`, `event_manager`, `admin`)

## VerifiedBadge
- File: `src/components/VerifiedBadge.jsx`
- Props: `verified`

## NotificationDropdown
- File: `src/components/NotificationDropdown.jsx`
- Props: `notifications`, `unreadCount`, `onMarkAllRead`, `onSelect`
- Includes: mark-all-read and view-all links.

## FollowersFollowingModal
- File: `src/components/FollowersFollowingModal.jsx`
- Props: `open`, `title`, `users`, `onClose`, `onToggleFollow`

## TagPickerModal
- File: `src/components/TagPickerModal.jsx`
- Props: `open`, `tags`, `selected`, `onSelect`, `onDone`, `onClose`

## ConfirmationDialog
- File: `src/components/ConfirmationDialog.jsx`
- Props: `open`, `title`, `warning`, `confirmLabel`, `onConfirm`, `onCancel`

## EmptyState
- File: `src/components/EmptyState.jsx`
- Props: `heading`, `subtext`, `actionLabel`, `onAction`

## SkeletonCard
- File: `src/components/SkeletonCard.jsx`
- Props: `lines`

## ImageCropInterface
- File: `src/components/ImageCropInterface.jsx`
- Props: `open`, `mode`, `imageUrl`, `onConfirm`, `onRecrop`, `onClose`

## LightboxMediaViewer
- File: `src/components/LightboxMediaViewer.jsx`
- Props: `open`, `items`, `index`, `onPrev`, `onNext`, `onClose`

## ToastNotifications
- File: `src/components/ToastNotifications.jsx`
- Props: `toasts`, `onDismiss`

## Inline Form Validation
- File: `src/components/InlineFormValidation.jsx`
- Exports:
  - `FieldError`
  - `hasErrorClass`
