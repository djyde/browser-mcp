
import { WSMethods } from "@browser-mcp/shared";
import { ConnectStatus, connectStatusStorage } from "../storage";
import { CallHandler } from "@/calls";


async function makeConnection() {
  let webSocket: WebSocket | null = null;
  const RETRY_INTERVAL = 5000

  await connectStatusStorage.setValue(ConnectStatus.Disconnected)

  browser.runtime.onMessage.addListener((msg: any) => {
    if (msg.type === "connect") {
      retryConnect()
    }
  })

  async function retryConnect() {
    if (webSocket) {
      webSocket.close()
      webSocket = null
      connectStatusStorage.setValue(ConnectStatus.Disconnected)
    }
    const retry = async () => {
      if (webSocket) {
        clearInterval(retryConnectIntervalId)
        return
      }
      connect()
    }
    retry()
    const retryConnectIntervalId = setInterval(retry, RETRY_INTERVAL)

    return () => {
      clearInterval(retryConnectIntervalId)
    }
  }

  async function connect() {
    webSocket = new WebSocket('ws://localhost:11223');

    connectStatusStorage.setValue(ConnectStatus.Connecting)

    webSocket.onopen = async (event) => {
      await connectStatusStorage.setValue(ConnectStatus.Connected)
      keepAlive()
    }

    webSocket.onclose = async (event) => {
      await connectStatusStorage.setValue(ConnectStatus.Disconnected)
      webSocket = null
      retryConnect()
    }

    webSocket.onerror = async (event) => {
      await connectStatusStorage.setValue(ConnectStatus.Disconnected)
      webSocket = null
      retryConnect()
    }

    webSocket.onmessage = async (event) => {
      let requestId: string | null = null
      try {
        const data = JSON.parse(event.data)
        requestId = data.id
        if (data.type === "call") {
          const method = data.method as WSMethods
          const callHandler = new CallHandler(webSocket!, requestId!)
          await callHandler.handle(method, data.args)
        }
      } catch (error) {
        if (requestId) {
          webSocket?.send(JSON.stringify({
            type: "response",
            id: requestId,
            error: error instanceof Error ? error.message : "Unknown error",
          }))
        }
      }
    }
  }

  function keepAlive() {
    const keepAliveIntervalId = setInterval(
      () => {
        if (webSocket) {
          webSocket.send(JSON.stringify({
            type: "keepalive",
          }));
        } else {
          clearInterval(keepAliveIntervalId);
        }
      },
      // Set the interval to 20 seconds to prevent the service worker from becoming inactive.
      5 * 1000
    );
  }

  connect()
}

export default defineBackground(() => {
  makeConnection()
});
