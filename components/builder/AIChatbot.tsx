'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { useResumeStore } from '@/store/resumeStore';
import { toast } from 'sonner';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: "Hi! I'm your AI Resume Assistant. Tell me what you'd like to change (e.g., 'Make my summary sound more aggressive', 'Add Python to my skills')." }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  
  const { data, setResumeData, setIsEditing } = useResumeStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    setInput('');
    
    // Add user message
    const newMsg: Message = { id: Date.now().toString(), role: 'user', content: userText };
    setMessages(prev => [...prev, newMsg]);
    setIsTyping(true);
    setIsEditing(true);

    try {
      const res = await fetch('/api/ai/chat-edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData: data, prompt: userText })
      });

      const result = await res.json();
      
      if (!res.ok) throw new Error(result.error || 'Failed to edit resume');

      if (result.patches && Array.isArray(result.patches)) {
        const newData = JSON.parse(JSON.stringify(data));
        
        result.patches.forEach((patch: any) => {
          const keys = patch.path.split('.');
          let current = newData;
          for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) current[keys[i]] = {};
            current = current[keys[i]];
          }
          
          let parsedValue = patch.value;
          try {
            // Attempt to parse arrays or objects if the LLM sent them as strings
            parsedValue = JSON.parse(patch.value);
          } catch (e) {
            // Keep as string if parsing fails
          }
          
          current[keys[keys.length - 1]] = parsedValue;
        });

        setResumeData(newData);
      } else if (result.error) {
        throw new Error(result.error);
      } else {
        // Fallback for full JSON returned (if the LLM didn't use the tool properly)
        setResumeData(result);
      }

      // Add success response
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: "I've updated your resume based on your request. Take a look!" 
      }]);
      toast.success('Resume updated via AI!', { id: 'chat-edit' });

    } catch (error: any) {
      console.error(error);
      const errorMsg = error.message || String(error);
      const isBusy = errorMsg.toLowerCase().includes('busy') || errorMsg.toLowerCase().includes('demand') || errorMsg.toLowerCase().includes('quota') || errorMsg.toLowerCase().includes('temporarily');
      
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: isBusy 
          ? "I'm currently assisting a high volume of users and need a quick breather. Please give me a few seconds and try again! 🧘" 
          : "Oops, something went wrong on my end while trying to update your resume. Let's try that again." 
      }]);
      toast.error(isBusy ? 'AI is resting 🧘' : 'AI Edit Failed', { id: 'chat-edit' });
    } finally {
      setIsTyping(false);
      setIsEditing(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 0 : 1 }}
        onClick={() => setIsOpen(true)}
        className="absolute bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:scale-105 transition-transform"
      >
        <Sparkles className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="absolute bottom-6 right-6 z-50 w-80 sm:w-96 h-[500px] max-h-[80vh] flex flex-col bg-[#0a0a0c]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-2 text-white font-medium">
                <Bot className="w-5 h-5 text-indigo-400" />
                AI Assistant
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-br-none' 
                      : 'bg-white/10 text-gray-200 rounded-bl-none'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl rounded-bl-none px-4 py-3 bg-white/10 text-gray-200">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {!isTyping && messages.length <= 2 && (
              <div className="flex flex-wrap gap-2 px-4 pb-3">
                <button 
                  onClick={() => {
                    const prompt = "Shorten the entire resume to strictly fit onto one A4 page without losing critical technical impact. Cut down wordy descriptions.";
                    setInput(prompt);
                  }}
                  className="px-3 py-1.5 text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full hover:bg-indigo-500/30 transition-colors"
                >
                  Auto-Fit to 1 Page
                </button>
                <button 
                  onClick={() => {
                    const prompt = "Rewrite all my project descriptions using the Google/FAANG XYZ format. Make them highly humanized, removing robotic filler words and focusing on technical depth and business impact.";
                    setInput(prompt);
                  }}
                  className="px-3 py-1.5 text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full hover:bg-emerald-500/30 transition-colors"
                >
                  Google-ify Projects
                </button>
              </div>
            )}

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-white/10 bg-[#0a0a0c]">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask AI to edit your resume..."
                  className="w-full bg-white/5 border border-white/10 rounded-full pl-4 pr-12 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  disabled={isTyping}
                />
                <button 
                  type="submit" 
                  disabled={!input.trim() || isTyping}
                  className="absolute right-1.5 p-1.5 rounded-full bg-indigo-600 text-white disabled:opacity-50 disabled:bg-gray-700 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
