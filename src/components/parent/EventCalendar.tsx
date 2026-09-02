import React, { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { SchoolEvent, ParentProfile } from '../../types';

interface EventCalendarProps {
  events: SchoolEvent[];
  profile: ParentProfile;
  onRsvpEvent: (eventId: string, status: 'Yes' | 'No' | 'Maybe') => void;
}

export default function EventCalendar({ events, profile, onRsvpEvent }: EventCalendarProps) {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-[fadeIn_0.5s_ease-out]">
      <div className="xl:col-span-2 glass-card rounded-3xl p-8">
        <div className="flex justify-between items-center mb-8 border-b border-slate-200/50 pb-5">
          <div>
            <h3 className="font-black text-slate-900 text-2xl">School Event Calendar</h3>
            <p className="text-sm font-medium text-slate-500 mt-1">Year planner and extracurricular event list</p>
          </div>
          <span className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-xs font-black rounded-xl shadow-md shadow-indigo-200">
            October - November 2025
          </span>
        </div>

        <div className="mb-6 grid grid-cols-7 gap-2 text-center font-black text-[11px] text-slate-400 tracking-widest uppercase border-b border-slate-100 pb-3">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <span key={d}>{d}</span>)}
        </div>
        <div className="grid grid-cols-7 gap-2 mb-2">
          {Array.from({ length: 31 }).map((_, idx) => {
            const dayVal = idx + 1;
            const hasEvent = [27].includes(dayVal);
            return (
              <div
                key={idx}
                className={`aspect-square sm:p-2 flex flex-col items-center justify-center rounded-2xl text-sm font-bold transition-all duration-300 relative ${
                  hasEvent 
                    ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-200 transform hover:scale-110 cursor-pointer' 
                    : 'bg-white/50 text-slate-600 border border-white hover:bg-white'
                }`}
              >
                <span className="z-10">{dayVal}</span>
                {hasEvent && <span className="absolute bottom-2 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-6">
        <div className="glass-card rounded-3xl p-8">
          <h3 className="font-black text-slate-900 text-lg mb-6 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-indigo-500" /> Upcoming Events
          </h3>
          
          <div className="space-y-5 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            {events.map((event, index) => {
              const rsvp = event.rsvps.find(r => r.parentName === profile.name);
              return (
                <div
                  key={event.id}
                  onClick={() => setSelectedEventId(event.id === selectedEventId ? null : event.id)}
                  className={`relative p-5 rounded-2xl border transition-all duration-300 z-10 cursor-pointer ${
                    selectedEventId === event.id
                      ? 'bg-white border-indigo-200 shadow-xl shadow-indigo-100/50 scale-[1.02]'
                      : 'bg-white/60 backdrop-blur-sm border-white shadow-sm hover:shadow-md hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-slate-100 to-slate-50 text-slate-600 px-3 py-1 rounded-lg border border-slate-200/50">
                      {event.category}
                    </span>
                    <span className="text-[11px] text-indigo-600 font-bold bg-indigo-50 px-2 py-1 rounded-md">{event.date}</span>
                  </div>
                  <h4 className="font-black text-slate-900 text-base">{event.title}</h4>
                  <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">
                    {event.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                      RSVP: 
                      <span className={`px-2 py-0.5 rounded-md text-white shadow-sm ${
                        rsvp?.status === 'Yes' ? 'bg-emerald-500' : rsvp?.status === 'No' ? 'bg-rose-500' : rsvp?.status === 'Maybe' ? 'bg-amber-500' : 'bg-slate-300'
                      }`}>
                        {rsvp?.status || 'None'}
                      </span>
                    </span>

                    <div className="flex gap-2">
                      {(['Yes', 'No', 'Maybe'] as const).map((opt) => (
                        <button
                          key={opt}
                          onClick={(e) => {
                            e.stopPropagation();
                            onRsvpEvent(event.id, opt);
                          }}
                          className={`px-3 py-1.5 text-[10px] font-black tracking-wide uppercase rounded-lg border transition-all duration-300 cursor-pointer ${
                            rsvp?.status === opt
                              ? opt === 'Yes' ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-200' :
                                opt === 'No' ? 'bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-200' :
                                'bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-200'
                              : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:shadow-sm'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
