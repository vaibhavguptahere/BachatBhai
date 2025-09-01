"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Plus, ChevronLeft, Star, Sparkle } from "lucide-react";

export default function ModernChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    "Tell me all expenses for this month?",
    "How many transactions did I make last week?",
    "Tell me about my last 5 transactions",
  ];

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: message,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate API call
    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: message }), // ✅ matches backend now
      });


      const data = await response.json();

      const aiResponse = {
        id: Date.now() + 1,
        text: data.answer || data.error || "I can help you with that! Let me analyze your financial data and provide you with the information you need.",
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      const errorResponse = {
        id: Date.now() + 1,
        text: "I'm having trouble connecting right now. Please try again later.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    }

    setIsLoading(false);
  };

  const handleQuickAction = (action) => {
    handleSendMessage(action);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const startNewChat = () => {
    setMessages([]);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-12 h-12 gradient border-1 border-black text-white rounded-full shadow-xl z-50 transition-all duration-300"
        size="icon"
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <Sparkle size={24} />
        )}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[95vw] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col z-50 animate-fade-in h-[600px]">
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
                <Plus size={14} />
                New chat
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

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {messages.length === 0 ? (
              <WelcomeSection onQuickAction={handleQuickAction} quickActions={quickActions} />
            ) : (
              <MessagesList messages={messages} isLoading={isLoading} messagesEndRef={messagesEndRef} />
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 bg-white p-4">
            <form onSubmit={handleSubmit} className="flex gap-2 items-end">
              <div className="flex-1">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask anything..."
                  disabled={isLoading}
                  className="w-full bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-sm"
                />
              </div>
              <Button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                size="icon"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-9 w-9"
              >
                <Send size={16} />
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}

function WelcomeSection({ onQuickAction, quickActions }) {
  return (
    <div className="flex-1 flex flex-col justify-center px-4 py-6">
      <div className="text-center space-y-6">
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-gray-900">
            How can I help you?
          </h1>
          <div className="space-y-1">
            <p className="text-gray-600 text-sm">
              Ask me anything about reports or transactions.
            </p>
            <p className="text-gray-600 text-sm">
              I can answer questions and help you work.
            </p>
          </div>
        </div>

        <QuickActions actions={quickActions} onAction={onQuickAction} />
      </div>
    </div>
  );
}

function QuickActions({ actions, onAction }) {
  return (
    <div className="space-y-2">
      {actions.map((action, index) => (
        <Button
          key={index}
          variant="outline"
          onClick={() => onAction(action)}
          className="w-full bg-gray-800 text-white border-gray-700 hover:bg-gray-700 hover:text-white rounded-lg px-3 py-2 text-sm text-left justify-start"
        >
          {action}
        </Button>
      ))}
    </div>
  );
}

function MessagesList({ messages, isLoading, messagesEndRef }) {
  return (
    <div className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-white border border-gray-200 rounded-lg p-3 max-w-xs">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-gray-500 text-xs">Thinking...</span>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}

function MessageBubble({ message }) {
  return (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] p-3 rounded-lg text-sm ${message.isUser
          ? 'bg-blue-600 text-white'
          : 'bg-white border border-gray-200 text-gray-900'
        }`}>
        <p>{message.text}</p>
      </div>
    </div>
  );
}