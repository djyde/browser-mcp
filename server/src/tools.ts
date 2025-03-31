import { z } from "zod"

import { WSMethods } from "@browser-mcp/shared"
import { call } from "./ws"
import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { Readability } from "@mozilla/readability"
import { JSDOM } from "jsdom"
import Turndown from "turndown"

export enum Tools {
  GetCurrentPageUrl = "get_current_page_url",
  GetCurrentPageMarkdown = "get_current_page_markdown",
}

export const tools = [
  {
    name: Tools.GetCurrentPageUrl,
    description: "Get the URL from current browser browsing tab",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: Tools.GetCurrentPageMarkdown,
    description: "Get the markdown from current browser browsing page",
    inputSchema: {
      type: "object",
      properties: {},
    },
  }
]

export class ToolHandler {
  constructor(private server: Server) {

  }

  async [Tools.GetCurrentPageUrl]() {
    const url = await call<string>(WSMethods.GetCurrentTabUrl, {})
    return {
      content: [{
        type: "text",
        text: url
      }]
    }
  }

  async [Tools.GetCurrentPageMarkdown]() {
    const { html, url } = await call<{ html: string, url: string }>(WSMethods.GetCurrentTabHtml, {})
    const dom = new JSDOM(html, {
      url
    })

    const reader = new Readability(dom.window.document)
    const article = reader.parse()

    if (!article?.content) {
      throw new Error("Unable to extract content from page")
    }

    const turndown = new Turndown()
    const markdown = turndown.turndown(article.content!)
    return {
      content: [{
        type: "text",
        text: markdown
      }]
    }
  }
}
