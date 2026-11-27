import { useState, useMemo, useRef, useEffect } from "react";
import { 
  Search, MessageSquare, Settings, Trash2, MoreVertical, FileText, FileDown, 
  PanelLeftClose, Pin, PinOff, Plus, BookOpen, Briefcase, Rocket, Scale, 
  Terminal, Heart, Languages, Mic, Swords, Hourglass, ChevronDown, ChevronUp,
  Sparkles, StickyNote, Globe, X
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Chat } from "@/hooks/useChats";
import { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import coreaiLogo from '@/assets/coreai-logo.png';
import { AnimatedLogoutButton } from "./AnimatedLogoutButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface CoreAIFeatureItem {
  id: string;
  label: string;
  icon: any;
  prompt: string;
}

// 11 CoreAI 0-Expense Special Features
export const coreAiFeatures: CoreAIFeatureItem[] = [
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
    label: 'Startup & Idea Incubator',
    icon: Rocket,
    prompt: 'Welcome to Startup & Idea Incubator! Share your rough business or app idea. I will generate: 1) Value Proposition, 2) Target Audience & SWOT Analysis, 3) 5 Unique Brand Names, and 4) A 30-Day Launch Roadmap.'
  },
  {
    id: 'decision-matrix',
    label: 'Decision Matrix',
    icon: Scale,
    prompt: 'Welcome to Decision Matrix! What difficult choice or dilemma are you facing? (e.g. "Job A vs Job B" or "College vs Startup"). List your options, and I will create a structured pros, cons, and risk comparison table.'
  },
  {
    id: 'prompt-vault',
    label: 'Prompt Vault & Optimizer',
    icon: Terminal,
    prompt: 'Welcome to Prompt Vault! Paste any simple or rough prompt you have written, and I will rewrite and optimize it into an expert-level, high-precision prompt with clear constraints and formatting.'
  },
  {
    id: 'mood-journal',
    label: 'Mind & Mood Journal',
    icon: Heart,
    prompt: 'Welcome to your safe space Daily Mind & Mood Journal. How are you feeling today? Share what happened today or what is on your mind. I am here to listen like a trusted, empathetic friend.'
  },
  {
    id: 'language-partner',
    label: 'Language Exchange',
    icon: Languages,
    prompt: 'Hello! I am your interactive Language Exchange Partner. Which language would you like to practice with me today? We can practice conversations, correct grammar, and learn 3 new vocabulary words!'
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
    prompt: 'Welcome to AI Debate Arena! Name any topic or debate motion (e.g. "Remote Work vs Office" or "Social Media impact on youth"). I will present Affirmative arguments, Negative arguments, and an objective final verdict.'
  },
  {
    id: 'future-you',
    label: 'Future You (Time Capsule)',
    icon: Hourglass,
    prompt: 'Hello from 10 years in the future! I am your Future Self. Tell me: What is your current age, what is your biggest struggle right now, and what are your biggest dreams? Let us talk, or write a note to lock in your Digital Time Capsule.'
  }
];

interface ChatSidebarProps {
  chats: Chat[];
  currentChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
  onNewChat: () => void;
  onSignOut: () => void;
  onOpenSettings: () => void;
  onDeleteChat: (chatId: string) => void;
  onExportChat: (chatId: string, format: 'text' | 'pdf') => void;
  user: User | null;
  onCollapse?: () => void;
  onSelectFeature?: (feature: CoreAIFeatureItem) => void;
}

