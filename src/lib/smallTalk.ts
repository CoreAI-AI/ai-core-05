// Local (no-AI) responder for small-talk, greetings, thanks, bye, and
// tiny utility asks. Saves AI credits and enforces mode persona.

import { getBrandIdentityReply } from './brandIdentity';

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

const MODE_GREETINGS: Record<string, string[]> = {
  'recipe': [
    "Namaste! 🍳 Main CoreAI Cooking Assistant hoon. Aaj aap kya banana chahenge? Koi recipe, diet meal, ya kitchen ke bache ingredients se kuch naya?",
    "Hello Chef! 🍲 Aaj kya special pakayein? Dish ka naam batayein ya ingredients share karein!"
  ],
  'code': [
    "Hello! 💻 Code Assistant active hai. Aaj kis language, bug ya project pe kaam karna hai? Code debugging, logic ya architecture?",
    "Hey Dev! 🚀 Kaunsa code likhna ya debug karna hai? Language aur requirement batayein."
  ],
  'study': [
    "Hello! 📚 Study Notes Assistant ready hai. Aaj kaunsa subject ya chapter padhna hai? Quick revision notes banayein ya concepts samjhein?",
    "Namaste! 📖 Kaunsa topic prepare karna hai? Main simplified notes aur summaries bana sakta hoon."
  ],
  'homework': [
    "Hello! 📝 Homework Helper mode active hai. Kaunsa question ya assignment solve karna hai? Sawal type karein ya photo bhejein!",
    "Hey! ✍️ Homework mein kya dikkat aa rahi hai? Question share karein, step-by-step solve karte hain."
  ],
  'photo': [
    "Hello! 🎨 Image Studio ready hai. Aap kis cheez ki 4K photo, digital art ya poster generate karna chahte hain? Apna prompt likhein!",
    "Namaste! 🖼️ Kaisi image banani hai? Subject, style aur lighting describe karein!"
  ],
  'deep-search': [
    "Hello! 🔍 Deep Search mode active hai. Kis topic pe aapko in-depth analysis, structured sections aur research report chahiye?",
    "Hey! 🌐 Kis subject par deep analytical research karni hai? Topic batayein."
  ],
  'creative': [
    "Hello! ✍️ Creative Writing Studio ready hai. Aaj kya likhna chahenge — story, kavita, script, ya essay?",
    "Namaste! 🎭 Kis theme par creative writeup chahiye? Apna concept batayein."
  ],
  'analyze': [
    "Hello! 📊 Analyzer active hai. Kaunsa text, data ya document breakdown aur summarize karna hai?",
    "Hey! 📈 Kis content ka key insights aur critical summary banana hai?"
  ],
  'rich': [
    "Hello! 💼 Executive Strategy & Wealth Advisory active hai. Market analysis, business scaling ya high-level consultation?",
    "Welcome! 💎 Luxury markets, high-tier business decisions ya portfolio strategy mein kya discuss karna hai?"
  ],
  'poor': [
    "Namaste! 🪙 Smart Budget & Savings Advisor active hai. Expense cut, daily savings ya affordable alternatives mein kya madad karoon?",
    "Hello! 💡 Paise bachane ka smart tareeqa ya pocket-friendly options dhoondhein?"
  ],
   'normal': [
    "Namaste! 👋 Kaise madad kar sakta hoon aaj?",
    "Hey! 😊 Kya jaanna chahenge?",
    "Hello! Batao, kis topic pe baat karni hai?"
  ]
};

