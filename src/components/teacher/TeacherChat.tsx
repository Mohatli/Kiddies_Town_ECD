import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, ChevronRight } from 'lucide-react';
import { ChatMessage } from '../../types';

interface TeacherChatProps {
  chats: ChatMessage[];
  onSendMessage: (txt: string, parentEmailAddress?: string) => void;
}

export default function TeacherChat({ chats, onSendMessage }: TeacherChatProps) {
  const [chatInput, setChatInput] = useState('');
  const [selectedParentEmail, setSelectedParentEmail] = useState<string>('parent@kiddiestown.co.za');

  const parentThreads = useMemo(() => {
    const map = new Map<string, string>();
    chats.forEach(c => {
      if (c.parentEmail) {
        if (c.sender === 'Parent') {
          map.set(c.parentEmail, c.senderName);
        } else if (!map.has(c.parentEmail)) {
          const fallbackName = c.senderName.replace('Teacher Anne', 'Parent');
          map.set(c.parentEmail, fallbackName.includes('Parent') ? fallbackName : `Family ${c.parentEmail.split('@')[0]}`);
        }
      }
    });
    if (!map.has('parent@kiddiestown.co.za')) {
      map.set('parent@kiddiestown.co.za', 'Sarah Mbeki');
    }
    return Array.from(map.entries()).map(([email, name]) => ({ email, name }));
  }, [chats]);

  const handleSendChatText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    onSendMessage(chatInput, selectedParentEmail);
    setChatInput('');
  };

  return (
    <div className="glass-card rounded-3xl max-w-4xl mx-auto flex flex-col h-[600px] relative overflow-hidden shadow-2xl shadow-indigo-100/50">
      <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-full blur-3xl -z-10 opacity-60 translate-x-1/3 -translate-y-1/3" />
      
      <div className="p-6 md:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 bg-white/50 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-rose-200">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-xl">Instant Messaging Feed</h3>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Viewing correspondence with: <strong className="text-rose-600">{parentThreads.find(t => t.email === selectedParentEmail)?.name || 'Parent'}</strong>
            </p>
          </div>
        </div>
        
        <div className="relative group z-20">
          <div className="relative">
            <select
              value={selectedParentEmail}
              onChange={(e) => setSelectedParentEmail(e.target.value)}
              className="border border-slate-200 bg-white px-5 py-3 rounded-xl text-sm font-bold text-slate-700 outline-hidden appearance-none pr-10 shadow-sm focus:border-rose-300 focus:ring-4 focus:ring-rose-500/10 transition-all cursor-pointer"
            >
              {parentThreads.map(t => (
                <option key={t.email} value={t.email}>
                  {t.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <ChevronRight className="w-4 h-4 rotate-90" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 relative z-0">
        {chats.filter(msg => msg.parentEmail === selectedParentEmail).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-50">
            <MessageSquare className="w-12 h-12 text-slate-300 mb-4" />
            <p className="text-sm text-slate-400 font-bold">
              No active messages in this folder yet.
            </p>
          </div>
        ) : (
          chats
            .filter(msg => msg.parentEmail === selectedParentEmail)
            .map((msg, i) => {
              const isMe = msg.sender === 'Teacher';
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className={`flex items-center gap-2 mb-1.5 px-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                    <span className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-500">
                      {msg.senderName.substring(0, 2).toUpperCase()}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      {msg.senderName} <span className="font-normal opacity-70">• {msg.timestamp}</span>
                    </span>
                  </div>
                  <div className={`p-4 rounded-3xl text-sm max-w-[85%] md:max-w-[70%] leading-relaxed shadow-md ${
                    isMe
                      ? 'bg-gradient-to-br from-rose-500 to-pink-600 text-white rounded-tr-sm shadow-rose-200'
                      : 'bg-white border border-slate-100 text-slate-800 rounded-tl-sm shadow-slate-200/50'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              );
            })
        )}
      </div>

      <div className="p-6 md:p-8 bg-white/80 backdrop-blur-md border-t border-slate-100 z-10">
        <form onSubmit={handleSendChatText} className="flex gap-3">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder={`Reply direct to ${parentThreads.find(t => t.email === selectedParentEmail)?.name || 'Parent'}...`}
            className="flex-1 bg-white border border-slate-200 px-6 py-4 rounded-2xl text-sm text-slate-800 font-medium focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 transition-all outline-hidden shadow-inner"
            required
          />
          <button
            type="submit"
            className="px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 transition-all duration-300 rounded-2xl text-white font-bold text-sm cursor-pointer shadow-lg shadow-rose-200 hover:shadow-xl hover:shadow-rose-300 hover:-translate-y-0.5 flex items-center gap-2"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
