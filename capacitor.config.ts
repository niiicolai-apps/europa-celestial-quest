import { CapacitorConfig } from '@capacitor/cli';

const isAndroid = process.env.CAPACITOR_PLATFORM === 'android';

const config: CapacitorConfig = {
  appId: 'com.c7pixel.europa.the.celestial.quest',
  appName: 'Europa: The Celestial Quest',
  webDir: 'dist',
  server: {
    androidScheme: isAndroid ? 'http' : 'https',
  },
};

export default config;
