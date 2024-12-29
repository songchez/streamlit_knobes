import React, { useEffect, useState } from "react"
import {
  Streamlit,
  withStreamlitConnection,
  ComponentProps,
} from "streamlit-component-lib"
import "./Knob.css"

interface KnobProps extends ComponentProps {
  args: {
    size?: "small" | "medium" | "large"
    knob_type?: string
  }
}

function Knob({ args: { size = "medium", knob_type = "2" } }: KnobProps) {
  const [angle, setAngle] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const sizeMap = {
    small: { width: "40px", height: "40px" },
    medium: { width: "55px", height: "55px" },
    large: { width: "110px", height: "110px" },
  }

  const calculateAngle = (mouseX: number, mouseY: number, rect: DOMRect) => {
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const calculatedAngle =
      Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI) + 90
    return calculatedAngle
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return

    const knobElement = document.querySelector("img[alt='knob']")
    if (!knobElement) return

    const rect = knobElement.getBoundingClientRect()
    const newAngle = calculateAngle(e.clientX, e.clientY, rect)

    if (newAngle !== undefined) {
      setAngle(newAngle)
      Streamlit.setComponentValue({ angle: newAngle })
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging])

  useEffect(() => {
    Streamlit.setFrameHeight()
  }, [])

  const { width, height } = sizeMap[size] || sizeMap.small

  return (
    <div id="center">
      <img
        className="knobe_in"
        src={`/knob${knob_type}_in.png`}
        alt="knob_in"
        style={{
          position: "absolute",
          zIndex: 1,
          transform: `rotate(${angle}deg)`,
          width: width,
          height: height,
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      />
      <img
        className="knobe"
        src={`/knob${knob_type}.png`}
        alt="knob"
        style={{
          transform: `rotate(${angle}deg)`,
          width:
            size === "small" ? "70px" : size === "large" ? "200px" : "100px",
          height:
            size === "small" ? "70px" : size === "large" ? "200px" : "100px",
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      />
      <div
        className="knobe_shadow"
        style={{
          position: "absolute",
          zIndex: 1,
          width: width,
          height: height,
          boxShadow:
            size === "small"
              ? "4px 4px 8px rgba(0, 0, 0, 0.5)"
              : "10px 10px 18px rgba(0, 0, 0, 0.9)",
          borderRadius: "50%", // 원형 그림자
        }}
      ></div>
    </div>
  )
}

export default withStreamlitConnection(Knob)
