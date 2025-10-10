export interface Model {
  id: string;
  name: string;
  provider: string;
  description: string;
  category?: 'text' | 'image' | 'video' | 'audio';
}

export const AVAILABLE_MODELS: Model[] = [
  // OpenAI Models
  {
    id: 'openai/gpt-5',
    name: 'GPT-5',
    provider: 'OpenAI',
    description: 'Most capable model for complex reasoning and tasks',
    category: 'text'
  },
  {
    id: 'openai/gpt-5-mini',
    name: 'GPT-5 Mini',
    provider: 'OpenAI',
    description: 'Balanced performance and speed',
    category: 'text'
  },
  {
    id: 'openai/gpt-5-nano',
    name: 'GPT-5 Nano',
    provider: 'OpenAI',
    description: 'Fastest, most cost-effective option',
    category: 'text'
  },
  {
    id: 'openai/gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    description: 'Multimodal model with text, image, and audio processing',
    category: 'text'
  },
  {
    id: 'openai/gpt-4.1-mini',
    name: 'GPT-4.1 Mini',
    provider: 'OpenAI',
    description: 'Lightweight variant optimized for efficiency',
    category: 'text'
  },
  {
    id: 'openai/whisper',
    name: 'Whisper',
    provider: 'OpenAI',
    description: 'Speech-to-text transcription for multiple languages',
    category: 'audio'
  },
  {
    id: 'openai/gpt-oss',
    name: 'GPT-OSS',
    provider: 'OpenAI',
    description: 'Open-weight model for customization and local deployment',
    category: 'text'
  },
  
  // Google Models
  {
    id: 'google/gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    provider: 'Google',
    description: 'Top-tier model for complex reasoning and multimodal tasks',
    category: 'text'
  },
  {
    id: 'google/gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'Google',
    description: 'Balanced speed and capability',
    category: 'text'
  },
  {
    id: 'google/gemini-2.5-flash-lite',
    name: 'Gemini 2.5 Flash Lite',
    provider: 'Google',
    description: 'Fastest for classification and simple tasks',
    category: 'text'
  },
  {
    id: 'google/gemini-2.5-flash-image-preview',
    name: 'Gemini Image (Nano Banana)',
    provider: 'Google',
    description: 'Text-to-image generation',
    category: 'image'
  },
  {
    id: 'google/gemma',
    name: 'Gemma',
    provider: 'Google',
    description: 'Lightweight open-source model for text tasks',
    category: 'text'
  },
  {
    id: 'google/imagen-4',
    name: 'Imagen 4',
    provider: 'Google',
    description: 'High-quality text-to-image generation',
    category: 'image'
  },
  {
    id: 'google/veo-3',
    name: 'Veo 3',
    provider: 'Google',
    description: 'Text-to-video generation',
    category: 'video'
  },
];
