import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, BookOpen, Activity, FileText, MessageSquare, Camera } from 'lucide-react';
import { Learner, WeeklyTheme, ProgressReport, ChatMessage, DailyRegister, JournalPost } from '../types';

import AttendanceTracker from './teacher/AttendanceTracker';
import ThemeManager from './teacher/ThemeManager';
import MilestoneTracker from './teacher/MilestoneTracker';
import ProgressReportEditor from './teacher/ProgressReportEditor';
import TeacherChat from './teacher/TeacherChat';
import JournalEditor from './teacher/JournalEditor';

interface TeacherDashboardProps {
  learners: Learner[];
  themes: WeeklyTheme[];
  reports: ProgressReport[];
  chats: ChatMessage[];
  registers?: DailyRegister[];
  journalPosts?: JournalPost[];
  onUpdateAttendance: (studentId: string, status: 'Present' | 'Absent' | 'Excused') => void;
  onMarkAllPresent: (studentIds: string[]) => Promise<void>;
  onSubmitRegister?: () => Promise<DailyRegister>;
  attendanceError?: string | null;
  onUpdateMilestones: (studentId: string, milestones: { label: string; val: number }[]) => void;
  onSaveReport: (report: ProgressReport) => Promise<void>;
  onAddTheme: (theme: WeeklyTheme) => void;
  onSendMessage: (txt: string, parentEmailAddress?: string) => void;
  onAddJournalPost?: (post: JournalPost) => Promise<void>;
}

export default function TeacherDashboard({
  learners,
  themes,
  reports,
  chats,
  registers = [],
  journalPosts = [],
  onUpdateAttendance,
  onMarkAllPresent,
  onSubmitRegister,
  attendanceError,
  onUpdateMilestones,
  onSaveReport,
  onAddTheme,
  onSendMessage,
  onAddJournalPost
}: TeacherDashboardProps) {
  const [activeTab, setActiveTab] = useState<'attendance' | 'curriculum' | 'milestones' | 'reports' | 'chat' | 'journal'>('attendance');
  const [selectedClass, setSelectedClass] = useState<'Roses' | 'Giraffes' | 'Tigers'>('Roses');

  // Filtering students based on selected class
  const classStudents = learners.filter(l => l.classType === selectedClass);

  return (
    <div className="space-y-8 p-2 pb-12 font-sans">
      {/* Role Title and class selector */}
      <div className="glass-card rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/60 to-violet-50/60 -z-10" />
        
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 tracking-tight">
            Teacher Management Portal
          </h2>
          <p className="text-sm text-slate-500 mt-2 font-semibold flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            Logged in: Teacher Anne • Lead Instructor {selectedClass} Room
          </p>
        </div>

        {/* Class switcher buttons */}
        <div className="flex bg-white/80 p-1.5 rounded-2xl shadow-sm border border-slate-100 backdrop-blur-md relative z-10 w-full md:w-auto overflow-x-auto">
          {(['Roses', 'Giraffes', 'Tigers'] as const).map(cls => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl transition-all duration-300 ease-out cursor-pointer font-bold text-sm relative ${
                selectedClass === cls
                  ? 'text-white shadow-md shadow-indigo-200/50'
                  : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50'
              }`}
            >
              {selectedClass === cls && (
                <motion.div
                  layoutId="class-selector"
                  className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-xl -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 whitespace-nowrap">{cls} Class</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tabs list inside Teacher Portal */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {[
          { id: 'attendance', label: 'Mark Attendance', icon: Clock },
          { id: 'curriculum', label: 'Curriculum & Themes', icon: BookOpen },
          { id: 'milestones', label: 'Assess Milestones', icon: Activity },
          { id: 'reports', label: 'Quarterly Reports', icon: FileText },
          { id: 'journal', label: 'Photo Journal', icon: Camera },
          { id: 'chat', label: 'Parent Messages', icon: MessageSquare },
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`group flex items-center gap-2.5 px-6 py-3.5 rounded-2xl transition-all duration-300 cursor-pointer whitespace-nowrap relative border ${
                isActive 
                  ? 'bg-white border-transparent shadow-lg shadow-indigo-100/50 text-indigo-600 font-bold' 
                  : 'bg-white/50 border-slate-200/60 text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-md'
              }`}
            >
              <Icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span>{t.label}</span>
              {isActive && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-b-2xl"
                />
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {activeTab === 'attendance' && (
            <AttendanceTracker
              selectedClass={selectedClass}
              classStudents={classStudents}
              onUpdateAttendance={onUpdateAttendance}
              onMarkAllPresent={onMarkAllPresent}
              onSubmitRegister={onSubmitRegister}
              totalLearners={learners.length}
              todayRegister={registers.find((r) => r.date === new Date().toISOString().split('T')[0])}
              attendanceError={attendanceError}
            />
          )}

          {activeTab === 'curriculum' && (
            <ThemeManager
              themes={themes}
              onAddTheme={onAddTheme}
            />
          )}

          {activeTab === 'milestones' && (
            <MilestoneTracker
              learners={learners}
              reports={reports}
              onUpdateMilestones={onUpdateMilestones}
            />
          )}

          {activeTab === 'reports' && (
            <ProgressReportEditor
              learners={learners}
              reports={reports}
              onSaveReport={onSaveReport}
            />
          )}

          {activeTab === 'journal' && (
            <JournalEditor
              onAddPost={onAddJournalPost}
              posts={journalPosts}
            />
          )}

          {activeTab === 'chat' && (
            <TeacherChat
              chats={chats}
              onSendMessage={onSendMessage}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
