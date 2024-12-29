import os
import streamlit as st
import streamlit.components.v1 as components

my_component = components.declare_component("my_component", url="http://localhost:3001")

my_component(name="fuckyou")


st.header("진촤 어이없네?")