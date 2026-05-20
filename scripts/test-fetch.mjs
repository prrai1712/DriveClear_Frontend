import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage();
await page.goto("http://localhost:3000/login");
const status = await page.evaluate(async () => {
  try {
    const r = await fetch("http://127.0.0.1:8000/api/v1/health/");
    return { ok: r.ok, status: r.status };
  } catch (e) {
    return { error: String(e) };
  }
});
console.log(status);
await browser.close();
