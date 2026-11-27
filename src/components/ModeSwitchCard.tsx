import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Code, 
  BookOpen, 
  GraduationCap, 
  Image as ImageIcon, 
  Brain, 
  FileText, 
  Utensils, 
  TrendingUp, 
  PiggyBank,
  ArrowRight,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export type ModeType = 'normal' | 'deep-search' | 'study' | 'photo' | 'code' | 'creative' | 'analyze' | 'rich' | 'poor' | 'recipe' | 'homework';

export interface ModeMeta {
  id: ModeType;
  label: string;
  icon: any;
  color: string;
  bgColor: string;
  description: string;
}

export const MODE_METAS: Record<ModeType, ModeMeta> = {
  'normal': {
    id: 'normal',
    label: 'Auto (Normal)',
    icon: null,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    description: 'सामान्य बातचीत और सामान्य सवाल-जवाब'
  },
  'photo': {
    id: 'photo',
    label: 'Image Studio',
    icon: ImageIcon,
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
    description: '4K AI फोटो और इमेज जेनरेशन के लिए विशेष मोड'
  },
  'code': {
    id: 'code',
    label: 'Code Assistant',
    icon: Code,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    description: 'क्लीन कोड, डिबगिंग और प्रोग्रामिंग के लिए विशेष मोड'
  },
  'homework': {
    id: 'homework',
    label: 'Homework Helper',
    icon: GraduationCap,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    description: 'मैथ्स, साइंस और होमवर्क का स्टेप-बाय-स्टेप सॉल्यूशन'
  },
  'deep-search': {
    id: 'deep-search',
    label: 'Deep Search',
    icon: Search,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    description: 'गहरी रिसर्च, फैक्ट-चेकिंग और विस्तृत रिपोर्ट'
  },
  'study': {
    id: 'study',
    label: 'Study Notes',
    icon: BookOpen,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    description: 'परीक्षा की तैयारी, रिवीजन नोट्स और कॉन्सेप्ट्स'
  },
  'recipe': {
    id: 'recipe',
    label: 'Recipe & Cooking',
    icon: Utensils,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    description: 'स्वादिष्ट रेसिपीज, सामग्री और कुकिंग स्टेप्स'
  },
  'creative': {
    id: 'creative',
    label: 'Creative Writing',
    icon: Brain,
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
    description: 'कहानियां, कविताएं, स्क्रिप्ट्स और एसेज'
  },
  'analyze': {
    id: 'analyze',
    label: 'Analyze & Summarize',
    icon: FileText,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10',
    description: 'डेटा एनालिसिस, निष्कर्ष और लंबी समरी'
  },
  'rich': {
    id: 'rich',
    label: 'Rich Mode (Wealth)',
    icon: TrendingUp,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-400/10',
    description: 'बिजनेस माइंडसेट, इन्वेस्टमेंट और वेल्थ क्रिएशन'
  },
  'poor': {
    id: 'poor',
    label: 'Poor Mode (Savings)',
    icon: PiggyBank,
    color: 'text-teal-400',
    bgColor: 'bg-teal-400/10',
    description: 'बजट सेविंग्स, मितव्ययिता और मनी-सेविंग हैक्स'
  }
};

interface ModeSwitchCardProps {
  targetMode: ModeType;
  userPrompt: string;
  onSwitch: (mode: ModeType, prompt: string) => void;
  onCancel: (prompt: string) => void;
}

export const ModeSwitchCard: React.FC<ModeSwitchCardProps> = ({
  targetMode,
  userPrompt,
  onSwitch,
  onCancel
}) => {
  const meta = MODE_METAS[targetMode] || MODE_METAS['photo'];
  const Icon = meta.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="my-3 p-3.5 sm:p-4 rounded-2xl bg-card/95 border border-border/80 shadow-md backdrop-blur-md max-w-xl mx-auto"
    >
      <div className="flex items-start gap-3">
        <div className={`p-2.5 rounded-xl ${meta.bgColor} flex-shrink-0 mt-0.5`}>
          {Icon ? <Icon className={`h-5 w-5 ${meta.color}`} /> : null}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              CoreAI Smart Suggestion
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              यह Normal Chat है
            </span>
          </div>

          <p className="text-xs sm:text-sm text-foreground mt-1.5 leading-relaxed">
            आपके इस सवाल के लिए हमारे पास विशेष <strong>{meta.label}</strong> मोड उपलब्ध है, जहाँ आपको सबसे सटीक और बेहतरीन रिज़ल्ट मिलेगा।
          </p>

          <p className="text-[11px] text-muted-foreground mt-1 italic">
            "{meta.description}"
          </p>

          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-border/40 flex-wrap">
            <Button
              size="sm"
              onClick={() => onSwitch(targetMode, userPrompt)}
              className="group h-8 px-3 text-xs font-medium rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-[0_0_18px_-2px_rgba(59,130,246,0.5)] hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
            >
              Switch to {meta.label}
              <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => onCancel(userPrompt)}
              className="h-8 px-3 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/70 active:scale-95 transition-all duration-150 rounded-full flex items-center gap-1 cursor-pointer"
            >
              <X className="h-3 w-3" />
              Cancel (Normal Chat में ही रहें)
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
