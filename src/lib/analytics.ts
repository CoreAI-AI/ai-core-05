// Lightweight analytics helper. Logs to console, dispatches a window event,
// and persists the last N events to localStorage so we can inspect drop-off.

export type AnalyticsEvent =
  | "intro_viewed"
  | "intro_skipped"
  | "intro_completed"
  | "intro_slide_viewed";

const STORAGE_KEY = "coreai_analytics_events";
const MAX_EVENTS = 200;

export function track(event: AnalyticsEvent, props: Record<string, any> = {}) {
  const payload = {
    event,
    props,
    ts: new Date().toISOString(),
    url: typeof window !== "undefined" ? window.location.pathname : "",
  };

  try {
    // eslint-disable-next-line no-console
    console.info("[analytics]", event, props);

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("coreai:analytics", { detail: payload }));

      const raw = localStorage.getItem(STORAGE_KEY);
      const list = raw ? JSON.parse(raw) : [];
      list.push(payload);
      const trimmed = list.slice(-MAX_EVENTS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));

      // Forward to gtag if present
      const gtag = (window as any).gtag;
      if (typeof gtag === "function") {
        gtag("event", event, props);
      }
    }
  } catch {
    // swallow — analytics must never break the app
  }
}

export function getRecentEvents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
