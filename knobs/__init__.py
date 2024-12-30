import streamlit as st
import streamlit.components.v1 as components

knobs = components.declare_component("knobs", url="http://localhost:3001")


st.header("Streamlit Knobes")
st.write("마우스로 간편하게 조절하는 노브")
st.divider()

col1, col2, col3 = st.columns(3)

with col1:
    knob1_return = knobs(knob_type="1",size="medium",title="KNOB 1",maxValue=3000,minValue=0)
    st.write(f"**1번: {knob1_return["value"]}**")

with col2:
    knob2_return = knobs(knob_type="2",size="medium",title="KNOB 2",maxValue=7000,minValue=0)
    st.write(f"**2번: {knob2_return["value"]}**")

with col3:
    knob3_return = knobs(knob_type="3",size="medium",title="KNOB 3",maxValue=10000,minValue=0)
    st.write(f"**3번: {knob3_return["value"]}**")








