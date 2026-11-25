import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  User as UserIcon, Monitor, Moon, Sun, Palette, 
  Volume2, Database, LogOut, Trash2, History,
  Upload, Check, Sparkles, Brain, MessageSquare, 
  Download, Plus, ShieldCheck, HeartHandshake, Briefcase, GraduationCap, Code2, Feather,
  MoreVertical, Shield, FileText, HelpCircle, Info
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserSettings, useSettings } from "@/hooks/useSettings";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AboutSection } from "@/components/AboutSection";
import { loadMemory, addManualFact, removeFact, clearAllMemoryFacts } from "@/lib/companionMemory";

interface SettingsProps {
  user: User | null;
}

type TabKey = 'profile' | 'personality' | 'memory' | 'chat' | 'voice' | 'data';

export const Settings = ({ user }: SettingsProps) => {
  const navigate = useNavigate();
  const { settings, updateSettings } = useSettings(user?.id);
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabKey>('profile');
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  // Real Memory state
  const [memoryFacts, setMemoryFacts] = useState<string[]>([]);
  const [newFactInput, setNewFactInput] = useState("");

  const refreshMemory = () => {
    const mem = loadMemory();
    setMemoryFacts(mem.facts || []);
  };

  useEffect(() => {
    setLocalSettings(settings);
    refreshMemory();
  }, [settings]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLocalSettings(prev => ({ ...prev, profilePicture: result }));
        updateSettings({ profilePicture: result });
        toast.success("Profile photo updated");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNameBlur = () => {
    if (localSettings.displayName !== settings.displayName) {
      updateSettings({ displayName: localSettings.displayName });
      setHasChanges(false);
      toast.success("Name updated");
    }
  };

  const getUserInitials = () => {
    if (localSettings.displayName) {
      return localSettings.displayName.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'C';
  };

  const testVoice = () => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance("Namaste, main CoreAI hoon.");
    const voice = voices.find(v => v.name === localSettings.selectedVoice);
    if (voice) utterance.voice = voice;
    utterance.rate = localSettings.speechRate;
    window.speechSynthesis.speak(utterance);
  };

  const handleClearHistory = async () => {
    try {
      if (user) {
        await (supabase as any).from('messages').delete().eq('chat_id', user.id);
        await (supabase as any).from('chats').delete().eq('user_id', user.id);
      }
      localStorage.removeItem('demo_chats');
      localStorage.removeItem('demo_messages');
      localStorage.removeItem('favorite_chats');
      toast.success("Chat history cleared successfully");
      setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      toast.error("Failed to clear chat history");
    }
  };

  const handleExportChats = () => {
    try {
      const chatsData: Record<string, any> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('chats') || key.includes('messages') || key.includes('companion'))) {
          chatsData[key] = localStorage.getItem(key);
        }
      }
      const blob = new Blob([JSON.stringify(chatsData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `coreai_backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Backup downloaded successfully");
    } catch {
      toast.error("Failed to export backup");
    }
  };

  const handleAddFact = () => {
    if (!newFactInput.trim()) return;
    addManualFact(newFactInput.trim());
    setNewFactInput("");
    refreshMemory();
    toast.success("Fact remembered by CoreAI");
  };

  const handleRemoveFact = (index: number) => {
    removeFact(index);
    refreshMemory();
    toast.success("Memory removed");
  };

  const handleClearAllMemory = () => {
    clearAllMemoryFacts();
    refreshMemory();
    toast.success("All CoreAI memories cleared");
  };

  const handleSignOutAll = async () => {
    try {
      await supabase.auth.signOut({ scope: 'global' });
      toast.success("Signed out from all devices");
      setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      toast.error("Failed to sign out from all devices");
    }
  };

  const navItems = [
    { key: 'profile' as TabKey, label: 'Profile & Look', icon: UserIcon },
    { key: 'personality' as TabKey, label: 'AI Personality', icon: Sparkles, badge: 'Smart' },
    { key: 'memory' as TabKey, label: 'Memory & Facts', icon: Brain, badge: `${memoryFacts.length}` },
    { key: 'chat' as TabKey, label: 'Chat & Shortcuts', icon: MessageSquare },
    { key: 'voice' as TabKey, label: 'Voice & Audio', icon: Volume2 },
    { key: 'data' as TabKey, label: 'Data & About', icon: Database },
  ];

  const personalityPresets = [
    { id: 'friend', name: 'Dost (Caring Friend)', icon: HeartHandshake, desc: 'Warm, natural Hindi/Hinglish, emotional support' },
    { id: 'mentor', name: 'Professional Mentor', icon: Briefcase, desc: 'Structured, direct, actionable, objective' },
    { id: 'teacher', name: 'Patient Teacher', icon: GraduationCap, desc: 'Step-by-step guidance, simple real-world examples' },
    { id: 'creative', name: 'Creative Thinker', icon: Feather, desc: 'Imaginative, vivid ideas, brainstorm companion' },
    { id: 'technical', name: 'Code & Tech Pro', icon: Code2, desc: 'Clean code first, high precision, zero filler' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto pb-16 text-foreground">
      {/* Header bar */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">CoreAI Preferences & Settings</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Customize your AI's personality, memory, audio, and appearance</p>
        </div>
               <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Free & Private
          </span>

          {/* 3-Dots More Options Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted border border-border/50 transition-all cursor-pointer"
                title="More Options & Pages"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-1.5 rounded-2xl bg-popover/95 backdrop-blur-xl border border-border/80 shadow-2xl z-50">
              <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-2 py-1">
                Quick Settings
              </DropdownMenuLabel>
              {navItems.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <DropdownMenuItem
                    key={item.key}
                    onClick={() => setActiveTab(item.key)}
                    className={`rounded-xl cursor-pointer text-xs sm:text-sm py-2 px-2.5 flex items-center justify-between ${
                      activeTab === item.key ? 'bg-primary/10 text-primary font-medium' : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <ItemIcon className="w-4 h-4 text-muted-foreground" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-muted text-muted-foreground">
                        {item.badge}
                      </span>
                    )}
                  </DropdownMenuItem>
                );
              })}

              <DropdownMenuSeparator className="my-1 border-border/40" />

              <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-2 py-1">
                Legal & Privacy
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigate('/privacy-policy')}
                className="rounded-xl cursor-pointer text-xs sm:text-sm py-2 px-2.5 flex items-center gap-2.5 text-foreground hover:bg-muted"
              >
                <Shield className="w-4 h-4 text-emerald-500" />
                <span>Privacy Policy</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate('/terms')}
                className="rounded-xl cursor-pointer text-xs sm:text-sm py-2 px-2.5 flex items-center gap-2.5 text-foreground hover:bg-muted"
              >
                <FileText className="w-4 h-4 text-blue-500" />
                <span>Terms & Conditions</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-1 border-border/40" />

              <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-2 py-1">
                About & Help
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigate('/about')}
                className="rounded-xl cursor-pointer text-xs sm:text-sm py-2 px-2.5 flex items-center gap-2.5 text-foreground hover:bg-muted"
              >
                <Info className="w-4 h-4 text-cyan-500" />
                <span>About CoreAI & Founder</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate('/faq')}
                className="rounded-xl cursor-pointer text-xs sm:text-sm py-2 px-2.5 flex items-center gap-2.5 text-foreground hover:bg-muted"
              >
                <HelpCircle className="w-4 h-4 text-amber-500" />
                <span>FAQ & Help Guide</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Wide Layout (Sidebar Tabs on Desktop + Pills on Mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Navigation Sidebar (Desktop) / Horizontal Scroll (Mobile) */}
        <div className="md:col-span-4 lg:col-span-3">
          <div className="flex md:flex-col gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none sticky top-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 md:shrink text-left ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-semibold ${
                      isActive ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="md:col-span-8 lg:col-span-9 space-y-6">

          {/* TAB 1: PROFILE & APPEARANCE */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Account Section */}
              <section className="rounded-2xl border border-border/40 bg-card/40 p-5 space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <UserIcon className="w-4 h-4 text-primary" />
                  <span>Profile Information</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
                  <div className="relative group">
                    <Avatar className="w-20 h-20 border border-border/50">
                      <AvatarImage src={localSettings.profilePicture} />
                      <AvatarFallback className="text-xl bg-muted text-foreground font-semibold">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <button
                      onClick={() => document.getElementById('profile-picture')?.click()}
                      className="absolute inset-0 bg-background/70 opacity-0 group-hover:opacity-100 rounded-full flex items-center justify-center transition-opacity"
                      title="Change photo"
                    >
                      <Upload className="w-4 h-4 text-foreground" />
                    </button>
                    <input
                      id="profile-picture"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfilePictureChange}
                    />
                  </div>

                  <div className="flex-1 w-full space-y-2 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <Input
                        value={localSettings.displayName}
                        onChange={(e) => {
                          setLocalSettings(prev => ({ ...prev, displayName: e.target.value }));
                          setHasChanges(true);
                        }}
                        onBlur={handleNameBlur}
                        placeholder="Your display name"
                        className="h-9 max-w-sm text-sm rounded-xl bg-muted/30 border-border/50"
                      />
                      {hasChanges && (
                        <Button size="sm" onClick={handleNameBlur} className="h-9 rounded-xl text-xs gap-1.5">
                          <Check className="w-3.5 h-3.5" /> Save
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {user?.email || "Guest User (Chats saved locally on your device)"}
                    </p>
                  </div>
                </div>
              </section>

              {/* Theme Section */}
              <section className="rounded-2xl border border-border/40 bg-card/40 p-5 space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <Palette className="w-4 h-4 text-primary" />
                  <span>Theme & Look</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <Label className="text-sm font-medium">Color Theme</Label>
                    <p className="text-xs text-muted-foreground">Select how CoreAI looks across your device</p>
                  </div>

                  <div className="flex items-center p-1 rounded-full bg-muted/50 border border-border/40 gap-1">
                    {[
                      { value: 'light', icon: Sun, label: 'Light' },
                      { value: 'dark', icon: Moon, label: 'Dark' },
                      { value: 'system', icon: Monitor, label: 'System' }
                    ].map(({ value, icon: Icon, label }) => {
                      const active = theme === value;
                      return (
                        <button
                          key={value}
                          onClick={() => setTheme(value)}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                            active 
                              ? 'bg-foreground text-background shadow-2xs' 
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                          title={label}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">{label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* TAB 2: AI PERSONALITY & CUSTOM INSTRUCTIONS */}
          {activeTab === 'personality' && (
            <div className="space-y-6">
              {/* Presets */}
              <section className="rounded-2xl border border-border/40 bg-card/40 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span>Personality Persona</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">Live with every reply</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {personalityPresets.map((preset) => {
                    const Icon = preset.icon;
                    const isSelected = (localSettings.personalityPreset || 'friend') === preset.id;
                    return (
                      <div
                        key={preset.id}
                        onClick={() => {
                          const updated = { ...localSettings, personalityPreset: preset.id as any };
                          setLocalSettings(updated);
                          updateSettings({ personalityPreset: preset.id as any });
                          toast.success(`Personality set to ${preset.name}`);
                        }}
                        className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/10 shadow-xs'
                            : 'border-border/40 bg-muted/20 hover:bg-muted/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className={`w-4 h-4 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                            <span className="text-sm font-semibold">{preset.name}</span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-primary" />}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{preset.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Custom Instructions */}
              <section className="rounded-2xl border border-border/40 bg-card/40 p-5 space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <span>Custom Instructions</span>
                </div>

                <div className="space-y-4 pt-1">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">What should CoreAI know about you?</Label>
                    <p className="text-[11px] text-muted-foreground">E.g., "Class 12 student", "Junior React developer", "Based in Kolkata", "Preparing for exams"</p>
                    <Textarea
                      value={localSettings.customAboutMe || ""}
                      onChange={(e) => setLocalSettings(prev => ({ ...prev, customAboutMe: e.target.value }))}
                      onBlur={() => {
                        updateSettings({ customAboutMe: localSettings.customAboutMe });
                        toast.success("Background instructions saved");
                      }}
                      placeholder="Tell CoreAI who you are..."
                      rows={2}
                      className="rounded-xl text-xs bg-muted/30 border-border/50 resize-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">How would you like CoreAI to respond?</Label>
                    <p className="text-[11px] text-muted-foreground">E.g., "Keep answers concise", "Use simple Hindi analogies", "Provide code examples first"</p>
                    <Textarea
                      value={localSettings.customResponseStyle || ""}
                      onChange={(e) => setLocalSettings(prev => ({ ...prev, customResponseStyle: e.target.value }))}
                      onBlur={() => {
                        updateSettings({ customResponseStyle: localSettings.customResponseStyle });
                        toast.success("Response style instructions saved");
                      }}
                      placeholder="Define reply tone, language or formatting..."
                      rows={2}
                      className="rounded-xl text-xs bg-muted/30 border-border/50 resize-none"
                    />
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* TAB 3: REAL MEMORY MANAGER */}
          {activeTab === 'memory' && (
            <div className="space-y-6">
              <section className="rounded-2xl border border-border/40 bg-card/40 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <Brain className="w-4 h-4 text-primary" />
                    <span>What CoreAI Remembers About You</span>
                  </div>
                  {memoryFacts.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearAllMemory}
                      className="h-7 text-xs text-destructive hover:bg-destructive/10 rounded-full"
                    >
                      Clear Memory
                    </Button>
                  )}
                </div>

                <p className="text-xs text-muted-foreground">
                  CoreAI naturally remembers key facts from your conversations locally in your browser. You can inspect, add, or delete any fact below.
                </p>

                {/* Add Fact Manually */}
                <div className="flex gap-2 pt-1">
                  <Input
                    value={newFactInput}
                    onChange={(e) => setNewFactInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddFact()}
                    placeholder="Add a new memory fact (e.g., 'Likes dark mode and coffee')..."
                    className="h-9 text-xs rounded-xl bg-muted/30 border-border/50"
                  />
                  <Button size="sm" onClick={handleAddFact} className="h-9 rounded-xl text-xs gap-1.5 shrink-0">
                    <Plus className="w-3.5 h-3.5" /> Add Fact
                  </Button>
                </div>

                {/* Facts List */}
                <div className="space-y-2 pt-2">
                  {memoryFacts.length === 0 ? (
                    <div className="text-center py-8 rounded-xl border border-dashed border-border/50 bg-muted/10">
                      <Brain className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">No active memories yet.</p>
                      <p className="text-[11px] text-muted-foreground/80 mt-0.5">As you chat, CoreAI will automatically remember important topics here.</p>
                    </div>
                  ) : (
                    memoryFacts.map((fact, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between gap-3 p-3 rounded-xl bg-muted/30 border border-border/40 text-xs"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                          <span className="truncate">{fact}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFact(index)}
                          className="h-7 w-7 p-0 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive shrink-0"
                          title="Delete memory"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>
          )}

          {/* TAB 4: CHAT & SHORTCUTS */}
          {activeTab === 'chat' && (
            <div className="space-y-6">
              <section className="rounded-2xl border border-border/40 bg-card/40 p-5 space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <span>Chat Behavior & Formatting</span>
                </div>

                {/* Send on Enter */}
                <div className="flex items-center justify-between pt-1">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">Send on Enter Key</Label>
                    <p className="text-xs text-muted-foreground">Press Enter to send message, Shift + Enter for new line</p>
                  </div>
                  <Switch
                    checked={localSettings.sendOnEnter ?? true}
                    onCheckedChange={(checked) => {
                      setLocalSettings(prev => ({ ...prev, sendOnEnter: checked }));
                      updateSettings({ sendOnEnter: checked });
                      toast.success(checked ? "Enter key sends messages" : "Enter key creates new lines");
                    }}
                  />
                </div>

                <Separator className="bg-border/40" />

                {/* Response Length */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">Default Response Length</Label>
                    <p className="text-xs text-muted-foreground">Adjust how verbose CoreAI replies should be</p>
                  </div>
                  <Select
                    value={localSettings.responseLength || 'balanced'}
                    onValueChange={(val: any) => {
                      setLocalSettings(prev => ({ ...prev, responseLength: val }));
                      updateSettings({ responseLength: val });
                      toast.success(`Response length set to ${val}`);
                    }}
                  >
                    <SelectTrigger className="h-8 w-36 text-xs rounded-xl bg-muted/40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short" className="text-xs">Concise (Short)</SelectItem>
                      <SelectItem value="balanced" className="text-xs">Balanced (Standard)</SelectItem>
                      <SelectItem value="detailed" className="text-xs">Detailed (In-depth)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="bg-border/40" />

                {/* Font Size */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">Chat Font Size</Label>
                    <p className="text-xs text-muted-foreground">Reading comfort for conversation bubbles</p>
                  </div>
                  <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/40 border border-border/40">
                    {[
                      { val: 'small', label: 'Small' },
                      { val: 'medium', label: 'Normal' },
                      { val: 'large', label: 'Large' },
                    ].map(opt => (
                      <button
                        key={opt.val}
                        onClick={() => {
                          setLocalSettings(prev => ({ ...prev, fontSize: opt.val as any }));
                          updateSettings({ fontSize: opt.val as any });
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                          (localSettings.fontSize || 'medium') === opt.val
                            ? 'bg-foreground text-background shadow-xs'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* TAB 5: VOICE & AUDIO (PRESERVED 100%) */}
          {activeTab === 'voice' && (
            <div className="space-y-6">
              <section className="rounded-2xl border border-border/40 bg-card/40 p-5 space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <Volume2 className="w-4 h-4 text-primary" />
                  <span>Voice & Speech Controls</span>
                </div>

                {/* Mic toggle */}
                <div className="flex items-center justify-between pt-1">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">Microphone Voice Input</Label>
                    <p className="text-xs text-muted-foreground">Speak directly instead of typing</p>
                  </div>
                  <Switch
                    checked={localSettings.voiceInputEnabled}
                    onCheckedChange={(checked) => {
                      setLocalSettings(prev => ({ ...prev, voiceInputEnabled: checked }));
                      updateSettings({ voiceInputEnabled: checked });
                    }}
                  />
                </div>

                <Separator className="bg-border/40" />

                {/* TTS toggle */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">Text-to-Speech (Read Aloud)</Label>
                    <p className="text-xs text-muted-foreground">Listen to AI responses read aloud</p>
                  </div>
                  <Switch
                    checked={localSettings.textToSpeechEnabled}
                    onCheckedChange={(checked) => {
                      setLocalSettings(prev => ({ ...prev, textToSpeechEnabled: checked }));
                      updateSettings({ textToSpeechEnabled: checked });
                    }}
                  />
                </div>

                {localSettings.textToSpeechEnabled && (
                  <div className="space-y-4 pt-3 pl-1 border-t border-border/40">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <Label className="text-xs text-muted-foreground">Voice Selection</Label>
                      <Select
                        value={localSettings.selectedVoice}
                        onValueChange={(value) => {
                          setLocalSettings(prev => ({ ...prev, selectedVoice: value }));
                          updateSettings({ selectedVoice: value });
                        }}
                      >
                        <SelectTrigger className="h-8 max-w-[240px] text-xs rounded-xl bg-muted/40">
                          <SelectValue placeholder="System Default Voice" />
                        </SelectTrigger>
                        <SelectContent className="max-h-48">
                          {voices.map((voice) => (
                            <SelectItem key={voice.name} value={voice.name} className="text-xs">
                              {voice.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Label className="text-xs text-muted-foreground">Speed</Label>
                        <span className="text-xs font-medium text-foreground">{localSettings.speechRate}x</span>
                      </div>
                      <div className="flex items-center gap-3 w-full sm:w-56">
                        <Slider
                          value={[localSettings.speechRate]}
                          onValueChange={([value]) => {
                            setLocalSettings(prev => ({ ...prev, speechRate: value }));
                          }}
                          onValueCommit={([value]) => {
                            updateSettings({ speechRate: value });
                          }}
                          min={0.8}
                          max={1.6}
                          step={0.1}
                          className="w-full"
                        />
                        <Button size="sm" variant="ghost" onClick={testVoice} className="h-7 px-2.5 text-xs rounded-full">
                          Test
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            </div>
          )}

          {/* TAB 6: DATA & ABOUT (PRESERVED 100%) */}
          {activeTab === 'data' && (
            <div className="space-y-6">
              <section className="rounded-2xl border border-border/40 bg-card/40 p-5 space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <Database className="w-4 h-4 text-primary" />
                  <span>Data, Storage & Backup</span>
                </div>

                {/* Auto save */}
                <div className="flex items-center justify-between pt-1">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">Auto-save History</Label>
                    <p className="text-xs text-muted-foreground">Keep chats saved locally in this browser</p>
                  </div>
                  <Switch
                    checked={localSettings.autoSaveConversations}
                    onCheckedChange={(checked) => {
                      setLocalSettings(prev => ({ ...prev, autoSaveConversations: checked }));
                      updateSettings({ autoSaveConversations: checked });
                    }}
                  />
                </div>

                <Separator className="bg-border/40" />

                {/* Export Data */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">Export Local Backup</p>
                    <p className="text-xs text-muted-foreground">Download all your conversations as a JSON file</p>
                  </div>
                  <Button onClick={handleExportChats} variant="outline" size="sm" className="rounded-xl text-xs gap-1.5 self-start sm:self-auto">
                    <Download className="w-3.5 h-3.5" /> Download Backup
                  </Button>
                </div>

                <Separator className="bg-border/40" />

                {/* Clear conversations */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">Clear Conversations</p>
                    <p className="text-xs text-muted-foreground">Permanently remove local chat history</p>
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="rounded-xl text-xs text-destructive hover:bg-destructive/10 border-destructive/30 self-start sm:self-auto">
                        <History className="w-3.5 h-3.5 mr-1.5" />
                        Clear History
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Clear All Chats?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will delete all conversation history stored on this browser. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleClearHistory} className="bg-destructive text-destructive-foreground rounded-full">
                          Clear All
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                {user && (
                  <>
                    <Separator className="bg-border/40" />
                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <p className="text-sm font-medium">Active Sessions</p>
                        <p className="text-xs text-muted-foreground">Sign out across all devices</p>
                      </div>
                      <Button onClick={handleSignOutAll} variant="ghost" size="sm" className="rounded-xl text-xs">
                        <LogOut className="w-3.5 h-3.5 mr-1.5" />
                        Sign Out Everywhere
                      </Button>
                    </div>
                  </>
                )}
              </section>

              {/* Founder & Mission Section (Preserved) */}
              <AboutSection />
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Settings;
