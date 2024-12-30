import React, { useEffect, useRef, useState, useCallback } from "react"
import {
  Streamlit,
  withStreamlitConnection,
  ComponentProps,
} from "streamlit-component-lib"
import "./Knob.css"

/** KnobProps 인터페이스 */
interface KnobProps extends ComponentProps {
  args: {
    size?: "small" | "medium" | "large"
    knob_type?: "1" | "2" | "3"
    title?: string
    /** 노브가 표현할 값의 최소 범위 */
    minValue?: number
    /** 노브가 표현할 값의 최대 범위 */
    maxValue?: number
    /** 노브 값에 적용할 step (1, 0.1 등) */
    step?: number
    /** 노브의 초기값 */
    initialValue?: number
  }
}

/** 노브 각도의 물리적 제한 (실제 포텐셔미터처럼) */
const MIN_ANGLE = -145
const MAX_ANGLE = 145

/** 특정 값이 주어진 최소~최대 사이를 벗어나지 않도록 해주는 함수 */
function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max))
}

/** 값 → 각도 변환 (초기 값 세팅에 사용) */
function valueToAngle(
  value: number,
  minValue: number,
  maxValue: number
): number {
  // 예: 50일 때 각도는 (중간치) => 0도 근처
  const ratio = (value - minValue) / (maxValue - minValue)
  const angle = MIN_ANGLE + ratio * (MAX_ANGLE - MIN_ANGLE)
  return clamp(angle, MIN_ANGLE, MAX_ANGLE)
}

/** 각도 → 값 변환 */
function angleToValue(
  angle: number,
  minValue: number,
  maxValue: number,
  step: number = 1
): number {
  const ratio = (angle - MIN_ANGLE) / (MAX_ANGLE - MIN_ANGLE)
  let newValue = minValue + ratio * (maxValue - minValue)

  // step(단계) 반올림
  if (step > 0) {
    const roundFactor = 1 / step
    newValue = Math.round(newValue * roundFactor) / roundFactor
  }
  // clamp 값 범위
  newValue = clamp(newValue, minValue, maxValue)
  return newValue
}

function Knob({
  args: {
    size = "medium",
    knob_type = "2",
    title,
    minValue = 0,
    maxValue = 100,
    step = 1,
    initialValue = (maxValue - minValue) / 2,
  },
}: KnobProps) {
  /**
   * 1) 노브 각도/값 상태
   * - angle: 실제 포텐셔미터처럼 -145° ~ +145° 범위
   * - knobValue: 노브가 표현하는 값(minValue~maxValue)
   */
  const [angle, setAngle] = useState(() =>
    valueToAngle(initialValue, minValue, maxValue)
  )
  const [knobValue, setKnobValue] = useState(initialValue)

  /** 2) 드래그 중인지 여부 */
  const [isDragging, setIsDragging] = useState(false)

  /**
   * 3) 드래그 계산에 필요한 마우스 위치 기억
   * - lastMouseY: 바로 이전 이벤트 시점의 마우스 Y좌표
   */
  const lastMouseY = useRef<number | null>(null)

  /**
   * 4) size별 스타일 (이미 제공된 CSS는 그대로 사용)
   */
  const sizeMap = {
    small: { width: "40px", height: "40px" },
    medium: { width: "55px", height: "55px" },
    large: { width: "110px", height: "110px" },
  }
  const containerSizeMap = {
    small: "70px",
    medium: "100px",
    large: "200px",
  }
  const shadowMap = {
    small: "4px 4px 8px rgba(0, 0, 0, 0.5)",
    medium: "10px 10px 18px rgba(0, 0, 0, 0.9)",
    large: "10px 10px 18px rgba(0, 0, 0, 0.9)",
  }
  const { width, height } = sizeMap[size] || sizeMap.medium
  const containerSize = containerSizeMap[size] || containerSizeMap.medium
  const boxShadow = shadowMap[size] || shadowMap.medium

  /**
   * 5) 마우스 드래그: 각도 업데이트 (상대 Δ 사용)
   */
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isDragging || lastMouseY.current === null) return

      // Δy 계산
      const deltaY = event.clientY - lastMouseY.current
      lastMouseY.current = event.clientY

      // 드래그 감도 (원하는 대로 조절)
      const DRAG_FACTOR = -1.0
      // 위로 드래그(ΔY<0) 시 각도 증가, 아래로 드래그(ΔY>0) 시 각도 감소

      let newAngle = angle + deltaY * DRAG_FACTOR
      // 물리적 각도 제한에 걸리면 더 이상 업데이트하지 않음
      newAngle = clamp(newAngle, MIN_ANGLE, MAX_ANGLE)

      // 새 값 계산
      const newValue = angleToValue(newAngle, minValue, maxValue, step)

      setAngle(newAngle)
      setKnobValue(newValue)
      Streamlit.setComponentValue({ angle: newAngle, value: newValue })
    },
    [isDragging, angle, minValue, maxValue, step]
  )

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    lastMouseY.current = e.clientY
  }

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    lastMouseY.current = null
  }, [])

  /**
   * 6) Streamlit 높이 자동조절 및 초기값 설정
   */
  useEffect(() => {
    // 초기값 계산 및 설정
    const initialAngle = valueToAngle(initialValue, minValue, maxValue)

    // 명시적으로 초기값 전달
    Streamlit.setComponentValue({
      angle: initialAngle,
      value: initialValue,
    })

    // 프레임 높이 설정
    Streamlit.setFrameHeight()
  }, [initialValue, minValue, maxValue])

  /**
   * 7) 전역 mousemove/mouseup 등록/해제
   */
  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  /**
   * 8) JSX 렌더링
   */
  return (
    <div
      id="box_container"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: containerSize,
        height: containerSize,
      }}
    >
      {/* 상단에 노브 타이틀 */}
      <p style={{ marginBottom: "10px", fontWeight: "bold" }}>{title}</p>

      {/* 중앙의 노브 컨테이너 */}
      <div id="center">
        {/* 그림자 영역 */}
        <div
          className="knob-shadow"
          style={{
            position: "absolute",
            zIndex: 1,
            width,
            height,
            borderRadius: "50%",
            boxShadow,
          }}
        />
        {/* 안쪽(Inner) 이미지 */}

        <img
          className="knob-inner"
          src={`images/knob${knob_type}_in.png`}
          alt="knob_in"
          style={{
            position: "absolute",
            zIndex: 1,
            width,
            height,
            transform: `rotate(${angle}deg)`,
          }}
          onMouseDown={handleMouseDown}
        />

        {/* 바깥쪽(Outer) 이미지 */}
        <img
          className="knob-outer"
          src={`images/knob${knob_type}.png`}
          alt="knob"
          style={{
            width: containerSize,
            height: containerSize,
            transform: `rotate(${angle}deg)`,
          }}
          onMouseDown={handleMouseDown}
        />
      </div>

      {/* 하단에 노브 값 표시 */}
      <div style={{ marginTop: "10px" }}>
        <span style={{ fontWeight: "bold" }}>{knobValue}</span>
      </div>
    </div>
  )
}

export default withStreamlitConnection(Knob)
