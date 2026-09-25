import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  use: { baseURL: 'http://127.0.0.1:5501/ws/' },
  webServer: { command: 'python -m http.server 5501 --bind 127.0.0.1 --directory ..', url: 'http://127.0.0.1:5501/ws/', reuseExistingServer: false },
});
