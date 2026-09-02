import React from 'react';
import { Sparkles, Heart, Facebook, ChevronRight } from 'lucide-react';
import { JournalPost } from '../../types';

interface WeeklyThemesProps {
  journalPosts: JournalPost[];
}

export default function WeeklyThemes({ journalPosts }: WeeklyThemesProps) {
  return (
    <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
      <div className="glass-card rounded-3xl p-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h3 className="font-black text-slate-900 text-2xl">Classroom Gallery & Lessons</h3>
          <p className="text-sm font-medium text-slate-500 mt-2 max-w-2xl">
            Visual records of children engaged in creative arts, physical exercises, and lessons. Supporting CARE, EDUCATE & DEVELOP.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-pink-200">
          <Sparkles className="w-4 h-4" />
          Teacher Verified
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {journalPosts.map((post) => (
          <article
            key={post.id}
            className="glass-card rounded-3xl overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col h-full group"
          >
            <div className="relative overflow-hidden">
              <img
                src={post.imageUrl}
                alt={post.title}
                referrerPolicy="no-referrer"
                className="w-full h-56 object-cover object-center bg-slate-100 group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between relative bg-white/40">
              <div>
                <p className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black tracking-widest uppercase mb-3 border border-indigo-100">{post.date}</p>
                <h4 className="font-black text-slate-900 text-lg leading-tight">{post.title}</h4>
                <p className="text-sm font-medium text-slate-600 mt-3 leading-relaxed">
                  {post.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/50 flex items-center justify-between">
                <span className="flex items-center gap-2 text-[11px] text-slate-500 font-bold">
                  <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] text-slate-600">{post.postedBy.charAt(0)}</div>
                  {post.postedBy}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[10px] text-pink-600 font-black tracking-widest uppercase bg-pink-50 px-2 py-1 rounded-md">
                  <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
                  Verified
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 mt-10 shadow-xl shadow-blue-200">
        <div className="flex items-center gap-5">
          <span className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shrink-0 transform rotate-3">
            <Facebook className="w-7 h-7" />
          </span>
          <div>
            <h4 className="font-black text-white text-lg">See standard classroom activity archives?</h4>
            <p className="text-sm font-medium text-blue-100 mt-1">Explore daily highlight reels, videos, and galleries on our public page.</p>
          </div>
        </div>
        <a 
          href="https://www.facebook.com/p/Kiddies-Town-ECD-100084221528687/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-white text-blue-700 hover:bg-blue-50 font-black text-sm px-6 py-3.5 rounded-2xl flex items-center gap-2 transition-all duration-300 shadow-lg cursor-pointer shrink-0 whitespace-nowrap hover:scale-105"
        >
          <span>View Facebook Albums</span>
          <ChevronRight className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
}
