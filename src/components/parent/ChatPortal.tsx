import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { ChatMessage } from '../../types';

interface ChatPortalProps {
  chatHistory: ChatMessage[];
  onAddMessage: (msg: string) => void;
}

export default function ChatPortal({ chatHistory, onAddMessage }: ChatPortalProps) {
  const [messageText, setMessageText] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    onAddMessage(messageText);
    setMessageText('');
  };

  return (
    <div className="glass-card rounded-3xl p-7 flex flex-col justify-between min-h-[400px]">
      <div className="flex justify-between items-center mb-4 border-b border-slate-200/50 pb-4">
        <div>
          <h3 className="font-black text-slate-900 text-lg">Teacher Instant Messaging</h3>
          <p className="text-xs font-medium text-slate-500 mt-1">Secure real-time compliance communication</p>
        </div>
        <span className="p-3 bg-gradient-to-br from-emerald-400 to-teal-500 text-white rounded-2xl shadow-lg shadow-emerald-200">
          <MessageSquare className="w-5 h-5" />
        </span>
      </div>

      <div className="space-y-4 my-4 h-64 overflow-y-auto pr-2 custom-scrollbar">
        {chatHistory.map((msg) => {
          const isMe = msg.sender === 'Parent';
          return (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <span className="text-[10px] font-black text-slate-400 px-2 mb-1 uppercase tracking-wider">
                {msg.senderName} • {msg.timestamp}
              </span>
              <div className={`p-3.5 px-5 rounded-2xl text-sm font-medium max-w-[85%] leading-relaxed shadow-sm ${
                isMe
                  ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-tr-sm shadow-indigo-200'
                  : 'bg-white border border-slate-100 text-slate-800 rounded-tl-sm'
              }`}>
                {msg.text}
              </div>
            </motion.div>
          );
        })}
      </div>

      <form onSubmit={handleSendMessage} className="flex gap-3 border-t border-slate-200/50 pt-4 relative">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type message directly to Teacher Anne..."
          className="flex-1 bg-white/80 backdrop-blur-sm text-sm font-medium px-5 py-3.5 rounded-2xl border border-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        />
        <button
          type="submit"
          className="p-3.5 px-5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 transition-all duration-300 rounded-2xl text-white cursor-pointer shadow-lg shadow-indigo-200 hover:-translate-y-0.5 flex items-center justify-center"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
