import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Upload, User as UserIcon, Settings as SettingsIcon } from "lucide-react";
import { UserSettings, useSettings } from "@/hooks/useSettings";
import { toast } from "sonner";

interface SettingsProps {
  user: User | null;
}

const allModels = [
  { id: "openai/gpt-5", name: "GPT-5", provider: "openai", displayName: "GPT-5" },
  { id: "openai/gpt-5-mini", name: "GPT-5 Mini", provider: "openai", displayName: "GPT-5 Mini" },
  { id: "openai/gpt-5-nano", name: "GPT-5 Nano", provider: "openai", displayName: "GPT-5 Nano" },
  { id: "google/gemini-2.5-pro", name: "Gemini 2.5 Pro", provider: "google", displayName: "Gemini 2.5 Pro" },
  { id: "google/gemini-2.5-flash", name: "Gemini 2.5 Flash", provider: "google", displayName: "Gemini 2.5 Flash" },
  { id: "google/gemini-2.5-flash-lite", name: "Gemini 2.5 Flash Lite", provider: "google", displayName: "Gemini 2.5 Flash Lite" },
  { id: "google/gemini-2.5-flash-image-preview", name: "Gemini 2.5 Flash Image", provider: "google", displayName: "Gemini 2.5 Flash Image" },
];

export const Settings = ({ user }: SettingsProps) => {
  const { settings, updateSettings } = useSettings(user?.id);
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLocalSettings(prev => ({ ...prev, profilePicture: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProviderToggle = (provider: 'openai' | 'google', checked: boolean) => {
    const newProviders = { ...localSettings.enabledModelProviders, [provider]: checked };
    
    // Filter models based on provider selection
    let newEnabledModels = localSettings.enabledModels;
    if (!checked) {
      // Remove all models from this provider
      newEnabledModels = newEnabledModels.filter(modelId => 
        !allModels.find(m => m.id === modelId && m.provider === provider)
      );
    } else {
      // Add back all models from this provider that aren't already enabled
      const providerModels = allModels
        .filter(m => m.provider === provider)
        .map(m => m.id)
        .filter(id => !newEnabledModels.includes(id));
      newEnabledModels = [...newEnabledModels, ...providerModels];
    }

    setLocalSettings(prev => ({
      ...prev,
      enabledModelProviders: newProviders,
      enabledModels: newEnabledModels
    }));
  };

  const handleModelToggle = (modelId: string, checked: boolean) => {
    const newEnabledModels = checked
      ? [...localSettings.enabledModels, modelId]
      : localSettings.enabledModels.filter(id => id !== modelId);

    setLocalSettings(prev => ({
      ...prev,
      enabledModels: newEnabledModels
    }));
  };

  const handleSave = () => {
    updateSettings(localSettings);
    toast.success("Settings saved successfully!");
  };

  const getUserInitials = () => {
    if (localSettings.displayName) {
      return localSettings.displayName.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="space-y-6">
      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="w-5 h-5" />
            Profile
          </CardTitle>
          <CardDescription>
            Manage your profile information and appearance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Picture */}
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={localSettings.profilePicture} />
              <AvatarFallback className="text-lg">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Label htmlFor="profile-picture">Profile Picture</Label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('profile-picture')?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload Image
                </Button>
                <input
                  id="profile-picture"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePictureChange}
                />
              </div>
            </div>
          </div>

          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="display-name">Display Name</Label>
            <Input
              id="display-name"
              value={localSettings.displayName}
              onChange={(e) => setLocalSettings(prev => ({ ...prev, displayName: e.target.value }))}
              placeholder="Enter your display name"
            />
          </div>
        </CardContent>
      </Card>

      {/* Model Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5" />
            AI Model Settings
          </CardTitle>
          <CardDescription>
            Choose which AI models appear in your model selector
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Provider Toggles */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Model Providers</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="openai-provider"
                  checked={localSettings.enabledModelProviders.openai}
                  onCheckedChange={(checked) => handleProviderToggle('openai', !!checked)}
                />
                <Label htmlFor="openai-provider" className="font-medium">OpenAI</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="google-provider"
                  checked={localSettings.enabledModelProviders.google}
                  onCheckedChange={(checked) => handleProviderToggle('google', !!checked)}
                />
                <Label htmlFor="google-provider" className="font-medium">Google</Label>
              </div>
            </div>
          </div>

          <Separator />

          {/* Individual Model Selection */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Individual Models</Label>
            
            {/* OpenAI Models */}
            {localSettings.enabledModelProviders.openai && (
              <div className="space-y-3">
                <Label className="text-sm font-medium text-muted-foreground">OpenAI Models</Label>
                {allModels.filter(m => m.provider === 'openai').map((model) => (
                  <div key={model.id} className="flex items-center space-x-2 ml-4">
                    <Checkbox
                      id={model.id}
                      checked={localSettings.enabledModels.includes(model.id)}
                      onCheckedChange={(checked) => handleModelToggle(model.id, !!checked)}
                    />
                    <Label htmlFor={model.id}>{model.displayName}</Label>
                  </div>
                ))}
              </div>
            )}

            {/* Google Models */}
            {localSettings.enabledModelProviders.google && (
              <div className="space-y-3">
                <Label className="text-sm font-medium text-muted-foreground">Google Models</Label>
                {allModels.filter(m => m.provider === 'google').map((model) => (
                  <div key={model.id} className="flex items-center space-x-2 ml-4">
                    <Checkbox
                      id={model.id}
                      checked={localSettings.enabledModels.includes(model.id)}
                      onCheckedChange={(checked) => handleModelToggle(model.id, !!checked)}
                    />
                    <Label htmlFor={model.id}>{model.displayName}</Label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="px-6">
          Save Settings
        </Button>
      </div>
    </div>
  );
};