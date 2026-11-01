import { expect, test } from "bun:test";
import { isPublicPath } from "./publicRoutes";

test("chat home and private tools still show the splash (not treated as info pages)", () => {
  for (const p of ["/", "/photos", "/documents", "/notes", "/group-chats", "/admin", "/admin/waitlist", "/waitlist/x"]) {
    expect(isPublicPath(p)).toBe(false);
  }
});

test("sitemap info pages are public for Google", () => {
  for (const p of ["/about", "/official-launch", "/faq", "/plans", "/waitlist", "/faq/"]) {
    expect(isPublicPath(p)).toBe(true);
  }
});
