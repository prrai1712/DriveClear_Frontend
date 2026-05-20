/**
 * E2E login (Firebase test phone). Run: cd frontend && node scripts/e2e-login.mjs
 */
import { chromium } from "playwright";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const PHONE = process.env.TEST_PHONE || "9876543210";
const OTP = process.env.TEST_OTP || "123456";
const NAME = "E2E Test User";

async function main() {
  const browser = await chromium.launch({
    headless: true,
    channel: "chrome",
  });
  const page = await browser.newPage();

  try {
    await page.goto(`${BASE}/login`, { waitUntil: "networkidle", timeout: 60000 });

    await page.locator('input[type="text"]').fill(NAME);
    await page.locator('input[type="tel"]').fill(PHONE);
    const devBtn = page.getByRole("button", { name: /Dev login/i });
    if (await devBtn.isVisible()) {
      await devBtn.click();
    } else {
      await page.locator('button[type="submit"]').click();
    }

    await page.waitForURL(/verify-otp/, { timeout: 60000 });
    await page.locator('input[inputmode="numeric"]').fill(OTP);
    await page.locator('button[type="submit"]').click();

    await page.waitForURL(/vehicle/, { timeout: 60000 });
    console.log("OK: logged in and reached /vehicle");
    process.exit(0);
  } catch (err) {
    const errText = await page.locator("p.text-red-400").first().textContent().catch(() => "");
    console.error("FAIL:", err.message);
    if (errText) console.error("Page error:", errText.trim());
    console.error("URL:", page.url());
    process.exit(1);
  } finally {
    await browser.close();
  }
}

main();
