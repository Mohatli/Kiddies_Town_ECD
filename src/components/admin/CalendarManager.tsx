import React from 'react';
import { Calendar, Plus } from 'lucide-react';

export interface CalendarManagerProps {
  events: any[];
}

export default function CalendarManager({ events }: CalendarManagerProps) {
  return (
    <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-4">
        <div>
          <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            Academic Calendar Management
          </h3>
          <p className="text-xs text-slate-500 mt-1">Schedule school events, term dates, and public holidays.</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="grid grid-cols-7 gap-px bg-slate-200/60 border-b border-slate-200/60">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="bg-slate-50 py-3 text-center text-[10px] font-black uppercase tracking-wider text-slate-500">
              {day}
            </div>
          ))}
        </div>
        
        {/* Mock Calendar Grid - Visualization Only */}
        <div className="grid grid-cols-7 gap-px bg-slate-100">
          {Array.from({ length: 35 }).map((_, i) => {
            const dayNum = i - 2; // Offset for month start
            const isCurrentMonth = dayNum > 0 && dayNum <= 31;
            const hasEvent = isCurrentMonth && events.find(e => {
              const d = new Date(e.date).getDate();
              return d === dayNum;
            });
            
            return (
              <div key={i} className={`min-h-[100px] bg-white p-2 ${!isCurrentMonth ? 'opacity-40 bg-slate-50' : 'hover:bg-slate-50 transition-colors cursor-pointer'} flex flex-col gap-1`}>
                <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                  dayNum === new Date().getDate() ? 'bg-indigo-600 text-white' : 'text-slate-600'
                }`}>
                  {isCurrentMonth ? dayNum : ''}
                </span>
                
                {hasEvent && (
                  <div className={`text-[9px] font-bold p-1 rounded border leading-tight truncate ${
                    hasEvent.type === 'holiday' ? 'bg-rose-50 border-rose-200 text-rose-700' :
                    hasEvent.type === 'parent-meeting' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                    'bg-indigo-50 border-indigo-200 text-indigo-700'
                  }`}>
                    {hasEvent.title}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Events List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm">
          <h4 className="font-extrabold text-sm text-slate-800 mb-4">Upcoming Schedule</h4>
          <div className="space-y-3">
            {events.map((e, idx) => (
              <div key={idx} className="flex items-start gap-4 p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center shrink-0 shadow-xs">
                  <span className="text-[9px] font-black uppercase text-rose-500">{new Date(e.date).toLocaleString('default', { month: 'short' })}</span>
                  <span className="text-sm font-black text-slate-800">{new Date(e.date).getDate()}</span>
                </div>
                <div>
                  <h5 className="font-bold text-xs text-slate-800">{e.title}</h5>
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{e.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
