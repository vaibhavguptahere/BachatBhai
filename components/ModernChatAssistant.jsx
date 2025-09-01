"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Send, Plus, ChevronLeft, Sparkle } from "lucide-react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";

export default function ModernChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const quickActions = useMemo(
    () => [
      "Tell me all expenses for this month?",
      "How many transactions did I make last week?",
      "Tell me about my last 5 transactions",
    ],
    []
  );

  // Send message handler
  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: message,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: message }),
      });
      const data = await response.json();

      const aiResponse = {
        id: Date.now() + 1,
        text: data.answer || data.error || "I can help with financial data!",
        isUser: false,
        timestamp: new Date(),
        tableData: data.tableData || null,
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch {
      const errorResponse = {
        id: Date.now() + 1,
        text: "I'm having trouble connecting right now. Please try again later.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action) => handleSendMessage(action);
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };
  const startNewChat = () => setMessages([]);

  return (
    <MotionConfig transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}>
      {/* Floating Toggle Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={false}
        animate={{ y: 0 }}
        whileHover={{ scale: 1.06 }}
      >
        <Button
          onClick={() => setIsOpen((v) => !v)}
          className="w-12 h-12 gradient border border-black/10 text-white rounded-full shadow-xl transition-[box-shadow] duration-200 hover:shadow-2xl"
          size="icon"
        >
          <motion.div
            initial={false}
            animate={{ rotate: isOpen ? 180 : 0, scale: isOpen ? 0.95 : 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            {isOpen ? <X size={24} /> : <Sparkle size={24} />}
          </motion.div>
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-window"
            className="fixed bottom-24 right-6 w-96 max-w-[95vw] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col z-50 h-[600px] backdrop-blur-sm"
            initial={{ opacity: 0, y: 16, scale: 0.98, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 16, scale: 0.98, filter: "blur(4px)" }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="text-gray-600 h-8 w-8">
                  <ChevronLeft size={16} />
                </Button>
                <span className="text-lg font-semibold text-gray-900">Chats</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 gap-2 text-sm"
                  onClick={startNewChat}
                >
                  <Plus size={14} /> New chat
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 h-8 w-8"
                  onClick={() => setIsOpen(false)}
                >
                  <X size={16} />
                </Button>
              </div>
            </div>

            {/* Main Chat Content */}
            <div className="flex-1 flex flex-col overflow-y-auto px-4 py-4 space-y-4">
              <AnimatePresence mode="popLayout" initial={false}>
                {messages.length === 0 ? (
                  <WelcomeSection
                    key="welcome"
                    onQuickAction={handleQuickAction}
                    quickActions={quickActions}
                  />
                ) : (
                  <MessagesList
                    key="messages"
                    messages={messages}
                    isLoading={isLoading}
                    messagesEndRef={messagesEndRef}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 bg-white p-4">
              <form onSubmit={handleSubmit} className="flex gap-2 items-end">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask anything..."
                  disabled={isLoading}
                  className="flex-1 bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-sm transition-shadow duration-200 focus:shadow-[0_0_0_4px_rgba(37,99,235,0.1)]"
                />
                <Button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  size="icon"
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-9 w-9 transition-transform duration-200 active:scale-95"
                >
                  <Send size={16} />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}

// ================= Welcome Section =================
function WelcomeSection({ onQuickAction, quickActions }) {
  return (
    <motion.div
      className="flex-1 flex flex-col justify-center items-center text-center px-4"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
    >
      <h1 className="text-2xl font-bold text-gray-900 mb-2">How can I help you?</h1>
      <p className="text-gray-600 text-sm mb-4">Ask anything about reports or transactions.</p>
      <QuickActions actions={quickActions} onAction={onQuickAction} />
    </motion.div>
  );
}

// ================= Quick Actions =================
function QuickActions({ actions, onAction }) {
  return (
    <motion.div
      className="w-full flex flex-col gap-2"
      initial="hidden"
      animate="show"
      variants={{
        hidden: { transition: { staggerChildren: 0.06, staggerDirection: -1 } },
        show: { transition: { staggerChildren: 0.06 } },
      }}
    >
      {actions.map((action, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 8 },
            show: { opacity: 1, y: 0 },
          }}
        >
          <Button
            variant="outline"
            onClick={() => onAction(action)}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg px-3 py-2 text-sm hover:translate-y-[-1px] hover:shadow-md active:translate-y-[0px] transition-transform duration-150"
          >
            {action}
          </Button>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ================= Messages List =================
function MessagesList({ messages, isLoading, messagesEndRef }) {
  return (
    <>
      <AnimatePresence initial={false}>
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </AnimatePresence>

      {isLoading && (
        <motion.div
          className="flex justify-start"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="bg-white border border-gray-200 rounded-lg p-3 max-w-xs flex items-center gap-3">
            <div className="relative h-4 w-16 overflow-hidden rounded-full bg-gray-200">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.2s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            </div>
            <span className="text-gray-500 text-xs">Thinking…</span>
          </div>
        </motion.div>
      )}

      <div ref={messagesEndRef} />
      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </>
  );
}

// ================= Message Bubble =================
function MessageBubble({ message }) {
  const isUser = message.isUser;

  return (
    <motion.div
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
      initial={{ opacity: 0, y: 8, x: isUser ? 8 : -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, x: isUser ? 8 : -8, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 420, damping: 30 }}
      layout="position"
    >
      <div
        className={`max-w-[80%] p-3 rounded-2xl text-sm break-words ${isUser
            ? "bg-blue-600 text-white shadow-md"
            : "bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 text-gray-900 shadow-sm"
          }`}
      >
        <p className="leading-relaxed">{message.text}</p>

        <span className="text-xs text-gray-400 float-right mt-1">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </motion.div>
  );
}
