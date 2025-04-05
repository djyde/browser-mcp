import { WSMethods } from "@browser-mcp/shared";

export class CallHandler {
  constructor(private webSocket: WebSocket, private requestId: string) {

  }

  async sendResponse(result: any) {
    this.webSocket.send(JSON.stringify({
      type: "response",
      id: this.requestId,
      result,
    }))
  }

  async sendError(message: string) {
    this.webSocket.send(JSON.stringify({
      type: "response",
      id: this.requestId,
      error: message,
    }))
  }

  async handle(method: WSMethods, params: any) {
    if (this[method as keyof CallHandler]) {
      const methodFn = this[method as keyof CallHandler] as (this: this, args_0: any) => Promise<void>;
      await methodFn.call(this, params);
    } else {
      this.sendError(`Method ${method} not found`);
    }
  }

  async [WSMethods.GetCurrentTabUrl]() {
    const [tab] = await browser.tabs.query({
      active: true,
    })
    this.sendResponse(tab.url)
  }

  async [WSMethods.GetCurrentTabHtml]() {
    const [tab] = await browser.tabs.query({
      active: true,
    })
    const result = await browser.scripting.executeScript({
      target: {
        tabId: tab.id!,
      },
      func: () => {
        return {
          html: document.documentElement.outerHTML,
        }
      }
    })
    this.sendResponse({
      ...result[0].result!,
      url: tab.url,
    })
  }

  async [WSMethods.AppendStyle]({ css_string }: { css_string: string }) {
    const [tab] = await browser.tabs.query({
      active: true,
    })
    try {
      await browser.scripting.insertCSS({
        target: {
          tabId: tab.id!,
        },
        css: css_string,
      })
      this.sendResponse("Append style successfully")
    } catch (error) {
      this.sendError(`Failed to append style: ${error}`)
    }
  }

  async [WSMethods.HistorySearch]({ query }: { query: string }) {
    const checkPermission = await browser.permissions.contains({
      permissions: ["history"],
    })
    if (!checkPermission) {
      this.sendError("You need to grant history permission to use this feature")
      return
    }
    const history = await browser.history.search({
      text: query,
      endTime: Date.now(),
      startTime: Date.now() - 30 * 24 * 60 * 60 * 1000,
    })
    this.sendResponse(history)
  }
}
