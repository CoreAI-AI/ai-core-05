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

const getSavedFaith = (): string => {
  try {
    const rawDemo = localStorage.getItem('user_settings_demo');
    if (rawDemo) {
      const parsed = JSON.parse(rawDemo);
      if (parsed.faithPreference) return parsed.faithPreference;
    }
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('user_settings_')) {
        const parsed = JSON.parse(localStorage.getItem(key) || '{}');
        if (parsed.faithPreference) return parsed.faithPreference;
      }
    }
  } catch {
    /* fallback */
  }
  return 'universal';
};

/** Short opening line for the chat screen (proactive follow-up with faith-respectful greeting). */
export const followUpGreeting = (now = new Date()) => {
  const due = dueFollowUps(now);
  if (!due.length) return null;
  const name = loadMemory().name;
  const faith = getSavedFaith();
  
  let prefix = "";
  if (faith === 'islam') {
    prefix = name ? `Assalamu Alaikum ${name} bhaijaan!` : "Assalamu Alaikum bhaijaan!";
  } else if (faith === 'sikhism') {
    prefix = name ? `Sat Sri Akaal ${name} veerji!` : "Sat Sri Akaal veerji!";
  } else if (faith === 'hinduism') {
    prefix = name ? `Namaste ${name} ji!` : "Namaste dost!";
  } else if (faith === 'christianity') {
    prefix = name ? `Peace be with you ${name}!` : "Peace be with you friend!";
  } else if (faith === 'jainism_buddhism') {
    prefix = name ? `Jai Jinendra ${name} ji!` : "Jai Jinendra dost!";
  } else {
    prefix = name ? `Namaste ${name} bhai!` : "Namaste dost!";
  }

  return `${prefix} Kal aapne bataya tha: "${due[0].topic}" — kaisa raha? Aakar batana zaroor! 💚`;
};

export const addManualFact = (factText: string) => {
  const trimmed = factText.trim();
  if (!trimmed) return;
  const m = loadMemory();
  if (!m.facts.includes(trimmed)) {
    m.facts = [...m.facts, trimmed].slice(-15);
    save(m);
  }
};

export const removeFact = (index: number) => {
  const m = loadMemory();
  m.facts = m.facts.filter((_, i) => i !== index);
  save(m);
};

export const clearAllMemoryFacts = () => {
  const m = loadMemory();
  m.facts = [];
  m.followUps = [];
  save(m);
};

/** Active Personality context builder helper */
const getPersonalityInstruction = (preset?: string): string => {
  switch (preset) {
    case 'mentor':
      return "Role: Professional Mentor. Be structured, analytical, objective, and action-oriented.";
    case 'teacher':
      return "Role: Patient Teacher. Explain concepts step-by-step with simple analogies and clear examples.";
    case 'creative':
      return "Role: Creative Thinker. Be imaginative, expressive, poetic when suitable, and offer unique angles.";
    case 'technical':
      return "Role: Senior Technical Expert. Direct code/answers first, high precision, zero pleasantries or fluff.";
    case 'friend':
    default:
      return "Role: Empathetic Best Friend (Dost). Warm, caring, respectful, natural Hindi/Hinglish, emotionally supportive.";
  }
};

/** 
 * Faith & Cultural greeting & balanced language guidelines:
 * Uses cultural terms & blessings naturally, but strictly avoids speaking 100% in another language.
 */
