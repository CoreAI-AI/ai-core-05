import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.7b25901092dc4bb9960068c87278c3ce',
  appName: 'ai-chat-04',
  webDir: 'dist',
  server: {
    url: 'https://7b259010-92dc-4bb9-9600-68c87278c3ce.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Camera: {
      iosPermissionsText: 'This app needs camera access to take photos',
      androidPermissionsText: 'This app needs camera access to take photos'
    }
  }
};

export default config;
