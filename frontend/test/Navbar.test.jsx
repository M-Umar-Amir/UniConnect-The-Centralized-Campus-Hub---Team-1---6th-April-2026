import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import Navbar from "../src/components/Navbar.jsx";

function renderNavbar(initialPath = "/home") {
  localStorage.setItem(
    "uniconnect_user_profile",
    JSON.stringify({ fullName: "Test User", role: "admin" })
  );

  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route
          path="*"
          element={
            <>
              <Navbar
                notifications={[
                  {
                    id: "n1",
                    type: "event",
                    text: "Your event was updated",
                    targetUrl: "/events/e1",
                    actor: { avatarUrl: "https://placehold.co/40x40" }
                  }
                ]}
                unreadCount={1}
                onMarkAllRead={vi.fn()}
                onOpenNotification={vi.fn()}
              />
              <div data-testid="route-indicator">{window.location.pathname}</div>
            </>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

describe("Navbar", () => {
  it("opens notifications dropdown on click", () => {
    renderNavbar();

    fireEvent.click(screen.getByRole("button", { name: /notifications/i }));

    expect(screen.getByText(/view all notifications/i)).toBeInTheDocument();
    expect(screen.getByText(/your event was updated/i)).toBeInTheDocument();
  });

  it("opens profile menu and exposes profile links", () => {
    renderNavbar();

    fireEvent.click(screen.getByRole("button", { name: /test user/i }));

    expect(screen.getByRole("button", { name: /my profile/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /settings/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /admin panel/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
  });

  it("shows search suggestions and clears query after choosing one", () => {
    renderNavbar();

    fireEvent.change(screen.getByPlaceholderText(/search events, users, startups/i), {
      target: { value: "Founder Meetup" }
    });
    expect(screen.getByRole("button", { name: /founder meetup/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /founder meetup/i }));

    expect(screen.getByPlaceholderText(/search events, users, startups/i)).toHaveValue("");
  });

  it("logo link points to home", () => {
    renderNavbar("/events");

    expect(screen.getByRole("link", { name: /uniconnect/i })).toHaveAttribute("href", "/home");
  });
});
