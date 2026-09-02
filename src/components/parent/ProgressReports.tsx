import React from 'react';
import { FileText, HelpCircle } from 'lucide-react';
import { ProgressReport } from '../../types';

interface ProgressReportsProps {
  reports: ProgressReport[];
  onSelectReport: (report: ProgressReport) => void;
}

export default function ProgressReports({ reports, onSelectReport }: ProgressReportsProps) {
  return (
    <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
      <div className="glass-card rounded-3xl p-8 flex justify-between items-center">
        <div>
          <h3 className="font-black text-slate-900 text-2xl">Academic Performance Reports</h3>
          <p className="text-sm font-medium text-slate-500 mt-2">
            Manage and view children progress reports evaluated by Kiddies Town teachers.
          </p>
        </div>
        <div className="hidden md:flex w-16 h-16 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-2xl items-center justify-center rotate-3 shadow-inner">
          <FileText className="w-8 h-8 text-indigo-500" />
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center space-y-5">
          <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center text-slate-400 shadow-inner border border-slate-200">
            <FileText className="w-10 h-10" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h4 className="font-black text-slate-800 text-lg">No Performance Reports Dispatched</h4>
            <p className="text-sm font-medium text-slate-500 leading-relaxed">
              Once classes commence and term evaluation milestones are processed, teachers will post formal progress reports here.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div
              key={report.id}
              className="glass-card rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-500/5 to-transparent rounded-full -mr-8 -mt-8 blur-xl" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg tracking-widest ${
                    report.released
                      ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 text-white shadow-md shadow-emerald-200'
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}>
                    {report.released ? 'Released' : 'Pending Evaluation'}
                  </span>
                  <span className="text-xs text-slate-400 font-bold bg-white/50 px-2 py-1 rounded-md">
                    Year: {report.academicYear}
                  </span>
                </div>
                <h4 className="font-black text-slate-900 text-lg">Term {report.term} Progress</h4>
                <p className="text-xs font-medium text-slate-500 mt-2">
                  {report.released ? `Released on ${report.releasedDate}` : 'Results will be released mid November.'}
                </p>
              </div>

              {report.released ? (
                <button
                  onClick={() => onSelectReport(report)}
                  className="mt-8 relative z-10 inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-50 to-violet-50 hover:from-indigo-100 hover:to-violet-100 text-indigo-700 transition-all duration-300 font-bold text-sm rounded-xl cursor-pointer border border-indigo-100 shadow-sm group-hover:shadow-md"
                >
                  <FileText className="w-4 h-4" />
                  View Detailed Sheet
                </button>
              ) : (
                <div className="mt-8 relative z-10 flex items-center gap-2 p-3 bg-slate-50/80 rounded-xl text-slate-500 border border-slate-100">
                  <HelpCircle className="w-4 h-4 shrink-0" />
                  <span className="text-[11px] font-bold leading-tight">Comments locked until principal release approvals.</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
