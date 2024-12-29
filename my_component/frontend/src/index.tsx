import React from "react"
import ReactDOM from "react-dom/client"
import MyComponent from "./MyComponent"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
  <React.StrictMode>
    <MyComponent />
  </React.StrictMode>
)
