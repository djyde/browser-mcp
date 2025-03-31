import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  runner: {
    binaries: {
      edge: "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    },
    chromiumArgs: ['--user-data-dir=./.wxt/chrome-data'],
  },
  manifest: {
    permissions: [
      "activeTab",
      "scripting",
      "storage"
    ],
    minimum_chrome_version: '116',
    host_permissions: [
      "https://*/*",
      'ws://localhost/*'
    ],
    action: {

    }
  },
});
