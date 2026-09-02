import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Search, Filter, Trash2, Mail, Users as UsersIcon
} from 'lucide-react';
import { Learner } from '../../types';
import StudentCard from './StudentCard';

export interface StudentDirectoryProps {
  students: Learner[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: 'all' | 'enrolled' | 'pending';
  setStatusFilter: (status: 'all' | 'enrolled' | 'pending') => void;
  classFilter: string;
  setClassFilter: (cls: string) => void;
  selectedStudentIds: string[];
  toggleStudentSelection: (id: string) => void;
  handleSelectAllStudents: () => void;
  handleBulkDeleteStudents: () => void;
  setShowBulkEmailModal: (show: boolean) => void;
  setSelectedMedicalLearner: (learner: Learner) => void;
  setSelectedTransportLearner: (learner: Learner) => void;
  handleRemoveStudent?: (id: string) => void;
}

export default function StudentDirectory({
  students,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  classFilter,
  setClassFilter,
  selectedStudentIds,
  toggleStudentSelection,
  handleSelectAllStudents,
  handleBulkDeleteStudents,
  setShowBulkEmailModal,
  setSelectedMedicalLearner,
  setSelectedTransportLearner,
  handleRemoveStudent
}: StudentDirectoryProps) {
  // Apply filtering logic locally based on passed state
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.firstNames.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         s.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (s.parentName && s.parentName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    const matchesClass = classFilter === 'all' || s.classType === classFilter;
    
    return matchesSearch && matchesStatus && matchesClass;
  });

  return (
    <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
      {/* Directory Header & Controls */}
      <div className="glass-card rounded-3xl p-6 shadow-sm border border-slate-200/60 flex flex-col xl:flex-row gap-6 items-center justify-between">
        
        {/* Title and stats */}
        <div className="flex items-center gap-4 w-full xl:w-auto">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
            <UsersIcon className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-lg">Student Directory</h3>
            <p className="text-xs text-slate-500 font-medium">Managing {filteredStudents.length} learner records</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search students or parents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200/80 pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
            />
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative group flex-1 sm:flex-none">
              <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full sm:w-auto bg-white border border-slate-200/80 pl-8 pr-8 py-2.5 rounded-xl text-xs font-bold text-slate-700 appearance-none focus:outline-hidden focus:border-indigo-400 transition-all cursor-pointer shadow-sm"
              >
                <option value="all">All Statuses</option>
                <option value="enrolled">Enrolled Only</option>
                <option value="pending">Pending Only</option>
              </select>
            </div>

            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="w-full sm:w-auto bg-white border border-slate-200/80 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 appearance-none focus:outline-hidden focus:border-indigo-400 transition-all cursor-pointer shadow-sm"
            >
              <option value="all">All Classes</option>
              <option value="Roses">Roses (Toddlers 1-2 yrs)</option>
              <option value="Giraffes">Giraffes (Preschool 3-4 yrs)</option>
              <option value="Tigers">Tigers (Grade R 5-6 yrs)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Action Bar (Only visible when students are selected) */}
      <AnimatePresence>
        {selectedStudentIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-indigo-900 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg border border-indigo-800"
          >
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-800 text-indigo-100 font-black text-xs border border-indigo-700">
                {selectedStudentIds.length}
              </span>
              <span className="text-xs font-bold text-indigo-100 uppercase tracking-wide">
                Students Selected
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSelectAllStudents}
                className="px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all bg-indigo-800/50 hover:bg-indigo-800 text-indigo-200 border border-indigo-700 cursor-pointer"
              >
                {selectedStudentIds.length === filteredStudents.length ? 'Deselect All' : 'Select All Visible'}
              </button>
              
              <div className="w-px h-6 bg-indigo-800/50 mx-2"></div>
              
              <button
                type="button"
                onClick={() => setShowBulkEmailModal(true)}
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 transition-colors text-white font-bold text-[11px] rounded-xl cursor-pointer flex items-center gap-2 border border-indigo-400 shadow-sm"
              >
                <Mail className="w-3.5 h-3.5" />
                Bulk Email
              </button>
              <button
                type="button"
                onClick={handleBulkDeleteStudents}
                className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500 transition-colors text-rose-300 hover:text-white font-bold text-[11px] rounded-xl cursor-pointer flex items-center gap-2 border border-rose-500/30 hover:border-rose-500"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid of Student Cards */}
      {filteredStudents.length === 0 ? (
        <div className="text-center py-20 bg-white/40 rounded-3xl border border-dashed border-slate-200">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-extrabold text-slate-600">No students match your criteria</p>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <AnimatePresence>
            {filteredStudents.map((s, idx) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: idx * 0.05 > 0.5 ? 0 : idx * 0.05 }}
              >
                <StudentCard 
                  student={s} 
                  isSelected={selectedStudentIds.includes(s.id)}
                  onToggleSelect={toggleStudentSelection}
                  onViewMedical={setSelectedMedicalLearner}
                  onManageTransport={setSelectedTransportLearner}
                  onRemoveStudent={handleRemoveStudent}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
