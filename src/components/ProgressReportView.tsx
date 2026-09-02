import { ProgressReport, Learner } from '../types';
import { Award, Check, FileText, ArrowLeft, Printer, AlertCircle } from 'lucide-react';
import KiddiesTownLogo from './KiddiesTownLogo';

interface ProgressReportProps {
  report: ProgressReport;
  learner: Learner;
  onBack: () => void;
}

export default function ProgressReportView({ report, learner, onBack }: ProgressReportProps) {
  const performanceInfo = [
    { key: 'A', title: 'Achieved', desc: 'Consistently demonstrates the skill', bg: 'bg-emerald-100 text-emerald-800' },
    { key: 'D', title: 'Developing', desc: 'Partially demonstrates the skill', bg: 'bg-blue-100 text-blue-800' },
    { key: 'E', title: 'Emerging', desc: 'Beginning to show signs of demonstrating or understanding the skill', bg: 'bg-amber-100 text-amber-800' },
    { key: 'N/O', title: 'Not Observed', desc: 'Not yet ready to demonstrate this skill', bg: 'bg-rose-100 text-rose-800' },
    { key: 'N/A', title: 'Not Applicable', desc: 'Not assessed at this Class/level', bg: 'bg-gray-100 text-gray-800' },
  ];

  const categories = [
    {
      code: 'A',
      title: 'Classroom Behavior',
      icon: '🏫',
      skills: [
        { id: 'A1_controlAndSafe', code: 'A1', text: 'I walk in classroom with reasonable control and safe movements, shows interest in group activities and respectful of others.', val: report.indicators.classroomBehavior.A1_controlAndSafe },
        { id: 'A2_bathroomIndependent', code: 'A2', text: 'I can go to bathroom by myself.', val: report.indicators.classroomBehavior.A2_bathroomIndependent }
      ]
    },
    {
      code: 'B',
      title: 'Communication Skills',
      icon: '💬',
      skills: [
        { id: 'B1_speaksClearly', code: 'B1', text: 'I speak clearly with my peers and teachers, am expanding my vocabulary, this also includes body language.', val: report.indicators.communicationSkills.B1_speaksClearly }
      ]
    },
    {
      code: 'C',
      title: 'Reading / Writing Skills',
      icon: '✏️',
      skills: [
        { id: 'C1_recognizesLetters', code: 'C1', text: 'I recognize letters of alphabets and can put basic letters together to form words.', val: report.indicators.readingWritingSkills.C1_recognizesLetters }
      ]
    },
    {
      code: 'D',
      title: 'Numbers / Math / Arithmetic',
      icon: '🔢',
      skills: [
        { id: 'D1_countsRecognizes', code: 'D1', text: 'I can count, recognize numbers and quantify.', val: report.indicators.numbersMathArithmetic.D1_countsRecognizes }
      ]
    },
    {
      code: 'E',
      title: 'Music & Art Skills',
      icon: '🎨',
      skills: [
        { id: 'E1_dancesMusicSings', code: 'E1', text: 'I can dance to music, sing after music and perform other art activities including drawings and creating objects using different elements.', val: report.indicators.musicArtSkills.E1_dancesMusicSings }
      ]
    },
    {
      code: 'F',
      title: 'Social / Emotional Skills',
      icon: '🤝',
      skills: [
        { id: 'F1_sharesAndPlays', code: 'F1', text: 'I know my first name, last name and age. I can share toys and play well with others. I can say "Sorry" to others and am happy and cheerful at school.', val: report.indicators.socialEmotionalSkills.F1_sharesAndPlays }
      ]
    },
    {
      code: 'G',
      title: 'Colours and Shapes',
      icon: '🟢',
      skills: [
        { id: 'G1_colorsShapes', code: 'G1', text: 'I know basic colors, can differentiate colors by names, differentiate shapes by names, understands big and small, long and short, high and low.', val: report.indicators.coloursAndShapes.G1_colorsShapes }
      ]
    },
    {
      code: 'H',
      title: 'Fine Motor Skills',
      icon: '✂️',
      skills: [
        { id: 'H1_pencilCrayonScissors', code: 'H1', text: 'I can hold and use a pencil, crayon, glue stick, paint brush and learning to use a scissor.', val: report.indicators.fineMotorSkills.H1_pencilCrayonScissors },
        { id: 'H2_blocksPuzzles', code: 'H2', text: 'I can build with blocks and also arrange puzzles.', val: report.indicators.fineMotorSkills.H2_blocksPuzzles },
        { id: 'H3_bounceKickThrow', code: 'H3', text: 'I can bounce, kick, throw and catch a ball. I can skip a rope, jump up and down and hop on one foot (left or right).', val: report.indicators.fineMotorSkills.H3_bounceKickThrow },
        { id: 'H4_buttonsShoesClothes', code: 'H4', text: 'I can button shirt, tie shoes and learning how to wear clothes.', val: report.indicators.fineMotorSkills.H4_buttonsShoesClothes }
      ]
    },
    {
      code: 'I',
      title: 'Approaches to Learn',
      icon: '💡',
      skills: [
        { id: 'I1_enjoysLearning', code: 'I1', text: 'I enjoy learning, relates knowledge from one experience to another and willing to participate in new experiences.', val: report.indicators.approachesToLearn.I1_enjoysLearning }
      ]
    },
    {
      code: 'J',
      title: 'Computer Skills',
      icon: '💻',
      skills: [
        { id: 'J1_tabletLaptopVoice', code: 'J1', text: 'I feel positive about use of tablet/ laptop to learn and can easily follow instructions, voices when using a computer.', val: report.indicators.computerSkills.J1_tabletLaptopVoice }
      ]
    }
  ];

  const shortSummaries = {
    K1: 'Joyful at school',
    K2: 'Melodious, playful and funny',
    K3: 'Honest and respectful to others',
    K4: 'Brilliant and creative',
    K5: 'Quite and reserved',
    K6: 'Sad at school'
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white min-h-screen text-slate-800 p-4 sm:p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 max-w-4xl mx-auto mb-10">
      {/* Back & Control actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-4 print:hidden">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Reports
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Print Report
          </button>
          {!report.released && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              <AlertCircle className="w-3.5 h-3.5" />
              Draft / Pending Release
            </span>
          )}
        </div>
      </div>

      {/* Report Sheet Head */}
      <div className="text-center mb-8 border-b-2 border-indigo-100 pb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-left flex items-center gap-3">
            <KiddiesTownLogo className="w-12 h-12 rounded-full border border-indigo-200/50 shadow-xs" />
            <div>
              <h1 className="text-2xl font-black text-indigo-950 tracking-tight font-sans">
                KIDDIES TOWN
              </h1>
              <p className="text-xs text-indigo-600 font-bold tracking-widest font-mono uppercase">ECD & Academy</p>
            </div>
          </div>
          <div className="text-right text-xs text-slate-400 font-mono">
            <p>7 Grimm Street, Ster Park</p>
            <p>Polokwane, 0700</p>
            <p>Tel: 015 023 0600</p>
          </div>
        </div>

        <h2 className="text-2xl font-black text-slate-900 mt-2">
          Quarterly Progress Report - {report.academicYear}
        </h2>
        
        {/* Term grid selector style */}
        <div className="flex justify-center mt-3 gap-2">
          {([1, 2, 3, 4] as const).map((t) => (
            <div
              key={t}
              className={`px-4 py-1.5 rounded-lg border text-xs font-bold font-mono transition-all ${
                report.term === t
                  ? 'bg-indigo-600 text-white border-indigo-600 scale-105 shadow-sm'
                  : 'bg-slate-50 text-slate-400 border-slate-200'
              }`}
            >
              Term {t} {t === 1 ? '(March)' : t === 2 ? '(June)' : t === 3 ? '(September)' : '(November)'}
            </div>
          ))}
        </div>
      </div>

      {/* Baby/Toddler/Learner's details section */}
      <div className="mb-8 bg-slate-50 p-6 rounded-xl border border-slate-100">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Learner & Class Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3.5">
          <div className="flex justify-between border-b border-slate-200 py-1.5">
            <span className="text-slate-500 text-sm">Name and surname:</span>
            <span className="font-bold text-slate-900 text-sm">{learner.firstNames} {learner.surname}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 py-1.5">
            <span className="text-slate-500 text-sm">Gender:</span>
            <span className="font-semibold text-slate-900 text-sm">{learner.gender}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 py-1.5">
            <span className="text-slate-500 text-sm">Age/DOB:</span>
            <span className="font-semibold text-slate-900 text-sm">{learner.dob}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 py-1.5">
            <span className="text-slate-500 text-sm">Class Group:</span>
            <span className="font-bold text-indigo-700 text-sm">{learner.classType} Class</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 py-1.5">
            <span className="text-slate-500 text-sm">Teacher Name:</span>
            <span className="font-semibold text-slate-900 text-sm">{report.teacherName}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 py-1.5">
            <span className="text-slate-500 text-sm">Recorded Days Absent:</span>
            <span className={`font-mono font-bold text-sm ${report.recordedDaysAbsent > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {report.recordedDaysAbsent} Days
            </span>
          </div>
        </div>
      </div>

      {/* Performance Indicators Key */}
      <div className="mb-8 p-5 bg-indigo-50/50 rounded-xl border border-indigo-100">
        <h4 className="text-sm font-bold text-indigo-900 mb-3 flex items-center gap-2">
          <Award className="w-4 h-4 text-indigo-600" />
          Performance Indicators Explanation
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {performanceInfo.map((p) => (
            <div key={p.key} className="bg-white p-3 rounded-lg border border-slate-100 flex items-start gap-2.5 shadow-xs">
              <span className={`w-8 h-8 shrink-0 flex items-center justify-center rounded-lg text-sm font-black ${p.bg}`}>
                {p.key}
              </span>
              <div>
                <p className="font-bold text-xs text-slate-900">{p.title}</p>
                <p className="text-[10px] leading-tight text-slate-400 mt-0.5">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Assessment Categories Table */}
      <div className="space-y-6">
        <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-200 pb-2">
          Developmental Assessments
        </h3>

        {categories.map((cat) => (
          <div key={cat.code} className="border border-slate-100 rounded-xl overflow-hidden shadow-xs">
            {/* Category Header */}
            <div className="bg-indigo-950 text-white px-4 py-3.5 flex items-center gap-2 font-bold text-sm">
              <span className="text-lg">{cat.icon}</span>
              <span>{cat.code}. {cat.title}</span>
            </div>

            {/* Skill rows */}
            <div className="divide-y divide-slate-100">
              {cat.skills.map((skill) => (
                <div key={skill.code} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white hover:bg-slate-50/40 transition-colors">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="bg-slate-100 text-slate-500 font-mono text-xs font-bold px-2 py-1 rounded">
                      {skill.code}
                    </span>
                    <p className="text-slate-700 text-sm leading-relaxed">{skill.text}</p>
                  </div>

                  {/* Rating Selector pill displays */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center">
                    {['A', 'D', 'E', 'N/O', 'N/A'].map((indicator) => {
                      const isActive = skill.val === indicator;
                      const mapping = performanceInfo.find(m => m.key === indicator)!;
                      return (
                        <span
                          key={indicator}
                          className={`w-9 h-9 flex items-center justify-center text-xs font-black rounded-lg transition-all ${
                            isActive
                              ? `${mapping.bg} ring-2 ring-indigo-500 scale-105 shadow-sm`
                              : 'bg-slate-50 text-slate-300 border border-slate-200/60'
                          }`}
                        >
                          {indicator}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Section K - Overall summary checklist */}
      <div className="mt-8 border border-slate-200 rounded-xl p-5 bg-slate-50">
        <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
          <span>🎯</span>
          <span>Section K: Overall Learner Character Summary</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Object.entries(shortSummaries).map(([kKey, label]) => {
            const isSelected = report.shortSummary === kKey;
            return (
              <div
                key={kKey}
                className={`p-3.5 rounded-xl border flex items-center gap-2.5 transition-all select-none ${
                  isSelected
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-950 font-semibold'
                    : 'bg-white border-slate-100 text-slate-400'
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                  isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-200'
                }`}>
                  {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3.5px]" />}
                </div>
                <div className="text-xs">
                  <span className="font-mono text-[10px] uppercase font-bold text-indigo-400 block">{kKey}</span>
                  {label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Teacher Comments Box */}
      {report.teacherComments && (
        <div className="mt-8 bg-slate-50 border border-slate-200 p-6 rounded-xl">
          <h4 className="font-extrabold text-slate-800 text-sm mb-2.5">Teacher General Remarks / Comments</h4>
          <p className="text-slate-600 text-sm leading-relaxed italic">
            "{report.teacherComments}"
          </p>
        </div>
      )}

      {/* Signature & Endorser grid */}
      <div className="mt-10 pt-8 border-t-2 border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-8 text-center text-slate-500 font-sans text-xs">
        <div className="flex flex-col items-center">
          <div className="h-10 flex items-end mb-1">
            <span className="font-serif italic text-base font-bold text-slate-800 tracking-tight">Teacher Anne</span>
          </div>
          <div className="w-48 border-t border-slate-300 pt-2 font-mono">
            <p className="font-bold text-slate-700">Teacher's Signature</p>
            <p className="text-[10px] mt-0.5 text-slate-400">Date: {report.releasedDate || `${report.academicYear || new Date().getFullYear()}-11-20`}</p>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="h-10 flex items-end mb-1">
            <span className="font-serif italic text-base font-bold text-indigo-800 tracking-wider">Shineon M.</span>
          </div>
          <div className="w-48 border-t border-slate-300 pt-2 font-mono">
            <p className="font-bold text-slate-700">Principal's Signature</p>
            <p className="text-[10px] mt-0.5 text-slate-400">Date: {report.releasedDate || `${report.academicYear || new Date().getFullYear()}-11-20`}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
