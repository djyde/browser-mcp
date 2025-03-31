import { MethodResponse } from '@browser-mcp/shared';
import { randomUUID } from 'node:crypto';
import WebSocket, { WebSocketServer } from 'ws';

const PORT = 11223;
let wss = new WebSocketServer({ port: PORT });

let currentWS: WebSocket | null = null

wss.on("connection", ws => {
  currentWS = ws

  // Handle client disconnection
  ws.on("close", () => {
    currentWS = null
  });

  // Handle connection errors
  ws.on("error", (error) => {
    try {
      ws.terminate();
    } catch (e) {
    }
  });

  ws.on('message', (message) => {
  })
});

// Handle server-level errors
wss.on("error", (error) => {
  console.error("WebSocket server error:", error);
});

// Cleanup on server shutdown
process.on("SIGTERM", () => {
  if (currentWS) {
    try {
      currentWS.terminate();
    } catch (e) {
      console.error("Error while terminating socket during shutdown:", e);
    }
  }
  wss.close();
});

export function call<T>(method: string, args: any) {
  return new Promise<T>((resolve, reject) => {
    if (!currentWS) {
      reject(new Error("No WebSocket connection"))
      return
    }
    const requestId = randomUUID()
    currentWS.send(JSON.stringify({
      type: "call",
      method,
      id: requestId,
      args
    }))

    currentWS.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data.toString()) as MethodResponse
        if (data.type === "response" && data.id === requestId) {
          if (data.error) {
            reject(new Error(data.error))
            return
          }
          const result = data.result as T
          resolve(result)
        }
      } catch (error) {
        reject(new Error("Failed to call method"))
      }
    }
  })
}