// Detects whether a user prompt (given attached images) is an edit request.
// Used to route uploads through the image-edit path instead of pure chat/gen.

const EDIT_KEYWORDS: string[] = [
  // English
  'remove background', 'transparent background', 'no background',
  'change dress', 'change clothes', 'change outfit', 'change background',
  'replace background', 'add object', 'remove object', 'add text',
  'improve quality', 'enhance quality', 'make hd', 'upscale', 'high res',
  'make realistic', 'photorealistic', 'realistic',
  'create poster', 'make poster', 'poster',
  'edit this', 'edit image', 'edit photo', 'edit picture',
  'change style', 'restyle', 'stylize',
  'extend image', 'expand image', 'outpaint',
  'resize', 'crop',
  'retouch', 'restore', 'colorize',
  // Hindi / Hinglish
  'background hatao', 'background remove karo', 'background badlo',
  'dress badlo', 'kapde badlo', 'outfit badlo',
  'chehra badlo', 'face change',
  'quality badhao', 'hd banao', 'saaf karo', 'clear karo',
  'realistic banao', 'assli banao',
  'poster banao',
  'ise edit karo', 'isko edit karo', 'edit kar do',
  'style badlo',
  'text add karo', 'likh do',
  'object hatao', 'object add karo',
];

export const detectImageEditIntent = (
  prompt: string,
  attachmentCount: number
): boolean => {
  if (attachmentCount < 1) return false;
  if (!prompt) return true; // has image + no text → treat as "do something with it"
  const p = prompt.toLowerCase();
  return EDIT_KEYWORDS.some((k) => p.includes(k));
};

export const EDIT_INTENT_KEYWORDS = EDIT_KEYWORDS;
