import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SettingsPage from "../src/pages/SettingsPage.jsx";

vi.mock("../src/hooks/useToast", () => ({
  useToast: () => ({
    toasts: [],
    removeToast: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn()
  })
}));

vi.mock("../src/services/settingsService", () => ({
  settingsService: {
    changePassword: vi.fn(),
    requestEmailChange: vi.fn(),
    verifyEmailChange: vi.fn(),
    logoutOtherDevices: vi.fn(),
    updateNotificationSettings: vi.fn(),
    updatePrivacySettings: vi.fn(),
    updateProfile: vi.fn()
  }
}));

describe("SettingsPage", () => {
  it("shows inline validation for mismatched passwords", () => {
    render(<SettingsPage />);

    fireEvent.click(screen.getByRole("button", { name: /security/i }));
    fireEvent.change(screen.getByPlaceholderText(/new password/i), { target: { value: "new-password123" } });
    fireEvent.change(screen.getByPlaceholderText(/confirm password/i), { target: { value: "different-password" } });
    fireEvent.click(screen.getByRole("button", { name: /update password/i }));

    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
  });
});
