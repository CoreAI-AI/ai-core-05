import { Search, MessageSquare, Settings, LogOut, Trash2, Image, MoreVertical, FileText, FileDown, PanelLeftClose } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Chat } from "@/hooks/useChats";
import { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
  
  const handleAction = (action: string) => {
    if (action === 'newChat') {
      onNewChat();
    } else if (action === 'settings') {
      onOpenSettings();
    } else if (action === 'photos') {
      navigate('/photos');
    }
  };

  return (
    <div className="w-full h-full bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-black rounded-md flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-sm"></div>
            </div>
            <span className="font-semibold text-sidebar-foreground">CoreAI</span>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            {onCollapse && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onCollapse}
                className="h-8 w-8 p-0 text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <PanelLeftClose className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search..." 
            className="pl-10 bg-sidebar-accent border-sidebar-border text-sidebar-foreground placeholder:text-muted-foreground" 
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 border-b border-sidebar-border">
        <nav className="space-y-1">
          {sidebarItems.map((item) => (
            <Button
              key={item.label}
              variant={item.active ? "default" : "ghost"}
              className={`w-full justify-start ${
                item.active 
                  ? "bg-primary text-primary-foreground" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
              onClick={() => handleAction(item.action)}
            >
              <item.icon className="w-4 h-4 mr-3" />
              {item.label}
            </Button>
          ))}
        </nav>
      </div>

      {/* Recent Chats */}
      <div className="p-4 flex-1 overflow-hidden flex flex-col">
        <div className="mb-3">
          <h3 className="text-sm font-medium text-sidebar-foreground">Recent</h3>
        </div>
        <div className="space-y-1 overflow-y-auto flex-1">
          {chats.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-4">
              No chats yet
            </div>
          ) : (
            chats.map((chat) => (
              <div key={chat.id} className="flex items-center group">
                <Button
                  variant={currentChat?.id === chat.id ? "secondary" : "ghost"}
                  className="flex-1 justify-start text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground truncate"
                  onClick={() => onSelectChat(chat)}
                >
                  {chat.title}
                </Button>
                <div className="opacity-0 group-hover:opacity-100 flex items-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-auto w-auto text-muted-foreground"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onExportChat(chat.id, 'text')}>
                        <FileText className="w-4 h-4 mr-2" />
                        Export as Text
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onExportChat(chat.id, 'pdf')}>
                        <FileDown className="w-4 h-4 mr-2" />
                        Export as PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteChat(chat.id);
                        }}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Chat
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Exit Demo / Sign Out Button */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="outline"
          size="sm"
          onClick={onSignOut}
          className="w-full flex items-center gap-2 text-sidebar-foreground border-sidebar-border hover:bg-sidebar-accent"
        >
          <LogOut className="w-4 h-4" />
          {user?.email === 'demo@example.com' ? 'Exit Demo' : 'Sign Out'}
        </Button>
      </div>
    </div>
  );
};