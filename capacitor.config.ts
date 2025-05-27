import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'AppC2',
  webDir: 'www',
  server: {
    androidScheme: 'https',
    allowNavigation: ['api-app-7tty.onrender.com']
  }
};

export default config;