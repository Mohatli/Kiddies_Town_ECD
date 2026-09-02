import React from 'react';
import { Shield, Clock, Search, Filter } from 'lucide-react';

export interface AuditLogViewerProps {
  logs: any[];
}

export default function AuditLogViewer({ logs }: AuditLogViewerProps) {
  return (
    <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-4">
        <div>
          <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600" />
            System Audit & Security Logs
          </h3>
          <p className="text-xs text-slate-500 mt-1">Immutable record of critical administrative actions and system events.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer border border-slate-200 shadow-sm flex items-center gap-2">
            <Filter className="w-3.5 h-3.5" /> Filter Logs
          </button>
          <button className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition-colors cursor-pointer border border-indigo-200 shadow-sm flex items-center gap-2">
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200/80 flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search events, IP addresses, or users..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-indigo-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[10px] uppercase font-black tracking-wider text-slate-400 border-b border-slate-200">
                <th className="p-4 w-48">Timestamp</th>
                <th className="p-4 w-32">Action Type</th>
                <th className="p-4">Event Details</th>
                <th className="p-4 w-32">Admin User</th>
                <th className="p-4 w-32">IP Address</th>
              </tr>
            </thead>
            <tbody className="text-xs text-slate-600 divide-y divide-slate-100">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span className="font-mono font-medium">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider border ${
                      log.action.includes('Delete') || log.action.includes('Reset') ? 'bg-rose-50 text-rose-700 border-rose-100' :
                      log.action.includes('Create') || log.action.includes('Approve') ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      log.action.includes('Export') || log.action.includes('Backup') ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                      'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-slate-800">{log.details}</td>
                  <td className="p-4 font-bold text-slate-700">{log.user}</td>
                  <td className="p-4 font-mono text-[10px] text-slate-400">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {logs.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              <Shield className="w-8 h-8 mx-auto mb-3 opacity-20" />
              <p className="text-sm font-semibold">No audit logs found matching criteria</p>
            </div>
          )}
        </div>
        
        {logs.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-150 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Showing {logs.length} log entries</span>
            <div className="flex gap-1">
              <button className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50">Previous</button>
              <button className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-100">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
