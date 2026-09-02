import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AlertTriangle, Calendar as CalIcon, MessageSquare, BookOpen, CreditCard, 
  User, Users, Plus, FileText, Send, ChevronRight, Activity, Clock, ShieldAlert,
  Download, Sparkles, Check, HelpCircle, Upload, Heart, Landmark, CheckCircle2,
  Facebook, ChevronDown, ChevronUp, Lightbulb, Info, ChevronLeft, Edit, X, Save
} from 'lucide-react';
import { Learner, ParentProfile, ProgressReport, PaymentItem, ChatMessage, SchoolEvent, JournalPost, WeeklyTheme } from '../types';
import ProgressReportView from './ProgressReportView';

// --- Date helpers (calendar & finance use real current dates instead of hardcoded years) ---
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function parseEventDate(iso: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || '');
  if (!match) return null;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function isUpcomingEvent(iso: string): boolean {
  const d = parseEventDate(iso);
  if (!d) return false;
  return startOfDay(d).getTime() >= startOfDay(new Date()).getTime();
}

interface ParentDashboardProps {
  learner?: Learner;
  profile: ParentProfile;
  reports: ProgressReport[];
  payments: PaymentItem[];
  chatHistory: ChatMessage[];
  events: SchoolEvent[];
  journalPosts: JournalPost[];
  themes: WeeklyTheme[];
  onAddMessage: (msg: string) => void;
  onRsvpEvent: (eventId: string, status: 'Yes' | 'No' | 'Maybe') => void;
  onAddPayment: (item: PaymentItem) => void;
  onApplyOnline?: () => void;
  onUpdateProfile?: (profile: ParentProfile) => void;
  parentLearners?: Learner[];
  onSelectLearner?: (id: string) => void;
}

