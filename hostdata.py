import base64
import datetime
from datetime import datetime
import pandas as pd
import streamlit as st
import io

st.title('Covid-19 Daily Statistics')

df = pd.read_csv('./corona_details.csv')
df.drop(["#", "Serious,Critical", "tests_1m", "Population","deaths_1m", "total_1m", "1 Caseevery X ppl", "1 Deathevery X ppl", "1 Testevery X ppl"], axis=1, inplace=True)
df.drop(range(0,8), inplace=True, axis=0)
df = df.reset_index()
df.drop(["index"], inplace=True, axis=1)
df = df.rename(columns={"Country,Other": "Country"})
st.table(df)


