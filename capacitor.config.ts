import { CapacitorConfig } from '@capacitor/cli';

const isAndroid = process.env.CAPACITOR_PLATFORM === 'android';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'frontend-template',
  webDir: 'dist',
  server: {
    androidScheme: isAndroid ? 'http' : 'https',
  },
};

export default config;
