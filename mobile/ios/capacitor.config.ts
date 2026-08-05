import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mylifectrl.app',
  appName: 'MyCTRL',
  webDir: '../../client/dist',
  server: {
    url: 'https://mylifectrl.com',
    cleartext: false,
  },
};

export default config;
