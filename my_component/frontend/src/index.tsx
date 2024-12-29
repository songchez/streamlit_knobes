import React from "react"
import ReactDOM from "react-dom/client"
import MyComponent from "./MyComponent"
import App from "./App"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
  <React.StrictMode>
    <App />
    <MyComponent />
  </React.StrictMode>
)
