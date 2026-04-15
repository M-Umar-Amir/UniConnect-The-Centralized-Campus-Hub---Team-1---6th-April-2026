import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import NotificationDropdown from "../src/components/NotificationDropdown.jsx";

describe("NotificationDropdown", () => {
  it("renders recent notifications and resolves the target route", () => {
    const onSelect = vi.fn();

    render(
      <MemoryRouter>
        <NotificationDropdown
          unreadCount={1}
          notifications={[
            {
              id: "notif-1",
              type: "startup",
              text: "Someone liked your startup pitch",
              targetUrl: "/startups/demo-pitch",
              actor: { avatarUrl: "https://placehold.co/40x40" }
            }
          ]}
          onMarkAllRead={vi.fn()}
          onSelect={onSelect}
        />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/someone liked your startup pitch/i));

    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ targetUrl: "/startups/demo-pitch" })
    );
    expect(screen.getByRole("link", { name: /view all notifications/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /mark all as read/i })).toBeInTheDocument();
  });
});
