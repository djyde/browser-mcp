import { defineConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite'

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
    name: "Browser MCP",
    description: "A browser extension and MCP server that allows you to interact with the browser you are using.",
    permissions: [
      "activeTab",
      "scripting",
      "storage",
    ],
    optional_permissions: [
      "bookmarks",
      "history"
    ],
    minimum_chrome_version: '116',
    host_permissions: [
      "https://*/*",
      'ws://localhost/*'
    ],
    action: {

    }
  },
  // @ts-expect-error
  vite: () => ({
    plugins: [
      tailwindcss(),
    ]
  }) 
});
