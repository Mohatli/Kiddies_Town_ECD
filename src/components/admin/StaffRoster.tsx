import React from 'react';
import { Briefcase, Heart } from 'lucide-react';

export interface StaffRosterProps {
  staffList: any[];
}

export default function StaffRoster({ staffList }: StaffRosterProps) {
  return (
    <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-4">
        <div>
          <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            Staff & Educator Roster
          </h3>
          <p className="text-xs text-slate-500 mt-1">Internal administrative view of employed educators, assistants, and support personnel.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm">
            + Add Staff Member
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staffList.map((staff, idx) => (
          <div key={idx} className="glass-card p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-start gap-4 hover-lift">
            <img src={staff.avatar} alt={staff.name} className="w-16 h-16 rounded-xl object-cover shadow-sm border border-slate-200" />
            <div className="flex-1 min-w-0">
              <h5 className="font-extrabold text-slate-800 text-sm truncate">{staff.name}</h5>
              <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider mt-0.5">{staff.role}</p>
              
              <div className="mt-3 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-medium">Assigned To:</span>
                  <span className="font-bold text-slate-700">{staff.room}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-medium">Qualifications:</span>
                  <span className="font-semibold text-slate-600">{staff.qualifications}</span>
                </div>
                {staff.cpr && (
                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded w-fit">
                    <Heart className="w-3 h-3 fill-emerald-600" /> First Aid & CPR Certified
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
