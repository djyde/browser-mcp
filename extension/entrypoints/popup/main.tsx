import { QueryClientProvider } from "@tanstack/react-query"
import ReactDOM from "react-dom/client"
import { queryClient } from "@/utils/query"
import { App } from "./App"
import "@/assets/tailwind.css"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
)