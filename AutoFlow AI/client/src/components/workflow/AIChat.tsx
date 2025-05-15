import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AIChatProps {
  messages: Array<{ role: string; content: string }>;
  onSendMessage: (message: string) => void;
}

export default function AIChat({ messages, onSendMessage }: AIChatProps) {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="bg-white dark:bg-neutral-dark rounded-lg shadow flex-1 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
        <h2 className="text-lg font-medium font-heading">AI Assistant</h2>
        <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
          <span className="material-icons">refresh</span>
        </button>
      </div>
      
      <ScrollArea className="p-4 flex-1">
        <div className="space-y-4">
          {messages.map((message, index) => {
            if (message.role === "system" || message.role === "assistant") {
              return (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-white">
                      <span className="material-icons text-sm">smart_toy</span>
                    </div>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 max-w-[85%]">
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                  </div>
                </div>
              );
            } else {
              return (
                <div key={index} className="flex items-start justify-end">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 max-w-[85%]">
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <div className="flex-shrink-0 ml-3">
                    <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                        alt="User" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  </div>
                </div>
              );
            }
          })}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <form onSubmit={handleSubmit} className="flex">
          <input 
            type="text" 
            className="flex-1 px-3 py-2 text-base text-neutral dark:text-white placeholder-gray-500 border border-gray-300 dark:border-gray-700 rounded-l-md bg-white dark:bg-neutral-dark focus:outline-none focus:ring-2 focus:ring-primary-light" 
            placeholder="Ask a question or provide feedback..." 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Button 
            type="submit" 
            className="px-4 py-2 rounded-r-md"
            disabled={!inputValue.trim()}
          >
            <span className="material-icons">send</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
