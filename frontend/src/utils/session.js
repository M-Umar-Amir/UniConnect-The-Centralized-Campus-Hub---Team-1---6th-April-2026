export function getStoredProfile() {
  try {
    return JSON.parse(localStorage.getItem("uniconnect_user_profile") || "{}");
  } catch {
    return {};
  }
}

export function logoutUser() {
  localStorage.removeItem("uniconnect_token");
  localStorage.removeItem("uniconnect_onboarding_complete");
  localStorage.removeItem("uniconnect_user_profile");
}
