# browser-mcp

A browser extension and MCP server that allows you to interact with the browser you are using.

![mcp](https://github.com/user-attachments/assets/8464d4dc-7192-4d89-be05-bdcbaf0b5807)

![jkXeswNy@2x](https://github.com/user-attachments/assets/18c90714-5ec7-4d9d-ac24-74af1b6c907d)

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

## Tools

All available tools are listed in `server/src/tools.ts`.

### `get_current_page_markdown`

Get the markdown from current browser browsing page.

example:

```
Summarize the current page.
```

### `append_style`

Append a css style to the current browser browsing page.

example:

```
Change the current page to dark mode.
```

### `history_search`

Search the browser history.

example:

```
Search the browser history for "github".
```

## Roadmap

- [ ] Publish the extension to extension store.
- [ ] Write documentation.
- [ ] Add more tools.

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

# dev
npm run dev

# build
npm run build
```

`server/dist/cli.js` is the MCP server entry.

## Contributing

### Add a new tool

1. Add the tool schema to the `tools` array in `server/src/tools.ts`.
2. Add a extension callable handler in `extension/calls.ts`.
3. Add a tool handler in `server/src/tools.ts`. Use the `call` function to call the extension handler.

## License

AGPL-3.0-or-later
