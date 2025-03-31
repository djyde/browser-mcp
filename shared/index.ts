export enum WSMethods {
  GetCurrentTabUrl = "get_current_tab_url",
  GetCurrentTabHtml = "get_current_tab_html",
}

export type MethodResponse = {
  type: "response"
  id: string
  result: any
  error?: string
}

export type MethodCall = {
  type: "call"
  id: string
  method: WSMethods
  args: Record<string, any>
}