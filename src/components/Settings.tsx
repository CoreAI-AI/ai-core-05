import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  User as UserIcon, Monitor, Moon, Sun, Palette, 
  Volume2, Database, Shield, LogOut, Trash2, History,
  AlertTriangle, Upload, Check
} from "lucide-react";
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

interface SettingsProps {
  user: User | null;
}

export const Settings = ({ user }: SettingsProps) => {
  const { settings, updateSettings } = useSettings(user?.id);
  const { theme, setTheme } = useTheme();
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
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

  const handleSignOutAll = async () => {
    try {
      await supabase.auth.signOut({ scope: 'global' });
      toast.success("Signed out from all devices");
      setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      toast.error("Failed to sign out from all devices");
    }
  };

  const handleDeleteAccount = async () => {
    toast.info("To delete your account, please send an email from the Contact section below.");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16 text-foreground">
      
      {/* 1. Account & Profile Section */}
      <section className="rounded-2xl border border-border/40 bg-card/40 p-4 sm:p-5 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          <UserIcon className="w-4 h-4 text-primary" />
          <span>Profile</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
          <div className="relative group">
            <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border border-border/50">
              <AvatarImage src={localSettings.profilePicture} />
              <AvatarFallback className="text-lg bg-muted text-foreground font-semibold">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={() => document.getElementById('profile-picture')?.click()}
              className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 rounded-full flex items-center justify-center transition-opacity"
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

          <div className="flex-1 w-full space-y-1.5 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <Input
                value={localSettings.displayName}
                onChange={(e) => {
                  setLocalSettings(prev => ({ ...prev, displayName: e.target.value }));
                  setHasChanges(true);
                }}
                onBlur={handleNameBlur}
                placeholder="Your display name"
                className="h-9 max-w-xs text-sm rounded-xl bg-muted/30 border-border/50"
              />
              {hasChanges && (
                <Button size="sm" onClick={handleNameBlur} className="h-9 rounded-xl text-xs gap-1.5">
                  <Check className="w-3.5 h-3.5" /> Save
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {user?.email || "Guest User (Sign in to sync)"}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Appearance Section */}
      <section className="rounded-2xl border border-border/40 bg-card/40 p-4 sm:p-5 space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          <Palette className="w-4 h-4 text-primary" />
          <span>Appearance</span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div>
            <Label className="text-sm font-medium">Color Theme</Label>
            <p className="text-xs text-muted-foreground">Select how CoreAI looks on your device</p>
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

      {/* 3. Voice & Speech Section */}
      <section className="rounded-2xl border border-border/40 bg-card/40 p-4 sm:p-5 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          <Volume2 className="w-4 h-4 text-primary" />
          <span>Voice & Audio</span>
        </div>

        {/* Mic toggle */}
        <div className="flex items-center justify-between">
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
            <p className="text-xs text-muted-foreground">Listen to AI responses</p>
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
          <div className="space-y-3 pt-2 pl-1 border-t border-border/40">
            <div className="flex items-center justify-between gap-4">
              <Label className="text-xs text-muted-foreground">Voice Selection</Label>
              <Select
                value={localSettings.selectedVoice}
                onValueChange={(value) => {
                  setLocalSettings(prev => ({ ...prev, selectedVoice: value }));
                  updateSettings({ selectedVoice: value });
                }}
              >
                <SelectTrigger className="h-8 max-w-[220px] text-xs rounded-full bg-muted/40">
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

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Label className="text-xs text-muted-foreground">Speed</Label>
                <span className="text-xs font-medium text-foreground">{localSettings.speechRate}x</span>
              </div>
              <div className="flex items-center gap-3 w-48">
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
                <Button size="sm" variant="ghost" onClick={testVoice} className="h-7 px-2 text-xs rounded-full">
                  Test
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 4. Data & Privacy Section */}
      <section className="rounded-2xl border border-border/40 bg-card/40 p-4 sm:p-5 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          <Database className="w-4 h-4 text-primary" />
          <span>Data & Storage</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-sm font-medium">Auto-save History</Label>
            <p className="text-xs text-muted-foreground">Keep chats locally on this device</p>
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

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">Clear Conversations</p>
            <p className="text-xs text-muted-foreground">Permanently remove saved chats</p>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-full text-xs text-destructive hover:bg-destructive/10 border-destructive/30">
                <History className="w-3.5 h-3.5 mr-1.5" />
                Clear Chat History
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
                <p className="text-xs text-muted-foreground">Sign out across phones and computers</p>
              </div>
              <Button onClick={handleSignOutAll} variant="ghost" size="sm" className="rounded-full text-xs">
                <LogOut className="w-3.5 h-3.5 mr-1.5" />
                Sign Out Everywhere
              </Button>
            </div>
          </>
        )}
      </section>

      {/* 5. About & Support */}
      <AboutSection />

    </div>
  );
};

export default Settings;
