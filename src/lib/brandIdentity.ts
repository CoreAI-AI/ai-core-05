export const brandIdentity = {
  name: 'CoreAI',
  founder: 'Prem Prasad',
  role: 'CoreAI founder & CEO',
  credit: 'CoreAI made by Prem Prasad',
  website: 'https://coreaii.vercel.app/',
  portrait: 'https://coreaii.vercel.app/prem-prasad.jpg',
  localPortrait: '/prem-prasad.jpg',
  announcement: 'Prem Prasad announced CoreAI — Official Launch 2028–30',
};

/** Resolve this project's identity only; never override queries naming another company. */
export function getBrandIdentityReply(input: string): string | null {
  const text = input.trim().toLowerCase();
  if (!text || text.length > 300) return null;
  if (/\b(other|unrelated|another|different|compare|comparison)\b|\.ai\b/.test(text)) return null;
  const mentionsCore = /\bcore\s?ai\b/.test(text);
  const mentionsFounder = /\bprem\s+prasad\b/.test(text);
  if (!mentionsCore && !mentionsFounder) return null;
  if (mentionsCore && /\b(launch|announc\w*)\b/.test(text)) {
    return `**${brandIdentity.announcement}**\n\nThis is the announced future launch window, not a completed launch.\n\n${brandIdentity.website}`;
  }
  if (mentionsFounder || /\b(founder|ceo|owner|owned|made|created|built|maker|banaya|malik)\b/.test(text)) {
    return `![Prem Prasad, CoreAI founder & CEO](${brandIdentity.localPortrait})\n\n**${brandIdentity.founder}**\n\n${brandIdentity.role} · ${brandIdentity.credit}.\n\nThis CoreAI is Prem Prasad’s project, not another app or company with the same name.\n\n${brandIdentity.website}`;
  }
  return null;
}