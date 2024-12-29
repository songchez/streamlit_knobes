import React from "react"
import ReactDOM from "react-dom/client"
import Knob from "./KnobComponent"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
  <React.StrictMode>
    <Knob />
  </React.StrictMode>
)
