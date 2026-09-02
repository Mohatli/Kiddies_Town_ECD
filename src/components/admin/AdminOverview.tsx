import React from 'react';
import { motion } from 'motion/react';
import { 
  AlertCircle, Download, Check, Mail, RefreshCw, FileText, 
  CheckCircle2, Users, Truck, Phone, UserCheck 
} from 'lucide-react';
import { EnrolmentApplication, Learner } from '../../types';

export interface AdminOverviewProps {
  totalStudents: number;
  pendingEnrolmentsCount: number;
  dailyActiveChildren: number;
  delinquentAccounts: any[];
  notifiedParents: string[];
  downloadPaymentsCSV: () => void;
  triggerArrearsNotice: (parentName: string, amount: number) => void;
  downloadBackupJSON: () => void;
  handleResetDatabase: () => void;
  resetting: boolean;
  resetMessage: string | null;
  pendingApps: EnrolmentApplication[];
  handleApproveClick: (enrolId: string) => void;
  attendanceGraphData: any[];
  computedTransportRoutes: any[];
}

export default function AdminOverview({
  totalStudents,
  pendingEnrolmentsCount,
  dailyActiveChildren,
  delinquentAccounts,
  notifiedParents,
  downloadPaymentsCSV,
  triggerArrearsNotice,
  downloadBackupJSON,
  handleResetDatabase,
  resetting,
  resetMessage,
  pendingApps,
  handleApproveClick,
  attendanceGraphData,
  computedTransportRoutes
}: AdminOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Financial Arrears Alerts Banner list */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="xl:col-span-2 glass-card rounded-3xl p-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2"></div>
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200/50">
            <div>
              <h4 className="font-extrabold text-slate-800 text-sm uppercase tracking-widest flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-500" />
                Active Arrears Accounts
              </h4>
              <p className="text-xs text-slate-500 mt-1.5 font-medium">Generate direct notices to parent profiles immediately</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={downloadPaymentsCSV}
                className="px-3 py-2 bg-white/80 hover:bg-white text-indigo-600 font-bold text-[11px] uppercase rounded-xl transition-all shadow-sm border border-slate-200/60 flex items-center gap-2 cursor-pointer hover-lift"
                title="Download Arrears CSV Report"
              >
                <Download className="w-3 h-3" />
                Download Report
              </button>
              <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200">
                Action Required
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {delinquentAccounts.map((ac) => {
              const isNotified = notifiedParents.includes(ac.parentName);
              return (
                <div key={ac.id} className="p-5 bg-white/60 hover:bg-white transition-all rounded-2xl border border-slate-200/60 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 hover-lift">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h5 className="font-extrabold text-sm text-slate-800">{ac.parentName}</h5>
                      <span className="text-[10px] bg-rose-100 text-rose-700 border border-rose-200/60 px-2.5 py-1 rounded-full font-black uppercase tracking-wider shadow-sm">
                        {ac.daysOverdue} Days Overdue
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">Learner: <span className="font-semibold text-slate-700">{ac.childName}</span> • Total Overdue: <span className="font-mono font-black text-rose-600 text-sm">R{ac.amount}</span></p>
                  </div>

                  <button
                    onClick={() => triggerArrearsNotice(ac.parentName, ac.amount)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-300 cursor-pointer inline-flex items-center gap-2 shadow-sm ${
                      isNotified
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/20'
                        : 'bg-gradient-to-r from-slate-800 to-slate-900 text-white hover:shadow-slate-800/20 hover-lift'
                    }`}
                    disabled={isNotified}
                  >
                    {isNotified ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        Notice Sent!
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4" />
                        Send Warning
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Performance counters */}
        <div className="bg-gradient-to-br from-indigo-900 via-violet-900 to-purple-900 text-indigo-50 rounded-3xl p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <h4 className="font-black text-xs uppercase tracking-widest text-indigo-200">Kiddies Town Pipeline</h4>
            <p className="text-xs text-indigo-200/80 mt-1.5 font-medium">System dashboard controls</p>
          </div>

          <div className="grid grid-cols-2 gap-4 my-8 relative z-10">
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/15 transition-colors">
              <p className="text-[10px] text-indigo-200 uppercase font-bold tracking-widest">Enrolled</p>
              <p className="text-3xl font-mono font-black mt-2 text-white">{totalStudents}</p>
            </div>

            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/15 transition-colors">
              <p className="text-[10px] text-indigo-200 uppercase font-bold tracking-widest">Pipeline Apps</p>
              <p className="text-3xl font-mono font-black mt-2 text-white">{pendingEnrolmentsCount}</p>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-white/10 flex flex-col gap-3 relative z-10">
            <button
              type="button"
              onClick={downloadBackupJSON}
              className="w-full flex items-center justify-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-extrabold text-[11px] uppercase py-3 px-4 rounded-xl transition-all cursor-pointer backdrop-blur-sm border border-emerald-500/30"
            >
              <Download className="w-4 h-4" />
              Backup System
            </button>
            <button
              type="button"
              onClick={handleResetDatabase}
              disabled={resetting}
              className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white font-extrabold text-[11px] uppercase py-3 px-4 rounded-xl transition-all cursor-pointer backdrop-blur-sm border border-white/10"
            >
              <RefreshCw className={`w-4 h-4 ${resetting ? 'animate-spin' : ''}`} />
              {resetting ? 'Synchronizing...' : 'Sync & Reset DB'}
            </button>
            {resetMessage && (
              <p className="text-[10px] text-amber-300 font-bold mt-2 text-center font-mono">
                {resetMessage}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* DEDICATED ENROLLMENT PIPELINE SECTION */}
      <div className="glass-card rounded-3xl p-8 shadow-sm space-y-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-100 pb-4 gap-3">
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              Enrollment Pipeline (Pending Action)
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Directly onboard pending child applications into the active student directory, assign to classrooms, and auto-generate initial tuition invoices.
            </p>
          </div>
          <span className="px-3 py-1 text-xs font-black rounded-full bg-amber-50 text-amber-700 border border-amber-200/60 w-fit shrink-0">
            {pendingApps.length} Pending Onboarding
          </span>
        </div>

        {pendingApps.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200/80">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="text-xs font-black text-slate-800">No Pending Applications!</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Your enrollment pipeline is 100% clean. All registered kiddies have been approved and moved to active registers.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {pendingApps.map((app) => {
              const child = app.childParticulars;
              const parent = app.parentParticulars;
              const hasTransport = app.transportDetails?.needed;
              const pEmail = app.parentParticulars?.email || app.parentParticulars?.mother?.email || 'parent@kiddiestown.co.za';
              
              return (
                <div key={app.id} className="bg-slate-50/50 rounded-2xl p-5 border border-slate-200 hover:border-indigo-300 hover:bg-white transition-all duration-200 flex flex-col justify-between shadow-2xs group relative overflow-hidden">
                  {/* Top Design Accent line */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500" />
                  
                  <div className="space-y-4">
                    {/* Header details */}
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-md text-[9.5px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {child?.classType || 'Giraffes'} Room
                        </span>
                        <h5 className="font-extrabold text-slate-900 text-base mt-2 leading-tight">
                          {child?.firstNames || 'Unnamed'} {child?.surname || 'Child'}
                        </h5>
                        <p className="text-[10px] text-slate-400 font-bold font-mono mt-0.5">ID No: {child?.idNumber || 'No national ID provided'}</p>
                      </div>
                      <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-150 px-2 py-0.5 rounded-lg font-black tracking-wider uppercase shrink-0">
                        Step {app.step}/6
                      </span>
                    </div>

                    {/* Parent Details card block */}
                    <div className="p-3 bg-white group-hover:bg-slate-50/80 rounded-xl border border-slate-200/60 space-y-1.5 transition-colors">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Parent Contact Profile</p>
                      <div className="text-[11px] font-extrabold text-slate-800 leading-none">
                        {parent?.name || (parent?.mother?.firstNames ? `${parent.mother.firstNames} Zulu` : 'Registered Parent')}
                      </div>
                      <div className="text-[10.5px] text-slate-500 font-semibold flex items-center gap-1.5 leading-tight truncate select-all">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {pEmail}
                      </div>
                      {parent?.phone && (
                        <div className="text-[10.5px] text-slate-500 font-semibold flex items-center gap-1.5 leading-none">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {parent.phone}
                        </div>
                      )}
                    </div>

                    {/* Essential child specifications */}
                    <div className="grid grid-cols-2 gap-2.5 text-[10.5px] font-bold text-slate-500">
                      <div className="flex items-center gap-1.5 bg-white/40 p-2 rounded-lg border border-slate-200/50">
                        <span className="text-slate-400 font-medium">DOB:</span>
                        <span className="text-slate-800 font-mono font-black">{child?.dob || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-white/40 p-2 rounded-lg border border-slate-200/50">
                        <span className="text-slate-400 font-medium">Lang:</span>
                        <span className="text-slate-800 font-black">{child?.homeLanguage || 'N/A'}</span>
                      </div>
                    </div>

                    {/* Transport requirement block */}
                    <div className="flex items-center justify-between text-[11px] font-bold px-1">
                      <span className="text-slate-400 font-semibold">School Transport Service:</span>
                      {hasTransport ? (
                        <span className="flex items-center gap-1 text-indigo-600 font-black bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-lg uppercase tracking-wider text-[10px]">
                          <Truck className="w-3.5 h-3.5" />
                          Required
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 bg-slate-200/60 border border-slate-200 px-2 py-0.5 rounded-lg font-black uppercase">Not Needed</span>
                      )}
                    </div>
                  </div>

                  {/* Quick Action Trigger button */}
                  <div className="mt-5 pt-3.5 border-t border-slate-200/80">
                    <button
                      type="button"
                      onClick={() => handleApproveClick(app.id)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] uppercase py-2.5 px-4 rounded-xl shadow-sm border border-emerald-500/30 transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 select-none hover:shadow-md"
                    >
                      <UserCheck className="w-4 h-4" />
                      Approve & Onboard Student
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sub Graphs Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Custom Attendance Bar chart (Fulfills Video/Img design specs) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
          <div>
            <h4 className="font-extrabold text-slate-800 text-sm">Weekly Attendance registers Overview</h4>
            <p className="text-[11px] text-slate-400 font-semibold mb-6">Consolidated attendance data from all class registers (Mon - Fri)</p>
          </div>

          {/* High fidelity SVG bar chart */}
          <div className="h-56 relative border-l border-b border-slate-100/80 pl-8 pb-8 flex justify-around items-end">
            {/* Y-Axis guide lines */}
            <div className="absolute left-0 bottom-8 border-b border-dashed border-slate-100 w-full mb-12 text-[10px] text-slate-300 font-mono">50%</div>
            <div className="absolute left-0 bottom-8 border-b border-dashed border-slate-100 w-full mb-24 text-[10px] text-slate-300 font-mono">75%</div>
            <div className="absolute left-0 bottom-8 border-b border-dashed border-slate-100 w-full mb-36 text-[10px] text-slate-300 font-mono">100%</div>

            {attendanceGraphData.map((data, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 group relative z-10 w-12">
                {/* Attendance pills stacked */}
                <div className="w-full flex flex-col justify-end gap-0.5 h-36">
                  {/* Present Bar (Green) */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${data.present}%` }}
                    transition={{ duration: 1, delay: idx * 0.1 }}
                    className="bg-emerald-500 rounded-t-sm w-full font-mono font-bold text-[9px] text-white flex items-end justify-center pb-1 select-none"
                    title={`Present: ${data.present}%`}
                  >
                    {data.present > 40 && `${data.present}%`}
                  </motion.div>
                  {/* Absent Bar (Red) */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${data.absent}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                    className="bg-rose-400/90 rounded-b-sm w-full font-mono font-bold text-[9px] text-rose-50 flex items-start justify-center pt-0.5 cursor-pointer"
                    title={`Absent: ${data.absent}%`}
                  >
                    {data.absent > 10 && `${data.absent}%`}
                  </motion.div>
                </div>
                <span className="text-[11px] font-bold text-slate-500">{data.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Transport distribution Doughnut chart + Legend specs */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
          <div>
            <h4 className="font-extrabold text-slate-800 text-sm">Transport Logistics distribution</h4>
            <p className="text-[11px] text-slate-400 font-semibold mb-6">Learner geographic distribution areas for school transport planning</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
            {/* SVG Doughnut Circle */}
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                {/* Gray base segment */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="4.2" />
                {/* Ster Park: 55% Segment (Indigo) */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#4f46e5" strokeWidth="4.2" strokeDasharray="55 45" strokeDashoffset="0" />
                {/* Flora Park: 30% Segment (Emerald) */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="4.2" strokeDasharray="30 70" strokeDashoffset="-55" />
                {/* CBD: 15% Segment (Amber) */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" strokeWidth="4.2" strokeDasharray="15 85" strokeDashoffset="-85" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-mono font-black text-slate-800">100%</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Represented</span>
              </div>
            </div>

            {/* Interactive Legend parameters */}
            <div className="space-y-3.5 text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded bg-indigo-600 shrink-0" />
                <div>
                  <p className="font-bold text-slate-800">Ster Park (55%)</p>
                  <p className="text-[10px] text-slate-400">Primary Pick-up zone</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded bg-emerald-500 shrink-0" />
                <div>
                  <p className="font-bold text-slate-800">Flora Park (30%)</p>
                  <p className="text-[10px] text-slate-400">Secondary zone</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded bg-amber-500 shrink-0" />
                <div>
                  <p className="font-bold text-slate-800">Polokwane CBD (15%)</p>
                  <p className="text-[10px] text-slate-400">Arranged bus pickups</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
