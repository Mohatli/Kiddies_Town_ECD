import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, AlertCircle, UserCheck, Send, Clock3 } from 'lucide-react';
import { Learner, DailyRegister } from '../../types';

interface AttendanceTrackerProps {
  selectedClass: string;
  classStudents: Learner[];
  totalLearners?: number;
  todayRegister?: DailyRegister;
  onUpdateAttendance: (studentId: string, status: 'Present' | 'Absent' | 'Excused') => void | Promise<void>;
  onMarkAllPresent: (studentIds: string[]) => Promise<void>;
  onSubmitRegister?: () => Promise<DailyRegister>;
  attendanceError?: string | null;
}

export default function AttendanceTracker({
  selectedClass,
  classStudents,
  totalLearners,
  todayRegister,
  onUpdateAttendance,
  onMarkAllPresent,
  onSubmitRegister,
  attendanceError
}: AttendanceTrackerProps) {
  const [isBulkSubmitting, setIsBulkSubmitting] = useState(false);
  const [bulkSuccessCount, setBulkSuccessCount] = useState<number | null>(null);
  const [isRegisterSubmitting, setIsRegisterSubmitting] = useState(false);
  const [registerSubmittedAt, setRegisterSubmittedAt] = useState<string | null>(
    todayRegister?.submittedAt ? new Date(todayRegister.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null
  );

  const pendingStudents = classStudents.filter(s => s.attendanceStatus === 'Pending');

  const handleMarkAllPresent = async () => {
    if (pendingStudents.length === 0 || isBulkSubmitting) return;
    setIsBulkSubmitting(true);
    setBulkSuccessCount(null);
    try {
      await onMarkAllPresent(pendingStudents.map((s) => s.id));
      setBulkSuccessCount(pendingStudents.length);
      setTimeout(() => setBulkSuccessCount(null), 4000);
    } finally {
      setIsBulkSubmitting(false);
    }
  };

  const handleSubmitRegister = async () => {
    if (!onSubmitRegister || isRegisterSubmitting) return;
    setIsRegisterSubmitting(true);
    try {
      await onSubmitRegister();
      setRegisterSubmittedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch {
      // Error banner is surfaced via attendanceError
    } finally {
      setIsRegisterSubmitting(false);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 md:p-10 max-w-4xl mx-auto relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -z-10 opacity-60 translate-x-1/2 -translate-y-1/2" />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-indigo-50/50 pb-6">
        <div>
          <h3 className="font-extrabold text-slate-800 text-xl flex items-center gap-2">
            Daily Attendance Register
          </h3>
          <p className="text-sm text-slate-500 font-medium mt-1">{selectedClass} Class Room • Today</p>
        </div>
        <div className="bg-gradient-to-r from-amber-50 to-rose-50 border border-amber-100/50 px-4 py-2.5 rounded-xl flex items-center gap-3 shadow-sm">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
          </span>
          <span className="text-sm font-bold text-amber-700">
            Pending: {pendingStudents.length} kids
          </span>
        </div>
      </div>

      {attendanceError && (
        <div role="alert" className="flex items-start gap-2.5 p-3.5 mb-5 bg-red-50 border border-red-200 rounded-xl text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
          <p className="text-xs font-bold leading-relaxed">{attendanceError}</p>
        </div>
      )}

      {bulkSuccessCount !== null && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2.5 p-3.5 mb-5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
          <p className="text-xs font-bold leading-relaxed">
            Marked {bulkSuccessCount} learner{bulkSuccessCount === 1 ? '' : 's'} present — the register has been synced.
          </p>
        </motion.div>
      )}

      <div className="space-y-4">
          {classStudents.map((student, idx) => (
            <motion.div 
              key={student.id} 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group p-4 bg-white hover:bg-slate-50/80 transition-all duration-300 border border-slate-100 hover:border-indigo-100/60 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 hover:shadow-xl hover:shadow-indigo-50/40 hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 text-indigo-700 font-bold text-sm flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
                  {student.firstNames[0]}{student.surname[0]}
                </div>
                <div>
                  <p className="font-bold text-base text-slate-800">{student.firstNames} {student.surname}</p>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">DOB: {student.dob}</p>
                </div>
              </div>

              {/* Present/Absent status switch pills */}
              <div className="flex gap-2 w-full sm:w-auto bg-slate-50/50 p-1.5 rounded-xl border border-slate-100/50">
                {(['Present', 'Absent', 'Excused'] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => onUpdateAttendance(student.id, opt)}
                    className={`flex-1 sm:flex-none px-4 py-2.5 text-[11px] font-black uppercase tracking-wider rounded-lg transition-all duration-300 cursor-pointer ${
                      student.attendanceStatus === opt
                        ? opt === 'Present'
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200/50 scale-105'
                          : opt === 'Absent'
                          ? 'bg-rose-500 text-white shadow-lg shadow-rose-200/50 scale-105'
                          : 'bg-amber-500 text-white shadow-lg shadow-amber-200/50 scale-105'
                        : 'bg-transparent text-slate-500 hover:bg-white hover:shadow-sm'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          ))}

          <button
            onClick={handleMarkAllPresent}
            disabled={isBulkSubmitting || pendingStudents.length === 0}
            className="w-full mt-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:opacity-50 disabled:pointer-events-none transition-all duration-300 rounded-2xl text-white font-bold tracking-widest uppercase text-xs cursor-pointer shadow-xl shadow-indigo-200 hover:shadow-2xl hover:shadow-indigo-300 hover:-translate-y-0.5 animate-gradient-x flex items-center justify-center gap-2"
          >
            <UserCheck className="w-4 h-4" aria-hidden="true" />
            {isBulkSubmitting
              ? 'Marking Present…'
              : pendingStudents.length === 0
              ? 'All Learners Marked'
              : `Mark All ${pendingStudents.length} Pending Learners Present`}
          </button>

          {/* Submit the compiled daily register to administration */}
          {onSubmitRegister && (
            <div className="mt-5 pt-6 border-t border-slate-100">
              {registerSubmittedAt && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2.5 p-3.5 mb-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <p className="text-xs font-bold leading-relaxed">
                    Daily register submitted at {registerSubmittedAt} — it now feeds the administration attendance statistics.
                  </p>
                </motion.div>
              )}
              <button
                onClick={handleSubmitRegister}
                disabled={isRegisterSubmitting || classStudents.length === 0}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:pointer-events-none transition-all duration-300 rounded-2xl text-white font-bold tracking-widest uppercase text-xs cursor-pointer shadow-xl shadow-emerald-200 hover:shadow-2xl hover:shadow-emerald-300 hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                {isRegisterSubmitting ? (
                  <>Submitting…</>
                ) : registerSubmittedAt ? (
                  <>
                    <Clock3 className="w-4 h-4" aria-hidden="true" />
                    Re-submit Updated Register ({(totalLearners ?? classStudents.length)} learners)
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" aria-hidden="true" />
                    Submit Daily Register to Administration ({totalLearners ?? classStudents.length} learners)
                  </>
                )}
              </button>
              <p className="text-[11px] text-slate-400 font-medium text-center mt-3">
                Submits attendance for ALL classes ({totalLearners ?? classStudents.length} learners), not just {selectedClass}.
              </p>
            </div>
          )}
        </div>
      </div>
  );
}
