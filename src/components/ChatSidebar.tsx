import { useState, useMemo } from "react";
import { Search, MessageSquare, Settings, LogOut, Trash2, Image, MoreVertical, FileText, FileDown, PanelLeftClose, FolderKanban, Pin, PinOff } from "lucide-react";
import coreaiLogo from '@/assets/coreai-logo.png';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Chat } from "@/hooks/useChats";
import { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const sidebarItems = [{
  icon: MessageSquare,
  label: "New Chat",
  active: true,
  action: 'newChat'
}, {
  icon: Image,
  label: "Image Studio",
  action: 'photos'
}, {
  icon: Settings,
  label: "Settings",
  action: 'settings'
}, {
  icon: FolderKanban,
  label: "Projects",
  action: 'projects'
}];

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
    } else if (action === 'settings') {
      onOpenSettings();
    } else if (action === 'photos') {
      navigate('/photos');
    } else if (action === 'projects') {
      navigate('/projects');
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

  // Filter and sort chats
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
        "flex items-center group rounded-lg transition-colors",
        currentChat?.id === chat.id 
          ? "bg-sidebar-accent/50" 
          : "hover:bg-sidebar-accent/30"
      )}
    >
      <Button
        variant="ghost"
        className={cn(
          "flex-1 justify-start text-sm text-sidebar-foreground truncate h-9 px-3",
          currentChat?.id === chat.id && "font-medium"
        )}
        onClick={() => onSelectChat(chat)}
      >
        {isPinned && <Pin className="w-3 h-3 mr-2 text-primary shrink-0" />}
        <span className="truncate">{chat.title}</span>
      </Button>
      <div className="opacity-0 group-hover:opacity-100 flex items-center pr-1 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={(e) => togglePin(chat.id, e)} className="cursor-pointer">
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
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onExportChat(chat.id, 'text')} className="cursor-pointer">
              <FileText className="w-4 h-4 mr-2" />
              Export as Text
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExportChat(chat.id, 'pdf')} className="cursor-pointer">
              <FileDown className="w-4 h-4 mr-2" />
              Export as PDF
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={(e) => {
                e.stopPropagation();
                onDeleteChat(chat.id);
              }}
              className="text-destructive focus:text-destructive cursor-pointer"
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
    <div className="w-full h-full bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <img src={coreaiLogo} alt="CoreAI Logo" className="w-7 h-7 rounded-lg shadow-sm" />
            <span className="font-semibold text-sidebar-foreground">CoreAI</span>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            {onCollapse && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onCollapse}
                className="h-8 w-8 p-0 text-sidebar-foreground hover:bg-sidebar-accent active:scale-95 transition-transform"
              >
                <PanelLeftClose className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search chats..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 bg-sidebar-accent/50 border-sidebar-border text-sidebar-foreground placeholder:text-muted-foreground focus:bg-sidebar-accent" 
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="p-3 border-b border-sidebar-border">
        <nav className="space-y-1">
          {sidebarItems.map((item) => (
            <Button
              key={item.label}
              variant={item.active ? "default" : "ghost"}
              size="sm"
              className={cn(
                "w-full justify-start h-9 active:scale-[0.98] transition-transform",
                item.active 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
              onClick={() => handleAction(item.action)}
            >
              <item.icon className="w-4 h-4 mr-2.5" />
              {item.label}
            </Button>
          ))}
        </nav>
      </div>

      {/* Chat Lists */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Pinned Chats */}
          {pinnedList.length > 0 && (
            <div>
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 px-1">
                Pinned
              </h3>
              <div className="space-y-0.5">
                {pinnedList.map((chat) => (
                  <ChatItem key={chat.id} chat={chat} isPinned={true} />
                ))}
              </div>
            </div>
          )}
          
          {/* Recent Chats */}
          <div>
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 px-1">
              {pinnedList.length > 0 ? 'Recent' : 'Chats'}
            </h3>
            <div className="space-y-0.5">
              {regularList.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-6">
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

      {/* Exit Demo / Sign Out Button */}
      <div className="p-3 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={onSignOut}
          className="w-full justify-start h-9 text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive active:scale-[0.98] transition-transform"
        >
          <LogOut className="w-4 h-4 mr-2.5" />
          {user?.email === 'demo@example.com' ? 'Exit Demo' : 'Sign Out'}
        </Button>
      </div>
    </div>
  );
};