export default function ParentDashboard({
  learner,
  profile,
  reports,
  payments,
  chatHistory,
  events,
  journalPosts,
  themes,
  onAddMessage,
  onRsvpEvent,
  onAddPayment,
  onApplyOnline,
  onUpdateProfile,
  parentLearners = [],
  onSelectLearner
}: ParentDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'calendar' | 'journal' | 'finance' | 'profile'>('overview');
  const [selectedReport, setSelectedReport] = useState<ProgressReport | null>(null);
  const [messageText, setMessageText] = useState('');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [rsvpStatus, setRsvpStatus] = useState<'Yes' | 'No' | 'Maybe'>('Yes');
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editProfileForm, setEditProfileForm] = useState<ParentProfile>(profile);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);
  const [calView, setCalView] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const shiftCalMonth = (delta: number) => {
    setCalView((v) => {
      const next = new Date(v.year, v.month + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  };
  
  const isPendingApproval = learner && learner.enrolmentApproved === false;
  
  const [payDescription, setPayDescription] = useState('Monthly Fees / October Aftercare');
  const [payAmount, setPayAmount] = useState('2500');
  const [payRef, setPayRef] = useState('');
  const [paySuccess, setPaySuccess] = useState(false);

  const parentPayments = payments.filter(p => 
    p.parentEmail === profile?.email || 
    parentLearners.some(l => l.id === p.learnerId)
  );

  const outstandingFees = parentPayments
    .filter(p => p.status === 'In Arrears' || p.status === 'Unpaid')
    .reduce((sum, p) => sum + p.amount, 0);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    onAddMessage(messageText);
    setMessageText('');
  };

  const handleManualPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payAmount || Number(payAmount) <= 0) return;
    
    const newPay: PaymentItem = {
      id: 'pay-manual-' + Date.now(),
      description: payDescription,
      date: new Date().toISOString().split('T')[0],
      amount: Number(payAmount),
      status: 'Pending Verification',
      receiptNo: payRef ? `REF-${payRef.toUpperCase()}` : `REF-${Math.floor(Math.random() * 900000 + 100000)}`
    };

    onAddPayment(newPay);
    setPaySuccess(true);
    setTimeout(() => {
      setPaySuccess(false);
      setPayDescription('Monthly Fees / October Aftercare');
      setPayAmount('2500');
      setPayRef('');
    }, 4000);
  };

  const activeReport = learner && reports.length > 0 
    ? reports.find(r => r.learnerId === learner.id) 
    : undefined;

  // Reports shown in the Academic tab belong to the currently selected child only
  const selectedLearnerReports = learner ? reports.filter(r => r.learnerId === learner.id) : [];

  const getScoreValue = (grade: string | undefined): number => {
    if (!grade) return 75;
    switch (grade.toUpperCase()) {
      case 'A': return 100;
      case 'D': return 75;
      case 'E': return 50;
      case 'N/O': return 25;
      case 'N/A': return 75;
      default: return 75;
    }
  };

  const getDynamicMilestones = () => {
    if (!activeReport || !activeReport.indicators) {
      return [
        {
          id: 'social',
          label: 'Social & Emotional Engagement',
          val: 92,
          status: 'Outstanding',
          color: 'from-emerald-400 to-emerald-500',
          bg: 'bg-emerald-50 text-emerald-700',
          details: 'Focuses on self-regulation, cooperative classroom group play, toilet learning, and following sequence directions.',
          recommendation: 'Encourage turn-taking and emotional description. Tip: Try setting the dinner table together and practice identifying different feelings using storybooks!'
        },
        {
          id: 'math',
          label: 'Cognitive & Numeracy Coordination',
          val: 80,
          status: 'On Track',
          color: 'from-indigo-400 to-indigo-500',
          bg: 'bg-indigo-50 text-indigo-700',
          details: 'Covers physical counting using physical items, shape identification, basic arithmetic logic, and matching colors.',
          recommendation: 'Play shape-hunt around the house! Tip: Let your learner count pieces of fruit or sort colored laundry to build real-world classification logic!'
        },
        {
          id: 'motor',
          label: 'Fine & Physical Motor Development',
          val: 85,
          status: 'On Track',
          color: 'from-sky-400 to-sky-500',
          bg: 'bg-sky-50 text-sky-700',
          details: 'Encompasses steady writing grip, scissor safety, block building, clothes buttoning, alongside skipping and balancing.',
          recommendation: 'Build fine motor control. Tip: Practice cutting scrap newspaper with safety scissors or thread large dry pasta onto yarn to master hand-eye grasp!'
        },
        {
          id: 'literacy',
          label: 'Language & Literacy Foundation',
          val: 68,
          status: 'Developing',
          color: 'from-amber-400 to-amber-500',
          bg: 'bg-amber-50 text-amber-700',
          details: 'Dials in clear spoken expression, vocabulary expansion, early alphabet recognition, and sound-to-letter matching phonetics.',
          recommendation: 'Read aloud together daily. Tip: Trace letters in a tray of clean dry sand or point out letter sounds on product packages at the local supermarket!'
        }
      ];
    }

    const inds = activeReport.indicators;

    const socialGrades = [
      inds.socialEmotionalSkills?.F1_sharesAndPlays,
      inds.classroomBehavior?.A1_controlAndSafe,
      inds.classroomBehavior?.A2_bathroomIndependent,
      inds.approachesToLearn?.I1_enjoysLearning
    ].filter(Boolean);
    const socialAvg = Math.round(socialGrades.reduce((sum, g) => sum + getScoreValue(g), 0) / (socialGrades.length || 1));

    const mathGrades = [
      inds.numbersMathArithmetic?.D1_countsRecognizes,
      inds.coloursAndShapes?.G1_colorsShapes
    ].filter(Boolean);
    const mathAvg = Math.round(mathGrades.reduce((sum, g) => sum + getScoreValue(g), 0) / (mathGrades.length || 1));

    const motorGrades = [
      inds.fineMotorSkills?.H1_pencilCrayonScissors,
      inds.fineMotorSkills?.H2_blocksPuzzles,
      inds.fineMotorSkills?.H3_bounceKickThrow,
      inds.fineMotorSkills?.H4_buttonsShoesClothes
    ].filter(Boolean);
    const motorAvg = Math.round(motorGrades.reduce((sum, g) => sum + getScoreValue(g), 0) / (motorGrades.length || 1));

    const litGrades = [
      inds.communicationSkills?.B1_speaksClearly,
      inds.readingWritingSkills?.C1_recognizesLetters
    ].filter(Boolean);
    const litAvg = Math.round(litGrades.reduce((sum, g) => sum + getScoreValue(g), 0) / (litGrades.length || 1));

    const getStatusStr = (v: number) => {
      if (v >= 90) return { label: 'Outstanding', color: 'from-emerald-400 to-emerald-500', bg: 'bg-emerald-50 text-emerald-700 border-emerald-100' };
      if (v >= 75) return { label: 'On Track', color: 'from-indigo-400 to-indigo-500', bg: 'bg-indigo-50 text-indigo-700 border-indigo-100' };
      if (v >= 50) return { label: 'Developing', color: 'from-amber-400 to-amber-500', bg: 'bg-amber-50 text-amber-700 border-amber-100' };
      return { label: 'Needs Support', color: 'from-rose-400 to-rose-500', bg: 'bg-rose-50 text-rose-700 border-rose-100' };
    };

    const s1 = getStatusStr(socialAvg);
    const s2 = getStatusStr(mathAvg);
    const s3 = getStatusStr(motorAvg);
    const s4 = getStatusStr(litAvg);

    return [
      {
        id: 'social',
        label: 'Social & Emotional Engagement',
        val: socialAvg,
        status: s1.label,
        color: s1.color,
        bg: s1.bg,
        details: 'Self-regulation, cooperative classroom group play, toilet learning, and readiness to adapt to classroom sequences.',
        recommendation: socialAvg >= 90 
          ? 'Showcase Challenge: Have them practice leading. Allow your child to "teach" a favorite toy or sibling progress rules, modeling polite classroom speech!'
          : 'Milestone Tip: Play daily role-play matching games (e.g. "school" or "shop") to build cooperative dialogue and practice taking polite group turns!'
      },
      {
        id: 'math',
        label: 'Cognitive & Numeracy Coordination',
        val: mathAvg,
        status: s2.label,
        color: s2.color,
        bg: s2.bg,
        details: 'Identifying shapes/sizes, counting with objects, number recognition, and logical spatial reasoning.',
        recommendation: mathAvg >= 90
          ? 'Creative Maths: Introduce small pattern-building challenges using items of different shapes. Let them sort kitchen spoons into size categories!'
          : 'Milestone Tip: Count physical steps when walking or count colorful vehicles on the driveway together, discussing colors and relative sizes.'
      },
      {
        id: 'motor',
        label: 'Fine & Physical Motor Development',
        val: motorAvg,
        status: motorAvg >= 90 ? 'Outstanding' : s3.label,
        color: s3.color,
        bg: s3.bg,
        details: 'Writing tool grip (pencil/crayon), fine puzzle sorting, scissor safety, alongside gross motor leaps like hopping/ball catching.',
        recommendation: motorAvg >= 90
          ? 'Showcase Game: Try finger painting detailed patterns, clay play, lego assembly, or sorting dried corn kernels using kitchen thumb tweezers.'
          : 'Milestone Tip: Practice buttoning old shirts or matching socks together; roll play-dough into snakes and pinch small balls to strengthen hands.'
      },
      {
        id: 'literacy',
        label: 'Language & Literacy Foundation',
        val: litAvg,
        status: s4.label,
        color: s4.color,
        bg: s4.bg,
        details: 'Verbal communication vocabulary size, letter recognition, following spoken directions, and phonetic interest.',
        recommendation: litAvg >= 90
          ? 'Library Leap: Point to words as you read, let them guess what happens next in stories, and let them trace alphabet letters in salt trays!'
          : 'Milestone Tip: Practice phone sounds. Let your child select items starting with sound /b/ (ball, box, book) around the bedroom floor.'
      }
    ];
  };

  const dynamicMilestones = getDynamicMilestones();

  // --- Calendar grid model (real current month, navigable) ---
  const today = startOfDay(new Date());
  const firstWeekday = new Date(calView.year, calView.month, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(calView.year, calView.month + 1, 0).getDate();
  const eventsByDay = new Map<number, SchoolEvent[]>();
  events.forEach((ev) => {
    const d = parseEventDate(ev.date);
    if (d && d.getFullYear() === calView.year && d.getMonth() === calView.month) {
      eventsByDay.set(d.getDate(), [...(eventsByDay.get(d.getDate()) || []), ev]);
    }
  });

  // --- Finance statement dates (relative to today, never a hardcoded year) ---
  const nextMonthDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const prevMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const nextDueLabel = `01 ${MONTH_NAMES[nextMonthDate.getMonth()]} ${nextMonthDate.getFullYear()}`;
  const lastProcessedLabel = `01 ${MONTH_NAMES[prevMonthDate.getMonth()]} ${prevMonthDate.getFullYear()}`;

  // Upcoming events first (soonest → latest), then past events (most recent first)
  const sortedEvents = [...events].sort((a, b) => {
    const ua = isUpcomingEvent(a.date);
    const ub = isUpcomingEvent(b.date);
    if (ua !== ub) return ua ? -1 : 1;
    const ta = parseEventDate(a.date)?.getTime() ?? 0;
    const tb = parseEventDate(b.date)?.getTime() ?? 0;
    return ua ? ta - tb : tb - ta;
  });

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-screen relative p-4 lg:p-8 bg-slate-50/50">
      {/* Visual Navigation Links Panel */}
      <div className="w-full lg:w-72 shrink-0 animate-[fadeIn_0.5s_ease-out]">
        <div className="glass-card rounded-3xl p-5 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible items-center lg:items-stretch sticky top-8 z-10">
          <div className="hidden lg:block pb-4 mb-3 border-b border-slate-200/50">
            <h4 className="font-bold text-[10px] text-slate-400 tracking-widest uppercase px-3">Parent Portal</h4>
            {parentLearners.length > 1 ? (
              <div className="px-3 mt-3 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-2">Select Student</span>
                <div className="flex flex-col gap-2">
                  {parentLearners.map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => {
                        onSelectLearner && onSelectLearner(l.id);
                        setSelectedReport(null);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all duration-300 cursor-pointer ${
                        learner?.id === l.id
                          ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-200'
                          : 'hover:bg-white/80 text-slate-600 border border-transparent hover:shadow-sm'
                      }`}
                    >
                      <span className="truncate">{l.preferredName}</span>
                      {learner?.id === l.id && <span className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 mt-3 bg-white/50 p-2 rounded-xl">
                <span className={`w-2 h-2 rounded-full ${learner ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
                <span className="text-xs text-slate-600 font-bold">
                  {learner ? `Linked: ${learner.preferredName}` : 'Admissions Pending'}
                </span>
              </div>
            )}
          </div>

          {[
            { id: 'overview', label: 'Notice Board & Highlights', icon: Sparkles, activeGradient: 'from-amber-500 to-rose-500' },
            { id: 'reports', label: 'Academic Reports', icon: FileText, activeGradient: 'from-indigo-500 to-violet-600' },
            { id: 'calendar', label: 'School Calendar', icon: CalIcon, activeGradient: 'from-emerald-500 to-teal-500' },
            { id: 'journal', label: 'Classroom Gallery', icon: BookOpen, activeGradient: 'from-rose-500 to-pink-500' },
            { id: 'finance', label: 'Fees & Payments', icon: CreditCard, activeGradient: 'from-sky-500 to-blue-600' },
            { id: 'profile', label: 'Contact & Family Info', icon: User, activeGradient: 'from-teal-500 to-emerald-600' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setSelectedReport(null);
                }}
                className={`group relative flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold tracking-wide transition-all duration-300 whitespace-nowrap cursor-pointer w-full overflow-hidden ${
                  isActive
                    ? 'text-white shadow-lg transform hover:-translate-y-0.5'
                    : 'text-slate-500 hover:bg-white/80 hover:text-slate-900 hover:shadow-sm'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeTab" 
                    className={`absolute inset-0 bg-gradient-to-r ${tab.activeGradient} opacity-100 rounded-2xl`}
                  />
                )}
                <Icon className={`relative z-10 w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Dashboard Frame */}
      <div className="flex-1 w-full max-w-7xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + (selectedReport ? '-report' : '')}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
            className="h-full"
          >
            {isPendingApproval && ['reports', 'journal', 'finance'].includes(activeTab) ? (
              <div className="glass-card rounded-3xl p-10 text-center max-w-lg mx-auto my-12 space-y-8 animate-[slideUp_0.5s_ease-out]">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-amber-200 shadow-xl shadow-amber-100/50 transform rotate-3">
                  <ShieldAlert className="w-10 h-10 stroke-[2]" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-orange-500">Portal Section Locked</h3>
                  <p className="text-slate-500 text-sm font-semibold leading-relaxed">
                    This module ({activeTab === 'reports' ? 'Academic Reports' : activeTab === 'journal' ? 'Classroom Gallery' : 'Fees & Payments'}) will be activated immediately once the administration team has verified and approved your child's enrolment application.
                  </p>
                </div>
                <div className="p-5 bg-white/50 backdrop-blur-sm rounded-2xl border border-white text-left text-xs font-semibold text-slate-600 space-y-2 shadow-sm">
                  <p className="text-slate-800 font-bold">Current Application Status:</p>
                  <div className="flex items-center gap-2 text-amber-700 bg-amber-50/80 px-3 py-1.5 rounded-xl border border-amber-200/60 w-fit">
                    <Clock className="w-4 h-4 animate-pulse" />
                    <span>Pending Administrative Approval</span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-2 leading-relaxed">
                    You can still review and update your contact information under the Contact & Family Info tab, or check general school announcements in the Notice Board.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 transition-all duration-300 text-white font-bold text-sm rounded-2xl cursor-pointer shadow-lg shadow-indigo-200 hover:-translate-y-1 w-full"
                >
                  Return to Notice Board
                </button>
              </div>
            ) : (
              <>
                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && !selectedReport && (
              <div className="space-y-8 animate-[fadeIn_0.6s_ease-out]">
                {/* Multi-student switcher banner */}
                {parentLearners.length > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card bg-gradient-to-r from-indigo-50/80 to-purple-50/80 rounded-3xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <Users className="w-4 h-4 text-indigo-500" /> Viewing Child Profile
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Switch view to display reports, logs, and fees for each of your kids:
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {parentLearners.map((l) => (
                        <button
                          key={l.id}
                          type="button"
                          onClick={() => {
                            onSelectLearner && onSelectLearner(l.id);
                            setSelectedReport(null);
                          }}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                            learner?.id === l.id
                              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200/50 scale-105'
                              : 'bg-white hover:bg-slate-50 text-indigo-700 border border-indigo-100 hover:shadow-md'
                          }`}
                        >
                          {l.preferredName}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Outstanding Payment Warning */}
                {outstandingFees > 0 && (
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-gradient-to-r from-rose-50/90 to-amber-50/90 backdrop-blur-md border border-rose-200/50 rounded-3xl p-5 flex items-start gap-4 shadow-lg shadow-rose-100/50"
                  >
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-rose-400 to-amber-500 text-white shadow-md">
                      <AlertTriangle className="w-6 h-6 stroke-[2]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-black text-rose-900 tracking-tight">Action Required: Outstanding School Fees</h4>
                      <p className="text-sm text-rose-700 mt-1">
                        Outstanding fees: <span className="font-black text-rose-950">R{outstandingFees.toLocaleString()}</span>. Please submit proof of payment to avoid penalties.
                      </p>
                      <button
                        onClick={() => setActiveTab('finance')}
                        className="inline-block mt-3 px-4 py-1.5 bg-rose-100 text-rose-800 text-xs font-bold rounded-lg hover:bg-rose-200 transition-colors cursor-pointer"
                      >
                        Submit Proof of Payment →
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Top Quick Status Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Learner status block */}
                  {learner ? (
                    learner.enrolmentApproved === false ? (
                      <div className="glass-card bg-gradient-to-br from-amber-50/80 to-orange-50/80 rounded-3xl p-7 flex flex-col justify-between group hover:shadow-[0_10px_40px_-10px_rgba(245,158,11,0.2)] transition-all duration-300">
                        <div>
                          <span className="text-xs font-black text-amber-600 tracking-widest uppercase flex items-center gap-1.5">
                            <Clock className="w-4 h-4 animate-spin-slow" /> Admission Status
                          </span>
                          <h3 className="text-xl font-black text-slate-800 mt-3">{learner.firstNames} {learner.surname}</h3>
                          <p className="text-sm text-slate-500 mt-1 font-bold">{learner.classType} Class</p>
                          <div className="p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-white mt-4 text-xs text-amber-800 font-bold leading-relaxed shadow-sm">
                            Application Submitted & Pending Board Approval. Profile will activate shortly.
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="glass-card rounded-3xl p-7 flex flex-col justify-between group hover:shadow-[0_10px_40px_-10px_rgba(79,70,229,0.15)] transition-all duration-300 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-500/10 to-transparent rounded-full -mr-10 -mt-10 blur-2xl" />
                        <div className="relative z-10">
                          <span className="text-[10px] font-black text-indigo-600 tracking-widest uppercase bg-indigo-50 px-2.5 py-1 rounded-lg">Active Learner</span>
                          <h3 className="text-xl font-black text-slate-900 mt-4">{learner.firstNames} {learner.surname}</h3>
                          <p className="text-sm text-slate-500 mt-1 font-bold">{learner.classType} Class</p>
                        </div>
                        <div className="flex items-center gap-3 mt-8 pt-5 border-t border-slate-200/50 relative z-10">
                          <div className="p-2 px-3 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 text-white flex items-center gap-2 shadow-md shadow-emerald-200/50">
                            <Clock className="w-4 h-4" />
                            <span className="text-xs font-bold">{learner.attendanceStatus || 'Present'}</span>
                          </div>
                          <span className="text-xs text-slate-500 font-bold">Arrived at {learner.arrivedTime || '07:45'} AM</span>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="glass-card bg-gradient-to-br from-rose-50/80 to-pink-50/80 rounded-3xl p-7 flex flex-col justify-between group hover:shadow-[0_10px_40px_-10px_rgba(244,63,94,0.2)] transition-all duration-300">
                      <div>
                        <span className="text-xs font-black text-rose-600 tracking-widest uppercase">Admission Status</span>
                        <h3 className="text-lg font-black text-slate-900 mt-3">No Active Enrolment</h3>
                        <p className="text-xs text-slate-500 mt-2 leading-relaxed font-medium">
                          Submit an admissions application to register your child at Kiddies Town ECD & Academy.
                        </p>
                      </div>
                      <button
                        onClick={onApplyOnline}
                        className="mt-6 flex items-center justify-center gap-2 w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-sm font-bold py-3 px-4 rounded-xl transition-all duration-300 cursor-pointer shadow-lg shadow-rose-200/50 hover:-translate-y-1"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Apply Online Now</span>
                      </button>
                    </div>
                  )}

                  {/* Weekly Theme block */}
                  <div className="glass-card rounded-3xl p-7 flex flex-col justify-between group hover:shadow-[0_10px_40px_-10px_rgba(245,158,11,0.15)] transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-full -mr-10 -mt-10 blur-2xl" />
                    <div className="relative z-10">
                      <span className="text-[10px] font-black text-amber-600 tracking-widest uppercase bg-amber-50 px-2.5 py-1 rounded-lg">Weekly Theme</span>
                      <h3 className="text-xl font-black text-slate-900 mt-4 flex items-center gap-2">
                        <span className="text-2xl drop-shadow-sm">🦁</span> {themes[0]?.title || 'Safari Adventures'}
                      </h3>
                      <p className="text-sm text-slate-500 mt-2 leading-relaxed line-clamp-2 font-medium">
                        {themes[0]?.description}
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('journal')}
                      className="text-xs font-bold text-indigo-600 flex items-center gap-1.5 hover:text-indigo-800 transition-colors mt-6 self-start cursor-pointer group-hover:translate-x-1 duration-300 relative z-10 bg-indigo-50/50 px-3 py-1.5 rounded-lg"
                    >
                      Explore themes & photos <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Upcoming event block */}
                  <div className="glass-card rounded-3xl p-7 flex flex-col justify-between group hover:shadow-[0_10px_40px_-10px_rgba(16,185,129,0.15)] transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-full -mr-10 -mt-10 blur-2xl" />
                    <div className="relative z-10">
                      <span className="text-[10px] font-black text-emerald-600 tracking-widest uppercase bg-emerald-50 px-2.5 py-1 rounded-lg">Upcoming Event</span>
                      <h3 className="text-xl font-black text-slate-900 mt-4 line-clamp-1 flex items-center gap-2">
                        <span className="text-2xl drop-shadow-sm">📸</span> {events[0]?.title}
                      </h3>
                      <p className="text-sm text-slate-500 mt-2 font-medium">
                        <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">{events[0]?.date}</span> at {events[0]?.time}
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('calendar')}
                      className="text-xs font-bold text-indigo-600 flex items-center gap-1.5 hover:text-indigo-800 transition-colors mt-6 self-start cursor-pointer group-hover:translate-x-1 duration-300 relative z-10 bg-indigo-50/50 px-3 py-1.5 rounded-lg"
                    >
                      Event Details & RSVP <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Sub-grid of chat and milestones */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {/* Milestones Panel */}
                  <div className="glass-card rounded-3xl p-7">
                    <div className="flex justify-between items-center mb-6 border-b border-slate-200/50 pb-4">
                      <div>
                        <h3 className="font-black text-slate-900 text-lg">Interactive ECD Milestone Insights</h3>
                        <p className="text-xs font-medium text-slate-500 mt-1">Live developmental metrics calculated from Term Reports.</p>
                      </div>
                      <span className="p-3 bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-2xl shadow-lg shadow-indigo-200">
                        <Activity className="w-5 h-5" />
                      </span>
                    </div>

                    <div className="space-y-4">
                      {dynamicMilestones.map((m) => {
                        const isSelected = selectedMilestone === m.id;
                        return (
                          <div 
                            key={m.id} 
                            onClick={() => setSelectedMilestone(isSelected ? null : m.id)}
                            className="p-4 rounded-2xl border border-white bg-white/40 hover:bg-white/70 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 cursor-pointer group"
                          >
                            <div className="flex justify-between items-center text-sm font-bold mb-3">
                              <span className="text-slate-800 flex items-center gap-2">
                                <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${m.color} shadow-sm`} />
                                {m.label}
                              </span>
                              <div className="flex items-center gap-3">
                                <span className="text-slate-600 font-black">{m.val}%</span>
                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase ${m.bg}`}>
                                  {m.status}
                                </span>
                                <div className="p-1 rounded-full bg-white shadow-sm border border-slate-100">
                                  {isSelected ? (
                                    <ChevronUp className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="w-full bg-slate-200/50 rounded-full h-2.5 overflow-hidden backdrop-blur-sm shadow-inner">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${m.val}%` }}
                                transition={{ duration: 1, ease: 'easeOut', delay: 0.1 }}
                                className={`h-full rounded-full bg-gradient-to-r ${m.color} relative`}
                              >
                                <div className="absolute inset-0 bg-white/20 w-full animate-[pulseSoft_2s_ease-in-out_infinite]" />
                              </motion.div>
                            </div>
                            <AnimatePresence initial={false}>
                              {isSelected && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="overflow-hidden text-xs text-slate-600 leading-relaxed border-t border-slate-200/50 pt-4"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <div className="bg-white/80 backdrop-blur-md p-4 rounded-xl border border-white shadow-sm space-y-3">
                                    <p className="flex items-start gap-2 font-medium">
                                      <Info className="w-4 h-4 mt-0.5 shrink-0 text-indigo-500" />
                                      <span>{m.details}</span>
                                    </p>
                                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-3 rounded-xl border border-amber-100 flex items-start gap-2">
                                      <Lightbulb className="w-4 h-4 mt-0.5 shrink-0 text-amber-500" />
                                      <p className="text-amber-900 font-bold">{m.recommendation}</p>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quick Chat Widget */}
                  <div className="glass-card rounded-3xl p-7 flex flex-col justify-between min-h-[400px]">
                    <div className="flex justify-between items-center mb-4 border-b border-slate-200/50 pb-4">
                      <div>
                        <h3 className="font-black text-slate-900 text-lg">Teacher Instant Messaging</h3>
                        <p className="text-xs font-medium text-slate-500 mt-1">Secure real-time compliance communication</p>
                      </div>
                      <span className="p-3 bg-gradient-to-br from-emerald-400 to-teal-500 text-white rounded-2xl shadow-lg shadow-emerald-200">
                        <MessageSquare className="w-5 h-5" />
                      </span>
                    </div>

                    {/* Chat Messages flow */}
                    <div className="space-y-4 my-4 h-64 overflow-y-auto pr-2 custom-scrollbar">
                      {chatHistory.map((msg) => {
                        const isMe = msg.sender === 'Parent';
                        return (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={msg.id}
                            className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                          >
                            <span className="text-[10px] font-black text-slate-400 px-2 mb-1 uppercase tracking-wider">
                              {msg.senderName} • {msg.timestamp}
                            </span>
                            <div className={`p-3.5 px-5 rounded-2xl text-sm font-medium max-w-[85%] leading-relaxed shadow-sm ${
                              isMe
                                ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-tr-sm shadow-indigo-200'
                                : 'bg-white border border-slate-100 text-slate-800 rounded-tl-sm'
                            }`}>
                              {msg.text}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    <form onSubmit={handleSendMessage} className="flex gap-3 border-t border-slate-200/50 pt-4 relative">
                      <input
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Type message directly to Teacher Anne..."
                        className="flex-1 bg-white/80 backdrop-blur-sm text-sm font-medium px-5 py-3.5 rounded-2xl border border-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                      <button
                        type="submit"
                        className="p-3.5 px-5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 transition-all duration-300 rounded-2xl text-white cursor-pointer shadow-lg shadow-indigo-200 hover:-translate-y-0.5 flex items-center justify-center"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </form>
                  </div>
                </div>

                {/* Facebook Community Activity Feed & Updates */}
                <div className="glass-card rounded-3xl p-7">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 border-b border-slate-200/50 pb-5 mb-6">
                    <div>
                      <h3 className="font-black text-slate-900 text-lg flex items-center gap-3">
                        <span className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-md shadow-blue-200 flex items-center justify-center">
                          <Facebook className="w-5 h-5" />
                        </span>
                        Official Facebook Community Feed
                      </h3>
                      <p className="text-xs font-medium text-slate-500 mt-2">Stay connected with graduation photos, parents day events, fun walks, and newsletters.</p>
                    </div>
                    <a 
                      href="https://www.facebook.com/p/Kiddies-Town-ECD-100084221528687/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-white text-sm font-bold px-6 py-3 rounded-2xl shadow-lg shadow-blue-200 cursor-pointer hover:-translate-y-0.5"
                    >
                      <Facebook className="w-4 h-4 block" />
                      <span>Join Facebook Group</span>
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      {
                        title: `${new Date().getFullYear()} Year-End Graduation Day`,
                        date: `Nov ${new Date().getFullYear()} • Announcement`,
                        text: "Congratulations to our beautiful Grade R Graduates (Tigers Class)! High-resolution group pictures and parent-teacher speeches are now uploaded to the community page.",
                        likes: 42,
                        comments: 18,
                        img: "https://images.unsplash.com/photo-1627556704302-624286467c65?w=500&auto=format&fit=crop&q=65"
                      },
                      {
                        title: "Annual Ster Park Fun Walk & Picnic",
                        date: `Oct ${new Date().getFullYear()} • Activity Update`,
                        text: "Parents, teachers, and energetic kids! Thank you for making our annual 3km Kiddies Fun Walk on the Ster Park trail such a success. See the colorful balloon arch pics!",
                        likes: 35,
                        comments: 12,
                        img: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=500&auto=format&fit=crop&q=65"
                      },
                      {
                        title: "Creative Arts & Cake Sale Morning",
                        date: `Sep ${new Date().getFullYear()} • School Highlight`,
                        text: "Roses and Giraffes absolute masterpieces in clay and finger-paint. Our cake sale raised sufficient funds for new safety playground mats! Thank you, community!",
                        likes: 56,
                        comments: 24,
                        img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&auto=format&fit=crop&q=65"
                      }
                    ].map((post, idx) => (
                      <div key={idx} className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white overflow-hidden hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col justify-between group">
                        <div className="overflow-hidden">
                          <img src={post.img} alt={post.title} className="w-full h-40 object-cover border-b border-slate-100 group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                          <div className="p-5">
                            <span className="text-[10px] text-blue-600 font-black uppercase tracking-widest block mb-2">{post.date}</span>
                            <h4 className="font-black text-slate-900 text-sm mb-2">{post.title}</h4>
                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 font-medium">{post.text}</p>
                          </div>
                        </div>
                        <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-bold">
                          <span className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-rose-500" /> {post.likes}</span>
                          <span className="flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5 text-blue-500" /> {post.comments}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ACADEMIC REPORTS TAB */}
            {activeTab === 'reports' && !selectedReport && (
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

                {selectedLearnerReports.length === 0 ? (
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
                    {selectedLearnerReports.map((report) => (
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
                            onClick={() => setSelectedReport(report)}
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
            )}

            {/* IF A REPORT IS SELECTED IN THE HUB, SHOW IT INLINE */}
            {selectedReport && (
              <ProgressReportView
                report={selectedReport}
                learner={learner}
                onBack={() => setSelectedReport(null)}
              />
            )}

            {/* CALENDAR & RSVP TAB */}
            {activeTab === 'calendar' && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-[fadeIn_0.5s_ease-out]">
                {/* Interactive School Events Grid */}
                <div className="xl:col-span-2 glass-card rounded-3xl p-8">
                  <div className="flex justify-between items-center mb-8 border-b border-slate-200/50 pb-5">
                    <div>
                      <h3 className="font-black text-slate-900 text-2xl">School Event Calendar</h3>
                      <p className="text-sm font-medium text-slate-500 mt-1">Year planner and extracurricular event list</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => shiftCalMonth(-1)}
                        aria-label="Previous month"
                        className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all duration-300 cursor-pointer shadow-sm"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-xs font-black rounded-xl shadow-md shadow-indigo-200 whitespace-nowrap">
                        {MONTH_NAMES[calView.month]} {calView.year}
                      </span>
                      <button
                        type="button"
                        onClick={() => shiftCalMonth(1)}
                        aria-label="Next month"
                        className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all duration-300 cursor-pointer shadow-sm"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-6 grid grid-cols-7 gap-2 text-center font-black text-[11px] text-slate-400 tracking-widest uppercase border-b border-slate-100 pb-3">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <span key={d}>{d}</span>)}
                  </div>

                  {/* Past events get a muted shade, upcoming events a vibrant one */}
                  <div className="mb-3 flex items-center gap-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 shadow-sm" /> Upcoming event
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded-md bg-gradient-to-br from-slate-300 to-slate-400" /> Past event
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded-md bg-white border-2 ring-2 ring-amber-400 ring-offset-0 border-amber-300" /> Today
                    </span>
                  </div>

                  <div className="grid grid-cols-7 gap-2 mb-2">
                    {Array.from({ length: firstWeekday }).map((_, idx) => (
                      <div key={`lead-${idx}`} aria-hidden="true" />
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, idx) => {
                      const dayVal = idx + 1;
                      const dayEvents = eventsByDay.get(dayVal) || [];
                      const hasUpcomingEvent = dayEvents.some((ev) => isUpcomingEvent(ev.date));
                      const hasPastEvent = dayEvents.some((ev) => !isUpcomingEvent(ev.date));
                      const hasEvent = dayEvents.length > 0;
                      const isToday = today.getTime() === new Date(calView.year, calView.month, dayVal).getTime();
                      return (
                        <button
                          key={dayVal}
                          type="button"
                          disabled={!hasEvent}
                          onClick={() => hasEvent && setSelectedEventId(dayEvents[0].id)}
                          className={`aspect-square sm:p-2 flex flex-col items-center justify-center rounded-2xl text-sm font-bold transition-all duration-300 relative ${
                            hasUpcomingEvent
                              ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-200 transform hover:scale-110 cursor-pointer'
                              : hasPastEvent
                              ? 'bg-gradient-to-br from-slate-200 to-slate-300 text-slate-500 cursor-pointer hover:scale-105'
                              : 'bg-white/50 text-slate-600 border border-white hover:bg-white'
                          } ${isToday ? 'ring-2 ring-amber-400' : ''} ${!hasEvent ? 'cursor-default' : ''}`}
                        >
                          <span className="z-10">{dayVal}</span>
                          {hasUpcomingEvent && <span className="absolute bottom-2 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                          {hasPastEvent && !hasUpcomingEvent && <span className="absolute bottom-2 w-1.5 h-1.5 rounded-full bg-slate-500/70" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* RSVP Details and Action panel */}
                <div className="space-y-6">
                  <div className="glass-card rounded-3xl p-8">
                    <h3 className="font-black text-slate-900 text-lg mb-6 flex items-center gap-2">
                      <CalIcon className="w-5 h-5 text-indigo-500" /> Upcoming & Past Events
                    </h3>
                    
                    <div className="space-y-5 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                      {sortedEvents.map((event) => {
                        const rsvp = event.rsvps.find(r => r.parentName === profile.name);
                        const upcoming = isUpcomingEvent(event.date);
                        return (
                          <div
                            key={event.id}
                            className={`relative p-5 rounded-2xl border transition-all duration-300 z-10 ${
                              selectedEventId === event.id
                                ? 'bg-white border-indigo-200 shadow-xl shadow-indigo-100/50 scale-[1.02]'
                                : 'bg-white/60 backdrop-blur-sm border-white shadow-sm hover:shadow-md hover:bg-white'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-slate-100 to-slate-50 text-slate-600 px-3 py-1 rounded-lg border border-slate-200/50">
                                {event.category}
                              </span>
                              <span className={`text-[11px] font-bold px-2 py-1 rounded-md border ${
                                upcoming
                                  ? 'text-emerald-700 bg-emerald-50 border-emerald-100'
                                  : 'text-slate-500 bg-slate-100 border-slate-200'
                              }`}>
                                {upcoming ? 'Upcoming' : 'Past'} • {event.date}
                              </span>
                            </div>
                            <h4 className="font-black text-slate-900 text-base">{event.title}</h4>
                            <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">
                              {event.description}
                            </p>

                            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                                RSVP: 
                                <span className={`px-2 py-0.5 rounded-md text-white shadow-sm ${
                                  rsvp?.status === 'Yes' ? 'bg-emerald-500' : rsvp?.status === 'No' ? 'bg-rose-500' : rsvp?.status === 'Maybe' ? 'bg-amber-500' : 'bg-slate-300'
                                }`}>
                                  {rsvp?.status || 'None'}
                                </span>
                              </span>

                              <div className="flex gap-2">
                                {(['Yes', 'No', 'Maybe'] as const).map((opt) => (
                                  <button
                                    key={opt}
                                    disabled={!upcoming}
                                    onClick={() => onRsvpEvent(event.id, opt)}
                                    className={`px-3 py-1.5 text-[10px] font-black tracking-wide uppercase rounded-lg border transition-all duration-300 ${
                                      !upcoming
                                        ? 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed'
                                        : rsvp?.status === opt
                                        ? opt === 'Yes' ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-200 cursor-pointer' :
                                          opt === 'No' ? 'bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-200 cursor-pointer' :
                                          'bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-200 cursor-pointer'
                                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:shadow-sm cursor-pointer'
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CLASSROOM GALLERY TAB */}
            {activeTab === 'journal' && (
              <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
                <div className="glass-card rounded-3xl p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div>
                    <h3 className="font-black text-slate-900 text-2xl">Classroom Gallery & Lessons</h3>
                    <p className="text-sm font-medium text-slate-500 mt-2 max-w-2xl">
                      Visual records of children engaged in creative arts, physical exercises, and lessons. Supporting CARE, EDUCATE & DEVELOP.
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-pink-200">
                    <Sparkles className="w-4 h-4" />
                    Teacher Verified
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {journalPosts.map((post) => (
                    <article
                      key={post.id}
                      className="glass-card rounded-3xl overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col h-full group"
                    >
                      <div className="relative overflow-hidden">
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-56 object-cover object-center bg-slate-100 group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="p-6 flex-1 flex flex-col justify-between relative bg-white/40">
                        <div>
                          <p className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black tracking-widest uppercase mb-3 border border-indigo-100">{post.date}</p>
                          <h4 className="font-black text-slate-900 text-lg leading-tight">{post.title}</h4>
                          <p className="text-sm font-medium text-slate-600 mt-3 leading-relaxed">
                            {post.description}
                          </p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-200/50 flex items-center justify-between">
                          <span className="flex items-center gap-2 text-[11px] text-slate-500 font-bold">
                            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] text-slate-600">{post.postedBy.charAt(0)}</div>
                            {post.postedBy}
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-[10px] text-pink-600 font-black tracking-widest uppercase bg-pink-50 px-2 py-1 rounded-md">
                            <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
                            Verified
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Facebook Gallery Redirection banner */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 mt-10 shadow-xl shadow-blue-200">
                  <div className="flex items-center gap-5">
                    <span className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shrink-0 transform rotate-3">
                      <Facebook className="w-7 h-7" />
                    </span>
                    <div>
                      <h4 className="font-black text-white text-lg">See standard classroom activity archives?</h4>
                      <p className="text-sm font-medium text-blue-100 mt-1">Explore daily highlight reels, videos, and galleries on our public page.</p>
                    </div>
                  </div>
                  <a 
                    href="https://www.facebook.com/p/Kiddies-Town-ECD-100084221528687/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-white text-blue-700 hover:bg-blue-50 font-black text-sm px-6 py-3.5 rounded-2xl flex items-center gap-2 transition-all duration-300 shadow-lg cursor-pointer shrink-0 whitespace-nowrap hover:scale-105"
                  >
                    <span>View Facebook Albums</span>
                    <ChevronRight className="w-5 h-5" />
                  </a>
                </div>
              </div>
            )}

            {/* FINANCE & PAYMENTS TAB */}
            {activeTab === 'finance' && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-[fadeIn_0.5s_ease-out]">
                {/* Account Balances and History list */}
                <div className="xl:col-span-2 space-y-8">
                  {/* Visual Cards grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-7 shadow-xl shadow-slate-300 flex flex-col justify-between relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl" />
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest relative z-10">Total Outstanding</span>
                      <h3 className="text-3xl font-black mt-4 relative z-10">R{outstandingFees.toLocaleString()}.00</h3>
                      <p className="text-[11px] font-medium text-slate-400 mt-3 relative z-10 bg-slate-800/50 w-fit px-2 py-1 rounded-md">Due by 1st of each month</p>
                    </div>

                    <div className="glass-card rounded-3xl p-7 flex flex-col justify-between relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-500/10 to-transparent rounded-full -mr-10 -mt-10 blur-xl" />
                      <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest relative z-10">Next Monthly Fee</span>
                      <h3 className="text-3xl font-black text-slate-900 mt-4 relative z-10">
                        {parentLearners.length > 0 ? `R${(parentLearners.length * 2500).toLocaleString()}.00` : "R0.00"}
                      </h3>
                      <p className="text-[11px] font-bold text-indigo-600 mt-3 relative z-10 bg-indigo-50 w-fit px-2 py-1 rounded-md">
                        {parentLearners.length > 0 ? `Due 01 ${MONTH_NAMES[nextMonthDate.getMonth()]} ${nextMonthDate.getFullYear()} (x${parentLearners.length})` : "No children enrolled"}
                      </p>
                    </div>

                    <div className="glass-card rounded-3xl p-7 flex flex-col justify-between relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-full -mr-10 -mt-10 blur-xl" />
                      <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest relative z-10">Last Processed</span>
                      <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600 mt-4 relative z-10">
                        {parentLearners.length > 0 ? `R${(parentLearners.length * 2500).toLocaleString()}.00` : "N/A"}
                      </h3>
                      <p className="text-[11px] font-bold text-emerald-700 mt-3 relative z-10 bg-emerald-50 w-fit px-2 py-1 rounded-md">
                        {parentLearners.length > 0 ? `Processed on 01 ${MONTH_NAMES[prevMonthDate.getMonth()]} ${prevMonthDate.getFullYear()}` : "No children enrolled"}
                      </p>
                    </div>
                  </div>

                  {/* Payment Logs */}
                  <div className="glass-card rounded-3xl p-8">
                    <h3 className="font-black text-slate-900 text-lg mb-6 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-indigo-500" /> Payment & Invoices History
                    </h3>

                    <div className="overflow-x-auto rounded-2xl border border-white bg-white/40 shadow-inner">
                      <table className="w-full text-left text-sm text-slate-600 border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200/50 bg-slate-50/50 uppercase tracking-widest text-[10px] font-black text-slate-500">
                            <th className="py-4 px-5">Description</th>
                            <th className="py-4 px-5">Date</th>
                            <th className="py-4 px-5 text-right">Amount</th>
                            <th className="py-4 px-5 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/50 font-medium">
                          {parentPayments.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="py-10 text-center text-slate-500 italic bg-white/30">
                                No invoice history or receipts located. Submit an admissions application to enroll!
                              </td>
                            </tr>
                          ) : (
                            parentPayments.map((item, i) => (
                              <tr key={item.id} className={`transition-colors hover:bg-white/60 ${i % 2 === 0 ? 'bg-transparent' : 'bg-slate-50/30'}`}>
                                <td className="py-4 px-5 text-slate-900 font-bold">{item.description}</td>
                                <td className="py-4 px-5 font-mono text-xs text-slate-500">{item.date}</td>
                                <td className="py-4 px-5 text-right font-black text-slate-900">
                                  R{item.amount.toLocaleString()}
                                </td>
                                <td className="py-4 px-5 text-right flex justify-end">
                                  <span className={`px-3 py-1 rounded-xl text-[10px] font-black tracking-widest uppercase flex items-center gap-1.5 w-fit ${
                                    item.status === 'Paid'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : item.status === 'Pending Verification'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-rose-100 text-rose-800'
                                  }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${
                                      item.status === 'Paid' ? 'bg-emerald-500' : item.status === 'Pending Verification' ? 'bg-blue-500' : 'bg-rose-500'
                                    }`} />
                                    {item.status}
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Bank account details and Manual payment Logger */}
                <div className="space-y-8">
                  {/* bank account panel */}
                  <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 rounded-3xl p-8 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full -mr-10 -mt-10 blur-2xl" />
                    <h3 className="font-black text-base border-b border-slate-700/50 pb-4 mb-5 flex items-center gap-3 text-white relative z-10">
                      <span className="p-2 bg-indigo-500/20 rounded-lg">
                        <Landmark className="w-5 h-5 text-indigo-400" />
                      </span>
                      Kiddies Town Bank Details
                    </h3>

                    <div className="space-y-4 font-mono text-xs text-slate-300 relative z-10">
                      <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                        <p className="text-[10px] text-slate-400 font-sans font-bold uppercase tracking-widest mb-1">Capitec Bank</p>
                        <p className="font-bold text-white text-sm">A/C: 17 046 859 05</p>
                        <p className="text-[10px] text-slate-400 font-sans mt-1">Linked Cell: 079 386 6233</p>
                      </div>
                      <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                        <p className="text-[10px] text-slate-400 font-sans font-bold uppercase tracking-widest mb-1">Nedbank Account</p>
                        <p className="font-bold text-white text-sm">A/C: 110 679 2211</p>
                      </div>
                      <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                        <p className="text-[10px] text-slate-400 font-sans font-bold uppercase tracking-widest mb-1">First National Bank (FNB)</p>
                        <p className="font-bold text-white text-sm">A/C: 6274 1889 490</p>
                      </div>
                      <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                        <p className="text-[10px] text-slate-400 font-sans font-bold uppercase tracking-widest mb-1">Standard Bank</p>
                        <p className="font-bold text-white text-sm">A/C: 1013 675 3726</p>
                      </div>
                    </div>

                    <div className="bg-rose-500/10 p-4 rounded-xl mt-6 border border-rose-500/20 text-[11px] font-medium leading-relaxed text-rose-200 relative z-10">
                      <span className="font-black text-rose-400 block mb-1">⚠️ Important Note</span>
                      Please use child's registered name and surname as payment reference. Mail proof to <span className="underline font-bold">admin@kiddiestown.co.za</span> or WhatsApp.
                    </div>
                  </div>

                  {/* Manual Payment Submit form */}
                  <div className="glass-card rounded-3xl p-8">
                    <h4 className="font-black text-slate-900 text-lg mb-2 flex items-center gap-2">
                      <Upload className="w-5 h-5 text-indigo-600" /> Submit Proof
                    </h4>
                    <p className="text-xs font-medium text-slate-500 mb-6">Log a direct bank transfer details for admin validations</p>

                    {paySuccess ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-800 p-6 rounded-2xl border border-emerald-200 text-center shadow-lg shadow-emerald-100"
                      >
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h5 className="font-black text-sm">Payment logged successfully!</h5>
                        <p className="text-xs mt-2 font-medium text-emerald-700">Our Financial Administrator was notified. Your status is now "Pending Verification".</p>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleManualPaymentSubmit} className="space-y-4 text-sm font-medium">
                        <div className="relative">
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Fee Category</label>
                          <select
                            value={payDescription}
                            onChange={(e) => setPayDescription(e.target.value)}
                            className="bg-white/80 backdrop-blur-sm w-full px-4 py-3 border border-white shadow-sm rounded-xl text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
                          >
                            <option value="Monthly Fees / October Aftercare">Monthly Fees / October Aftercare</option>
                            <option value="Monthly Fees / November Full Day">Monthly Fees / November Full Day</option>
                            <option value={`School Registration Fee (New Year ${new Date().getFullYear()})`}>Registration Fee (R600)</option>
                            <option value="Excursion / Outing Fee">Excursion / Outing Fee</option>
                          </select>
                          <ChevronDown className="absolute right-4 top-[30px] w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>

                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Amount Transferred (ZAR)</label>
                          <input
                            type="number"
                            value={payAmount}
                            onChange={(e) => setPayAmount(e.target.value)}
                            className="bg-white/80 backdrop-blur-sm w-full px-4 py-3 border border-white shadow-sm rounded-xl font-mono text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
                            placeholder="e.g. 2500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Reference Code / Slip No</label>
                          <input
                            type="text"
                            value={payRef}
                            onChange={(e) => setPayRef(e.target.value)}
                            className="bg-white/80 backdrop-blur-sm w-full px-4 py-3 border border-white shadow-sm rounded-xl font-mono text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
                            placeholder="e.g. FNB1200388"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 transition-all duration-300 rounded-xl text-white font-black tracking-wide mt-4 cursor-pointer shadow-lg shadow-indigo-200 hover:-translate-y-0.5"
                        >
                          Submit Proof and Log Reference
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* FAMILY PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-[fadeIn_0.5s_ease-out]">
                {/* Child particulars card */}
                <div className="xl:col-span-2 space-y-8">
                  <div className="glass-card rounded-3xl p-8">
                    <h3 className="font-black text-slate-900 text-xl mb-6 border-b border-slate-200/50 pb-4 flex items-center gap-3">
                      <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><User className="w-5 h-5" /></span>
                      Learner Particulars
                    </h3>
                    
                    {learner ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 text-sm font-medium">
                        {[
                          { label: 'First Names', value: learner.firstNames },
                          { label: 'Surname/Family Name', value: learner.surname },
                          { label: 'Preferred Name', value: learner.preferredName },
                          { label: 'Date of Birth', value: learner.dob },
                          { label: 'ID Number', value: learner.idNumber, isMono: true },
                          { label: 'Home Language', value: learner.homeLanguage },
                          { label: 'Religion', value: learner.religion },
                          { label: 'Registered Class', value: `${learner.classType} Class`, isHighlight: true }
                        ].map((item, idx) => (
                          <div key={idx} className="relative group">
                            <span className="absolute -top-2 left-2 bg-white/80 backdrop-blur-sm px-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest z-10 group-hover:text-indigo-500 transition-colors">{item.label}</span>
                            <div className="pt-3 pb-2 px-3 border-b-2 border-slate-100 group-hover:border-indigo-200 transition-colors">
                              <span className={`block text-slate-900 ${item.isMono ? 'font-mono' : ''} ${item.isHighlight ? 'font-black text-indigo-700' : 'font-bold'}`}>
                                {item.value}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-white/40 rounded-2xl border border-dashed border-slate-300">
                        <p className="text-sm font-medium text-slate-500">No Enrolled Child Registered</p>
                        <button
                          onClick={onApplyOnline}
                          className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold py-2.5 px-5 rounded-xl transition-all hover:-translate-y-0.5 shadow-md shadow-indigo-200 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Submit Admissions Application</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="glass-card rounded-3xl p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-200/50 pb-4">
                      <div>
                        <h3 className="font-black text-slate-900 text-xl">Parent / Guardian Details</h3>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">Household contacts, employer, and family particulars</p>
                      </div>
                      <button
                        onClick={() => {
                          setEditProfileForm(profile);
                          setShowEditProfileModal(true);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer w-fit"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit Household Profile</span>
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Mother Profile */}
                      <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-2xl border border-pink-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/10 rounded-full -mr-8 -mt-8 blur-xl" />
                        <h4 className="font-black text-rose-900 text-sm mb-4 flex items-center gap-2 relative z-10">
                          <span className="w-8 h-8 rounded-full bg-rose-200 text-rose-700 flex items-center justify-center">M</span>
                          {profile.mother.firstNames} {profile.mother.surname}
                        </h4>
                        <div className="space-y-3 text-xs font-semibold text-slate-600 relative z-10">
                          <div className="flex justify-between border-b border-pink-200/50 pb-1">
                            <span className="text-slate-500">ID:</span> <span className="font-mono text-slate-900">{profile.mother.idNumber}</span>
                          </div>
                          <div className="flex justify-between border-b border-pink-200/50 pb-1">
                            <span className="text-slate-500">Occupation:</span> <span className="text-slate-900">{profile.mother.occupation}</span>
                          </div>
                          <div className="flex justify-between border-b border-pink-200/50 pb-1">
                            <span className="text-slate-500">Employer:</span> <span className="text-slate-900">{profile.mother.employer}</span>
                          </div>
                          <div className="flex justify-between border-b border-pink-200/50 pb-1">
                            <span className="text-slate-500">Cell No:</span> <span className="text-slate-900 font-mono">{profile.mother.cellNo}</span>
                          </div>
                          <div className="flex justify-between pb-1">
                            <span className="text-slate-500">Email:</span> <span className="text-slate-900">{profile.mother.email}</span>
                          </div>
                        </div>
                      </div>

                      {/* Father Profile */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full -mr-8 -mt-8 blur-xl" />
                        <h4 className="font-black text-indigo-900 text-sm mb-4 flex items-center gap-2 relative z-10">
                          <span className="w-8 h-8 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center">F</span>
                          {profile.father.firstNames} {profile.father.surname}
                        </h4>
                        <div className="space-y-3 text-xs font-semibold text-slate-600 relative z-10">
                          <div className="flex justify-between border-b border-blue-200/50 pb-1">
                            <span className="text-slate-500">ID:</span> <span className="font-mono text-slate-900">{profile.father.idNumber}</span>
                          </div>
                          <div className="flex justify-between border-b border-blue-200/50 pb-1">
                            <span className="text-slate-500">Occupation:</span> <span className="text-slate-900">{profile.father.occupation}</span>
                          </div>
                          <div className="flex justify-between border-b border-blue-200/50 pb-1">
                            <span className="text-slate-500">Employer:</span> <span className="text-slate-900">{profile.father.employer}</span>
                          </div>
                          <div className="flex justify-between border-b border-blue-200/50 pb-1">
                            <span className="text-slate-500">Cell No:</span> <span className="text-slate-900 font-mono">{profile.father.cellNo}</span>
                          </div>
                          <div className="flex justify-between pb-1">
                            <span className="text-slate-500">Email:</span> <span className="text-slate-900">{profile.father.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medical panel right column */}
                <div className="space-y-8">
                  <div className="glass-card rounded-3xl p-8">
                    <h3 className="font-black text-slate-900 text-lg mb-6 border-b border-slate-200/50 pb-4 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-rose-500" /> Medical Profile
                    </h3>
                    
                    <div className="space-y-5 text-sm font-medium text-slate-600">
                      <div className="p-4 bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-100 rounded-2xl shadow-sm">
                        <span className="font-black text-rose-700 block text-[10px] uppercase tracking-widest mb-2 flex items-center gap-1.5">
                          <ShieldAlert className="w-4 h-4" /> List of Allergies
                        </span>
                        <p className="font-bold text-rose-950">Peanuts, Shellfish. Required Epipen in school bag.</p>
                      </div>

                      <div className="p-4 bg-white/50 rounded-2xl border border-white shadow-sm">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Medical Aid Fund</p>
                        <p className="font-black text-slate-900 text-base">Discovery Health</p>
                        <p className="text-xs text-indigo-600 font-mono font-bold mt-1 bg-indigo-50 px-2 py-0.5 rounded w-fit">Plan: Classic Saver (No. 60511210)</p>
                      </div>

                      <div className="p-4 bg-white/50 rounded-2xl border border-white shadow-sm">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Family Physician Plan</p>
                        <p className="font-black text-slate-900 text-base">Dr. Melusi Khoza</p>
                        <p className="text-xs text-teal-600 font-mono font-bold mt-1 bg-teal-50 px-2 py-0.5 rounded w-fit">Tel: 015 023 1111</p>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card rounded-3xl p-8">
                    <h3 className="font-black text-slate-900 text-lg mb-6 border-b border-slate-200/50 pb-4">Emergency Contacts</h3>

                    <div className="space-y-5">
                      <div className="flex items-center gap-4 p-3 hover:bg-white/60 rounded-2xl transition-colors">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-200 to-slate-100 font-black text-sm flex items-center justify-center text-slate-600 shadow-inner border border-white">TM</div>
                        <div>
                          <p className="font-black text-sm text-slate-900">Thabo Mbeki</p>
                          <p className="text-xs text-slate-500 font-bold mt-0.5">Uncle • <span className="font-mono text-indigo-600 bg-indigo-50 px-1 rounded">+27 82 120 4455</span></p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-3 hover:bg-white/60 rounded-2xl transition-colors">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-200 to-slate-100 font-black text-sm flex items-center justify-center text-slate-600 shadow-inner border border-white">GZ</div>
                        <div>
                          <p className="font-black text-sm text-slate-900">Grace Zulu</p>
                          <p className="text-xs text-slate-500 font-bold mt-0.5">Grandmother • <span className="font-mono text-indigo-600 bg-indigo-50 px-1 rounded">+27 71 889 6043</span></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>
        </AnimatePresence>

        {/* EDIT PROFILE MODAL */}
        <AnimatePresence>
          {showEditProfileModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 w-full max-w-3xl overflow-hidden my-8"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-4 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <User className="w-5 h-5" />
                    <h3 className="font-extrabold text-base">Edit Household Profile & Family Details</h3>
                  </div>
                  <button
                    onClick={() => setShowEditProfileModal(false)}
                    className="p-1 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Form Body */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    onUpdateProfile?.(editProfileForm);
                    setProfileSaveSuccess(true);
                    setTimeout(() => {
                      setProfileSaveSuccess(false);
                      setShowEditProfileModal(false);
                    }, 1200);
                  }}
                  className="p-6 space-y-6 max-h-[75vh] overflow-y-auto"
                >
                  {profileSaveSuccess && (
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      Household profile successfully updated and synchronized!
                    </div>
                  )}

                  {/* General Household Info */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest border-b border-slate-100 pb-1">
                      1. Household & Residential Information
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Primary Contact Phone</label>
                        <input
                          type="text"
                          value={editProfileForm.phone || ''}
                          onChange={(e) => setEditProfileForm({ ...editProfileForm, phone: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all outline-hidden"
                          placeholder="+27 82 123 4567"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Marital Status</label>
                        <select
                          value={editProfileForm.maritalStatus || 'Married'}
                          onChange={(e) => setEditProfileForm({ ...editProfileForm, maritalStatus: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all outline-hidden"
                        >
                          <option value="Married">Married</option>
                          <option value="Single">Single</option>
                          <option value="Divorced">Divorced</option>
                          <option value="Widowed">Widowed</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Residential Physical Address</label>
                        <input
                          type="text"
                          value={editProfileForm.address || ''}
                          onChange={(e) => setEditProfileForm({ ...editProfileForm, address: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all outline-hidden"
                          placeholder="e.g. 7 Grimm Street, Ster Park, Polokwane"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mother / Primary Guardian Particulars */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-black text-pink-600 uppercase tracking-widest border-b border-slate-100 pb-1">
                      2. Mother / Primary Guardian Particulars
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">First Names</label>
                        <input
                          type="text"
                          value={editProfileForm.mother?.firstNames || ''}
                          onChange={(e) => setEditProfileForm({
                            ...editProfileForm,
                            mother: { ...editProfileForm.mother, firstNames: e.target.value }
                          })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-pink-500 outline-hidden"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Surname</label>
                        <input
                          type="text"
                          value={editProfileForm.mother?.surname || ''}
                          onChange={(e) => setEditProfileForm({
                            ...editProfileForm,
                            mother: { ...editProfileForm.mother, surname: e.target.value }
                          })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-pink-500 outline-hidden"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Cell Phone</label>
                        <input
                          type="text"
                          value={editProfileForm.mother?.cellNo || ''}
                          onChange={(e) => setEditProfileForm({
                            ...editProfileForm,
                            mother: { ...editProfileForm.mother, cellNo: e.target.value }
                          })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-pink-500 outline-hidden"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
                        <input
                          type="email"
                          value={editProfileForm.mother?.email || ''}
                          onChange={(e) => setEditProfileForm({
                            ...editProfileForm,
                            mother: { ...editProfileForm.mother, email: e.target.value }
                          })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-pink-500 outline-hidden"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Occupation</label>
                        <input
                          type="text"
                          value={editProfileForm.mother?.occupation || ''}
                          onChange={(e) => setEditProfileForm({
                            ...editProfileForm,
                            mother: { ...editProfileForm.mother, occupation: e.target.value }
                          })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-pink-500 outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Employer / Company</label>
                        <input
                          type="text"
                          value={editProfileForm.mother?.employer || ''}
                          onChange={(e) => setEditProfileForm({
                            ...editProfileForm,
                            mother: { ...editProfileForm.mother, employer: e.target.value }
                          })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-pink-500 outline-hidden"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Father / Secondary Guardian Particulars */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest border-b border-slate-100 pb-1">
                      3. Father / Secondary Guardian Particulars
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">First Names</label>
                        <input
                          type="text"
                          value={editProfileForm.father?.firstNames || ''}
                          onChange={(e) => setEditProfileForm({
                            ...editProfileForm,
                            father: { ...editProfileForm.father, firstNames: e.target.value }
                          })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-blue-500 outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Surname</label>
                        <input
                          type="text"
                          value={editProfileForm.father?.surname || ''}
                          onChange={(e) => setEditProfileForm({
                            ...editProfileForm,
                            father: { ...editProfileForm.father, surname: e.target.value }
                          })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-blue-500 outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Cell Phone</label>
                        <input
                          type="text"
                          value={editProfileForm.father?.cellNo || ''}
                          onChange={(e) => setEditProfileForm({
                            ...editProfileForm,
                            father: { ...editProfileForm.father, cellNo: e.target.value }
                          })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-blue-500 outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
                        <input
                          type="email"
                          value={editProfileForm.father?.email || ''}
                          onChange={(e) => setEditProfileForm({
                            ...editProfileForm,
                            father: { ...editProfileForm.father, email: e.target.value }
                          })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-blue-500 outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Occupation</label>
                        <input
                          type="text"
                          value={editProfileForm.father?.occupation || ''}
                          onChange={(e) => setEditProfileForm({
                            ...editProfileForm,
                            father: { ...editProfileForm.father, occupation: e.target.value }
                          })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-blue-500 outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Employer / Company</label>
                        <input
                          type="text"
                          value={editProfileForm.father?.employer || ''}
                          onChange={(e) => setEditProfileForm({
                            ...editProfileForm,
                            father: { ...editProfileForm.father, employer: e.target.value }
                          })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-blue-500 outline-hidden"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/80">
                    <button
                      type="button"
                      onClick={() => setShowEditProfileModal(false)}
                      className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-indigo-200 transition-all hover:-translate-y-0.5 cursor-pointer flex items-center gap-1.5"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Household Changes</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
