export enum WSMethods {
  GetCurrentTabUrl = "get_current_tab_url",
  GetCurrentTabHtml = "get_current_tab_html",
  AppendStyle = "append_style",
  ListBookmarks = "list_bookmarks",
  HistorySearch = "history_search",
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