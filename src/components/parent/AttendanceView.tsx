import React from 'react';
import { Clock, Plus } from 'lucide-react';
import { Learner } from '../../types';

interface AttendanceViewProps {
  learner?: Learner;
  onApplyOnline?: () => void;
}

export default function AttendanceView({ learner, onApplyOnline }: AttendanceViewProps) {
  if (learner) {
    if (learner.enrolmentApproved === false) {
      return (
        <div className="glass-card bg-gradient-to-br from-amber-50/80 to-orange-50/80 rounded-3xl p-7 flex flex-col justify-between group hover:shadow-[0_10px_40px_-10px_rgba(245,158,11,0.2)] transition-all duration-300">
          <div>
            <span className="text-xs font-black text-amber-600 tracking-widest uppercase flex items-center gap-1.5">
              <Clock className="w-4 h-4 animate-spin-slow" /> Admission Status
            </span>
            <h3 className="text-xl font-black text-slate-800 mt-3">{learner.firstNames} {learner.surname}</h3>
            <p className="text-sm text-slate-500 mt-1 font-bold">{learner.classType} Class</p>
            <div className="p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-white mt-4 text-xs text-amber-800 font-bold leading-relaxed shadow-sm">
              Application Submitted & Pending Board Approval. Profile will activate shortly.
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="glass-card rounded-3xl p-7 flex flex-col justify-between group hover:shadow-[0_10px_40px_-10px_rgba(79,70,229,0.15)] transition-all duration-300 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-500/10 to-transparent rounded-full -mr-10 -mt-10 blur-2xl" />
        <div className="relative z-10">
          <span className="text-[10px] font-black text-indigo-600 tracking-widest uppercase bg-indigo-50 px-2.5 py-1 rounded-lg">Active Learner</span>
          <h3 className="text-xl font-black text-slate-900 mt-4">{learner.firstNames} {learner.surname}</h3>
          <p className="text-sm text-slate-500 mt-1 font-bold">{learner.classType} Class</p>
        </div>
        <div className="flex items-center gap-3 mt-8 pt-5 border-t border-slate-200/50 relative z-10">
          <div className="p-2 px-3 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 text-white flex items-center gap-2 shadow-md shadow-emerald-200/50">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-bold">{learner.attendanceStatus || 'Present'}</span>
          </div>
          <span className="text-xs text-slate-500 font-bold">Arrived at {learner.arrivedTime || '07:45'} AM</span>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card bg-gradient-to-br from-rose-50/80 to-pink-50/80 rounded-3xl p-7 flex flex-col justify-between group hover:shadow-[0_10px_40px_-10px_rgba(244,63,94,0.2)] transition-all duration-300">
      <div>
        <span className="text-xs font-black text-rose-600 tracking-widest uppercase">Admission Status</span>
        <h3 className="text-lg font-black text-slate-900 mt-3">No Active Enrolment</h3>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed font-medium">
          Submit an admissions application to register your child at Kiddies Town ECD & Academy.
        </p>
      </div>
      <button
        onClick={onApplyOnline}
        className="mt-6 flex items-center justify-center gap-2 w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-sm font-bold py-3 px-4 rounded-xl transition-all duration-300 cursor-pointer shadow-lg shadow-rose-200/50 hover:-translate-y-1"
      >
        <Plus className="w-4 h-4" />
        <span>Apply Online Now</span>
      </button>
    </div>
  );
}