// Faith-specific instant greetings (Zero latency & ₹0 cost)
const FAITH_GREETINGS: Record<string, string[]> = {
  islam: [
    "Assalamu Alaikum! 🌙 Kaise madad kar sakta hoon aaj?",
    "Walaikum Assalam! 😊 Bataiye aaj kya karna hai?",
    "Assalamu Alaikum wa Rahmatullahi wa Barakatuhu! ✨ Khushi hui aap se baat karke. Bataiye aaj kya seekhna ya karna chahte hain?"
  ],
  hinduism: [
    "Namaste! 🙏 Shubh din! Kaise madad kar sakta hoon aaj?",
    "Pranam! 🕉️ Bataiye aaj kis vishay par baat karni hai?",
    "Namaste ji! 😊 Ishwar kripa bani rahe. Aaj main aapki kya sahayata karoon?"
  ],
  sikhism: [
    "Sat Sri Akaal! ⚔️ Chardi Kala! Kaise madad kar sakta hoon aaj?",
    "Waheguru ji ka Khalsa, Waheguru ji ki Fateh! ✨ Bataiye aaj kya madad karoon?",
    "Sat Sri Akaal ji! 😊 Veerji batao aaj ki seva kariye?"
  ],
  christianity: [
    "Peace be with you! ✝️ How can I help you today?",
    "Hello and blessings! ✨ May peace be upon your day. How can I assist you today?",
    "Hello! God bless you. 😊 How can I support you today?"
  ],
  jainism_buddhism: [
    "Jai Jinendra! 🌸 Michhami Dukkadam / Namaste! Kaise madad kar sakta hoon aaj?",
    "Om Shanti! 🕊️ Shanti aur sadbhavna ke sath swagat hai. Bataiye kya madad karoon?",
    "Namo Buddhaya! 🌿 Sadbhav aur shaanti ke saath, bataiye aaj kya seva karein?"
  ],
  universal: [
    "Namaste! 👋 Kaise madad kar sakta hoon aaj?",
    "Hey! 😊 Kya jaanna chahenge?",
    "Hello! Batao, kis topic pe baat karni hai?"
  ]
};

const FAITH_THANKS: Record<string, string[]> = {
  islam: [
    "JazakAllah Khair! 🙏 Hamesha aapki madad ke liye hazir hoon.",
    "Alhamdulillah, khushi hui ki aapka kaam hua! 😊 Aur koi sawal ho toh zaroor batayein."
  ],
  hinduism: [
    "Aapka swagat hai! 🙏 Prabhu kripa bani rahe.",
    "Dhanyavaad! Khushi hui ki main aapke kaam aa saka. 😊"
  ],
  sikhism: [
    "Waheguru mehar kare! 🙏 Aapka shukrana, hamesha tayaar hoon.",
    "Bohat shukriya veerji! Hamesha chardi kala mein rahein. 😊"
  ],
  christianity: [
    "You are most welcome! 🙏 God bless you on your journey.",
    "Always happy to help! Grace and peace to you. 😊"
  ],
  jainism_buddhism: [
    "Aapka aabhaar! 🙏 Shanti aur ahimsa ka marg hamesha mangalmaye ho.",
    "Om Shanti! Mangal ho aapka. 😊"
  ],
  universal: [
    "Aapka swagat hai! 🙏 Aur kuch chahiye toh batao.",
    "Anytime! Happy to help. 😊"
  ]
};

const FAITH_BYES: Record<string, string[]> = {
  islam: [
    "Khuda Hafiz! Allah tala aapko salamat aur khush rakhe. Jab bhi zarurat ho, wapas aa jaana. 👋",
    "Fi Amanillah! Duaon mein yaad rakhna. 🌙 Take care!"
  ],
  hinduism: [
    "Shubh alvida! Ishwar aapko safalta aur achhi sehat dein. Phir milenge! 👋",
    "Namaste! Apna dhyan rakhiyega. 🕉️"
  ],
  sikhism: [
    "Alvida ji! Waheguru hamesha ang-sang sahai hon. Chardi kala vich raho! 👋",
    "Sat Sri Akaal! Rab rakha. ⚔️"
  ],
  christianity: [
    "Goodbye! May God's peace and grace be with you always. Take care! 👋",
    "Peace be with you! See you soon. ✝️"
  ],
  jainism_buddhism: [
    "Om Shanti! 🕊️ Aapka din shaant aur mangalkari ho. Phir milenge! 👋",
    "Jai Jinendra! Mann mein sadbhavna banaye rakhein. 🌸"
  ],
  universal: [
    "Alvida! Jab bhi zarurat ho, wapas aa jaana. 👋",
    "Bye! Take care. 💙"
  ]
};

