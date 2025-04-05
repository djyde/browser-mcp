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
  AppendStyle = "append_style",
  ListBookmarks = "list_bookmarks",
  HistorySearch = "history_search",
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
  },
  {
    name: Tools.AppendStyle,
    description: "Append a css style to the current browser browsing page",
    inputSchema: {
      type: "object",
      properties: {
        css_string: {
          type: "string",
          description: "The css style to append to the current browser browsing page",
        },
      },
    },
  },
  {
    name: Tools.HistorySearch,
    description: "Search the browser history",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "A free-text query to the history service. Leave this empty to retrieve all pages.",
        },
      },
    },
  },
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

  async [Tools.AppendStyle]({ css_string }: { css_string: string }) {
    const result = await call(WSMethods.AppendStyle, { css_string })
    return {
      content: [{
        type: "text",
        text: "Style appended successfully"
      }]
    }
  }

  async [Tools.HistorySearch]({ query }: { query: string }) {
    const history = await call(WSMethods.HistorySearch, { query })
    return {
      content: [{
        type: "text",
        text: JSON.stringify(history, null, 2)
      }]
    }
  }
}
