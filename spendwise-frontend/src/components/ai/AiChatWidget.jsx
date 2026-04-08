import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { aiService } from "../../services/aiService";
import { 
  FiMessageSquare, 
  FiX, 
  FiSend, 
  FiLoader, 
  FiUser, 
  FiCpu,
  FiTrash2,
  FiMinimize2,
  FiMaximize2  // Add this import for the maximize icon
} from "react-icons/fi";

export default function AIChatWidget() {
  const { token } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isHistoryCleared, setIsHistoryCleared] = useState(false); // Track if history was cleared
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Check if AI service is available
  useEffect(() => {
    const checkAIAvailability = async () => {
      const available = await aiService.healthCheck();
      setIsAvailable(available);
      if (!available) {
        console.warn("AI Service not available");
      }
    };
    checkAIAvailability();
  }, []);

  // Load chat history from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem("spendwise_chat_history");
    if (savedMessages && !isHistoryCleared) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed);
      } catch (e) {
        console.error("Failed to load chat history");
      }
    } else if (!savedMessages || isHistoryCleared) {
      // Add welcome message
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: "Hi! I'm SpendWise AI. I can help you with:\n\n💰 Saving money\n🎯 Savings goals\n📊 Understanding your spending\n💵 Budgeting tips\n📈 Financial health checkups\n\nWhat would you like to know about your finances?",
          timestamp: new Date().toISOString(),
        },
      ]);
      setIsHistoryCleared(false);
    }
  }, [isHistoryCleared]);

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0 && !isHistoryCleared) {
      localStorage.setItem("spendwise_chat_history", JSON.stringify(messages));
    }
  }, [messages, isHistoryCleared]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  // Focus input when widget opens
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;
    if (!token) {
      alert("Please login to use the AI assistant");
      return;
    }
    if (!isAvailable) {
      alert("AI service is currently unavailable. Please try again later.");
      return;
    }

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await aiService.sendMessage(userMessage.content, token);
      
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.response,
        timestamp: new Date().toISOString(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("AI Error:", error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearHistory = () => {
    if (window.confirm("Clear chat history?")) {
      localStorage.removeItem("spendwise_chat_history");
      setIsHistoryCleared(true); // Trigger reload with cleared history
      setMessages([
        {
          id: "cleared",
          role: "assistant",
          content: "Chat history cleared! How can I help you with your finances today?",
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-[#5409DA] to-[#4E71FF] text-white rounded-full shadow-lg hover:scale-110 transition-transform duration-200 group"
      >
        <FiMessageSquare size={24} className="group-hover:rotate-12 transition-transform" />
      </button>
    );
  }

  return (
    <div className={`fixed z-50 transition-all duration-300 ${
      isMinimized ? "bottom-6 right-6 w-72" : "bottom-6 right-6 w-96 h-[500px]"
    }`}>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#5409DA] to-[#4E71FF]">
          <div className="flex items-center gap-2">
            <FiCpu size={20} className="text-white" />
            <h3 className="text-white font-semibold">SpendWise AI</h3>
            {!isAvailable && (
              <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-300 rounded-full">
                Offline
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearHistory}
              className="p-1 text-white/80 hover:text-white transition"
              title="Clear chat"
            >
              <FiTrash2 size={16} />
            </button>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 text-white/80 hover:text-white transition"
              title={isMinimized ? "Maximize" : "Minimize"}
            >
              {isMinimized ? <FiMaximize2 size={16} /> : <FiMinimize2 size={16} />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-white/80 hover:text-white transition"
              title="Close"
            >
              <FiX size={18} />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-[#5409DA] to-[#4E71FF] text-white"
                        : message.isError
                        ? "bg-red-950 border border-red-800 text-red-300"
                        : "bg-gray-800 text-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {message.role === "user" ? (
                        <FiUser size={12} className="opacity-70" />
                      ) : (
                        <FiCpu size={12} className="opacity-70" />
                      )}
                      <span className="text-xs opacity-70">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 rounded-2xl px-4 py-2">
                    <div className="flex items-center gap-2">
                      <FiLoader size={14} className="animate-spin text-[#8DD8FF]" />
                      <span className="text-sm text-gray-400">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-800">
              <div className="flex gap-2">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask me about your finances..."
                  className="flex-1 bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 placeholder-gray-500 outline-none focus:border-[#4E71FF] focus:ring-1 focus:ring-[#4E71FF] transition resize-none"
                  rows={2}
                  disabled={isLoading || !isAvailable}
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isLoading || !isAvailable}
                  className="px-4 bg-gradient-to-r from-[#5409DA] to-[#4E71FF] text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <FiSend size={18} />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Ask about saving money, budgets, savings goals, or get a financial health checkup
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}