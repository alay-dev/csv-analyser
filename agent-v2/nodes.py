from shared import State, llm
import os
import pandas as pd
from pydantic import BaseModel, Field
from typing import  Literal
from langchain.output_parsers import PydanticOutputParser
from shared import ChartSpec, MultiChartResponse


class MessageClassifier(BaseModel):
    message_type: Literal["generate_graph", "analytical_response"] = Field(
        ...,
        description="Classify if the message requires to generate graph or analytical response"
    )

def load_csv_node(state: State) -> State:
    print("📂 Loading CSV...")
    csv_path = "ad_metrics_sample.csv"
    if not csv_path or not os.path.exists(csv_path):
        raise FileNotFoundError(f"CSV path not found: {csv_path}")
    
    df = pd.read_csv(csv_path)
    state["dataframe"] = df
    return state

def classify_message(state: State):
    last_message = state["messages"][-1]
    classifier_llm = llm.with_structured_output(MessageClassifier)

    result = classifier_llm.invoke([
        {
            "role": "system",
            "content": """Classify the user message as either:
            - 'generate_graph': if it asks to generate graphs based on the given CSV data.
            - 'analytical_response': if it asks for an analytical response that doesn't require generating graphs.
            """
        },
        {"role": "user", "content": last_message.content},
    ], config={"thread_id": state["thread_id"]})
    return {"message_type": result.message_type}


def router(state: State):
    message_type = state.get("message_type", "analytical_response")
    if message_type == "generate_graph":
        return {"next": "generate_graph"}

    return {"next": "analytical_response"}



def generate_graph_agent(state: State):
    last_message = state["messages"][-1]
    schema = state["schema"]

    output_parser = PydanticOutputParser(pydantic_object=MultiChartResponse)

    messages = [
        {
            "role": "system",
            "content": f"""
You are a data visualization assistant. Based on the user's request and the dataset schema below,
generate a list of the most useful charts.

Each chart must:
- Be a separate object in a list.
- Use one of these chart types only: "LINE", "BAR", or "PIE"
- Have one x_axis and one y_axis
- Include inline data from the schema (based on sample rows)

Your response must follow this Pydantic schema:
{output_parser.get_format_instructions()}

Schema:
{schema}
"""
        },
        {
            "role": "user",
            "content": last_message.content
        }
    ]

    response = llm.invoke(messages, config={"thread_id": state["thread_id"]})

    # Parse structured response
    result = output_parser.parse(response.content)

    return {
        "messages": [
            {
                "role": "assistant",
                "content": f"Here are the suggested charts:\n```json\n{result.model_dump_json(indent=2)}\n```"
            }
        ]
    }


def analytical_response_agent(state: State):
    last_message = state["messages"][-1]
    schema = state["schema"]

    messages = [
        {"role": "system",
         "content": f"""You are a data analyst assistant specialized in analyzing structured datasets (such as CSV files).

Your goal is to help the user understand the data by answering natural language questions based on the dataset.

You have access to the dataset's schema, sample rows, and key metrics. Answer accurately and precisely using only the available data.

If the user asks for:
- **Aggregated metrics** (e.g., total, average, min, max, median): calculate or reference them using numeric fields.
- **Breakdowns** (e.g., per day, per category): describe how values change over that dimension.
- **Comparisons or trends**: mention patterns, outliers, or relative changes.
- **Chartable insights**: explain what kind of chart (bar, line, pie, scatter) would best represent the insight if applicable.

If the question is ambiguous, infer intent from context and suggest a clarifying chart or summary.

Respond concisely, in plain English, and only use the data or schema provided. Avoid fabricating values. Always reference specific columns or values where possible.

            
Use the following dataset schema and sample rows as context:

Schema:
{schema}
"""
         },
        {
            "role": "user",
            "content": last_message.content
        }
    ]
    reply = llm.invoke(messages, config={"thread_id": state["thread_id"]})
    return {"messages": [{"role": "assistant", "content": reply.content}]}


def analyze_schema_node(state: State) -> State:
    df = state["dataframe"]
    schema = {
        "columns": list(df.columns),
        "dtypes": df.dtypes.apply(lambda x: str(x)).to_dict(),
        "sample": df.head(5).to_dict(orient="records")
    }
    state["schema"] = schema
    return state

def load_and_analyze_csv(state: State) -> State:
    state = load_csv_node(state)
    state = analyze_schema_node(state)
    return state
