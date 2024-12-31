import streamlit as st
import streamlit.components.v1 as components
import os

# 개발용. 개발할땐 풀고 npm start + streamlit run
# knobs = components.declare_component("knobs", url="http://localhost:3001")

# deploy용
parent_dir = os.path.dirname(os.path.abspath(__file__))
build_dir = os.path.join(parent_dir, "frontend/build")
knobs = components.declare_component("knobs", path=build_dir)




def knob(
    knob_type: str = "1",  # 기본 스타일 "1"
    size: str = "medium",  # 기본 크기 "medium"
    title: str = "Knob",  # 기본 제목 "Knob"
    max_value: int = 100,  # 기본 최대값 100
    min_value: int = 0,    # 기본 최소값 0
    step: int = 1,         # 기본 스텝 1
    initial_value: int = None  # 초기값 (기본값은 중간값)
):
    """
    Create a new instance of the "knobs" Streamlit custom component.

    This component renders an interactive knob element in the Streamlit app. 
    The knob allows users to select a value within a specific range by rotating it, 
    and the selected value is directly returned to Streamlit.

    Parameters
    ----------
    knob_type: str, optional
        Specifies the visual style of the knob. 
        Options may include "1", "2", or "3", representing different design types. Default is "1".
    size: str, optional
        Defines the size of the knob.
        Available options are "small", "medium", or "large". Default is "medium".
    title: str, optional
        A title displayed above the knob to describe its purpose or context. Default is "Knob".
    max_value: int or float, optional
        The maximum value the knob can represent. Default is 100.
    min_value: int or float, optional
        The minimum value the knob can represent. Default is 0.
    step: int or float, optional
        The incremental step size for the knob's value. Default is 1.
    initial_value: int or float, optional
        The starting value of the knob. 
        If not specified, defaults to the midpoint between `min_value` and `max_value`.

    Returns
    -------
    number : int or float
        The current value selected by the knob, mapped proportionally between 
        `min_value` and `max_value`.

    Notes
    -----
    - The knob component updates the selected value in real-time as the user 
      rotates it.

    Examples
    --------
    >>> knob_value = knob(max_value=1000, min_value=0)
    >>> st.write(f"Selected Value: {knob_value}")
    """

    # 초기값이 설정되지 않은 경우, 최소값과 최대값의 중간값을 사용
    if initial_value is None:
        initial_value = (max_value + min_value) / 2

    # Streamlit 커스텀 컴포넌트 호출
    knobvalue = knobs(
        knob_type=knob_type,
        size=size,
        title=title,
        maxValue=max_value,
        minValue=min_value,
        step=step,
        initialValue=initial_value
    )

    return knobvalue