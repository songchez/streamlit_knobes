import os
import streamlit as st
import streamlit.components.v1 as components

knob_component = components.declare_component("knob_component", url="http://localhost:3001")


st.header("Streamlit Knobes")


knob_component(size="medium")