const getFaithInstruction = (faith?: string): string => {
  switch (faith) {
    case 'islam':
      return "CULTURAL & FAITH CONTEXT: User practices Islam. Always greet with 'Assalamu Alaikum' or 'Salam'. Respond in natural, warm conversational Hindi/Hinglish, naturally blending Islamic polite terms & blessings (InshaAllah, Alhamdulillah, MashaAllah, JazakAllah, Bhaijaan, Dua). STRICT RULE: Do NOT speak 100% Arabic or heavy archaic Urdu; keep sentences simple, friendly, modern, and readable.";
      
    case 'hinduism':
      return "CULTURAL & FAITH CONTEXT: User practices Hinduism. Always greet with 'Namaste' or 'Pranam'. Respond in natural, warm conversational Hindi/Hinglish, naturally blending cultural warmth & blessings (Shubh-kamnayein, Ishwar/Prabhu kripa, Aashirwad, Parishram, Dhyan rakhiye). STRICT RULE: Do NOT use pure heavy Sanskrit; keep language conversational and easy to understand.";
      
    case 'sikhism':
      return "CULTURAL & FAITH CONTEXT: User is Sikh. Always greet with 'Sat Sri Akaal'. Respond in warm, respectful Hindi/Hinglish infused with Punjabi warmth & spirit (Waheguru di mehar, Chardi Kala, Veerji/Veere, Shukrana, Fateh). STRICT RULE: Do NOT use full difficult Gurmukhi; keep sentences accessible in standard Hindi/Hinglish.";
      
    case 'christianity':
      return "CULTURAL & FAITH CONTEXT: User is Christian. Always greet with 'Peace be with you' or 'Hello & Blessings'. Respond in natural, comforting Hindi/Hinglish/English with compassion and grace (God bless you, Duayein, Grace, Prabhu Yeshu/God ki kripa). STRICT RULE: Use modern, uplifting everyday language, avoiding ancient or archaic phrasing.";
      
    case 'jainism_buddhism':
      return "CULTURAL & FAITH CONTEXT: User follows Jainism/Buddhism. Greet with 'Jai Jinendra' or 'Namo Buddhaya / Om Shanti'. Respond with serene warmth emphasizing peace, mindfulness, ahimsa, and karuna (Mangal bhavnayein, Dhairya, Mann shant rakhiye) in simple, peaceful Hindi/Hinglish.";
      
    case 'universal':
    default:
      return "CULTURAL & FAITH CONTEXT: Universal/Neutral. Greet warmly with 'Namaste' or 'Hello' in friendly, natural Hindi/Hinglish.";
  }
};

/** Learn from the message and build the private context sent with this request only. */
export const buildCompanionContext = (message: string, now = new Date()): string => {
  const m = learnFromMessage(message, now);
  const due = dueFollowUps(now);
  const parts = [`User local time: ${timeContext(now)}.`];
  
    // Read active personality, custom instructions & faith preference from localStorage (Zero cost)
  try {
    // 1. Direct Faith Preference has absolute priority
    const directFaith = localStorage.getItem('coreai_faith_preference');

    // 2. Read user settings for other preferences
    let userSettings: any = null;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('user_settings_')) {
        try {
          const parsed = JSON.parse(localStorage.getItem(key) || '{}');
          if (parsed && Object.keys(parsed).length > 0) {
            userSettings = parsed;
            break;
          }
        } catch { /* continue */ }
      }
    }

    if (userSettings) {
      if (userSettings.personalityPreset) {
        parts.push(`PERSONALITY: ${getPersonalityInstruction(userSettings.personalityPreset)}`);
      }
      const activeFaith = directFaith || userSettings.faithPreference;
      if (activeFaith) {
        parts.push(getFaithInstruction(activeFaith));
      }
    } else if (directFaith) {
      parts.push(getFaithInstruction(directFaith));
    }
>>>>

      if (userSettings.customAboutMe?.trim()) {
        parts.push(`ABOUT USER: ${userSettings.customAboutMe.trim()}`);
      }
      if (userSettings.customResponseStyle?.trim()) {
        parts.push(`RESPONSE PREFERENCE: ${userSettings.customResponseStyle.trim()}`);
      }
      if (userSettings.responseLength) {
        parts.push(`LENGTH: Prefer ${userSettings.responseLength} replies.`);
      }
    }
  } catch {
    /* fallback to default friend */
  }

  if (m.name) parts.push(`User's name: ${m.name}.`);
  if (m.facts.length) parts.push(`Remembered about user: ${m.facts.join("; ")}.`);
  if (due.length) parts.push(`PENDING FOLLOW-UP (ask warmly how it went): ${due.map((f) => `"${f.topic}"`).join("; ")}.`);
  if (due.length) markFollowUpsAsked(now);
  
  return parts.join(" ").slice(0, 1600);
};
