from dotenv import load_dotenv
from langgraph.graph import StateGraph, START, END
import uuid
from nodes import classify_message, router, generate_graph_agent, analytical_response_agent, load_csv_node, analyze_schema_node, load_and_analyze_csv
from shared import State


load_dotenv()

graph_builder = StateGraph(State) 

graph_builder.add_node("classifier", classify_message)
graph_builder.add_node("router", router)
graph_builder.add_node("generate_graph", generate_graph_agent)
graph_builder.add_node("analytical_response", analytical_response_agent)    


graph_builder.add_edge(START, "classifier")
graph_builder.add_edge("classifier", "router")

graph_builder.add_conditional_edges(
    "router", 
    lambda state: state.get("next"), 
    {"generate_graph": "generate_graph", "analytical_response":  "analytical_response"}
)


graph_builder.add_edge("generate_graph", END)
graph_builder.add_edge("analytical_response", END)

graph = graph_builder.compile() 


def run_chatbot():
    thread_id = str(uuid.uuid4()) 
    csv_path = "ad_metrics_sample.csv"
    state = State({"thread_id": thread_id, "messages": [], "message_type": None, csv_path: csv_path})
    state = load_and_analyze_csv(state)

    while True:
        user_input = input("Message: ")
        if user_input == "exit":
            print("Bye")
            break

        state["messages"] = state.get("messages", []) + [
            {"role": "user", "content": user_input}
        ]

    

        state = graph.invoke(state)

        if state.get("messages") and len(state["messages"]) > 0:
            last_message = state["messages"][-1]
            print(f"Assistant: {last_message.content}")


if __name__ == "__main__":
    run_chatbot()