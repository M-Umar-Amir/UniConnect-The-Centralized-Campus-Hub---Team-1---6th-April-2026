// src/App.jsx
// Drop this in to replace your existing App.jsx
// Adds all Section A auth routes alongside existing app routes

import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";

// ── Existing pages (keep as-is) ──
import HomePage          from "./pages/HomePage";
import NotificationsPage from "./pages/NotificationsPage";
import SettingsPage      from "./pages/SettingsPage";
import EventsPage        from "./pages/EventsPage";
import StartupsPage      from "./pages/StartupsPage";
import ProfilePage       from "./pages/ProfilePage";
import SearchResultsPage from "./pages/SearchResultsPage";
import EventDetailPage   from "./pages/EventDetailPage";
import EventEditorPage   from "./pages/EventEditorPage";
import ProfileEditPage   from "./pages/ProfileEditPage";

// ── New: all auth pages from single file ──
import {
  LandingPage,
  LoginPage,
  SignupPage,
  ForgotPassword,
  ResetPassword,
  EmailVerify,
  OnboardingPage,
} from "./pages/AuthPages";

function isAuthenticated() {
  return Boolean(localStorage.getItem("uniconnect_token"));
}

function hasFinishedOnboarding() {
  return localStorage.getItem("uniconnect_onboarding_complete") === "true";
}

function PublicOnlyRoute({ children }) {
  if (isAuthenticated()) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function OnboardingRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (hasFinishedOnboarding()) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

function HomeRoute() {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (!hasFinishedOnboarding()) {
    return <Navigate to="/onboarding" replace />;
  }

  return <HomePage />;
}

export default function App() {
  return (
    <Routes>
      {/* ── Public / Auth routes ── */}
      <Route path="/"                        element={<PublicOnlyRoute><LandingPage /></PublicOnlyRoute>} />
      <Route path="/login"                   element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
      <Route path="/signup"                  element={<PublicOnlyRoute><SignupPage /></PublicOnlyRoute>} />
      <Route path="/forgot-password"         element={<PublicOnlyRoute><ForgotPassword /></PublicOnlyRoute>} />
      <Route path="/reset-password/:token"   element={<ResetPassword />} />
      <Route path="/verify-email/:token"     element={<EmailVerify />} />
      <Route path="/onboarding"              element={<OnboardingRoute><OnboardingPage /></OnboardingRoute>} />

      {/* ── Protected app routes ── */}
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/home"          element={<HomeRoute />} />
        <Route path="/search"        element={<SearchResultsPage />} />
        <Route path="/settings"      element={<SettingsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/events"        element={<EventsPage />} />
        <Route path="/events/create" element={<EventEditorPage />} />
        <Route path="/events/:id"    element={<EventDetailPage />} />
        <Route path="/events/:id/edit" element={<EventEditorPage />} />
        <Route path="/startups"      element={<StartupsPage />} />
        <Route path="/profile/me"    element={<ProfilePage />} />
        <Route path="/profile/edit"  element={<ProfileEditPage />} />
        <Route path="/profile/:id"   element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
