import { useState, useMemo } from "react";
import { Search, MessageSquare, Settings, Trash2, Image, MoreVertical, FileText, FileDown, PanelLeftClose, Sparkles, Pin, PinOff, Plus } from "lucide-react";
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

const sidebarItems = [
  { icon: MessageSquare, label: "New Chat", action: 'newChat' },
  { icon: Image, label: "Image Studio", action: 'photos' },
  { icon: Sparkles, label: "Explore AI", action: 'explore' },
  { icon: Settings, label: "Settings", action: 'settings' },
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
  onCollapse
}: ChatSidebarProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
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
    } else if (action === 'plans') {
      navigate('/plans');
    }
  };

  const handleSelectWithAutoClose = (chat: Chat) => {
    onSelectChat(chat);
    // Tablet & Mobile: Auto-collapse drawer for maximum chat canvas
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
        "flex items-center group rounded-2xl transition-all duration-150 px-1 py-0.5",
        currentChat?.id === chat.id 
          ? "bg-muted font-medium" 
          : "hover:bg-muted/50"
      )}
    >
      <Button
        variant="ghost"
        className={cn(
          "flex-1 justify-start text-xs sm:text-sm truncate h-10 px-2.5 hover:bg-transparent shadow-none",
          currentChat?.id === chat.id 
            ? "text-foreground font-medium" 
            : "text-muted-foreground hover:text-foreground"
        )}
        onClick={() => handleSelectWithAutoClose(chat)}
      >
        {isPinned && <Pin className="w-3.5 h-3.5 mr-2 text-foreground shrink-0" />}
        <span className="truncate">{chat.title}</span>
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
      {/* Header */}
      <div className="p-3.5 border-b border-sidebar-border/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <img src={coreaiLogo} alt="CoreAI" className="w-7 h-7 rounded-full ring-1 ring-border/40" />
            <span className="font-semibold text-base text-sidebar-foreground tracking-tight">CoreAI</span>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            {onCollapse && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onCollapse}
                className="h-8 w-8 p-0 rounded-full text-sidebar-foreground hover:bg-sidebar-accent btn-press"
              >
                <PanelLeftClose className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        {/* Minimalist Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input 
            placeholder="Search chats..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8.5 h-9 bg-muted/40 hover:bg-muted/60 border border-border/40 text-xs sm:text-sm text-sidebar-foreground placeholder:text-muted-foreground rounded-full focus-visible:ring-1 focus-visible:ring-foreground/20" 
          />
        </div>
      </div>

      {/* ChatGPT-style High-Contrast New Chat Pill Button */}
      <div className="p-3 border-b border-sidebar-border/30">
        <Button
          onClick={() => handleAction('newChat')}
          className="w-full h-10.5 bg-foreground text-background font-medium hover:opacity-90 btn-press rounded-full shadow-2xs transition-all text-xs sm:text-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Quick Navigation */}
      <div className="p-2 border-b border-sidebar-border/30">
        <nav className="space-y-0.5">
          {sidebarItems.slice(1).map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              size="sm"
              className="w-full justify-start h-9.5 text-xs sm:text-sm text-sidebar-foreground hover:bg-muted/60 btn-press rounded-2xl"
              onClick={() => handleAction(item.action)}
            >
              <item.icon className="w-4 h-4 mr-2.5 text-muted-foreground" />
              {item.label}
            </Button>
          ))}
        </nav>
      </div>

      {/* Chat Lists */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-2.5 space-y-4">
          {/* Pinned Chats */}
          {pinnedList.length > 0 && (
            <div>
              <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 px-2">
                Pinned
              </h3>
              <div className="space-y-0.5">
                {pinnedList.map((chat) => (
                  <ChatItem key={chat.id} chat={chat} isPinned={true} />
                ))}
              </div>
            </div>
          )}
          
          {/* Recent History */}
          <div>
            <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 px-2">
              {pinnedList.length > 0 ? 'Recent' : 'History'}
            </h3>
            <div className="space-y-0.5">
              {regularList.length === 0 ? (
                <div className="text-xs text-muted-foreground text-center py-8">
                  <MessageSquare className="w-6 h-6 mx-auto mb-2 opacity-25" />
                  {searchQuery ? 'No matching chats' : 'No chats yet'}
                </div>
              ) : (
                regularList.map((chat) => (
                  <ChatItem key={chat.id} chat={chat} isPinned={false} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* User Section & Logout */}
      <div className="p-3 border-t border-sidebar-border/30 space-y-2">
        {user && (
          <button
            onClick={onOpenSettings}
            className="w-full px-3 py-2 rounded-2xl bg-muted/40 text-left hover:bg-muted/70 transition-colors cursor-pointer border border-border/30"
          >
            <p className="text-[10px] text-muted-foreground">Signed in as</p>
            <p className="text-xs font-medium text-sidebar-foreground truncate">
              {user.email === 'demo@example.com' ? 'Demo User' : user.email}
            </p>
          </button>
        )}
        <AnimatedLogoutButton 
          onSignOut={onSignOut} 
          isDemo={user?.email === 'demo@example.com'} 
        />
      </div>
    </div>
  );
};