export const getActiveFaith = (): string => {
  try {
    const direct = localStorage.getItem('coreai_faith_preference');
    if (direct) return direct;
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('user_settings_')) {
        const p = JSON.parse(localStorage.getItem(k) || '{}');
        if (p.faithPreference) return p.faithPreference;
      }
    }
  } catch {
    /* fallback */
  }
  return 'universal';
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Returns a canned reply for trivial messages based on mode & faith so we skip the AI call.
 */
export function tryLocalReply(raw: string, mode: string = 'normal'): string | null {
  if (!raw) return null;
  const identity = getBrandIdentityReply(raw);
  if (identity) return identity;
  const msg = norm(raw);
  if (msg.length === 0 || msg.length > 80) return null;

  const currentFaith = getActiveFaith();

  if (GREETINGS.includes(msg)) {
    if (mode !== 'normal' && MODE_GREETINGS[mode]) {
      return pick(MODE_GREETINGS[mode]);
    }
    const faithList = FAITH_GREETINGS[currentFaith] || FAITH_GREETINGS['universal'];
    return pick(faithList);
  }

  if (THANKS.some((t) => msg === t || msg.startsWith(t + " "))) {
    const thanksList = FAITH_THANKS[currentFaith] || FAITH_THANKS['universal'];
    return pick(thanksList);
  }

  if (BYES.includes(msg)) {
    const byesList = FAITH_BYES[currentFaith] || FAITH_BYES['universal'];
    return pick(byesList);
  }
>>>>
  
  if (HOW_ARE_YOU.some((p) => msg === p || msg.startsWith(p))) {
    return "Main bilkul theek hoon aur aapki madad ke liye ready hoon. ✨ Aap sunao?";
  }
  if (WHO_ARE_YOU.some((p) => msg.includes(p))) {
    return "Main **CoreAI** hoon — **Prem Prasad, CoreAI founder & CEO**, ka banaya hua AI assistant.";
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

const SUB_PATTERNS: RegExp[] = [
  /\b(buy|purchase|get|want|need|take|lena|lunga|loonga|chahiye|chahta|khareed|kharid)\b.*\b(subscription|premium|plan|pro|paid|upgrade|membership)\b/i,
  /\b(subscription|premium|plan|pro|paid|upgrade|membership)\b.*\b(buy|purchase|lena|lunga|loonga|chahiye|chahta|khareed|kharid|price|cost|kitna|kitne|how much)\b/i,
  /\b(upgrade|subscribe)\s+(to\s+)?(premium|pro|plan)?/i,
  /\bpremium\s+(kaise|how)\b/i,
  /\bhow\s+(much|to)\b.*\b(premium|subscription|plan|upgrade)\b/i,
  /\b(premium|subscription)\s+(price|cost|pricing|kitna|kitne|charges?)\b/i,
  /\b(pricing|plans)\b/i,
  /\b(paid\s+plan|paid\s+version)\b/i,
  /\bcore\s?ai\s+premium\b/i,
  /\b(premium|subscription|membership)\b.*\b(dikhao|dikha|batao|bata|show|details|info|about|renew|cancel|manage)\b/i,
  /\b(renew|cancel|manage|restore)\b.*\b(premium|subscription|plan|membership)\b/i,
  /\b(premium|subscription)\s+(lena|lu|lunga|loonga|chahiye)\b/i,
  /\b(show|open|display|dikhao|dikha|batao)\b.*\b(all\s+)?plans?\b/i,
  /\b(plans?)\b.*\b(again|repeat|one\s+more\s+time|phir|fir|dobara|wapas)\b/i,
  /\b(one\s+more\s+time|again|phir\s+se|fir\s+se|ek\s+baar\s+phir|dobara)\b.*\b(plans?|premium|subscription)\b/i,
];

export function detectSubscriptionIntent(input: string): boolean {
  const t = input.trim();
  if (!t || t.length > 200) return false;
  return SUB_PATTERNS.some((r) => r.test(t));
}