export const ChatSidebar = ({
  chats,
  currentChat,
  onSelectChat,
  onNewChat,
  onSignOut,
  onOpenSettings,
  onDeleteChat,
  onExportChat,
  user,
  onCollapse,
  onSelectFeature
}: ChatSidebarProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut (Ctrl+K or Cmd+K) to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [pinnedChats, setPinnedChats] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('pinnedChats');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const handleAction = (action: string) => {
    if (action === 'newChat') {
      onNewChat();
      if (typeof window !== 'undefined' && window.innerWidth < 1024 && onCollapse) {
        onCollapse();
      }
    } else if (action === 'settings') {
      onOpenSettings();
    } else if (action === 'photos') {
      navigate('/photos');
    } else if (action === 'explore') {
      navigate('/explore');
    }
  };

  const handleSelectWithAutoClose = (chat: Chat) => {
    onSelectChat(chat);
    if (typeof window !== 'undefined' && window.innerWidth < 1024 && onCollapse) {
      onCollapse();
    }
  };

  const togglePin = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPinnedChats(prev => {
      const next = new Set(prev);
      if (next.has(chatId)) {
        next.delete(chatId);
      } else {
        next.add(chatId);
      }
      localStorage.setItem('pinnedChats', JSON.stringify([...next]));
      return next;
    });
  };

  const { pinnedList, regularList } = useMemo(() => {
    const filtered = chats.filter(chat => 
      chat.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const pinned = filtered.filter(chat => pinnedChats.has(chat.id));
    const regular = filtered.filter(chat => !pinnedChats.has(chat.id));
    return { pinnedList: pinned, regularList: regular };
  }, [chats, searchQuery, pinnedChats]);

  const ChatItem = ({ chat, isPinned }: { chat: Chat; isPinned: boolean }) => (
    <div 
      key={chat.id} 
      className={cn(
        "flex items-center group rounded-xl transition-all duration-150 px-1 py-0.5",
        currentChat?.id === chat.id 
          ? "bg-muted font-medium text-foreground" 
          : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
      )}
    >
      <Button
        variant="ghost"
        className="flex-1 justify-start text-sm truncate h-10 px-2.5 hover:bg-transparent shadow-none transition-colors duration-150 font-normal group-hover:font-medium"
        onClick={() => handleSelectWithAutoClose(chat)}
      >
        {isPinned && <Pin className="w-4 h-4 mr-2 text-foreground shrink-0" />}
        <span className="truncate tracking-normal">{chat.title}</span>
      </Button>
      
      <div className="opacity-0 group-hover:opacity-100 flex items-center pr-1 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground rounded-full"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-2xl border border-border/60 shadow-xl p-1.5 backdrop-blur-xl">
            <DropdownMenuItem onClick={(e) => togglePin(chat.id, e)} className="cursor-pointer rounded-xl text-xs sm:text-sm">
              {isPinned ? (
                <>
                  <PinOff className="w-4 h-4 mr-2" />
                  Unpin chat
                </>
              ) : (
                <>
                  <Pin className="w-4 h-4 mr-2" />
                  Pin chat
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem onClick={() => onExportChat(chat.id, 'text')} className="cursor-pointer rounded-xl text-xs sm:text-sm">
              <FileText className="w-4 h-4 mr-2" />
              Export as Text
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExportChat(chat.id, 'pdf')} className="cursor-pointer rounded-xl text-xs sm:text-sm">
              <FileDown className="w-4 h-4 mr-2" />
              Export as PDF
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem 
              onClick={(e) => {
                e.stopPropagation();
                onDeleteChat(chat.id);
              }}
              className="text-destructive focus:text-destructive cursor-pointer rounded-xl text-xs sm:text-sm"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Chat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full bg-sidebar border-r border-sidebar-border/40 flex flex-col select-none">
      {/* Top Header */}
      <div className="p-3.5 border-b border-sidebar-border/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <img src={coreaiLogo} alt="CoreAI" className="w-7 h-7 rounded-full ring-1 ring-border/40" />
            <span className="font-semibold text-lg text-sidebar-foreground tracking-tight">CoreAI</span>
          </div>
          
          <div className="flex items-center gap-1">
            <ThemeToggle />
            {onCollapse && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onCollapse}
                className="h-8 w-8 p-0 rounded-full text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <PanelLeftClose className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        {/* Sleek Search chats */}
        <div className="relative flex items-center group">
          <Search className="absolute left-3 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors pointer-events-none" />
          <Input 
            ref={searchInputRef}
            placeholder="Search chats..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-14 h-10 bg-muted/40 hover:bg-muted/70 focus:bg-background border border-border/40 focus:border-foreground/30 text-sm text-sidebar-foreground placeholder:text-muted-foreground/80 rounded-xl transition-all shadow-none focus-visible:ring-0 font-normal" 
          />
                 
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          ) : (
            <kbd className="pointer-events-none absolute right-2.5 text-[9px] font-mono text-muted-foreground/70 bg-muted/60 px-1.5 py-0.5 rounded border border-border/40">
              ⌘K
            </kbd>
          )}
        </div>
      </div>

      {/* Gradient + New Chat Button with Tactile & Glow Animation */}
      <div className="p-3 border-b border-sidebar-border/30">
        <Button
          onClick={() => handleAction('newChat')}
          className="group w-full h-11 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-medium rounded-xl shadow-sm hover:shadow-[0_0_24px_-3px_rgba(79,70,229,0.6)] hover:scale-[1.02] active:scale-95 transition-all duration-200 text-sm md:text-base flex items-center justify-center gap-2.5 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.2] transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110" />
          New Chat
        </Button>
      </div>

      {/* Navigation */}
      <div className="p-2 border-b border-sidebar-border/30">
        <nav className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start h-9 text-sm text-sidebar-foreground hover:bg-muted/60 rounded-xl group transition-all duration-150 font-normal hover:font-medium"
            onClick={() => {
              navigate('/explore');
              if (typeof window !== 'undefined' && window.innerWidth < 1024 && onCollapse) onCollapse();
            }}
          >
            <Sparkles className="w-4 h-4 mr-2.5 text-indigo-400 group-hover:scale-105 transition-transform" />
            <span className="truncate">Explore Prompts</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start h-9 text-sm text-sidebar-foreground hover:bg-muted/60 rounded-xl group transition-all duration-150 font-normal hover:font-medium"
            onClick={() => {
              navigate('/notes');
              if (typeof window !== 'undefined' && window.innerWidth < 1024 && onCollapse) onCollapse();
            }}
          >
            <StickyNote className="w-4 h-4 mr-2.5 text-amber-400 group-hover:scale-105 transition-transform" />
            <span className="truncate">Notes & Canvas</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start h-9 text-sm text-sidebar-foreground hover:bg-muted/60 active:scale-[0.98] rounded-xl group transition-all duration-150 font-normal hover:font-medium"
            onClick={() => {
              onNewChat();
              if (typeof window !== 'undefined' && window.innerWidth < 1024 && onCollapse) onCollapse();
            }}
          >
            <Globe className="w-4 h-4 mr-2.5 text-cyan-400 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-200" />
            <span className="truncate">Deep Research</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start h-9 text-sm text-sidebar-foreground hover:bg-muted/60 active:scale-[0.98] rounded-xl group transition-all duration-150 font-normal hover:font-medium"
            onClick={() => {
              onOpenSettings();
              if (typeof window !== 'undefined' && window.innerWidth < 1024 && onCollapse) onCollapse();
            }}
          >
            <Settings className="w-4 h-4 mr-2.5 text-muted-foreground group-hover:scale-110 group-hover:rotate-45 transition-transform duration-200" />
            <span className="truncate">Settings</span>
          </Button>
        </nav>
      </div>

      {/* History Section */}
      <div className="flex-1 overflow-y-auto p-2 no-scrollbar">
        <div className="px-2.5 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          History
        </div>
        
        <div className="space-y-0.5 mt-1">
          {pinnedList.map(chat => (
            <ChatItem key={chat.id} chat={chat} isPinned={true} />
          ))}
          {regularList.map(chat => (
            <ChatItem key={chat.id} chat={chat} isPinned={false} />
          ))}
          {chats.length === 0 && (
            <div className="text-center py-6 text-xs text-muted-foreground">
              No chats yet
            </div>
          )}
        </div>
      </div>

      {/* User Info & Logout */}
      <div className="p-3 border-t border-sidebar-border/30 bg-muted/20">
        {user && (
          <div className="mb-2.5 p-2.5 rounded-xl bg-card/60 border border-border/40 transition-colors duration-150">
            <div className="text-xs text-muted-foreground font-normal">Signed in as</div>
            <div className="text-sm font-medium text-foreground truncate mt-0.5">{user.email}</div>
          </div>
        )}

        <AnimatedLogoutButton onSignOut={onSignOut} />
      </div>
    </div>
  );
};

export default ChatSidebar;
