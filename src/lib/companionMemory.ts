// Zero-cost companion memory: stored only in this browser (localStorage). No server, no database.
const KEY = "coreai_companion_v1";

export interface FollowUp { topic: string; due: string; created: string; asked?: boolean }
export interface CompanionMemory { name?: string; facts: string[]; followUps: FollowUp[] }

const dayStr = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const loadMemory = (): CompanionMemory => {
  try {
    const m = JSON.parse(localStorage.getItem(KEY) || "{}");
    return { name: m.name, facts: Array.isArray(m.facts) ? m.facts : [], followUps: Array.isArray(m.followUps) ? m.followUps : [] };
  } catch { return { facts: [], followUps: [] }; }
};
const save = (m: CompanionMemory) => { try { localStorage.setItem(KEY, JSON.stringify(m)); } catch { /* ignore */ } };

const EVENT_WORDS = /(exam|paper|test|interview|result|match|presentation|viva|board|date|trip|operation|surgery|audition|competition|parikshaa?|pariksha)/i;

/** Learn name, facts and upcoming events from a user message. */
export const learnFromMessage = (text: string, now = new Date()): CompanionMemory => {
  const m = loadMemory();
  const t = text.trim();
  const name = t.match(/(?:mera naam|my name is|i am called|naam hai)\s+([A-Za-z\u0900-\u097F]{2,20})/i)?.[1];
  if (name && !/^(kya|what|nahi)$/i.test(name)) m.name = name;

  const fact = t.match(/(?:main|mai|i am|i'm|mein)\s+(class\s*\d{1,2}|\d{1,2}(?:th|st|nd|rd)\s*(?:class|grade)|college|engineering|neet|jee)[^.!?\n]{0,40}/i)?.[0]
    || t.match(/(?:meri|my)\s+[a-z]+\s+(?:weak|strong|kamzor)[^.!?\n]{0,30}/i)?.[0];
  if (fact && !m.facts.includes(fact)) m.facts = [...m.facts, fact].slice(-8);

  const ev = t.match(EVENT_WORDS);
  if (ev) {
    let offset = -1;
    if (/\b(kal|tomorrow)\b/i.test(t)) offset = 1;
    else if (/\b(parso|day after tomorrow)\b/i.test(t)) offset = 2;
    else if (/\b(aaj|today)\b/i.test(t)) offset = 1; // ask the next day how it went
    if (offset > 0) {
      const due = new Date(now); due.setDate(due.getDate() + offset);
      const topic = t.slice(0, 90);
      m.followUps = [...m.followUps.filter((f) => f.topic !== topic), { topic, due: dayStr(due), created: dayStr(now) }].slice(-5);
    }
  }
  save(m);
  return m;
};

/** Follow-ups due today or earlier that have not been asked yet. */
export const dueFollowUps = (now = new Date()) => loadMemory().followUps.filter((f) => !f.asked && f.due <= dayStr(now));

export const markFollowUpsAsked = (now = new Date()) => {
  const m = loadMemory();
  const today = dayStr(now);
  m.followUps = m.followUps.map((f) => (f.due <= today ? { ...f, asked: true } : f)).filter((f) => !f.asked || f.due >= today);
  save(m);
};

export const timeContext = (now = new Date()) => {
  const h = now.getHours();
  const day = now.toLocaleDateString("en-IN", { weekday: "long" });
  const part = h < 4 ? "late night (very late)" : h < 12 ? "morning" : h < 17 ? "afternoon" : h < 21 ? "evening" : "night";
  return `${day}, ${now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} (${part})`;
};

/** Short opening line for the chat screen (proactive follow-up). */
export const followUpGreeting = (now = new Date()) => {
  const due = dueFollowUps(now);
  if (!due.length) return null;
  const name = loadMemory().name;
  return `${name ? name + " bhai" : "Bhai"}, kal tumne bataya tha: "${due[0].topic}" — kaisa gaya? Aakar batana zaroor! 💚`;
};

/** Learn from the message and build the private context sent with this request only. */
export const buildCompanionContext = (message: string, now = new Date()): string => {
  const m = learnFromMessage(message, now);
  const due = dueFollowUps(now);
  const parts = [`User local time: ${timeContext(now)}.`];
  if (m.name) parts.push(`User's name: ${m.name}.`);
  if (m.facts.length) parts.push(`Remembered about user: ${m.facts.join("; ")}.`);
  if (due.length) parts.push(`PENDING FOLLOW-UP (ask warmly how it went, at the start of your reply): ${due.map((f) => `"${f.topic}" (said on ${f.created})`).join("; ")}.`);
  if (due.length) markFollowUpsAsked(now);
  return parts.join(" ").slice(0, 1200);
};
