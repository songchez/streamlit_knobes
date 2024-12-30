# streamlit-Knobs

간단하게 쓸 수 있는 노브 컴포넌트입니다.
AI로 이미지를 생성하여 아날로그 버튼과 비슷하게 구현하였습니다.

![image](https://raw.githubusercontent.com/songchez/streamlit_knobes/refs/heads/main/image.png)

## Installation instructions

```sh
pip install streamlit-knobs
```

## Usage instructions

```python
# streamlit_nobes
import streamlit as st

from knobs import streamlit-knobs

knob1_value = knobs(knob_type="1",size="medium",title="KNOB 1",maxValue=3000,minValue=0)

st.write(knob1_value["angle"])
st.write(knob1_value["value"])
```
