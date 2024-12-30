import React from "react"
import ReactDOM from "react-dom/client"
import Knobs from "./Knobs"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
  <React.StrictMode>
    <Knobs />
  </React.StrictMode>
)
