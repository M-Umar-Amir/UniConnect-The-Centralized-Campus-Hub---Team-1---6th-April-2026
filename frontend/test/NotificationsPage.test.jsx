import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import NotificationsPage from "../src/pages/NotificationsPage.jsx";

const navigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigate
  };
});

vi.mock("../src/services/notificationService", () => ({
  notificationService: {
    getNotifications: vi.fn(async () => ({
      items: [
        {
          _id: "notif-1",
          type: "event",
          text: "Your event registration was confirmed",
          targetUrl: "/events/demo-hackathon",
          actor: { avatarUrl: "https://placehold.co/44x44" },
          createdAt: new Date().toISOString(),
          isRead: false,
          referenceThumbnail: "https://placehold.co/120x80"
        }
      ],
      unreadCount: 1
    })),
    markAsRead: vi.fn(async () => ({})),
    markAllRead: vi.fn(async () => ({}))
  }
}));

describe("NotificationsPage", () => {
  it("marks a notification as read and navigates to its target", async () => {
    render(<NotificationsPage />);

    await waitFor(() => {
      expect(screen.getByText(/your event registration was confirmed/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/your event registration was confirmed/i));

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith("/events/demo-hackathon");
    });
  });
});
