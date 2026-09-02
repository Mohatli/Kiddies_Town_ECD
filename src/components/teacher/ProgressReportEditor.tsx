import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FileText, CheckCircle2, ChevronRight, Edit, AlertCircle } from 'lucide-react';
import { Learner, ProgressReport } from '../../types';

interface ProgressReportEditorProps {
  learners: Learner[];
  reports?: ProgressReport[];
  onSaveReport: (report: ProgressReport) => Promise<void>;
}

export default function ProgressReportEditor({ learners, reports = [], onSaveReport }: ProgressReportEditorProps) {
  const [selectedReportStudentId, setSelectedReportStudentId] = useState(() => learners[0]?.id || 'student-jill');
  const [selectedTerm, setSelectedTerm] = useState<1 | 2 | 3 | 4>(4);
  const [recordedAbsent, setRecordedAbsent] = useState(0);
  const [remarks, setRemarks] = useState('Continues to excel across all learning areas. Respectful, creative, and engaged in classroom activities.');
  const [indicators, setIndicators] = useState<Record<string, 'A' | 'D' | 'E' | 'N/O' | 'N/A'>>({
    A1: 'A', A2: 'A',
    B1: 'A',
    C1: 'D',
    D1: 'A',
    E1: 'A',
    F1: 'A',
    G1: 'A',
    H1: 'A', H2: 'A', H3: 'A', H4: 'D',
    I1: 'A',
    J1: 'A'
  });
  const [reportSuccess, setReportSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Sync editor fields when selected student or term changes
  useEffect(() => {
    const existing = reports.find(
      (r) => r.learnerId === selectedReportStudentId && r.term === selectedTerm
    );
    if (existing) {
      setRecordedAbsent(existing.recordedDaysAbsent ?? 0);
      if (existing.teacherComments) setRemarks(existing.teacherComments);
      if (existing.indicators) {
        setIndicators({
          A1: existing.indicators.classroomBehavior?.A1_controlAndSafe || 'A',
          A2: existing.indicators.classroomBehavior?.A2_bathroomIndependent || 'A',
          B1: existing.indicators.communicationSkills?.B1_speaksClearly || 'A',
          C1: existing.indicators.readingWritingSkills?.C1_recognizesLetters || 'D',
          D1: existing.indicators.numbersMathArithmetic?.D1_countsRecognizes || 'A',
          E1: existing.indicators.musicArtSkills?.E1_dancesMusicSings || 'A',
          F1: existing.indicators.socialEmotionalSkills?.F1_sharesAndPlays || 'A',
          G1: existing.indicators.coloursAndShapes?.G1_colorsShapes || 'A',
          H1: existing.indicators.fineMotorSkills?.H1_pencilCrayonScissors || 'A',
          H2: existing.indicators.fineMotorSkills?.H2_blocksPuzzles || 'A',
          H3: existing.indicators.fineMotorSkills?.H3_bounceKickThrow || 'A',
          H4: existing.indicators.fineMotorSkills?.H4_buttonsShoesClothes || 'D',
          I1: existing.indicators.approachesToLearn?.I1_enjoysLearning || 'A',
          J1: existing.indicators.computerSkills?.J1_tabletLaptopVoice || 'A',
        });
      }
    }
  }, [selectedReportStudentId, selectedTerm, reports]);

  const selectedLearner = learners.find((l) => l.id === selectedReportStudentId);
  const selectedLearnerName = selectedLearner ? `${selectedLearner.firstNames} ${selectedLearner.surname}` : 'the learner';

  const handleUpdateIndicator = (key: string, val: 'A' | 'D' | 'E' | 'N/O' | 'N/A') => {
    setIndicators({ ...indicators, [key]: val });
  };

  const handleSaveReportForm = async () => {
    if (isSaving) return;
    setIsSaving(true);
    setSaveError(null);

    const existing = reports.find(
      (r) => r.learnerId === selectedReportStudentId && r.term === selectedTerm
    );

    const canonicalId = existing?.id || `report-${selectedReportStudentId}-term${selectedTerm}`;

    const reportModel: ProgressReport = {
      id: canonicalId,
      learnerId: selectedReportStudentId,
      academicYear: new Date().getFullYear(),
      term: selectedTerm,
      released: true,
      releasedDate: new Date().toISOString().split('T')[0],
      recordedDaysAbsent: recordedAbsent,
      indicators: {
        classroomBehavior: { A1_controlAndSafe: indicators.A1, A2_bathroomIndependent: indicators.A2 },
        communicationSkills: { B1_speaksClearly: indicators.B1 },
        readingWritingSkills: { C1_recognizesLetters: indicators.C1 },
        numbersMathArithmetic: { D1_countsRecognizes: indicators.D1 },
        musicArtSkills: { E1_dancesMusicSings: indicators.E1 },
        socialEmotionalSkills: { F1_sharesAndPlays: indicators.F1 },
        coloursAndShapes: { G1_colorsShapes: indicators.G1 },
        fineMotorSkills: {
          H1_pencilCrayonScissors: indicators.H1,
          H2_blocksPuzzles: indicators.H2,
          H3_bounceKickThrow: indicators.H3,
          H4_buttonsShoesClothes: indicators.H4
        },
        approachesToLearn: { I1_enjoysLearning: indicators.I1 },
        computerSkills: { J1_tabletLaptopVoice: indicators.J1 }
      },
      shortSummary: 'K4',
      teacherComments: remarks,
      teacherName: existing?.teacherName || 'Teacher Anne',
      principalName: existing?.principalName || 'Mrs. Shineon'
    };

    try {
      await onSaveReport(reportModel);
      setReportSuccess(true);
      setTimeout(() => {
        setReportSuccess(false);
      }, 4000);
    } catch {
      setSaveError('The report could not be published. Please check your connection and try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 md:p-10 max-w-4xl mx-auto space-y-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-50 rounded-full blur-3xl -z-10 opacity-60 translate-x-1/3 -translate-y-1/3" />
      
      <div className="border-b border-indigo-50/50 pb-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[10px] font-bold font-mono text-emerald-600 uppercase tracking-widest block mb-1">Report Builder</span>
          <h3 className="font-extrabold text-slate-800 text-xl">Evaluate Academic Performance</h3>
          <p className="text-sm text-slate-500 font-medium mt-1">Set learner check rankings corresponding to ECD specifications.</p>
        </div>
      </div>

      {saveError && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800"
        >
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm font-bold leading-relaxed">{saveError}</p>
        </motion.div>
      )}

      {reportSuccess ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-800 p-10 rounded-3xl border border-emerald-100/60 text-center shadow-lg shadow-emerald-100/50"
        >
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}>
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          </motion.div>
          <h4 className="font-black text-xl">Report Published!</h4>
          <p className="text-sm text-emerald-700/80 mt-2 font-medium">
            The report is now live in the parent portal under Academic Reports for {selectedLearnerName} — Term {selectedTerm}.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative group">
              <label className="absolute -top-2.5 left-4 bg-white px-2 text-[10px] uppercase font-bold tracking-wider text-indigo-500 z-10">Learner Name</label>
              <div className="relative z-0">
                <select
                  value={selectedReportStudentId}
                  onChange={(e) => setSelectedReportStudentId(e.target.value)}
                  className="bg-white border border-slate-200 w-full px-5 py-4 rounded-2xl text-slate-800 font-bold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-hidden appearance-none"
                >
                  {learners.map(l => (
                    <option key={l.id} value={l.id}>{l.firstNames} {l.surname}</option>
                  ))}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronRight className="w-5 h-5 rotate-90" />
                </div>
              </div>
            </div>

            <div className="relative group">
              <label className="absolute -top-2.5 left-4 bg-white px-2 text-[10px] uppercase font-bold tracking-wider text-indigo-500 z-10">Select Term</label>
              <div className="relative z-0">
                <select
                  value={selectedTerm}
                  onChange={(e) => setSelectedTerm(Number(e.target.value) as any)}
                  className="bg-white border border-slate-200 w-full px-5 py-4 rounded-2xl text-slate-800 font-bold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-hidden appearance-none"
                >
                  <option value={1}>Term 1 Progress Report</option>
                  <option value={2}>Term 2 Progress Report</option>
                  <option value={3}>Term 3 Progress Report</option>
                  <option value={4}>Term 4 Progress Report</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronRight className="w-5 h-5 rotate-90" />
                </div>
              </div>
            </div>
          </div>

          <div className="relative group">
            <label className="absolute -top-2.5 left-4 bg-white px-2 text-[10px] uppercase font-bold tracking-wider text-indigo-500 z-10">Recorded Days Absent</label>
            <input
              type="number"
              value={recordedAbsent}
              onChange={(e) => setRecordedAbsent(Number(e.target.value))}
              className="bg-white border border-slate-200 w-full px-5 py-4 rounded-2xl font-mono text-slate-800 font-bold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-hidden relative z-0"
            />
          </div>

          <div className="border border-slate-200/60 rounded-3xl p-6 space-y-4 bg-slate-50/30">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-widest border-b border-slate-200 pb-3 mb-4 flex items-center gap-2">
              <Edit className="w-4 h-4 text-indigo-500" /> Selected Performance Rankings
            </h4>
            
            {[
              { key: 'A1', label: 'Walks with reasonable control & safe movements (Classroom Behavior)' },
              { key: 'B1', label: 'Speaks clearly with peers & teachers (Communication Skills)' },
              { key: 'C1', label: 'Recognizes letters of alphabets (Reading / Writing)' },
              { key: 'D1', label: 'Counts, recognizes numbers and quantify (Numeracy)' },
            ].map((item) => (
              <div key={item.key} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-3 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-slate-700 text-sm flex-1 font-semibold">{item.label}</span>
                <div className="flex gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-100 w-full lg:w-auto">
                  {(['A', 'D', 'E', 'N/O', 'N/A'] as const).map(ind => (
                    <button
                      key={ind}
                      type="button"
                      onClick={() => handleUpdateIndicator(item.key, ind)}
                      className={`flex-1 lg:flex-none w-10 h-10 flex items-center justify-center rounded-lg text-xs font-black cursor-pointer transition-all duration-200 ${
                        indicators[item.key] === ind
                          ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-200/50 scale-105'
                          : 'bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200'
                      }`}
                    >
                      {ind}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="relative group">
            <label className="absolute -top-2.5 left-4 bg-white px-2 text-[10px] uppercase font-bold tracking-wider text-indigo-500 z-10">Teacher General Comments</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="bg-white border border-slate-200 w-full px-5 py-4 rounded-2xl text-slate-800 font-medium focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-hidden h-32 relative z-0 resize-none"
              placeholder="Comment on developmental achievements or recommended focus areas..."
            />
          </div>

          <button
            onClick={handleSaveReportForm}
            disabled={isSaving}
            className="w-full mt-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:pointer-events-none transition-all duration-300 text-white font-bold tracking-widest uppercase text-xs rounded-2xl cursor-pointer shadow-xl shadow-emerald-200 hover:shadow-2xl hover:shadow-emerald-300 hover:-translate-y-0.5 animate-gradient-x"
          >
            {isSaving ? 'Publishing…' : 'Confirm, Compile & Publish Report'}
          </button>
        </div>
      )}
    </div>
  );
}
