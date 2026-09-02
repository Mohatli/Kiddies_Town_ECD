import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Activity, CheckCircle2, ChevronRight } from 'lucide-react';
import { Learner, ProgressReport } from '../../types';

interface MilestoneTrackerProps {
  learners: Learner[];
  reports?: ProgressReport[];
  onUpdateMilestones: (studentId: string, milestones: { label: string; val: number }[]) => void;
}

export default function MilestoneTracker({ learners, reports = [], onUpdateMilestones }: MilestoneTrackerProps) {
  const [selectedMilestoneStudentId, setSelectedMilestoneStudentId] = useState(() => learners[0]?.id || 'student-jill');
  const [socialVal, setSocialVal] = useState(95);
  const [mathVal, setMathVal] = useState(82);
  const [motorVal, setMotorVal] = useState(88);
  const [langVal, setLangVal] = useState(78);
  const [milestonesSuccess, setMilestonesSuccess] = useState(false);

  // Sync sliders when the selected learner changes based on existing progress reports
  useEffect(() => {
    const studentReport = reports.find((r) => r.learnerId === selectedMilestoneStudentId);
    if (studentReport && studentReport.indicators) {
      const getVal = (code: string | undefined): number => {
        switch (code) {
          case 'A': return 95;
          case 'D': return 75;
          case 'E': return 55;
          case 'N/O': return 40;
          default: return 80;
        }
      };
      setSocialVal(getVal(studentReport.indicators.socialEmotionalSkills?.F1_sharesAndPlays));
      setMathVal(getVal(studentReport.indicators.numbersMathArithmetic?.D1_countsRecognizes));
      setMotorVal(getVal(studentReport.indicators.fineMotorSkills?.H1_pencilCrayonScissors));
      setLangVal(getVal(studentReport.indicators.readingWritingSkills?.C1_recognizesLetters));
    }
  }, [selectedMilestoneStudentId, reports]);

  const handleSaveMilestones = () => {
    onUpdateMilestones(selectedMilestoneStudentId, [
      { label: 'Social & Emotional', val: socialVal },
      { label: 'Numeracy (D1)', val: mathVal },
      { label: 'Fine Motor Skills (H)', val: motorVal },
      { label: 'Language / Literacy (C1)', val: langVal }
    ]);
    setMilestonesSuccess(true);
    setTimeout(() => {
      setMilestonesSuccess(false);
    }, 3000);
  };

  return (
    <div className="glass-card rounded-3xl p-6 md:p-10 max-w-4xl mx-auto space-y-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 bg-amber-50 rounded-full blur-3xl -z-10 opacity-60 translate-x-1/3 -translate-y-1/3" />
      
      <div className="border-b border-indigo-50/50 pb-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-amber-200">
          <Activity className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-extrabold text-slate-800 text-xl">Dynamic Milestones Tracker</h3>
          <p className="text-sm text-slate-500 font-medium mt-1">Adjust learning parameters to reflect in the Parent Portal.</p>
        </div>
      </div>

      {milestonesSuccess ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-800 p-10 rounded-3xl border border-emerald-100/60 text-center shadow-lg shadow-emerald-100/50"
        >
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}>
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          </motion.div>
          <h4 className="font-black text-xl">Metrics Updated & Saved!</h4>
          <p className="text-sm text-emerald-700/80 mt-2 font-medium">New scores are now reflecting dynamically inside parent dashboards.</p>
        </motion.div>
      ) : (
        <div className="space-y-8">
          <div className="relative group">
            <label className="absolute -top-2.5 left-4 bg-white px-2 text-[10px] uppercase font-bold tracking-wider text-indigo-500 z-10">Select Learner</label>
            <div className="relative z-0">
              <select
                value={selectedMilestoneStudentId}
                onChange={(e) => setSelectedMilestoneStudentId(e.target.value)}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {[
              { label: 'Social & Emotional Skills', val: socialVal, set: setSocialVal, color: 'indigo' },
              { label: 'Numeracy Indicator (D1)', val: mathVal, set: setMathVal, color: 'violet' },
              { label: 'Fine Motor Control (H)', val: motorVal, set: setMotorVal, color: 'rose' },
              { label: 'Language / Literacy (C1)', val: langVal, set: setLangVal, color: 'amber' }
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-50/50 border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-slate-700 font-bold text-sm">{item.label}</span>
                  <span className={`text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-${item.color}-500 to-${item.color}-600`}>
                    {item.val}%
                  </span>
                </div>
                <div className="relative pt-1">
                  <input
                    type="range" min="0" max="100" value={item.val}
                    onChange={(e) => item.set(Number(e.target.value))}
                    className={`w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-${item.color}-500`}
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSaveMilestones}
            className="w-full mt-6 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 transition-all duration-300 text-white font-bold tracking-widest uppercase text-xs rounded-2xl cursor-pointer shadow-xl shadow-indigo-200 hover:shadow-2xl hover:shadow-indigo-300 hover:-translate-y-0.5 animate-gradient-x"
          >
            Save & Sync Student Milestones
          </button>
        </div>
      )}
    </div>
  );
}
