// Public info pages (listed in sitemap) render without the splash/access-code gate so Google can crawl them.
// Everything else (chat and private tools) stays behind the gate.
export const PUBLIC_PAGES = [
  "/about", "/official-launch", "/features", "/faq", "/contact", "/privacy-policy",
  "/terms", "/free-ai-chatbot", "/ai-homework-helper", "/hindi-ai-assistant", "/plans", "/waitlist",
];

export const isPublicPath = (pathname: string) => {
  const p = pathname.replace(/\/+$/, "").toLowerCase() || "/";
  return PUBLIC_PAGES.includes(p);
};
