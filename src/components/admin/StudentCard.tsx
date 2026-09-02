import React from 'react';
import { motion } from 'motion/react';
import { 
  User, CheckCircle2, Heart, Truck, Mail, 
  MapPin, Clock, Edit3, Trash2
} from 'lucide-react';
import { Learner } from '../../types';

export interface StudentCardProps {
  student: Learner;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onViewMedical: (learner: Learner) => void;
  onManageTransport: (learner: Learner) => void;
  onRemoveStudent?: (id: string) => void;
}

export default function StudentCard({
  student,
  isSelected,
  onToggleSelect,
  onViewMedical,
  onManageTransport,
  onRemoveStudent
}: StudentCardProps) {
  // Safe defaults for visualization
  const emergencyPhone = student.id === 'student-leo' ? '+27 82 555 1234' : '+27 82 444 9999';
  const hasMedicalAlert = student.id === 'student-thabo' || student.id === 'student-leo';
  
  return (
    <div 
      className={`glass-card rounded-2xl p-5 border transition-all duration-300 relative group overflow-hidden ${
        isSelected 
          ? 'border-indigo-400 shadow-md shadow-indigo-100 bg-indigo-50/10 ring-2 ring-indigo-500/10 ring-offset-1' 
          : 'border-slate-200/60 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50 hover-lift'
      }`}
    >
      {/* Decorative gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      {/* Selection Checkbox */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <label className="relative flex items-center cursor-pointer p-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(student.id)}
            className="peer sr-only"
          />
          <div className="w-5 h-5 rounded-md border-2 border-slate-300 peer-checked:border-indigo-600 peer-checked:bg-indigo-600 transition-all flex items-center justify-center">
            <CheckCircle2 className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 scale-50 peer-checked:scale-100 transition-all" />
          </div>
        </label>
      </div>

      <div className="flex flex-col h-full space-y-4 relative z-10">
        {/* Header: Avatar & Names */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 shadow-sm relative group-hover:scale-105 transition-transform">
            <User className="w-6 h-6 text-indigo-500" />
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${
              student.status === 'enrolled' ? 'bg-emerald-500' : 'bg-slate-300'
            }`}>
              {student.status === 'enrolled' && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
            </div>
          </div>
          
          <div className="pt-1">
            <h5 className="font-extrabold text-slate-800 text-base leading-tight group-hover:text-indigo-700 transition-colors">
              {student.firstNames} <span className="text-slate-900">{student.surname}</span>
            </h5>
            <p className="text-[10px] text-slate-400 font-bold font-mono mt-0.5">ID: {student.idNumber || 'No ID provided'}</p>
            
            <div className="flex items-center gap-1.5 mt-2">
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-md text-[9px] font-black uppercase tracking-wider">
                {student.classType || 'Unassigned'} Room
              </span>
              <span className={`px-2 py-0.5 border rounded-md text-[9px] font-black uppercase tracking-wider ${
                student.status === 'enrolled' 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
                {student.status}
              </span>
            </div>
          </div>
        </div>

        {/* Parent & Contact Grid */}
        <div className="grid grid-cols-1 bg-white/60 p-3 rounded-xl border border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-semibold">Primary Parent:</span>
            <span className="font-extrabold text-slate-700">{student.parentName || 'Not specified'}</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <Mail className="w-3 h-3" /> Email:
            </span>
            <span className="font-bold text-slate-600 truncate max-w-[120px]">{student.parentEmail || 'No email'}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100">
            <span className="text-slate-400 font-semibold">Emergency:</span>
            <span className="font-mono font-bold text-rose-600">{emergencyPhone}</span>
          </div>
        </div>

        {/* Status Indicators & Actions */}
        <div className="mt-auto pt-3 border-t border-slate-200/60">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Quick Actions</span>
            {hasMedicalAlert && (
              <span className="flex items-center gap-1 text-[9px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">
                <Heart className="w-2.5 h-2.5 fill-rose-600" /> Alerts Active
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onViewMedical(student)}
              className="px-3 py-2 rounded-lg text-[10.5px] font-bold transition-all flex items-center justify-center gap-1.5 border hover:-translate-y-0.5 hover:shadow-sm bg-white border-slate-200 text-slate-700 hover:border-rose-300 hover:text-rose-600 group/btn"
            >
              <Heart className="w-3.5 h-3.5 text-rose-400 group-hover/btn:text-rose-600 group-hover/btn:fill-rose-100 transition-colors" />
              Medical
            </button>
            <button
              type="button"
              onClick={() => onManageTransport(student)}
              className="px-3 py-2 rounded-lg text-[10.5px] font-bold transition-all flex items-center justify-center gap-1.5 border hover:-translate-y-0.5 hover:shadow-sm bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:text-indigo-600 group/btn"
            >
              <Truck className={`w-3.5 h-3.5 ${student.transportNeeded ? 'text-indigo-600' : 'text-slate-400'} group-hover/btn:text-indigo-600 transition-colors`} />
              Transport
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
