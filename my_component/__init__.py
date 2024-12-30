import os
import streamlit as st
import streamlit.components.v1 as components

knob_component = components.declare_component("knob_component", url="http://localhost:3001")


st.header("Streamlit Knobes")

knob1_return = knob_component(knob_type="1",size="medium",title="KNOB 1",maxValue=10000,minValue=0)
knob2_return = knob_component(knob_type="2",size="medium",title="KNOB 2",maxValue=10000,minValue=0)
knob3_return = knob_component(knob_type="3",size="medium",title="KNOB 3",maxValue=10000,minValue=0)

st.write(f"**1번: {knob1_return["value"]}**")
st.write(f"**2번: {knob2_return["value"]}**")
st.write(f"**3번: {knob3_return["value"]}**")
