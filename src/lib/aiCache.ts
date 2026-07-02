// Lightweight response cache. Avoids re-calling the AI when the same
// (message + mode + model) pair was already answered recently.

const KEY = "coreai_ai_cache_v1";
const MAX_ENTRIES = 80;
const TTL_MS = 1000 * 60 * 60 * 24 * 3; // 3 days

type Entry = { q: string; a: string; t: number };

function load(): Entry[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(entries: Entry[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(entries.slice(-MAX_ENTRIES)));
  } catch {
    /* quota — ignore */
  }
}

function key(message: string, mode: string, model: string) {
  return `${mode}::${model}::${message.trim().toLowerCase()}`;
}

export function getCached(message: string, mode: string, model: string): string | null {
  const k = key(message, mode, model);
  const now = Date.now();
  const entries = load();
  const hit = entries.find((e) => e.q === k && now - e.t < TTL_MS);
  return hit ? hit.a : null;
}

export function setCached(message: string, mode: string, model: string, answer: string) {
  if (!answer || answer.length < 4 || answer.length > 6000) return;
  const k = key(message, mode, model);
  const entries = load().filter((e) => e.q !== k);
  entries.push({ q: k, a: answer, t: Date.now() });
  save(entries);
}

/** Modes/messages we should NEVER cache (dynamic or media). */
export function isCacheable(message: string, mode: string): boolean {
  if (!message || message.length > 500) return false;
  if (["photo", "deep-search", "deep_search", "image"].includes(mode)) return false;
  // Skip time-sensitive queries
  if (/\b(today|abhi|current|now|latest|aaj|kal|breaking|news|score|weather|mausam)\b/i.test(message)) return false;
  return true;
}
