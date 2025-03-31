import React from "react"
import ReactDOM from "react-dom/client"


const App = () => {
  return <div>Hello World</div>
}

// create root
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(<App />)