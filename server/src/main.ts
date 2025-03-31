import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { version } from '../package.json'
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { tools, ToolHandler } from "./tools";

// Create an MCP server
const server = new Server({
  name: "Browser MCP",
  version,
}, {
  capabilities: {
    resources: {},
    logging: {},
    tools: {}
  }
});

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: tools
  }
})

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const toolHandler = new ToolHandler(server)
  return toolHandler[request.params.name](request.params.arguments)
})

export async function main() {
  // Start receiving messages on stdin and sending messages on stdout
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
