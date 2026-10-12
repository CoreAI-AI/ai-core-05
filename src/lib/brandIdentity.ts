export const brandIdentity = {
  name: 'CoreAI',
  founder: 'Prem Prasad',
  role: 'CoreAI founder & CEO',
  credit: 'CoreAI made by Prem Prasad',
  website: 'https://coreaii.vercel.app/',
  product: 'coreaii.vercel.app',
  birthDate: '2010-08-04',
  birthDateLabel: '4 August 2010',
  portrait: 'https://coreaii.vercel.app/prem-prasad.jpg',
  localPortrait: '/prem-prasad.jpg',
  announcement: 'Prem Prasad announced CoreAI — Official Launch 2028–30',
  publicLaunch: '2028–30 (upcoming, not yet launched)',
  brothers: ['Dipak Prasad', 'Manish Prasad'],
  mother: 'Lakhi Devi',
  father: 'Ajay Prasad',
  grandfather: 'Shri Krishun Prasad',
  grandmother: 'Shrimati Gulabi Devi',
  city: 'Kolkata, West Bengal',
  nationality: 'Indian',
  instagram: 'https://www.instagram.com/_coreaii',
  mission: 'Building the next frontier of artificial intelligence, engineered to outperform ChatGPT.',
};

const has = (text: string, re: RegExp) => re.test(text);

/** Resolve this project's identity only; never override queries naming another company. */
export function getBrandIdentityReply(input: string): string | null {
  const text = input.trim().toLowerCase();
  if (!text || text.length > 300) return null;
  if (/\b(other|unrelated|another|different|compare|comparison)\b|\.ai\b/.test(text)) return null;
  const mentionsCore = /\bcore\s?ai\b/.test(text);
  const mentionsFounder = /\bprem(\s+prasad)?\b/.test(text) && /\bprem\s+prasad\b|\bprem\b.*\b(bhai|brother|mother|father|mummy|papa|dada|dadi|grand\w*)/.test(text);
  const aboutFounder = mentionsFounder || (mentionsCore && /\b(founder|ceo|owner|malik)\b/.test(text));
  if (!mentionsCore && !mentionsFounder) return null;

  const b = brandIdentity;
  const wantsBrothers = has(text, /\b(brothers?|bhai|bhaiyo|bhaiyon|siblings?|bhaai)\b/);
  const wantsMother = has(text, /\b(mother|mom|mummy|mumma|maa|mata|mataji|amma)\b/);
  const wantsFather = has(text, /\b(father|dad|daddy|papa|pita|pitaji|baba)\b/);
  const wantsFamily = has(text, /\b(family|parivar|parents)\b/);

  if (aboutFounder && has(text, /\b(dada|dadi|grand\w*|nana|nani)\b/)) {
    return `${b.founder} ke Dada ji **${b.grandfather}** aur Dadi ji **${b.grandmother}** hain.`;
  }
  if (aboutFounder && has(text, /\b(where|kahan|kaha|city|hometown|from|rehte|location|nationality|country)\b/)) {
    return `${b.founder} **${b.city}** se hain. Nationality: **${b.nationality}**.`;
  }
  if (has(text, /\b(instagram|insta|social)\b/) && (aboutFounder || mentionsCore)) {
    return `Official Instagram: ${b.instagram}`;
  }
  if (mentionsCore && has(text, /\b(mission|vision|aim|goal|maqsad|purpose)\b/)) {
    return `**CoreAI mission:** ${b.mission}`;
  }
  if (aboutFounder && (wantsBrothers || wantsMother || wantsFather || wantsFamily)) {
    const lines: string[] = [];
    if (wantsFamily || (wantsMother && wantsFather) || has(text, /\bparents\b/)) {
      lines.push(`Father: **${b.father}**`, `Mother: **${b.mother}**`);
      if (wantsFamily || wantsBrothers) lines.push(`Brothers: **${b.brothers.join('** & **')}**`);
      return `${b.founder} ki family:\n\n- ${lines.join('\n- ')}`;
    }
    if (wantsBrothers) lines.push(`${b.founder} ke brothers **${b.brothers.join('** aur **')}** hain.`);
    if (wantsMother) lines.push(`${b.founder} ki mother ka naam **${b.mother}** hai.`);
    if (wantsFather) lines.push(`${b.founder} ke father ka naam **${b.father}** hai.`);
    return lines.join('\n\n');
  }

  if (has(text, /\b(age|old|umar|umra|born|birth\w*|dob|janam\w*)\b/) && aboutFounder) {
    return `${b.founder} ka date of birth **${b.birthDateLabel}** hai.`;
  }
  if (mentionsCore && has(text, /\b(launch|announc\w*)\b/)) {
    return `**${b.announcement}**\n\nPublic launch: ${b.publicLaunch}. This is the announced future launch window, not a completed launch.\n\n${b.website}`;
  }
  if (aboutFounder || has(text, /\b(founder|ceo|owner|owned|made|created|built|maker|banaya|malik)\b/)) {
    return `![Prem Prasad, CoreAI founder & CEO](${b.localPortrait})\n\n**${b.founder}**\n\n${b.role} · ${b.credit}.\n\nThis CoreAI is Prem Prasad’s project, not another app or company with the same name.\n\n${b.website}`;
  }
  return null;
}
