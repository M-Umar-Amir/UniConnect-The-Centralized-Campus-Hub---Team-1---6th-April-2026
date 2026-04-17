import { expect, test } from "@playwright/test";

async function getToken(request) {
  const email = `pw.${Date.now()}@uniconnect.test`;

  const register = await request.post("http://localhost:5000/api/auth/register", {
    data: {
      fullName: "Playwright User",
      email,
      password: "password123",
      role: "student"
    }
  });

  const payload = await register.json();
  return payload.token;
}

test("public auth routes render", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: /get started|signup/i })).toBeVisible();

  await page.goto("/login");
  await expect(page.getByRole("button", { name: /login/i })).toBeVisible();

  await page.goto("/forgot-password");
  await expect(page.getByRole("button", { name: /send reset link/i })).toBeVisible();
});

test("protected routes render with real token", async ({ page, request }) => {
  const token = await getToken(request);

  await page.addInitScript((value) => {
    localStorage.setItem("uniconnect_token", value);
    localStorage.setItem("uniconnect_onboarding_complete", "true");
    localStorage.setItem(
      "uniconnect_user_profile",
      JSON.stringify({ fullName: "Playwright User", role: "admin" })
    );
  }, token);

  await page.goto("/events");
  await expect(page.getByRole("heading", { name: /event/i })).toBeVisible();

  await page.goto("/startups");
  await expect(page.getByRole("heading", { name: /startup/i })).toBeVisible();

  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: /admin panel/i })).toBeVisible();
});
