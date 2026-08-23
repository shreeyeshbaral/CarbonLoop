"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Compass,
  Laptop,
  ShieldCheck,
  TrendingUp,
  Boxes,
  RotateCcw,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { useRole } from "@/context/RoleContext";
import Link from "next/link";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export function AICopilotWidget() {
  const { currentRole } = useRole();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-welcome",
      role: "assistant",
      content: `### 🌿 Welcome to CarbonLoop AI Copilot!\nI am your circular resource copilot for **ITER SOA University, Bhubaneswar**.\n\nAsk me anything about surplus inventory, departmental shortages, NIST 800-88 data-wipe protocols, or Scope 3 carbon metrics!`,
      timestamp: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    { label: "💻 Available Laptops", query: "Show available surplus laptops for research labs" },
    { label: "📍 D-block Inventory", query: "What equipment is stored in ITER D-block?" },
    { label: "📊 Carbon & Savings", query: "Summarize our avoided procurement and CO2 stats" },
    { label: "🔒 NIST Data Wipe", query: "How does the NIST 800-88 data wipe protocol work?" },
    { label: "🚚 Route Optimizer", query: "How does the campus van route optimization work?" },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          userRole: currentRole,
        }),
      });

      if (!res.ok) throw new Error("AI request failed");

      const data = await res.json();
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: data.content,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: "assistant",
          content: "Sorry, I encountered a temporary connection issue. Please try asking again!",
          timestamp: "Just now",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Simple Markdown renderer for links, bold, and bullet points
  const renderFormattedText = (content: string) => {
    const lines = content.split("\n");
    return (
      <div className="space-y-1.5 text-xs text-ink leading-relaxed">
        {lines.map((line, idx) => {
          if (line.startsWith("### ")) {
            return (
              <h4 key={idx} className="font-heading font-bold text-sm text-forest mt-1">
                {line.replace("### ", "")}
              </h4>
            );
          }
          if (line.startsWith("- ")) {
            const cleanLine = line.replace("- ", "");
            return (
              <div key={idx} className="flex items-start gap-1.5 pl-1">
                <span className="text-forest mt-0.5">•</span>
                <span dangerouslySetInnerHTML={{ __html: formatInline(cleanLine) }} />
              </div>
            );
          }
          if (line.trim() === "") {
            return <div key={idx} className="h-1" />;
          }
          return (
            <p key={idx} dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
          );
        })}
      </div>
    );
  };

  const formatInline = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong class='font-semibold text-ink'>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, "<code class='px-1 py-0.5 bg-canvas rounded font-mono text-[11px] text-forest'>$1</code>")
      .replace(/\[(.*?)\]\((.*?)\)/g, "<a href='$2' class='text-forest underline font-semibold hover:text-forest-dark'>$1</a>");
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative p-3.5 sm:p-4 rounded-full bg-forest text-surface shadow-elevated hover:bg-forest-dark hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5"
            aria-label="Open AI Copilot"
          >
            <div className="relative">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-leaf group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-leaf animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-leaf" />
            </div>
            <span className="font-heading font-bold text-xs sm:text-sm tracking-wide pr-1 hidden sm:inline">
              Campus AI Copilot
            </span>
          </button>
        )}
      </div>

      {/* Slide-out AI Drawer */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-[92vw] sm:w-[420px] max-w-[440px] h-[580px] max-h-[85vh] rounded-3xl bg-surface border border-border/80 shadow-elevated flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 fade-in duration-200">
          {/* Header */}
          <div className="p-4 bg-forest text-surface flex items-center justify-between border-b border-forest-dark">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-forest-dark flex items-center justify-center text-leaf shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading text-sm font-bold text-surface flex items-center gap-1.5">
                  CarbonLoop AI Copilot
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-leaf/20 text-leaf border border-leaf/30 uppercase font-mono">
                    GPT-4o
                  </span>
                </h3>
                <p className="text-[10px] text-surface/80">
                  ITER SOA Campus Intelligence & Reverse Logistics
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  setMessages([
                    {
                      id: "msg-welcome-reset",
                      role: "assistant",
                      content: `🌿 Conversation reset. How can I assist your department today?`,
                      timestamp: "Just now",
                    },
                  ])
                }
                title="Reset Chat"
                className="p-1.5 rounded-lg hover:bg-forest-dark text-surface/80 hover:text-surface transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-forest-dark text-surface/80 hover:text-surface transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-3 py-2 bg-canvas border-b border-border/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p.query)}
                className="px-2.5 py-1 rounded-lg bg-surface border border-border text-[10px] font-semibold text-ink-muted hover:text-forest hover:border-forest/40 whitespace-nowrap transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-canvas/40">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <div className="w-6 h-6 rounded-lg bg-forest-light text-forest flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs shadow-xs ${
                    m.role === "user"
                      ? "bg-forest text-surface font-medium"
                      : "bg-surface border border-border/80"
                  }`}
                >
                  {m.role === "assistant" ? renderFormattedText(m.content) : m.content}
                  <span
                    className={`block text-[9px] mt-1.5 text-right ${
                      m.role === "user" ? "text-surface/70" : "text-ink-muted"
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
                {m.role === "user" && (
                  <div className="w-6 h-6 rounded-lg bg-canvas border border-border text-ink-muted flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-6 h-6 rounded-lg bg-forest-light text-forest flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="p-3 rounded-2xl bg-surface border border-border/80 flex items-center gap-1.5 text-xs text-ink-muted">
                  <span className="w-2 h-2 rounded-full bg-forest animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-forest animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-forest animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-surface border-t border-border/80 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask about ITER surplus, routes, carbon savings..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 px-3 py-2 rounded-xl bg-canvas border border-border text-xs text-ink placeholder:text-ink-muted focus:outline-none focus:border-forest"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isLoading}
              className="p-2 rounded-xl bg-forest text-surface hover:bg-forest-dark disabled:opacity-40 transition-colors shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
