import { useMemo, useState } from "react";
import { settingsService } from "../services/settingsService";
import { FieldError, hasErrorClass } from "../components/InlineFormValidation";
import ToastNotifications from "../components/ToastNotifications";
import { useToast } from "../hooks/useToast";

const tabs = ["account", "security", "notifications", "privacy"];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");
  const toast = useToast();

  const [account, setAccount] = useState({ currentPassword: "", newEmail: "", verificationCode: "", university: "" });
  const [security, setSecurity] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [notificationSettings, setNotificationSettings] = useState({
    likes: true,
    comments: true,
    replies: true,
    follows: true,
    eventRegistration: true,
    eventUpdates: true,
    startupMatch: true,
    announcements: true,
    emailNotifications: true
  });
  const [privacySettings, setPrivacySettings] = useState({
    showEventsAttended: true,
    showStartupInvolvement: true,
    publicProfile: true,
    allowMentionsFrom: "everyone",
    showOnlineStatus: true
  });

  const passwordStrength = useMemo(() => {
    const value = security.newPassword;
    if (value.length >= 12) return "Strong";
    if (value.length >= 8) return "Medium";
    return "Weak";
  }, [security.newPassword]);

  const [errors, setErrors] = useState({});

  async function handleEmailRequest() {
    try {
      await settingsService.requestEmailChange({
        currentPassword: account.currentPassword,
        newEmail: account.newEmail
      });
      toast.success("Verification code sent to your new email");
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function handleEmailVerify() {
    try {
      await settingsService.verifyEmailChange({ code: account.verificationCode });
      toast.success("Email updated successfully");
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function handlePasswordUpdate() {
    const localErrors = {};
    if (security.newPassword !== security.confirmPassword) {
      localErrors.confirmPassword = "Passwords do not match";
    }
    if (security.newPassword.length < 8) {
      localErrors.newPassword = "Must be at least 8 characters";
    }

    setErrors(localErrors);
    if (Object.keys(localErrors).length > 0) return;

    try {
      await settingsService.changePassword(security);
      toast.success("Password updated");
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function handleSaveNotificationSettings() {
    try {
      await settingsService.updateNotificationSettings(notificationSettings);
      toast.success("Notification settings saved");
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function handleSavePrivacySettings() {
    try {
      await settingsService.updatePrivacySettings(privacySettings);
      toast.success("Privacy settings saved");
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <section className="settings-page">
      <header className="settings-header">
        <h1>Settings</h1>
        <nav>
          {tabs.map((tab) => (
            <button key={tab} className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)}>
              {tab}
            </button>
          ))}
        </nav>
      </header>

      {activeTab === "account" && (
        <section className="panel">
          <h2>Account</h2>
          <p>Email display and change flow</p>
          <input
            placeholder="Current password"
            type="password"
            value={account.currentPassword}
            onChange={(e) => setAccount((prev) => ({ ...prev, currentPassword: e.target.value }))}
          />
          <input
            placeholder="New email"
            value={account.newEmail}
            onChange={(e) => setAccount((prev) => ({ ...prev, newEmail: e.target.value }))}
          />
          <button onClick={handleEmailRequest}>Request verification</button>
          <input
            placeholder="Verification code"
            value={account.verificationCode}
            onChange={(e) => setAccount((prev) => ({ ...prev, verificationCode: e.target.value }))}
          />
          <button onClick={handleEmailVerify}>Verify and change email</button>
          <input
            placeholder="University"
            value={account.university}
            onChange={(e) => setAccount((prev) => ({ ...prev, university: e.target.value }))}
          />
          <button onClick={() => settingsService.updateProfile({ university: account.university })}>Save university</button>
        </section>
      )}

      {activeTab === "security" && (
        <section className="panel">
          <h2>Password & Security</h2>
          <input
            placeholder="Current password"
            type="password"
            value={security.currentPassword}
            onChange={(e) => setSecurity((prev) => ({ ...prev, currentPassword: e.target.value }))}
          />
          <input
            placeholder="New password"
            type="password"
            className={hasErrorClass(errors.newPassword)}
            value={security.newPassword}
            onChange={(e) => setSecurity((prev) => ({ ...prev, newPassword: e.target.value }))}
          />
          <FieldError message={errors.newPassword} />
          <p>Password strength: {passwordStrength}</p>
          <input
            placeholder="Confirm password"
            type="password"
            className={hasErrorClass(errors.confirmPassword)}
            value={security.confirmPassword}
            onChange={(e) => setSecurity((prev) => ({ ...prev, confirmPassword: e.target.value }))}
          />
          <FieldError message={errors.confirmPassword} />
          <button onClick={handlePasswordUpdate}>Update Password</button>
          <button onClick={() => settingsService.logoutOtherDevices()}>Log out of all other devices</button>
        </section>
      )}

      {activeTab === "notifications" && (
        <section className="panel">
          <h2>Notifications</h2>
          {Object.entries(notificationSettings).map(([key, value]) => (
            <label key={key} className="toggle-row">
              <span>{key}</span>
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => setNotificationSettings((prev) => ({ ...prev, [key]: e.target.checked }))}
              />
            </label>
          ))}
          <button onClick={handleSaveNotificationSettings}>Save Notification Preferences</button>
        </section>
      )}

      {activeTab === "privacy" && (
        <section className="panel">
          <h2>Privacy</h2>
          {Object.entries(privacySettings).map(([key, value]) => {
            if (key === "allowMentionsFrom") {
              return (
                <label key={key}>
                  <span>Allow mentions from</span>
                  <select
                    value={value}
                    onChange={(e) => setPrivacySettings((prev) => ({ ...prev, allowMentionsFrom: e.target.value }))}
                  >
                    <option value="everyone">Everyone</option>
                    <option value="followers">Followers</option>
                    <option value="none">No one</option>
                  </select>
                </label>
              );
            }

            return (
              <label key={key} className="toggle-row">
                <span>{key}</span>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setPrivacySettings((prev) => ({ ...prev, [key]: e.target.checked }))}
                />
              </label>
            );
          })}
          <button onClick={handleSavePrivacySettings}>Save Privacy Settings</button>
        </section>
      )}

      <ToastNotifications toasts={toast.toasts} onDismiss={toast.removeToast} />
    </section>
  );
}
