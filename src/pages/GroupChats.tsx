import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useGroupChats } from "@/hooks/useGroupChats";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowLeft, 
  Plus, 
  Users, 
  Send, 
  MoreVertical,
  UserPlus,
  LogOut,
  Trash2,
  Crown,
  User
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const GroupChats = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const {
    groups,
    currentGroup,
    members,
    messages,
    loading,
    createGroup,
    selectGroup,
    sendMessage,
    addMember,
    removeMember,
    deleteGroup,
    leaveGroup,
    setCurrentGroup
  } = useGroupChats(user?.id);

  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [newMemberId, setNewMemberId] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    navigate('/');
    return null;
  }

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;
    
    const group = await createGroup(newGroupName.trim(), newGroupDescription.trim() || undefined);
    if (group) {
      setNewGroupName("");
      setNewGroupDescription("");
      setCreateDialogOpen(false);
      selectGroup(group);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;
    
    await sendMessage(messageInput.trim());
    setMessageInput("");
  };

  const handleAddMember = async () => {
    if (!newMemberId.trim()) return;
    
    const success = await addMember(newMemberId.trim());
    if (success) {
      setNewMemberId("");
      setAddMemberDialogOpen(false);
    }
  };

  const isAdmin = members.some(m => m.user_id === user.id && m.role === 'admin');
  const isCreator = currentGroup?.created_by === user.id;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Groups Sidebar */}
      <div className="w-80 border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <h1 className="text-lg font-semibold">Group Chats</h1>
            </div>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1">
                  <Plus className="w-4 h-4" />
                  New
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Group</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Input
                    placeholder="Group name"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                  />
                  <Input
                    placeholder="Description (optional)"
                    value={newGroupDescription}
                    onChange={(e) => setNewGroupDescription(e.target.value)}
                  />
                  <Button onClick={handleCreateGroup} className="w-full">
                    Create Group
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Groups List */}
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : groups.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p>No groups yet</p>
                <p className="text-sm">Create one to get started</p>
              </div>
            ) : (
              <AnimatePresence>
                {groups.map((group) => (
                  <motion.div
                    key={group.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <button
                      onClick={() => selectGroup(group)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        currentGroup?.id === group.id
                          ? 'bg-primary/10 border border-primary/30'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">{group.name}</p>
                          {group.description && (
                            <p className="text-xs text-muted-foreground truncate">{group.description}</p>
                          )}
                        </div>
                      </div>
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentGroup ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">{currentGroup.name}</h2>
                  <p className="text-xs text-muted-foreground">{members.length} members</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Members Sheet */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Users className="w-4 h-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Group Members ({members.length})</SheetTitle>
                    </SheetHeader>
                    <div className="mt-4 space-y-2">
                      {isAdmin && (
                        <Dialog open={addMemberDialogOpen} onOpenChange={setAddMemberDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="w-full gap-2">
                              <UserPlus className="w-4 h-4" />
                              Add Member
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add Member</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                              <Input
                                placeholder="User ID"
                                value={newMemberId}
                                onChange={(e) => setNewMemberId(e.target.value)}
                              />
                              <Button onClick={handleAddMember} className="w-full">
                                Add Member
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                      <div className="space-y-2 mt-4">
                        {members.map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                {member.role === 'admin' ? (
                                  <Crown className="w-4 h-4 text-primary" />
                                ) : (
                                  <User className="w-4 h-4 text-muted-foreground" />
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium">
                                  {member.user_id === user.id ? 'You' : member.user_id.slice(0, 8) + '...'}
                                </p>
                                <p className="text-xs text-muted-foreground capitalize">{member.role}</p>
                              </div>
                            </div>
                            {isAdmin && member.user_id !== user.id && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeMember(member.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Group Options */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={leaveGroup}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Leave Group
                    </DropdownMenuItem>
                    {isCreator && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => deleteGroup(currentGroup.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Group
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4 max-w-3xl mx-auto">
                {messages.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No messages yet</p>
                    <p className="text-sm">Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((message) => {
                    const isMe = message.user_id === user.id;
                    return (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                            isMe
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          {!isMe && (
                            <p className="text-xs text-muted-foreground mb-1">
                              {message.user_id.slice(0, 8)}...
                            </p>
                          )}
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-border">
              <div className="max-w-3xl mx-auto flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Select a group</h3>
              <p>Choose a group from the sidebar to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupChats;