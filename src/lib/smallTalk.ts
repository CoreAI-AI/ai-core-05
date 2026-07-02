// Local (no-AI) responder for small-talk, greetings, thanks, bye, and
// tiny utility asks (calculator, word/character count). Saves AI credits.

const norm = (s: string) => s.trim().toLowerCase().replace(/[!?.,]+$/g, "");

const GREETINGS = [
  "hi", "hii", "hiii", "hello", "helo", "hey", "heyy", "yo",
  "namaste", "namaskar", "salaam", "salam", "assalamualaikum",
  "hlo", "hii there", "hello there", "gm", "good morning", "good afternoon",
  "good evening", "good night", "gn", "shubh prabhat", "shubh ratri",
];

const THANKS = [
  "thanks", "thank you", "thankyou", "ty", "thx", "tysm",
  "shukriya", "shukria", "dhanyavaad", "dhanyawad", "dhanyabad",
];

const BYES = [
  "bye", "byee", "goodbye", "good bye", "cya", "see ya", "see you",
  "alvida", "phir milenge", "tata",
];

const HOW_ARE_YOU = [
  "how are you", "how r u", "kaise ho", "kaisa hai", "kya haal hai",
  "kaise hain aap", "kaise ho aap", "sab theek", "sab thik",
];

const WHO_ARE_YOU = [
  "who are you", "what is your name", "your name", "tumhara naam",
  "aapka naam", "tum kaun ho", "aap kaun ho",
];

const WEBSITE_LINK = [
  "website link", "site link", "url of this website", "what is this website",
  "iss website ka link", "yeh website ka link", "website ka naam",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Returns a canned reply for trivial messages so we skip the AI call.
 * Returns null when the message needs the real model.
 */
export function tryLocalReply(raw: string): string | null {
  if (!raw) return null;
  const msg = norm(raw);
  if (msg.length === 0 || msg.length > 60) return null;

  if (GREETINGS.includes(msg)) {
    return pick([
      "Namaste! 👋 Kaise madad kar sakta hoon aaj?",
      "Hey! 😊 Kya jaanna chahenge?",
      "Hello! Batao, kis topic pe baat karni hai?",
    ]);
  }
  if (THANKS.some((t) => msg === t || msg.startsWith(t + " "))) {
    return pick([
      "Aapka swagat hai! 🙏 Aur kuch chahiye toh batao.",
      "Anytime! Happy to help. 😊",
    ]);
  }
  if (BYES.includes(msg)) {
    return pick([
      "Alvida! Jab bhi zarurat ho, wapas aa jaana. 👋",
      "Bye! Take care. 💙",
    ]);
  }
  if (HOW_ARE_YOU.some((p) => msg === p || msg.startsWith(p))) {
    return "Main bilkul theek hoon aur aapki madad ke liye ready hoon. ✨ Aap sunao?";
  }
  if (WHO_ARE_YOU.some((p) => msg.includes(p))) {
    return "Main **CoreAI** hoon — Prem Prasad ka banaya hua intelligent AI assistant.";
  }
  if (WEBSITE_LINK.some((p) => msg.includes(p))) {
    return "Yeh website hai: **https://coreaii.vercel.app/**";
  }

  // Tiny calculator: "2+2", "12 * 7", "100/4"
  const calc = raw.replace(/\s+/g, "").match(/^(-?\d+(?:\.\d+)?)([+\-*/x])(-?\d+(?:\.\d+)?)$/);
  if (calc) {
    const a = parseFloat(calc[1]);
    const b = parseFloat(calc[3]);
    const op = calc[2] === "x" ? "*" : calc[2];
    let out: number | string = "?";
    if (op === "+") out = a + b;
    else if (op === "-") out = a - b;
    else if (op === "*") out = a * b;
    else if (op === "/") out = b === 0 ? "∞ (divide by zero)" : a / b;
    return `= **${out}**`;
  }

  return null;
}
