import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage();
await page.goto("http://localhost:3000/login");
const status = await page.evaluate(async () => {
  try {
    const api =
      process.env.NEXT_PUBLIC_API_URL || "https://driveclearbackend-production.up.railway.app/api/v1";
    const r = await fetch(`${api.replace(/\/$/, "")}/health/`);
    return { ok: r.ok, status: r.status };
  } catch (e) {
    return { error: String(e) };
  }
});
console.log(status);
await browser.close();
