import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export interface BulkEmailModalProps {
  showBulkEmailModal: boolean;
  setShowBulkEmailModal: (show: boolean) => void;
  bulkEmailTemplate: string;
  handleTemplateChange: (tmpl: string) => void;
  bulkEmailSubject: string;
  setBulkEmailSubject: (subject: string) => void;
  bulkEmailBody: string;
  setBulkEmailBody: (body: string) => void;
  isSendingBulkEmail: boolean;
  bulkEmailErrorMsg: string | null;
  bulkEmailSuccessMsg: string | null;
  handleSendBulkEmail: () => void;
  selectedStudentIds: string[];
}

export default function BulkEmailModal({
  showBulkEmailModal,
  setShowBulkEmailModal,
  bulkEmailTemplate,
  handleTemplateChange,
  bulkEmailSubject,
  setBulkEmailSubject,
  bulkEmailBody,
  setBulkEmailBody,
  isSendingBulkEmail,
  bulkEmailErrorMsg,
  bulkEmailSuccessMsg,
  handleSendBulkEmail,
  selectedStudentIds
}: BulkEmailModalProps) {
  return (
    <AnimatePresence>
      {showBulkEmailModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-slate-100 overflow-hidden"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600 border border-indigo-100">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">Bulk Email Dispatch</h3>
                  <p className="text-[10px] text-slate-400 font-bold">Sending to {selectedStudentIds.length} selected parent accounts</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowBulkEmailModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                disabled={isSendingBulkEmail}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl">
                <p className="text-xs text-indigo-800 font-medium">
                  Use this tool to dispatch official notices to the parents of the selected students. All emails are sent individually to preserve privacy (BCC format).
                </p>
              </div>

              {/* Template Selector */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Choose Notification Template</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'custom', name: 'Custom Message' },
                    { id: 'attendance', name: 'Attendance Alert' },
                    { id: 'announcement', name: 'General Announcement' },
                    { id: 'transport', name: 'Transport Route Update' },
                  ].map(tmpl => (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => handleTemplateChange(tmpl.id)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all ${
                        bulkEmailTemplate === tmpl.id
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-extrabold shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {tmpl.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject Line */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Subject Line</label>
                <input
                  type="text"
                  value={bulkEmailSubject}
                  onChange={(e) => setBulkEmailSubject(e.target.value)}
                  placeholder="Enter email subject line..."
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  disabled={isSendingBulkEmail}
                />
              </div>

              {/* Email Body Message */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Message Body</label>
                <textarea
                  value={bulkEmailBody}
                  onChange={(e) => setBulkEmailBody(e.target.value)}
                  placeholder="Type your official announcement here..."
                  rows={6}
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-sans leading-relaxed resize-none"
                  disabled={isSendingBulkEmail}
                />
              </div>

              {/* Feedback Messages */}
              {bulkEmailErrorMsg && (
                <div className="p-3 bg-rose-50 text-rose-700 border border-rose-100 rounded-xl text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{bulkEmailErrorMsg}</span>
                </div>
              )}

              {bulkEmailSuccessMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{bulkEmailSuccessMsg}</span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-slate-50 border-t border-slate-150 rounded-b-3xl flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowBulkEmailModal(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 transition-colors text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                disabled={isSendingBulkEmail}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendBulkEmail}
                disabled={isSendingBulkEmail || selectedStudentIds.length === 0}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:text-slate-500 transition-all text-white font-bold text-xs rounded-xl cursor-pointer shadow-md shadow-indigo-600/10 flex items-center gap-2"
              >
                {isSendingBulkEmail ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Dispatching...
                  </>
                ) : (
                  <>
                    <Mail className="w-3.5 h-3.5" />
                    Send Notifications
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
