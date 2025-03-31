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

}

