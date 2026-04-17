import { expect, test } from "@playwright/test";

/**
 * Comprehensive UI interaction audit
 * Tests navbar buttons, dropdowns, search, profile menu, and key page CTAs
 */

async function getToken(request) {
  const email = `qa.${Date.now()}@uniconnect.test`;

  const register = await request.post("http://localhost:5000/api/auth/register", {
    data: {
      fullName: "QA Tester",
      email,
      password: "password123",
      role: "student"
    }
  });

  const payload = await register.json();
  return payload.token;
}

test.describe("UI Button & Link Audit", () => {
  test("navbar: logo navigates to home", async ({ page, request }) => {
    const token = await getToken(request);

    await page.addInitScript((value) => {
      localStorage.setItem("uniconnect_token", value);
      localStorage.setItem("uniconnect_onboarding_complete", "true");
      localStorage.setItem("uniconnect_user_profile", JSON.stringify({ fullName: "QA Tester", role: "student" }));
    }, token);

    await page.goto("/events");
    await page.getByRole("link", { name: /uniconnect/i }).click();
    await expect(page).toHaveURL(/\/home/);
  });

  test("navbar: notifications button opens dropdown", async ({ page, request }) => {
    const token = await getToken(request);

    await page.addInitScript((value) => {
      localStorage.setItem("uniconnect_token", value);
      localStorage.setItem("uniconnect_onboarding_complete", "true");
      localStorage.setItem("uniconnect_user_profile", JSON.stringify({ fullName: "QA Tester", role: "student" }));
    }, token);

    await page.goto("/home");
    await page.getByRole("button", { name: /notifications/i }).click();
    await expect(page.getByText(/view all notifications/i)).toBeVisible();
  });

  test("navbar: profile menu button opens avatar menu", async ({ page, request }) => {
    const token = await getToken(request);

    await page.addInitScript((value) => {
      localStorage.setItem("uniconnect_token", value);
      localStorage.setItem("uniconnect_onboarding_complete", "true");
      localStorage.setItem("uniconnect_user_profile", JSON.stringify({ fullName: "QA Tester", role: "student" }));
    }, token);

    await page.goto("/home");
    await page.getByRole("button", { name: /qa tester/i }).click();
    await expect(page.getByRole("button", { name: /my profile/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /settings/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /logout/i })).toBeVisible();
  });

  test("navbar: profile menu -> my profile navigates", async ({ page, request }) => {
    const token = await getToken(request);

    await page.addInitScript((value) => {
      localStorage.setItem("uniconnect_token", value);
      localStorage.setItem("uniconnect_onboarding_complete", "true");
      localStorage.setItem("uniconnect_user_profile", JSON.stringify({ fullName: "QA Tester", role: "student" }));
    }, token);

    await page.goto("/home");
    await page.getByRole("button", { name: /qa tester/i }).click();
    await page.getByRole("button", { name: /my profile/i }).click();
    await expect(page).toHaveURL(/\/profile\/me/);
  });

  test("navbar: profile menu -> settings navigates", async ({ page, request }) => {
    const token = await getToken(request);

    await page.addInitScript((value) => {
      localStorage.setItem("uniconnect_token", value);
      localStorage.setItem("uniconnect_onboarding_complete", "true");
      localStorage.setItem("uniconnect_user_profile", JSON.stringify({ fullName: "QA Tester", role: "student" }));
    }, token);

    await page.goto("/home");
    await page.getByRole("button", { name: /qa tester/i }).click();
    await page.getByRole("button", { name: /settings/i }).click();
    await expect(page).toHaveURL(/\/settings/);
  });

  test("navbar: search input and suggestions work", async ({ page, request }) => {
    const token = await getToken(request);

    await page.addInitScript((value) => {
      localStorage.setItem("uniconnect_token", value);
      localStorage.setItem("uniconnect_onboarding_complete", "true");
      localStorage.setItem("uniconnect_user_profile", JSON.stringify({ fullName: "QA Tester", role: "student" }));
    }, token);

    await page.goto("/home");
    await page.getByPlaceholderText(/search events, users, startups/i).fill("Hackathon");
    await page.getByRole("button", { name: /hackathon/i }).click();
    await expect(page).toHaveURL(/\/search\?q=Hackathon/);
  });

  test("home: search link works", async ({ page, request }) => {
    const token = await getToken(request);

    await page.addInitScript((value) => {
      localStorage.setItem("uniconnect_token", value);
      localStorage.setItem("uniconnect_onboarding_complete", "true");
      localStorage.setItem("uniconnect_user_profile", JSON.stringify({ fullName: "QA Tester", role: "student" }));
    }, token);

    await page.goto("/home");
    await page.getByRole("link", { name: /search/i }).first().click();
    await expect(page).toHaveURL(/\/search/);
  });

  test("home: notifications link works", async ({ page, request }) => {
    const token = await getToken(request);

    await page.addInitScript((value) => {
      localStorage.setItem("uniconnect_token", value);
      localStorage.setItem("uniconnect_onboarding_complete", "true");
      localStorage.setItem("uniconnect_user_profile", JSON.stringify({ fullName: "QA Tester", role: "student" }));
    }, token);

    await page.goto("/home");
    await page.getByRole("link", { name: /notifications/i }).click();
    await expect(page).toHaveURL(/\/notifications/);
  });

  test("events page loads and renders", async ({ page, request }) => {
    const token = await getToken(request);

    await page.addInitScript((value) => {
      localStorage.setItem("uniconnect_token", value);
      localStorage.setItem("uniconnect_onboarding_complete", "true");
      localStorage.setItem("uniconnect_user_profile", JSON.stringify({ fullName: "QA Tester", role: "student" }));
    }, token);

    await page.goto("/events");
    await expect(page.getByRole("heading", { name: /event/i })).toBeVisible();
  });

  test("startups page loads and renders", async ({ page, request }) => {
    const token = await getToken(request);

    await page.addInitScript((value) => {
      localStorage.setItem("uniconnect_token", value);
      localStorage.setItem("uniconnect_onboarding_complete", "true");
      localStorage.setItem("uniconnect_user_profile", JSON.stringify({ fullName: "QA Tester", role: "student" }));
    }, token);

    await page.goto("/startups");
    await expect(page.getByRole("heading", { name: /startup/i })).toBeVisible();
  });

  test("notifications page loads and renders", async ({ page, request }) => {
    const token = await getToken(request);

    await page.addInitScript((value) => {
      localStorage.setItem("uniconnect_token", value);
      localStorage.setItem("uniconnect_onboarding_complete", "true");
      localStorage.setItem("uniconnect_user_profile", JSON.stringify({ fullName: "QA Tester", role: "student" }));
    }, token);

    await page.goto("/notifications");
    await expect(page.getByRole("heading", { name: /notification/i })).toBeVisible();
  });

  test("profile page loads and renders", async ({ page, request }) => {
    const token = await getToken(request);

    await page.addInitScript((value) => {
      localStorage.setItem("uniconnect_token", value);
      localStorage.setItem("uniconnect_onboarding_complete", "true");
      localStorage.setItem("uniconnect_user_profile", JSON.stringify({ fullName: "QA Tester", role: "student" }));
    }, token);

    await page.goto("/profile/me");
    await expect(page.locator("[data-testid='profile-owner']")).toBeVisible();
  });

  test("settings page loads and renders", async ({ page, request }) => {
    const token = await getToken(request);

    await page.addInitScript((value) => {
      localStorage.setItem("uniconnect_token", value);
      localStorage.setItem("uniconnect_onboarding_complete", "true");
      localStorage.setItem("uniconnect_user_profile", JSON.stringify({ fullName: "QA Tester", role: "student" }));
    }, token);

    await page.goto("/settings");
    await expect(page.getByRole("heading", { name: /setting/i })).toBeVisible();
  });
});
