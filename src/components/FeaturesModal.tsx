import React from "react";
import { 
  X, ChevronRight, FileText, BookOpen, Briefcase, Rocket, Scale, 
  Terminal, Heart, Languages, Mic, Swords, Hourglass, Code 
} from "lucide-react";

export interface CoreAIFeatureItem {
  id: string;
  label: string;
  icon: any;
  prompt: string;
}

export const allCoreAiFeatures: CoreAIFeatureItem[] = [
  {
    id: 'doc-reader',
    label: 'Document & Notes Q&A',
    icon: FileText,
    prompt: 'Hello! I am your AI Document & Notes Reader. Please paste any notes, article, or document text here. I can summarize it, extract key insights, or answer any questions about it.'
  },
  {
    id: 'quiz-maker',
    label: 'Flashcards & Quiz',
    icon: BookOpen,
    prompt: 'Welcome to Flashcards & Quiz Maker! Give me any topic or paste study notes, and I will generate 5 interactive flashcards and a 5-question quiz with answers to test your knowledge.'
  },
  {
    id: 'mock-interview',
    label: 'Mock Interviewer',
    icon: Briefcase,
    prompt: 'Welcome to AI Mock Interviewer! Which job role or exam interview would you like to practice today? (e.g. Software Engineer, UPSC, Marketing, Data Analyst). Tell me your target role to begin.'
  },
  {
    id: 'startup-incubator',
    label: 'Startup Incubator',
    icon: Rocket,
    prompt: 'Welcome to Startup & Idea Incubator! Share your rough business or app idea. I will generate: 1) Value Proposition, 2) Target Audience & SWOT Analysis, 3) 5 Unique Brand Names, and 4) A 30-Day Launch Roadmap.'
  },
  {
    id: 'decision-matrix',
    label: 'Decision Matrix',
    icon: Scale,
    prompt: 'Welcome to Decision Matrix! What difficult choice or dilemma are you facing? (e.g. "Job A vs Job B" or "College vs Startup"). List your options, and I will create a structured comparison table.'
  },
  {
    id: 'prompt-vault',
    label: 'Prompt Vault & Optimizer',
    icon: Terminal,
    prompt: 'Welcome to Prompt Vault! Paste any simple or rough prompt you have written, and I will rewrite and optimize it into an expert-level, high-precision prompt.'
  },
  {
    id: 'mood-journal',
    label: 'Mind & Mood Journal',
    icon: Heart,
    prompt: 'Welcome to your safe space Daily Mind & Mood Journal. How are you feeling today? Share what is on your mind. I am here to listen like a trusted, empathetic friend.'
  },
  {
    id: 'language-partner',
    label: 'Language Exchange',
    icon: Languages,
    prompt: 'Hello! I am your interactive Language Exchange Partner. Which language would you like to practice with me today? We can practice conversations, correct grammar, and learn new vocabulary!'
  },
  {
    id: 'voice-walkie',
    label: 'Voice Walkie-Talkie',
    icon: Mic,
    prompt: 'Voice Walkie-Talkie mode active! You can speak or ask anything aloud, and I will reply with concise, spoken-style natural responses.'
  },
  {
    id: 'debate-arena',
    label: 'AI Debate Arena',
    icon: Swords,
    prompt: 'Welcome to AI Debate Arena! Name any topic or debate motion. I will present Affirmative arguments, Negative arguments, and an objective final verdict.'
  },
  {
    id: 'future-you',
    label: 'Future You (Capsule)',
    icon: Hourglass,
    prompt: 'Hello from 10 years in the future! I am your Future Self. What is your current age, biggest struggle, and dreams? Let us talk or lock a note into your Digital Time Capsule.'
  },
  {
    id: 'code-assistant',
    label: 'Code Assistant',
    icon: Code,
    prompt: 'Welcome to Code Assistant! Paste your code, error stack trace, or tell me what component you want to build. I will write clean, bug-free code with step-by-step explanations.'
  }
];

interface FeaturesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFeature: (feature: CoreAIFeatureItem) => void;
}

export const FeaturesModal: React.FC<FeaturesModalProps> = ({ isOpen, onClose, onSelectFeature }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-card border border-emerald-500/30 rounded-3xl p-5 sm:p-7 shadow-[0_0_60px_-15px_rgba(16,185,129,0.3)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Soft Background Neon Glow */}
        <div className="absolute -top-20 -left-20 w-52 h-52 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-52 h-52 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header matching user image */}
        <div className="relative flex items-center justify-between pb-4 border-b border-border/40">
          <div className="flex items-center gap-3">
            {/* 4-leaf Clover Cross Icon */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 p-2 flex items-center justify-center shadow-md shadow-emerald-500/20">
              <div className="grid grid-cols-2 gap-1 w-full h-full">
                <span className="bg-white/90 rounded-sm" />
                <span className="bg-white/90 rounded-sm" />
                <span className="bg-white/90 rounded-sm" />
                <span className="bg-white/90 rounded-sm" />
              </div>
            </div>
            <div className="h-6 w-px bg-border/70" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Features</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center border border-border/40 transition-all cursor-pointer hover:scale-105"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 3-Column Grid of Features Cards matching user image */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3 mt-5 max-h-[60vh] overflow-y-auto overscroll-contain touch-pan-y pr-1">
          {allCoreAiFeatures.map((feature, idx) => (
            <button
              key={feature.id}
              type="button"
              onClick={() => {
                onSelectFeature(feature);
                onClose();
              }}
              className={`group flex items-center justify-between p-2.5 rounded-2xl border transition-all text-left cursor-pointer hover:-translate-y-0.5 active:translate-y-0 ${
                idx === 0 
                  ? "bg-emerald-500/10 border-emerald-500/40 shadow-[0_0_20px_-5px_rgba(16,185,129,0.25)]" 
                  : "bg-muted/30 hover:bg-muted/70 border-border/50 hover:border-emerald-500/40 hover:shadow-[0_0_20px_-5px_rgba(16,185,129,0.2)]"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-slate-950 border border-slate-800 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                  <feature.icon className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-foreground truncate group-hover:text-emerald-400 transition-colors">
                  {feature.label}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/60 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-1.5" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
