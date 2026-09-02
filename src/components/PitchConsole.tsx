import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useDragControls } from 'motion/react';
import { 
  Sparkles, ShieldCheck, HelpCircle, Laptop, Award, ArrowRight, ArrowLeft, 
  UserCheck, Terminal, Heart, Zap, FileSpreadsheet, Lock
} from 'lucide-react';
import NdebeleArtAccent from './NdebeleArtAccent';

interface PitchConsoleProps {
  onSelectRole: (role: 'landing' | 'parent' | 'admin' | 'teacher' | 'enrolment' | 'login') => void;
  onLoginSuccess: (user: { role: 'parent' | 'admin' | 'teacher'; name: string; email: string }) => void;
  onLogout: () => void;
  currentRoleMode: string;
}

export default function PitchConsole({ 
  onSelectRole, 
  onLoginSuccess, 
  onLogout,
  currentRoleMode 
}: PitchConsoleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [baloonsList, setBaloonsList] = useState<{ id: number; char: string; left: number; delay: number; duration: number }[]>([]);
  
  const dragControls = useDragControls();

  // 1. PITCH DECK SLIDERS DATA
  const pitchSlides = [
    {
      title: "Core Early Childhood SaaS Highlights",
      icon: Award,
      bullets: [
        { label: "Derived Class Routing", desc: "Automated class placement calculated strictly by age: Roses Class (≤3 Years), Giraffes Class (4 Years), Tigers Class (5+ Years)." },
        { label: "Interactive Reports Tracker", desc: "Monitors Social development, Cognitive numeracy, Literacy foundations, and Gross/Fine Motor development indexes." },
        { label: "Dual Storage Engine", desc: "Durable server database mapping for public updates with automatic offline local buffer fallback protection." }
      ]
    },
    {
      title: "Auditing & Regulatory Standards Compliance",
      icon: ShieldCheck,
      bullets: [
        { label: "Hand-Drawn e-Signatures", desc: "Direct browser-based touch and cursor signature capture bound to legally audited POPI compliance." },
        { label: "POPI Act Privacy Standards", desc: "Includes explicit photo consents & non-commercial media usage agreement safeguards." },
        { label: "Certified Document Checks", desc: "File validator framework for Birth certificates, ID documents and proof of residency." }
      ]
    },
    {
      title: "Administrative Pipeline & Ledger Control",
      icon: FileSpreadsheet,
      bullets: [
        { label: "Alert & Notices Automation", desc: "Integrated parent SMS & Email notifications for unpaid school bills with instant warning dispatching." },
        { label: "Weekly ECD Themes Log", desc: "Head teachers post weekly themes (e.g. 'Under the Sea') to keep parents in sync with learning modules." },
        { label: "Real-Time Registers", desc: "Responsive visual checkers displaying daily attendance patterns and student counts." }
      ]
    }
  ];

  // 2. STAKEHOLDER DEMO SIMULATOR CONTROL HANDLERS
  const triggerRoleSim = (role: 'parent' | 'admin' | 'teacher', name: string, email: string) => {
    onLoginSuccess({ role, name, email });
    setIsOpen(false);
  };

  const triggerAutofillWizard = () => {
    // Jump user directly to enrolment wizard mode first
    onSelectRole('enrolment');
    
    // Dispatch custom autofill event to EnrolmentWizard
    setTimeout(() => {
      const event = new CustomEvent('autofill-enrolment-wizard', {
        detail: {
          firstNames: 'Sphiwe Junior',
          surname: 'Mokoena',
          dob: '2021-04-12',
          idNumber: '2104125345084',
          prefName: 'SJ',
          gender: 'Male',
          language: 'Setswana',
          religion: 'Christian',
          mName: 'Sarah',
          mSurname: 'Mokoena',
          mId: '8903155348082',
          mCell: '0721473957',
          mEmail: 'sarah.mokoena@kiddiestown.co.za',
          mOcc: 'Software Engineer',
          mEmp: 'Google South Africa',
          fName: 'Thabo',
          fSurname: 'Mokoena',
          fId: '8704255146083',
          fCell: '0834195724',
          signerName: 'Sarah Mokoena'
        }
      });
      window.dispatchEvent(event);
    }, 250);

    setIsOpen(false);
  };

  // Celebration Fireworks / Emoji rain
  const triggerLaunchCelebration = () => {
    setShowCelebration(true);
    const icons = ['🎈', '🌹', '🦒', '🐯', '⭐', '✨', '🎓', '🎉'];
    const newList = Array.from({ length: 25 }).map((_, i) => ({
      id: Math.random() + i,
      char: icons[Math.floor(Math.random() * icons.length)],
      left: Math.random() * 95,
      delay: Math.random() * 0.8,
      duration: 3 + Math.random() * 3
    }));
    setBaloonsList(newList);

    setTimeout(() => {
      setShowCelebration(false);
      setBaloonsList([]);
    }, 6000);
  };

  return (
    <>
      {/* 1. ANIMATED FLOATING PITCH CONSOLE WITH ORIGINAL NDEBELE VIBES */}
      <div className="fixed bottom-6 left-6 z-40 select-none">
        <AnimatePresence>
          {!isOpen ? (
            <motion.button
              layoutId="pitch-panel-layout"
              onClick={() => setIsOpen(true)}
              drag
              dragMomentum={false}
              className="px-4.5 py-3 rounded-full bg-slate-900 border-2 border-slate-950 text-white shadow-2xl flex items-center gap-2.5 cursor-pointer hover:bg-slate-950 transition-all duration-300 transform"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              whileHover={{ y: -4, scale: 1.03 }}
            >
              <div className="relative flex items-center gap-1">
                <NdebeleArtAccent type="badge" className="scale-75 shadow-sm border-white/20" />
                <Laptop className="w-4 h-4 text-indigo-300" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              </div>
              <span className="text-xs font-black font-mono tracking-wider text-slate-100">STAKEHOLDER PITCH CONTROL</span>
            </motion.button>
          ) : (
            <motion.div
              layoutId="pitch-panel-layout"
              className="w-[365px] md:w-[410px] bg-slate-950 text-indigo-50 border-3 border-slate-900 rounded-3xl shadow-3xl p-0 flex flex-col relative overflow-hidden"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              drag
              dragControls={dragControls}
              dragListener={false}
              dragMomentum={false}
            >
              {/* Main Content Container with standard padding */}
              <div className="p-5 md:p-6 flex flex-col gap-4">
                {/* Title Header */}
                <div 
                  onPointerDown={(e) => dragControls.start(e)}
                  className="flex justify-between items-center border-b border-slate-900 pb-3 cursor-move active:cursor-grabbing select-none"
                >
                  <div className="flex items-center gap-2">
                    <NdebeleArtAccent type="badge" className="scale-90" />
                    <span className="text-[11.5px] font-black font-mono tracking-widest text-[#FBBF24] uppercase">
                      ECD Enterprise Pitch Panel ⚡
                    </span>
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="text-xs text-slate-400 hover:text-rose-400 font-mono bg-slate-900 px-2.5 py-1 rounded-md transition-colors cursor-pointer select-none border border-slate-800"
                  >
                    Close [X]
                  </button>
                </div>

                {/* SLIDE VISUALIZER (PITCH PRESENTATION HIGHLIGHTS) */}
                <div className="bg-slate-900/40 rounded-2xl p-4 border border-slate-900 relative">
                  {/* Subtle right-hand vertical design stripe for slide section */}
                  <div className="absolute right-0 top-0 bottom-0 w-2.5 overflow-hidden rounded-r-2xl opacity-40">
                    <NdebeleArtAccent type="vertical-stripe" className="h-full border-0" />
                  </div>

                  <div className="flex justify-between items-start gap-4 mb-3 md:pr-4">
                    <div className="flex items-center gap-2 text-indigo-300">
                      {(() => {
                        const SlideIcon = pitchSlides[activeSlide].icon;
                        return <SlideIcon className="w-4 h-4 shrink-0 stroke-[2.5]" />;
                      })()}
                      <h4 className="text-[11.5px] font-black uppercase tracking-wider text-slate-100">
                        {pitchSlides[activeSlide].title}
                      </h4>
                    </div>
                    {/* Slide numbering indicator */}
                    <span className="text-[9.5px] font-bold font-mono text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800/40 shrink-0">
                      Slide {activeSlide + 1} of 3
                    </span>
                  </div>

                  <div className="space-y-3 min-h-[148px] flex flex-col justify-center md:pr-4">
                    {pitchSlides[activeSlide].bullets.map((bullet, idx) => (
                      <div key={idx} className="flex gap-2.5 items-start">
                        <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <h5 className="text-[10.5px] font-extrabold text-indigo-200">{bullet.label}</h5>
                          <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed font-semibold">
                            {bullet.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Slicer controllers */}
                  <div className="flex justify-between items-center mt-3 pt-3.5 border-t border-slate-900/50 md:pr-4">
                    <button
                      onClick={() => setActiveSlide(p => Math.max(0, p - 1))}
                      disabled={activeSlide === 0}
                      className="p-1 px-2.5 rounded bg-slate-950 hover:bg-slate-805 disabled:opacity-40 text-[10px] text-indigo-200 font-bold flex items-center gap-1 cursor-pointer transition-all border border-slate-800"
                    >
                      <ArrowLeft className="w-3 h-3" /> Back
                    </button>
                    <button
                      onClick={() => setActiveSlide(p => Math.min(pitchSlides.length - 1, p + 1))}
                      disabled={activeSlide === pitchSlides.length - 1}
                      className="p-1 px-2.5 rounded bg-indigo-950/80 hover:bg-indigo-900 disabled:opacity-40 text-[10px] text-indigo-100 font-bold flex items-center gap-1 cursor-pointer transition-all border border-indigo-800/50"
                    >
                      Next <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

              {/* DEMO FAST ACTION CHEATS */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-indigo-300 uppercase tracking-widest leading-relaxed">
                  🔌 Quick Demo Role-Login Simulators
                </h4>
                
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => triggerRoleSim('parent', 'Sarah Mbeki', 'parent@kiddiestown.co.za')}
                    className="px-3 py-2 bg-indigo-950/60 border border-indigo-850 hover:bg-slate-900 hover:border-indigo-400 text-[10.5px] font-mono font-bold rounded-lg transition-all text-left flex items-center gap-2 text-white cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    Sarah M. (Parent)
                  </button>
                  <button
                    onClick={() => triggerRoleSim('admin', 'Shineon Mbeki', 'admin@kiddiestown.co.za')}
                    className="px-3 py-2 bg-indigo-950/60 border border-indigo-850 hover:bg-slate-900 hover:border-indigo-400 text-[10.5px] font-mono font-bold rounded-lg transition-all text-left flex items-center gap-2 text-white cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    Shineon (Admin)
                  </button>
                  <button
                    onClick={() => triggerRoleSim('teacher', 'Head Teacher Tigers', 'teacher@kiddiestown.co.za')}
                    className="px-3 py-2 bg-indigo-950/60 border border-indigo-850 hover:bg-slate-900 hover:border-indigo-400 text-[10.5px] font-mono font-bold rounded-lg transition-all text-left flex items-center gap-2 text-white cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    Tigers Teacher
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      setIsOpen(false);
                    }}
                    className="px-3 py-2 bg-slate-950 border border-slate-900 hover:bg-slate-900 hover:border-slate-750 text-[10.5px] font-mono font-bold rounded-lg transition-all text-left flex items-center gap-2 text-slate-400 cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    Logout (Landing)
                  </button>
                </div>
              </div>

              {/* INTERACTIVE TRICKS & BLOW-OUT DEMO FEATURES */}
              <div className="space-y-2 pt-2 border-t border-slate-900">
                <button
                  type="button"
                  onClick={triggerAutofillWizard}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-black py-2.5 px-3 rounded-lg shadow-md transition-all cursor-pointer font-sans"
                >
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300 animate-spin" />
                  AUTOFILL ENROLMENT ADMITTANCE FORM
                </button>
                <div className="flex gap-2.5 justify-between">
                  <button
                    type="button"
                    onClick={triggerLaunchCelebration}
                    className="w-full bg-slate-900 hover:bg-slate-805 border border-indigo-900/60 text-slate-200 text-[10px] py-2 px-3 rounded-md transition-all font-mono font-black tracking-wide cursor-pointer text-center"
                  >
                    🎉 CELEBRATE CONFETTI STORM
                  </button>
                </div>
              </div>

              <div className="text-[9px] text-center text-slate-500 font-mono mt-1">
                Kiddies Town • Product Presentation Layer 1.0.0
              </div>
            </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Celebration overlay */}
      <AnimatePresence>
        {showCelebration && (
          <div className="fixed inset-0 z-50 pointer-events-none select-none overflow-hidden">
            {baloonsList.map((b) => (
              <motion.div
                key={b.id}
                initial={{ y: '110vh', x: `${b.left}vw`, scale: 0.8, opacity: 0 }}
                animate={{ 
                  y: '-10vh', 
                  opacity: [0, 1, 1, 0],
                  scale: [0.8, 1.2, 1.2, 0.8]
                }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: b.duration, 
                  delay: b.delay,
                  ease: "easeOut"
                }}
                className="absolute text-5xl font-extrabold select-none"
              >
                {b.char}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
