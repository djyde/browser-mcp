# browser-mcp

A browser extension and MCP server that allows you to interact with the browser you are using.

## Usage

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@djyde/mcp-browser@latest"
      ]
    }
  }
}
```

## Build

```bash
pnpm i
```

### Extension

```bash
cd extension

# chrome
npm run build

# edge
npm run build:edge

# firefox
npm run build:firefox
```

After building, the extension will be in the `extension/.output` directory.

## Server

```bash
cd server
npm run build
```

`server/dist/cli.js` is the MCP server entry.

## License

AGPL-3.0-or-later