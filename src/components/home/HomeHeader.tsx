import { SiteHeader } from "./SiteHeader";

/** Logged-in app shell header (vehicle search, etc.) */
export function HomeHeader() {
  return <SiteHeader ctaHref="/orders" ctaLabel="My orders" />;
}
