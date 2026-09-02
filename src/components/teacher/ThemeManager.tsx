import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, CheckCircle2, Check, Trash2, Plus } from 'lucide-react';
import { WeeklyTheme } from '../../types';

interface ThemeManagerProps {
  themes: WeeklyTheme[];
  onAddTheme: (theme: WeeklyTheme) => void;
}

export default function ThemeManager({ themes, onAddTheme }: ThemeManagerProps) {
  const [themeTitle, setThemeTitle] = useState('Safari Adventures');
  const [themeDesc, setThemeDesc] = useState('Exploring African wildlife and animal tracking.');
  const [newActivity, setNewActivity] = useState('');
  const [themeActivities, setThemeActivities] = useState<string[]>([
    'Lions craft with woolly manes',
    'Identifying animal tracks in muddy prints'
  ]);
  const [themeSuccess, setThemeSuccess] = useState(false);

  const handleAddActivity = () => {
    if (!newActivity.trim()) return;
    setThemeActivities([...themeActivities, newActivity]);
    setNewActivity('');
  };

  const handleRemoveActivity = (idx: number) => {
    setThemeActivities(themeActivities.filter((_, i) => i !== idx));
  };

  const handleSaveTheme = () => {
    onAddTheme({
      weekNo: themes.length + 1,
      title: themeTitle,
      description: themeDesc,
      activities: themeActivities
    });
    setThemeSuccess(true);
    setTimeout(() => {
      setThemeSuccess(false);
    }, 3000);
  };

  return (
    <div className="glass-card rounded-3xl p-6 md:p-10 max-w-4xl mx-auto space-y-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-violet-50 rounded-full blur-3xl -z-10 opacity-60 -translate-x-1/2 -translate-y-1/2" />
      
      <div className="border-b border-indigo-50/50 pb-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-extrabold text-slate-800 text-xl">Weekly Themes & Home Learning Guides</h3>
          <p className="text-sm text-slate-500 font-medium mt-1">Design the curriculum path for parents to follow.</p>
        </div>
      </div>

      {themeSuccess ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-800 p-10 rounded-3xl border border-emerald-100/60 text-center shadow-lg shadow-emerald-100/50"
        >
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}>
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          </motion.div>
          <h4 className="font-black text-xl">Weekly Theme Published!</h4>
          <p className="text-sm text-emerald-700/80 mt-2 font-medium">Parents will view this educational theme in their dashboard to support home study loops.</p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          <div className="relative group">
            <label className="absolute -top-2.5 left-4 bg-white px-2 text-[10px] uppercase font-bold tracking-wider text-indigo-500 z-10 transition-colors">Theme Title</label>
            <input
              type="text"
              value={themeTitle}
              onChange={(e) => setThemeTitle(e.target.value)}
              className="bg-white border border-slate-200 w-full px-5 py-4 rounded-2xl text-slate-800 font-semibold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-hidden relative z-0"
            />
          </div>

          <div className="relative group">
            <label className="absolute -top-2.5 left-4 bg-white px-2 text-[10px] uppercase font-bold tracking-wider text-indigo-500 z-10 transition-colors">Theme Overview Description</label>
            <textarea
              value={themeDesc}
              onChange={(e) => setThemeDesc(e.target.value)}
              className="bg-white border border-slate-200 w-full px-5 py-4 rounded-2xl text-slate-800 font-semibold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-hidden h-28 relative z-0 resize-none"
            />
          </div>

          <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-6">
            <label className="block text-[11px] uppercase font-bold tracking-widest text-slate-500 mb-4 flex items-center gap-2">
              <Check className="w-4 h-4 text-indigo-500" />
              In-Class Activities Checklist
            </label>
            
            <div className="space-y-3">
              <AnimatePresence>
                {themeActivities.map((act, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center justify-between p-4 bg-white border border-slate-200/60 rounded-xl shadow-sm group"
                  >
                    <span className="text-slate-700 font-medium text-sm">{act}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveActivity(idx)}
                      className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-5">
              <input
                type="text"
                value={newActivity}
                onChange={(e) => setNewActivity(e.target.value)}
                placeholder="e.g. Clay sculpting lion models..."
                className="bg-white border border-slate-200 flex-1 px-5 py-3.5 rounded-xl text-slate-800 font-medium focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-hidden text-sm"
              />
              <button
                type="button"
                onClick={handleAddActivity}
                className="px-6 py-3.5 bg-indigo-50 border border-indigo-100 text-indigo-700 hover:bg-indigo-600 hover:text-white transition-all duration-300 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-lg hover:shadow-indigo-200"
              >
                <Plus className="w-4 h-4" /> Add Activity
              </button>
            </div>
          </div>

          <button
            onClick={handleSaveTheme}
            className="w-full mt-6 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 transition-all duration-300 text-white font-bold tracking-widest uppercase text-xs rounded-2xl cursor-pointer shadow-xl shadow-indigo-200 hover:shadow-2xl hover:shadow-indigo-300 hover:-translate-y-0.5 animate-gradient-x"
          >
            Publish Weekly Theme Update
          </button>
        </div>
      )}
    </div>
  );
}
