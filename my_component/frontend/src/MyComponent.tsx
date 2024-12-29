import {
  Streamlit,
  withStreamlitConnection,
  ComponentProps,
} from "streamlit-component-lib"
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  ReactElement,
} from "react"
import "./Knob.css" // Custom CSS for styling the knob

/**
 * Custom Knob Component: Allows the user to adjust a numerical value using a knob UI.
 *
 * Features:
 * - Dragging mouse up/down or using keyboard arrows to change values.
 * - Basic UI with customizable colors.
 * - Option to load an image to display as the knob.
 */
function KnobComponent({ args, theme }: ComponentProps): ReactElement {
  const { min = 0, max = 100, step = 1, initial = 50, knobImage } = args

  const [value, setValue] = useState(initial)
  const [isFocused, setIsFocused] = useState(false)

  const angle = useMemo(() => {
    // Map the value to an angle for UI rotation
    return ((value - min) / (max - min)) * 270 - 135
  }, [value, min, max])

  const style: React.CSSProperties = useMemo(() => {
    if (!theme) return {}
    return {
      border: `2px solid ${isFocused ? theme.primaryColor : "gray"}`,
      borderRadius: "50%",
      width: "100px",
      height: "100px",
      backgroundImage: knobImage ? `url(${knobImage})` : undefined,
      backgroundSize: "cover",
      backgroundColor: knobImage ? "transparent" : theme.backgroundColor,
    }
  }, [theme, isFocused, knobImage])

  const handleChange = useCallback(
    (delta: number) => {
      setValue((prevValue: any) => {
        const newValue = Math.min(max, Math.max(min, prevValue + delta))
        Streamlit.setComponentValue(newValue)
        return newValue
      })
    },
    [min, max]
  )

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "ArrowUp") {
        handleChange(step)
      } else if (event.key === "ArrowDown") {
        handleChange(-step)
      }
    },
    [handleChange, step]
  )

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (event.buttons === 1) {
        handleChange(-Math.sign(event.movementY) * step)
      }
    },
    [handleChange, step]
  )

  useEffect(() => {
    if (isFocused) {
      window.addEventListener("mousemove", handleMouseMove)
    } else {
      window.removeEventListener("mousemove", handleMouseMove)
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [isFocused, handleMouseMove])

  useEffect(() => {
    Streamlit.setFrameHeight()
  }, [value, style])

  return (
    <div
      tabIndex={0} // Makes the element focusable
      style={style}
      onKeyDown={handleKeyDown}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <div className="knob" style={{ transform: `rotate(${angle}deg)` }}></div>
      <div className="knob-value">{value}</div>
    </div>
  )
}

export default withStreamlitConnection(KnobComponent)
