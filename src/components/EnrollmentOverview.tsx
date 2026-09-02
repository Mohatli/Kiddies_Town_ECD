import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Filter, CheckCircle2, UserCheck, XCircle, ChevronRight, Mail, 
  Phone, Eye, Download, FileText, Truck, Heart, FileCheck, ShieldAlert,
  ArrowUpDown, AlertCircle, RefreshCw
} from 'lucide-react';
import { EnrolmentApplication } from '../types';

interface EnrollmentOverviewProps {
  enrolments: EnrolmentApplication[];
  onApproveEnrolment: (enrolId: string, sendWelcomeEmail?: boolean) => void;
  onRejectEnrolment: (enrolId: string) => void;
  onResetEnrolmentStatus?: (enrolId: string, status: 'In Review' | 'Pending Approval') => void;
}

export default function EnrollmentOverview({
  enrolments,
  onApproveEnrolment,
  onRejectEnrolment,
  onResetEnrolmentStatus
}: EnrollmentOverviewProps) {
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [classFilter, setClassFilter] = useState<string>('all');
  
  // Sort State
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'progress'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Selected application for detail modal drawer
  const [selectedApp, setSelectedApp] = useState<EnrolmentApplication | null>(null);
  const [detailTab, setDetailTab] = useState<'personal' | 'parents' | 'medical' | 'transport' | 'consents'>('personal');

  // Toggle sort field
  const handleSort = (field: 'name' | 'date' | 'progress') => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Filter and Sort enrolments
  const filteredAndSortedEnrolments = useMemo(() => {
    let result = [...enrolments];

    // Search term matching
    if (searchTerm.trim() !== '') {
      const lower = searchTerm.toLowerCase();
      result = result.filter(app => {
        const childName = `${app.childParticulars?.firstNames || ''} ${app.childParticulars?.surname || ''}`.toLowerCase();
        const parentName = `${app.parentParticulars?.name || ''}`.toLowerCase();
        const parentEmail = `${app.parentParticulars?.email || app.parentParticulars?.mother?.email || ''}`.toLowerCase();
        const parentPhone = `${app.parentParticulars?.phone || ''}`.toLowerCase();
        const classType = `${app.childParticulars?.classType || ''}`.toLowerCase();
        
        return childName.includes(lower) || 
               parentName.includes(lower) || 
               parentEmail.includes(lower) || 
               parentPhone.includes(lower) ||
               classType.includes(lower);
      });
    }

    // Status filtering
    if (statusFilter !== 'all') {
      result = result.filter(app => app.status?.toLowerCase() === statusFilter.toLowerCase());
    }

    // Class/Group filtering
    if (classFilter !== 'all') {
      result = result.filter(app => app.childParticulars?.classType?.toLowerCase() === classFilter.toLowerCase());
    }

    // Sorting
    result.sort((a, b) => {
      let valA: any = '';
      let valB: any = '';

      if (sortBy === 'name') {
        valA = `${a.childParticulars?.firstNames || ''} ${a.childParticulars?.surname || ''}`.toLowerCase();
        valB = `${b.childParticulars?.firstNames || ''} ${b.childParticulars?.surname || ''}`.toLowerCase();
      } else if (sortBy === 'date') {
        valA = a.dateApplied || '';
        valB = b.dateApplied || '';
      } else if (sortBy === 'progress') {
        valA = a.step || 0;
        valB = b.step || 0;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [enrolments, searchTerm, statusFilter, classFilter, sortBy, sortOrder]);

  // Export data grid as CSV
  const handleExportCSV = () => {
    const headers = [
      'Application ID', 'Student First Name', 'Student Surname', 'Class Room', 
      'Date of Birth', 'Gender', 'Home Language', 'Parent Name', 'Parent Email', 
      'Parent Phone', 'Transport Needed', 'Date Applied', 'Wizard Step', 'Status'
    ];

    const rows = filteredAndSortedEnrolments.map(app => {
      const child = app.childParticulars;
      const parent = app.parentParticulars;
      const email = parent?.email || parent?.mother?.email || '';
      return [
        app.id,
        child?.firstNames || '',
        child?.surname || '',
        child?.classType || 'Unassigned',
        child?.dob || '',
        child?.gender || '',
        child?.homeLanguage || '',
        parent?.name || '',
        email,
        parent?.phone || '',
        app.transportDetails?.needed ? 'Yes' : 'No',
        app.dateApplied || '',
        `${app.step}/6`,
        app.status
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `KiddiesTown_Enrollment_Overview_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters panel */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search kiddies name, parent, email, or room..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 pl-9 pr-4 py-2 text-xs font-semibold rounded-xl focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-800"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase text-slate-400">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              >
                <option value="all">All Statuses</option>
                <option value="in review">In Review</option>
                <option value="pending approval">Pending Approval</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Class Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase text-slate-400">Room:</span>
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              >
                <option value="all">All Rooms</option>
                <option value="giraffes">Giraffes</option>
                <option value="lions">Lions</option>
                <option value="elephants">Elephants</option>
                <option value="unassigned">Unassigned</option>
              </select>
            </div>

            {/* Export Action */}
            <button
              onClick={handleExportCSV}
              disabled={filteredAndSortedEnrolments.length === 0}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:hover:bg-slate-100 text-slate-700 border border-slate-200/80 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer select-none transition-colors ml-auto lg:ml-0"
              title="Download results as CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Counter tags */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-100 text-slate-600">
            Filtered: {filteredAndSortedEnrolments.length} of {enrolments.length} Applications
          </span>
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-50 text-amber-700 border border-amber-100">
            Pending Action: {enrolments.filter(e => e.status !== 'Approved' && e.status !== 'Rejected').length}
          </span>
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
            Approved: {enrolments.filter(e => e.status === 'Approved').length}
          </span>
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-rose-50 text-rose-700 border border-rose-100">
            Rejected: {enrolments.filter(e => e.status === 'Rejected').length}
          </span>
        </div>
      </div>

      {/* Main Data Grid Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredAndSortedEnrolments.length === 0 ? (
          <div className="p-12 text-center bg-slate-50/50">
            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-extrabold text-slate-800">No applications match filter settings</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting the search terms or category filters to list registrations.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-extrabold uppercase tracking-wider text-[10px] select-none">
                  <th 
                    onClick={() => handleSort('name')}
                    className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      Kiddie (Student)
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-4">Contact Parent / Guardian</th>
                  <th 
                    onClick={() => handleSort('date')}
                    className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      Date Filed
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('progress')}
                    className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      Application Step
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-4">Submitted Documents</th>
                  <th className="py-3 px-4">Decision Status</th>
                  <th className="py-3 px-4 text-center">Action Directives</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {filteredAndSortedEnrolments.map((app) => {
                  const child = app.childParticulars;
                  const parent = app.parentParticulars;
                  const pEmail = parent?.email || parent?.mother?.email || 'N/A';
                  const docCount = Object.values(app.uploadedFiles || {}).filter(Boolean).length;
                  const hasTransport = app.transportDetails?.needed;

                  return (
                    <tr 
                      key={app.id} 
                      className="hover:bg-slate-50/40 transition-colors cursor-pointer"
                      onClick={() => setSelectedApp(app)}
                    >
                      {/* Student Particulars */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 font-black flex items-center justify-center text-xs border border-indigo-100 uppercase">
                            {child?.firstNames ? child.firstNames[0] : 'K'}
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900 text-sm">
                              {child?.firstNames || 'Unnamed'} {child?.surname || 'Student'}
                            </div>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="px-1.5 py-0.5 rounded-sm text-[9px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-700">
                                {child?.classType || 'Giraffes'}
                              </span>
                              <span className="text-[10px] text-slate-400 font-bold font-mono">
                                DOB: {child?.dob || 'N/A'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Parent Contacts */}
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-bold text-slate-800 text-xs">
                            {parent?.name || 'Registered Parent'}
                          </div>
                          <div className="flex flex-col gap-0.5 mt-1 text-[10px] text-slate-500 font-semibold">
                            <span className="flex items-center gap-1.5">
                              <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                              {pEmail}
                            </span>
                            {parent?.phone && (
                              <span className="flex items-center gap-1.5">
                                <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                                {parent.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Date Applied */}
                      <td className="py-4 px-4 text-xs font-mono font-extrabold text-slate-500">
                        {app.dateApplied || 'N/A'}
                      </td>

                      {/* Form Progress */}
                      <td className="py-4 px-4">
                        <div className="space-y-1.5 max-w-[120px]">
                          <div className="flex justify-between text-[10px] font-bold text-slate-500">
                            <span>Step {app.step || 1}/6</span>
                            <span>{Math.round(((app.step || 1) / 6) * 100)}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200/50">
                            <div 
                              className="bg-indigo-600 h-full transition-all duration-300" 
                              style={{ width: `${((app.step || 1) / 6) * 100}%` }} 
                            />
                          </div>
                        </div>
                      </td>

                      {/* File Submitted Checkboxes */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded-sm text-[9.5px] font-bold ${docCount === 4 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                            {docCount}/4 Files
                          </span>
                          <div className="flex items-center gap-0.5 text-[9px]">
                            <span className={`w-1.5 h-1.5 rounded-full ${app.uploadedFiles?.birthCertificate ? 'bg-emerald-500' : 'bg-slate-300'}`} title="Birth Certificate" />
                            <span className={`w-1.5 h-1.5 rounded-full ${app.uploadedFiles?.immunisationCard ? 'bg-emerald-500' : 'bg-slate-300'}`} title="Immunisation Card" />
                            <span className={`w-1.5 h-1.5 rounded-full ${app.uploadedFiles?.parentIds ? 'bg-emerald-500' : 'bg-slate-300'}`} title="Parent IDs" />
                            <span className={`w-1.5 h-1.5 rounded-full ${app.uploadedFiles?.proofOfResidence ? 'bg-emerald-500' : 'bg-slate-300'}`} title="Proof of Residence" />
                          </div>
                        </div>
                      </td>

                      {/* Decision Status Badge */}
                      <td className="py-4 px-4">
                        {app.status === 'Approved' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Approved
                          </span>
                        ) : app.status === 'Rejected' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200/60">
                            <XCircle className="w-3.5 h-3.5" />
                            Rejected
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200/60 animate-pulse">
                            <RefreshCw className="w-3 h-3 text-amber-600 animate-spin" />
                            {app.status || 'In Review'}
                          </span>
                        )}
                      </td>

                      {/* Decision actions */}
                      <td className="py-4 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-2">
                          {app.status !== 'Approved' && app.status !== 'Rejected' ? (
                            <>
                              <button
                                onClick={() => onApproveEnrolment(app.id)}
                                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <UserCheck className="w-3 h-3" />
                                Onboard
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to REJECT ${child?.firstNames}'s application?`)) {
                                    onRejectEnrolment(app.id);
                                  }
                                }}
                                className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <XCircle className="w-3 h-3" />
                                Reject
                              </button>
                            </>
                          ) : app.status === 'Rejected' && onResetEnrolmentStatus ? (
                            <button
                              onClick={() => {
                                onResetEnrolmentStatus(app.id, 'In Review');
                              }}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg text-[9.5px] font-black uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <RefreshCw className="w-3 h-3" />
                              Re-Evaluate
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-extrabold flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-sm border border-slate-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Finished
                            </span>
                          )}
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                            title="View Full Application Folder"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETAILED DRAWERS MODAL OVERLAY */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            {/* Backdrop cover */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black cursor-pointer"
              onClick={() => setSelectedApp(null)}
            />

            {/* Side Drawer container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden"
            >
              {/* Header block with visual gradient accent */}
              <div className="bg-gradient-to-r from-indigo-900 to-indigo-950 p-6 text-white relative">
                <button
                  onClick={() => setSelectedApp(null)}
                  className="absolute right-4 top-4 p-2 text-indigo-200 hover:text-white bg-indigo-800/40 hover:bg-indigo-800/70 rounded-full transition-colors cursor-pointer"
                >
                  <XCircle className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-500/20 text-white font-black rounded-2xl flex items-center justify-center text-lg border border-indigo-500/30">
                    {selectedApp.childParticulars?.firstNames ? selectedApp.childParticulars.firstNames[0] : 'S'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-indigo-500/30 text-indigo-100 border border-indigo-500/40">
                        {selectedApp.childParticulars?.classType || 'Giraffes'} Room
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-slate-500/30 text-slate-100 border border-slate-500/40">
                        Step {selectedApp.step}/6 Completed
                      </span>
                    </div>
                    <h3 className="font-extrabold text-lg mt-1">
                      {selectedApp.childParticulars?.firstNames} {selectedApp.childParticulars?.surname}
                    </h3>
                    <p className="text-xs text-indigo-200/80 mt-0.5">Applied: {selectedApp.dateApplied}</p>
                  </div>
                </div>
              </div>

              {/* Navigation Tab rail inside drawer */}
              <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-1 overflow-x-auto shrink-0">
                <button
                  onClick={() => setDetailTab('personal')}
                  className={`px-3 py-2 text-xs font-black tracking-wider uppercase border-b-2 transition-colors cursor-pointer shrink-0 ${detailTab === 'personal' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                  1. Child Particulars
                </button>
                <button
                  onClick={() => setDetailTab('parents')}
                  className={`px-3 py-2 text-xs font-black tracking-wider uppercase border-b-2 transition-colors cursor-pointer shrink-0 ${detailTab === 'parents' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                  2. Parent Profiles
                </button>
                <button
                  onClick={() => setDetailTab('medical')}
                  className={`px-3 py-2 text-xs font-black tracking-wider uppercase border-b-2 transition-colors cursor-pointer shrink-0 ${detailTab === 'medical' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                  3. Emergency Medical
                </button>
                <button
                  onClick={() => setDetailTab('transport')}
                  className={`px-3 py-2 text-xs font-black tracking-wider uppercase border-b-2 transition-colors cursor-pointer shrink-0 ${detailTab === 'transport' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                  4. Transport
                </button>
                <button
                  onClick={() => setDetailTab('consents')}
                  className={`px-3 py-2 text-xs font-black tracking-wider uppercase border-b-2 transition-colors cursor-pointer shrink-0 ${detailTab === 'consents' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                  5 & 6. Financials
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {detailTab === 'personal' && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase text-slate-400 flex items-center gap-1">
                      <FileText className="w-4 h-4 text-indigo-600" /> Primary Learner Record
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/60 text-xs">
                      <div>
                        <span className="text-slate-400 font-bold block mb-0.5">First Names:</span>
                        <span className="text-slate-800 font-extrabold">{selectedApp.childParticulars?.firstNames || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold block mb-0.5">Surname:</span>
                        <span className="text-slate-800 font-extrabold">{selectedApp.childParticulars?.surname || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold block mb-0.5">Preferred Name:</span>
                        <span className="text-slate-800 font-extrabold">{selectedApp.childParticulars?.preferredName || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold block mb-0.5">Identity / Birth No:</span>
                        <span className="text-slate-800 font-extrabold font-mono">{selectedApp.childParticulars?.idNumber || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold block mb-0.5">Date of Birth:</span>
                        <span className="text-slate-800 font-extrabold font-mono">{selectedApp.childParticulars?.dob || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold block mb-0.5">Gender / Sex:</span>
                        <span className="text-slate-800 font-extrabold">{selectedApp.childParticulars?.gender || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold block mb-0.5">Home Language:</span>
                        <span className="text-slate-800 font-extrabold">{selectedApp.childParticulars?.homeLanguage || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold block mb-0.5">Religious Affiliation:</span>
                        <span className="text-slate-800 font-extrabold">{selectedApp.childParticulars?.religion || 'None'}</span>
                      </div>
                    </div>

                    <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                      <h5 className="text-[10.5px] font-black uppercase text-slate-400">Mandatory Attachment Validation</h5>
                      <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                        <div className="flex items-center gap-2 p-2 rounded-lg border bg-white/50">
                          <span className={`w-2 h-2 rounded-full ${selectedApp.uploadedFiles?.birthCertificate ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          <span className="text-slate-700">Birth Certificate</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded-lg border bg-white/50">
                          <span className={`w-2 h-2 rounded-full ${selectedApp.uploadedFiles?.immunisationCard ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          <span className="text-slate-700">Immunisation Card</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded-lg border bg-white/50">
                          <span className={`w-2 h-2 rounded-full ${selectedApp.uploadedFiles?.parentIds ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          <span className="text-slate-700">Parent IDs</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded-lg border bg-white/50">
                          <span className={`w-2 h-2 rounded-full ${selectedApp.uploadedFiles?.proofOfResidence ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          <span className="text-slate-700">Proof of Residence</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {detailTab === 'parents' && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase text-slate-400 flex items-center gap-1">
                      <UserCheck className="w-4 h-4 text-indigo-600" /> Guardian Profiles
                    </h4>

                    {selectedApp.parentParticulars?.mother && (
                      <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2 text-xs">
                        <span className="px-2 py-0.5 bg-pink-100 text-pink-700 font-extrabold text-[9px] rounded-sm uppercase tracking-wide">Mother Profile</span>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div>
                            <span className="text-slate-400 block font-bold">Full Name:</span>
                            <span className="text-slate-800 font-extrabold">{selectedApp.parentParticulars.mother.firstNames} {selectedApp.parentParticulars.mother.surname}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-bold">ID Number:</span>
                            <span className="text-slate-800 font-extrabold font-mono">{selectedApp.parentParticulars.mother.idNumber || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-bold">Email:</span>
                            <span className="text-slate-800 font-extrabold font-mono">{selectedApp.parentParticulars.mother.email}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-bold">Phone:</span>
                            <span className="text-slate-800 font-extrabold font-mono">{selectedApp.parentParticulars.mother.phone}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-slate-400 block font-bold">Residential Address:</span>
                            <span className="text-slate-800 font-extrabold">{selectedApp.parentParticulars.mother.residentialAddress || 'Same'}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedApp.parentParticulars?.father && selectedApp.parentParticulars.father.firstNames && (
                      <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2 text-xs">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 font-extrabold text-[9px] rounded-sm uppercase tracking-wide">Father Profile</span>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div>
                            <span className="text-slate-400 block font-bold">Full Name:</span>
                            <span className="text-slate-800 font-extrabold">{selectedApp.parentParticulars.father.firstNames} {selectedApp.parentParticulars.father.surname}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-bold">ID Number:</span>
                            <span className="text-slate-800 font-extrabold font-mono">{selectedApp.parentParticulars.father.idNumber || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-bold">Email:</span>
                            <span className="text-slate-800 font-extrabold font-mono">{selectedApp.parentParticulars.father.email}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-bold">Phone:</span>
                            <span className="text-slate-800 font-extrabold font-mono">{selectedApp.parentParticulars.father.phone}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {detailTab === 'medical' && (
                  <div className="space-y-4 text-xs">
                    <h4 className="text-xs font-black uppercase text-slate-400 flex items-center gap-1">
                      <Heart className="w-4 h-4 text-rose-500" /> Allergy & Emergency Medical Ledger
                    </h4>

                    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <div>
                        <span className="text-slate-400 font-bold block mb-0.5">Family Doctor Name:</span>
                        <span className="text-slate-800 font-extrabold">{selectedApp.medicalProfile?.familyDoctorName || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold block mb-0.5">Doctor Contact:</span>
                        <span className="text-slate-800 font-extrabold font-mono">{selectedApp.medicalProfile?.familyDoctorPhone || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold block mb-0.5">Medical Aid Name:</span>
                        <span className="text-slate-800 font-extrabold">{selectedApp.medicalProfile?.medicalAidName || 'None'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold block mb-0.5">Medical Aid Number:</span>
                        <span className="text-slate-800 font-extrabold font-mono">{selectedApp.medicalProfile?.medicalAidNumber || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border-2 border-rose-100 bg-rose-50/20 space-y-3">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0" />
                        <span className="font-extrabold text-slate-900">Critical Medical & Allergy Declaration</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">
                        <strong className="text-slate-800">Allergies/Illnesses: </strong>
                        {selectedApp.medicalProfile?.allergiesOrIllnesses || 'None specified or declared.'}
                      </p>
                      <div className="border-t border-rose-100 pt-2 flex justify-between items-center text-[11px] font-bold text-slate-500">
                        <span>Emergency Treatment Medical Consent:</span>
                        {selectedApp.medicalProfile?.medicalConsentApproved ? (
                          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm uppercase tracking-wide border border-emerald-200">Signed & Accepted</span>
                        ) : (
                          <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded-sm uppercase tracking-wide border border-rose-200">Not Indicated</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {detailTab === 'transport' && (
                  <div className="space-y-4 text-xs">
                    <h4 className="text-xs font-black uppercase text-slate-400 flex items-center gap-1">
                      <Truck className="w-4 h-4 text-indigo-600" /> School Bus Service details
                    </h4>

                    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-600 text-sm">Transport Pick-up Needed:</span>
                        {selectedApp.transportDetails?.needed ? (
                          <span className="px-3 py-1 bg-indigo-600 text-white font-extrabold rounded-lg uppercase tracking-wider text-[10px]">Active Service</span>
                        ) : (
                          <span className="px-3 py-1 bg-slate-200 text-slate-600 font-extrabold rounded-lg uppercase tracking-wider text-[10px]">No Service Required</span>
                        )}
                      </div>

                      {selectedApp.transportDetails?.needed && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-200 pt-3 text-xs leading-relaxed">
                          <div>
                            <span className="text-slate-400 font-bold block mb-0.5">Physical Pick-up Address:</span>
                            <span className="text-slate-800 font-extrabold block">{selectedApp.transportDetails.address}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-bold block mb-0.5">Approved Custodian Contact Name:</span>
                            <span className="text-slate-800 font-extrabold block">{selectedApp.transportDetails.contactPerson}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-slate-400 font-bold block mb-0.5">Emergency Mobile Number:</span>
                            <span className="text-slate-800 font-extrabold font-mono block">{selectedApp.transportDetails.phone}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {detailTab === 'consents' && (
                  <div className="space-y-4 text-xs">
                    <h4 className="text-xs font-black uppercase text-slate-400 flex items-center gap-1">
                      <FileCheck className="w-4 h-4 text-indigo-600" /> Tuition, POPI and Permissions Consent Folder
                    </h4>

                    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2.5">
                      <div className="flex justify-between">
                        <span className="font-bold text-slate-500">Scheduled Monthly Premium:</span>
                        <span className="font-black text-indigo-600">R {selectedApp.consents?.monthlyAmount || '2,500.00'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold text-slate-500">Payer Selection Date:</span>
                        <span className="font-black text-slate-800 font-mono">Every {selectedApp.consents?.paymentDay || '31st'} of the month</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold text-slate-500">Signature Verification Name:</span>
                        <span className="font-black text-slate-800 italic underline">{selectedApp.consents?.monthlyPayerSignatureName || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold text-slate-500">Signature Date stamp:</span>
                        <span className="font-black text-slate-800 font-mono">{selectedApp.consents?.signedDate || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="text-[10.5px] font-black uppercase text-slate-400">Compliance checkmarks</h5>
                      <div className="space-y-1.5 font-bold">
                        <div className="flex items-center justify-between p-2.5 rounded-lg border bg-white">
                          <span>POPI Compliance Protection Act Consent</span>
                          {selectedApp.consents?.popiActSigned ? (
                            <span className="text-[10.5px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-sm uppercase tracking-wide border border-emerald-100">Signed</span>
                          ) : (
                            <span className="text-[10.5px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-sm uppercase tracking-wide border border-rose-100">Unsigned</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between p-2.5 rounded-lg border bg-white">
                          <span>Outing Field-Trips Activity Liability Permission</span>
                          {selectedApp.consents?.outingsPermission ? (
                            <span className="text-[10.5px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-sm uppercase tracking-wide border border-emerald-100">Granted</span>
                          ) : (
                            <span className="text-[10.5px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-sm uppercase tracking-wide border border-rose-100">Declined</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Drawer Action buttons footer */}
              <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl font-bold text-xs cursor-pointer select-none"
                >
                  Close Folder
                </button>

                {selectedApp.status !== 'Approved' && selectedApp.status !== 'Rejected' && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Are you sure you want to REJECT ${selectedApp.childParticulars?.firstNames}'s application?`)) {
                          onRejectEnrolment(selectedApp.id);
                          setSelectedApp(null);
                        }
                      }}
                      className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl font-bold text-xs cursor-pointer select-none"
                    >
                      Reject Application
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onApproveEnrolment(selectedApp.id);
                        setSelectedApp(null);
                      }}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs cursor-pointer select-none flex items-center gap-1.5 shadow-sm hover:shadow-md"
                    >
                      <UserCheck className="w-4 h-4" />
                      Approve & Onboard kiddie
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
