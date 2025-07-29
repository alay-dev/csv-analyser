"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/store/main";
import { CloseCircle, SendSquare } from "solar-icon-set";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const Agent = () => {
  const setPanel = useAppStore((state) => state.setPanel);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI assistant. I can help you analyze your CSV data, create charts, and answer questions about your dashboard. How can I assist you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]");
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response (replace with actual AI integration)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(userMessage.content),
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000 + Math.random() * 2000);
  };

  const generateAIResponse = (userInput: string): string => {
    const responses = [
      "I can help you analyze that data. Could you provide more details about what specific insights you're looking for?",
      "Based on your CSV data, I can suggest creating visualizations that would best represent your information. What type of chart would you prefer?",
      "That's an interesting question! Let me analyze your data patterns and provide you with some insights.",
      "I can help you create metrics and dashboards. What key performance indicators are most important for your analysis?",
      "Great question! I can assist with data filtering, sorting, and creating custom views. What would you like to focus on?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="bg-background h-full shadow-xl relative border-r flex flex-col">
      {/* Header */}
      <div className="p-5 pb-3 border-b">
        <div onClick={() => setPanel(null)} className="absolute z-10 top-2 right-2 hover:bg-gray-100 transition duration-200 w-8 h-8 flex items-center justify-center rounded-md text-gray-500 cursor-pointer">
          <CloseCircle size={20} className="m-0 p-0 flex" />
        </div>
        <div className="w-full relative">
          <h4 className="text-lg font-semibold text-black">AI Assistant</h4>
          <p className="text-sm text-gray-500">Ask me anything about your data</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea ref={scrollAreaRef} className="h-full px-5 py-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={cn("flex w-full", message.sender === "user" ? "justify-end" : "justify-start")}>
                <div className={cn("max-w-[80%] rounded-2xl px-4 py-3 text-sm", message.sender === "user" ? "bg-blue-500 text-white rounded-br-md" : "bg-gray-100 text-gray-900 rounded-bl-md")}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className={cn("text-xs mt-2 opacity-70", message.sender === "user" ? "text-blue-100" : "text-gray-500")}>{formatTime(message.timestamp)}</p>
                </div>
              </div>
            ))}

            {/* Loading indicator */}
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

      {/* Input Area */}
      <div className="p-5 pt-3 border-t bg-white">
        <div className="flex space-x-2">
          <Input ref={inputRef} value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={handleKeyPress} placeholder="Type your message..." disabled={isLoading} className="flex-1" />
          <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isLoading} size="icon" className="shrink-0">
            <SendSquare size={16} />
          </Button>
        </div>
        <p className="text-xs text-gray-400 mt-2">Press Enter to send, Shift+Enter for new line</p>
      </div>
    </div>
  );
};

export default Agent;
