"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppStore } from "@/store/main";
import { AltArrowDown, AltArrowUp, ArrowUp, CloseCircle, MagicStick, MagicStick3, SendSquare } from "solar-icon-set";
import { cn, getNextPosition } from "@/lib/utils";
import type { Chart, Entity, Message, MessageHistoryRes, NodeAttribute } from "@/types/common";
import { createChartNode } from "@/lib/group";
import { nanoid } from "nanoid";
import { useDataStore } from "@/store/data";
import { useReactFlow } from "@xyflow/react";
import ReactMarkdown from "react-markdown";
import useCallAgent from "@/hooks/use-call-agent";

const Agent = () => {
  const { addNodeData, nodeData, currentTag } = useDataStore();
  const { addNodes } = useReactFlow();
  const setPanel = useAppStore((state) => state.setPanel);
  const setAiAgent = useAppStore((state) => state.setAiAgent);
  const { callAiAgent } = useCallAgent();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI assistant. I can help you analyze your CSV data, create charts, and answer questions about your dashboard. How can I assist you today?",
      role: "assistant",
      // timestamp: new Date("2023-08-17T14:30:00Z"),
      additional_kwargs: { message_type: "TEXT" },
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchMessageHistory = useCallback(async () => {
    const history = await fetch(`http://127.0.0.1:8000/session/${currentTag?.sessionID}/history`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = (await history.json()) as MessageHistoryRes;

    setMessages(json.messages);
  }, [currentTag?.sessionID]);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]");
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  useEffect(() => {
    if (!currentTag?.sessionID) return;
    fetchMessageHistory();
  }, [currentTag?.sessionID, fetchMessageHistory]);

  const handleSendMessage = async () => {
    if (!currentTag) return;
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = { id: nanoid(), content: inputValue.trim(), role: "user", additional_kwargs: { message_type: "TEXT" } };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    const { response, type } = await callAiAgent(userMessage.content, currentTag?.sessionID);

    try {
      if (type !== "TEXT") {
        const parsedData = JSON.parse(response);
        const charts = parsedData.charts as Chart[];
        // const existingNodes: Position[] = nodeData.map((item) => ({ x: item.x, y: item.position.y, height: item.height || 0, width: item.width || 0 }));
        const existingNodes: NodeAttribute[] = nodeData.map((item) => item.data.attributes!);
        for (const c of charts) {
          const id = nanoid();
          const position = getNextPosition(existingNodes, { boxHeight: c.height, boxWidth: c.width, canvasWidth: 2400 });
          const element: Entity = { id, position, type: "GROUP", data: { element: createChartNode(c.chart_type, id), name: `Group` } };

          addNodeData({ id, tag: currentTag!, data: { type: "CHART", chart: c, attributes: { ...position, width: c.width, height: c.height } } });
          addNodes([element]);
          existingNodes.push({ ...position, height: c.height, width: c.width });
        }
        const aiResponse: Message = { id: nanoid(), content: "Generated charts based on the provided data.", role: "assistant", additional_kwargs: { message_type: "TEXT" } };
        setMessages((prev) => [...prev, aiResponse]);
      } else {
        const aiResponse: Message = { id: nanoid(), content: response, role: "assistant", additional_kwargs: { message_type: "TEXT" } };
        setMessages((prev) => [...prev, aiResponse]);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-background h-full shadow-xl relative border-r flex flex-col">
      <div className="p-5 pb-3 border-b">
        <div onClick={() => setAiAgent(false)} className="absolute z-10 top-2 right-2 hover:bg-gray-100 transition duration-200 w-8 h-8 flex items-center justify-center rounded-md text-gray-500 cursor-pointer">
          <AltArrowDown size={20} className="m-0 p-0 flex" />
        </div>
        <div className="w-full relative">
          <h4 className="text-lg font-semibold text-black">AI Assistant</h4>
          <p className="text-sm text-gray-500">Ask me anything about your data</p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea ref={scrollAreaRef} className="h-full px-5 py-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={cn("flex flex-col w-full ", message.role === "user" ? "justify-end items-end" : "justify-start")}>
                {message.role === "assistant" ? (
                  <div className="flex items-center gap-2 text-purple-700">
                    <MagicStick />
                    <p className="text-sm  font-semibold">Reportify</p>{" "}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm mb-1">You</p>
                )}
                <div className={cn("w-full rounded-2xl px-4 py-3 text-sm prose", message.role === "user" ? "bg-blue-500 text-white rounded-tr-md max-w-[80%]" : " text-gray-900 rounded-bl-md")}>
                  <ReactMarkdown>{message.role === "assistant" && message.additional_kwargs.message_type !== "TEXT" ? "Generated charts based on the provided data." : message.content}</ReactMarkdown>

                  {/* <p className={cn("text-xs mt-2 opacity-70", message.role === "user" ? "text-blue-100" : "text-gray-500")}>{formatTime(message.timestamp)}</p> */}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3 text-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="p-5 pt-3 border-t bg-white">
        <div className="flex space-x-2">
          <Input ref={inputRef} value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={handleKeyPress} placeholder="Type your message..." disabled={isLoading} className="flex-1" />
          <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isLoading} size="icon" className="shrink-0">
            <ArrowUp size={16} />
          </Button>
        </div>
        <p className="text-xs text-gray-400 mt-2">Press Enter to send, Shift+Enter for new line</p>
      </div>
    </div>
  );
};

export default Agent;
