import { useState, useMemo, useRef, useEffect } from "react";
import { 
  Search, MessageSquare, Settings, Trash2, MoreVertical, FileText, FileDown, 
  PanelLeftClose, Pin, PinOff, Plus, ChevronDown, ChevronUp,
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
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChatSidebarProps {
  chats: Chat[];
  currentChat?: Chat | null;
  onSelectChat: (chat: Chat) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
  onExportChat: (chatId: string, format: 'text' | 'pdf') => void;
  onCollapse?: () => void;
  onOpenSettings: () => void;
  user?: User | null;
  onSignOut: () => void;
}

export const ChatSidebar = ({
  chats,
  currentChat,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onExportChat,
  onCollapse,
  onOpenSettings,
  user,
  onSignOut
}: ChatSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleSelectWithAutoClose = (chat: Chat) => {
    onSelectChat(chat);
    if (typeof window !== 'undefined' && window.innerWidth < 1024 && onCollapse) {
      onCollapse();
    }
  };

  const handleAction = (action: 'newChat' | 'settings') => {
    if (action === 'newChat') onNewChat();
    if (action === 'settings') onOpenSettings();
    if (typeof window !== 'undefined' && window.innerWidth < 1024 && onCollapse) {
      onCollapse();
    }
  };

  // Keyboard shortcut Ctrl/Cmd + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const [pinnedChatIds, setPinnedChatIds] = useState<string[]>(() => {
    if (!user) return [];
    try {
      const saved = localStorage.getItem(`pinned_chats_${user.id}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const togglePin = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    setPinnedChatIds(prev => {
      const next = prev.includes(chatId) ? prev.filter(id => id !== chatId) : [...prev, chatId];
      localStorage.setItem(`pinned_chats_${user.id}`, JSON.stringify(next));
      return next;
    });
  };

  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return chats;
    return chats.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [chats, searchQuery]);

  const pinnedList = useMemo(() => {
    return filteredChats.filter(c => pinnedChatIds.includes(c.id));
  }, [filteredChats, pinnedChatIds]);

  const regularList = useMemo(() => {
    return filteredChats.filter(c => !pinnedChatIds.includes(c.id));
  }, [filteredChats, pinnedChatIds]);

  const ChatItem = ({ chat, isPinned }: { chat: Chat; isPinned: boolean }) => (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -8 }}
      transition={{ duration: 0.15 }}
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
              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground rounded-full cursor-pointer hover:scale-105 active:scale-95 transition-transform"
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
    </motion.div>
  );

  return (
    <div className="w-full h-full bg-sidebar border-r border-sidebar-border/40 flex flex-col select-none">
      {/* Top Header */}
      <div className="p-3.5 border-b border-sidebar-border/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <motion.img 
              whileHover={{ rotate: 15, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              src={coreaiLogo} 
              alt="CoreAI" 
              className="w-7 h-7 rounded-full ring-1 ring-border/40 cursor-pointer" 
            />
            <span className="font-semibold text-lg text-sidebar-foreground tracking-tight">CoreAI</span>
          </div>
          
          <div className="flex items-center gap-1">
            <ThemeToggle />
            {onCollapse && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={onCollapse}
                className="h-8 w-8 rounded-full flex items-center justify-center text-sidebar-foreground hover:bg-sidebar-accent cursor-pointer transition-colors"
              >
                <PanelLeftClose className="h-4 w-4" />
              </motion.button>
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
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" />
            </motion.button>
          ) : (
            <kbd className="pointer-events-none absolute right-2.5 text-[9px] font-mono text-muted-foreground/70 bg-muted/60 px-1.5 py-0.5 rounded border border-border/40">
              ⌘K
            </kbd>
          )}
        </div>
      </div>

      {/* Gradient New Chat Button */}
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
            className="w-full justify-start h-9 text-sm text-sidebar-foreground hover:bg-muted/60 rounded-xl group transition-all duration-150 font-normal hover:font-medium cursor-pointer"
            onClick={() => {
              navigate('/explore');
              if (typeof window !== 'undefined' && window.innerWidth < 1024 && onCollapse) onCollapse();
            }}
          >
            <Sparkles className="w-4 h-4 mr-2.5 text-indigo-400 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-200" />
            <span className="truncate">Explore Prompts</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start h-9 text-sm text-sidebar-foreground hover:bg-muted/60 rounded-xl group transition-all duration-150 font-normal hover:font-medium cursor-pointer"
            onClick={() => {
              navigate('/notes');
              if (typeof window !== 'undefined' && window.innerWidth < 1024 && onCollapse) onCollapse();
            }}
          >
            <StickyNote className="w-4 h-4 mr-2.5 text-amber-400 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-200" />
            <span className="truncate">Notes & Canvas</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start h-9 text-sm text-sidebar-foreground hover:bg-muted/60 active:scale-[0.98] rounded-xl group transition-all duration-150 font-normal hover:font-medium cursor-pointer"
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
            className="w-full justify-start h-9 text-sm text-sidebar-foreground hover:bg-muted/60 active:scale-[0.98] rounded-xl group transition-all duration-150 font-normal hover:font-medium cursor-pointer"
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
          <AnimatePresence initial={false}>
            {pinnedList.map(chat => (
              <ChatItem key={chat.id} chat={chat} isPinned={true} />
            ))}
            {regularList.map(chat => (
              <ChatItem key={chat.id} chat={chat} isPinned={false} />
            ))}
          </AnimatePresence>

          {chats.length === 0 && (
            <div className="text-center py-6 text-xs text-muted-foreground">
              No chats yet
            </div>
          )}
        </div>
      </div>

      {/* User Info & Animated Logout */}
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
