import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, User as UserIcon } from "lucide-react";
import { UserSettings, useSettings } from "@/hooks/useSettings";
import { toast } from "sonner";

interface SettingsProps {
  user: User | null;
}

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

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="px-6">
          Save Settings
        </Button>
      </div>
    </div>
  );
};