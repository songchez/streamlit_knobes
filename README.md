# streamlit-Knobs

---

간단하게 쓸 수 있는 노브 컴포넌트입니다.
AI로 이미지를 생성하여 아날로그 버튼과 비슷하게 구현하였습니다.

![image](https://raw.githubusercontent.com/songchez/streamlit_knobes/refs/heads/main/image.png)

---

## Installation instructions

```sh
pip install streamlit-knobs
```

## Usage instructions

```python
# streamlit_nobes
import streamlit as st

from streamlit-knobs import knob

knob_value = knob(knob_type="1",max_value=1000, min_value=0)

st.write(knob_value)
```

### Parameters

#### knob_type: str, optional

- Specifies the visual style of the knob.
- Options may include "1", "2", or "3", representing different design types. Default is "1".

#### size: str, optional

- Defines the size of the knob.
- Available options are "small", "medium", or "large". Default is "medium".

#### title: str, optional

- A title displayed above the knob to describe its purpose or context. Default is "Knob".

#### max_value: int or float, optional

- The maximum value the knob can represent. Default is 100.

#### min_value: int or float, optional

- The minimum value the knob can represent. Default is 0.

#### step: int or float, optional

- The incremental step size for the knob's value. Default is 1.

#### initial_value: int or float, optional

- The starting value of the knob.
- If not specified, defaults to the midpoint between `min_value` and `max_value`.
