import React, { useState } from 'react';
import { 
  Sparkles, ShieldCheck, Heart, Star, BookOpen, Clock, Phone, 
  MapPin, ChevronRight, Award, Compass, Users, CheckCircle, 
  Facebook, ArrowRight, ShieldAlert, GraduationCap, ChevronDown, Check, Info
} from 'lucide-react';
import KiddiesTownLogo from './KiddiesTownLogo';
import FloatingBalloons from './FloatingBalloons';

interface LandingPageProps {
  onSelectRole: (role: 'parent' | 'admin' | 'teacher' | 'enrolment') => void;
}

export default function LandingPage({ onSelectRole }: LandingPageProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'tigers' | 'giraffes' | 'roses'>('all');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [galleryCategory, setGalleryCategory] = useState<'all' | 'grad' | 'fun' | 'art' | 'play'>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<{
    id: number;
    category: string;
    title: string;
    description: string;
    longDesc: string;
    image: string;
    link: string;
  } | null>(null);

  const galleryPhotos = [
    {
      id: 1,
      category: 'grad',
      title: 'Grade R Graduation Ceremony',
      description: 'Our proud Grade R graduates (Tigers Class) throwing caps in celebration of stepping into primary school.',
      longDesc: 'Each November, we host our beautiful annual Year-End Graduation Ceremony. Our little graduates, wearing gowns and caps, stand tall to receive certificates of level completion. The event features parents-teacher assembly, kids choruses, and school milestone speeches.',
      image: 'https://images.unsplash.com/photo-1627556704302-624286467c65?w=800&auto=format&fit=crop&q=75',
      link: 'https://www.facebook.com/people/Kiddies-Town-ECD/100084221528687/?sk=photos'
    },
    {
      id: 2,
      category: 'fun',
      title: 'Annual Ster Park Fun Walk & Picnic',
      description: 'Creating memorable bonds under sunny skies with our annual community-sponsored physical run.',
      longDesc: 'The Kiddies Town 3km Fun Walk brings together over 150 parents, kids, and Polokwane community sponsors for a scenic morning stride in local Ster Park. Features include bright balloon arches, bouncy castles, face painting arenas, and parent picnic bags.',
      image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=800&auto=format&fit=crop&q=75',
      link: 'https://www.facebook.com/people/Kiddies-Town-ECD/100084221528687/?sk=photos'
    },
    {
      id: 3,
      category: 'art',
      title: 'Creative Art & Finger Painting',
      description: 'Enriching hand-eye motor coordination and sensory logic through colorful non-toxic canvas designs.',
      longDesc: 'Our dedicated painting, sculpting, and tactile collage sessions allow child-guided organic exploration. These fun tasks support motor pathways, color theory recognition, and focus during early development cycles.',
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=75',
      link: 'https://www.facebook.com/people/Kiddies-Town-ECD/100084221528687/?sk=photos'
    },
    {
      id: 4,
      category: 'play',
      title: 'Accredited Safe Outdoor Play Gyms',
      description: 'Strengthening spatial awareness on premium, age-compliant climbing gears and soft safety mats.',
      longDesc: 'Kiddies Town features state-of-the-art wooden jungle gyms, custom child-friendly slides, and specialized soft rubber turf. Outdoor playtime is strictly governed under the watchful eyes of Teacher Anne and our core ECD care teams.',
      image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&auto=format&fit=crop&q=75',
      link: 'https://www.facebook.com/people/Kiddies-Town-ECD/100084221528687/?sk=photos'
    },
    {
      id: 5,
      category: 'art',
      title: 'Sensory Sandbox Archaeologists',
      description: 'Syllabus-aligned sandbox group play to discover geometric shapes, dinosaur fossiles, and patterns.',
      longDesc: 'Our sandbox activities merge geography, geometry shapes, and vocabulary. Kids work in team circles using wooden brushes and sifting grids, reinforcing early social communication and analytical skillsets.',
      image: 'https://images.unsplash.com/photo-1505673542670-a5e3ff5b14a3?w=800&auto=format&fit=crop&q=75',
      link: 'https://www.facebook.com/people/Kiddies-Town-ECD/100084221528687/?sk=photos'
    },
    {
      id: 6,
      category: 'play',
      title: 'Toddlers Musical Rhythm Circles',
      description: 'Phonetic building and vocabulary coordination through instruments, handclaps, and group songs.',
      longDesc: 'Rhythm and sound patterns form the critical bedrock of early speech and language mastery. Our toddlers enjoy circle sing-alongs, xylophone taps, and acoustic matching cues to expand cognitive recall in a playful setting.',
      image: 'https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?w=800&auto=format&fit=crop&q=75',
      link: 'https://www.facebook.com/people/Kiddies-Town-ECD/100084221528687/?sk=photos'
    }
  ];

  const filteredGallery = galleryCategory === 'all'
    ? galleryPhotos
    : galleryPhotos.filter(p => p.category === galleryCategory);

  const classesData = [
    {
      id: 'roses',
      name: 'Roses Nursery Group',
      ages: '1 - 2 Years Old',
      color: 'bg-rose-50 text-rose-700 border-rose-100',
      badgeColor: 'bg-rose-500',
      pillText: 'Nursery & Infant Care',
      focus: 'Fine motor skills, emotional anchoring, sensory play, language initiation',
      desc: 'Our Roses group provides an exceptionally warm, secure, and nurturing nest. We focus on child-led sensory development, safe crawling spaces, tactile objects, and cognitive sound associations.',
      activities: ['Tactile sand & water plays', 'Soft block construction', 'Daily read-aloud circles', 'Nursery rhyming exercises'],
      image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=600&auto=format&fit=crop&q=65'
    },
    {
      id: 'giraffes',
      name: 'Giraffes Toddler Class',
      ages: '2 - 3 Years Old',
      color: 'bg-amber-50 text-amber-700 border-amber-100',
      badgeColor: 'bg-amber-500',
      pillText: 'Interactive Exploration',
      focus: 'Expressive speech, cooperative games, shape & color sorting, toilet independence',
      desc: 'The Giraffes class is tailored for rapid exploration and social play! Children enjoy creative finger painting, puzzle matching, and early physical coordination milestones in our dedicated play gyms.',
      activities: ['Shape-sorting puzzles', 'Fine arts finger-painting', 'Guided nature trails', 'Cooperative outdoor game cycles'],
      image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&auto=format&fit=crop&q=65'
    },
    {
      id: 'tigers',
      name: 'Tigers Grade R Prep',
      ages: '4 - 5 Years Old',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-110',
      badgeColor: 'bg-emerald-500',
      pillText: 'Grade R Readiness',
      focus: 'Emergent numeracy, structured phonics, science sandbox exploration, social confidence',
      desc: 'The Tigers classroom guides our oldest learners seamlessly into primary school readiness. Following strict South African CAPS guidelines, learners develop early writing patterns, basic maths, and robust reasoning.',
      activities: ['Emergent phonics matching', 'Sandbox archaeology digs', 'Early math sorting cycles', 'Basic coding blocks & patterns'],
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=65'
    }
  ];

  const filteredClasses = activeTab === 'all' 
    ? classesData 
    : classesData.filter(c => c.id === activeTab);

  const testimonials = [
    {
      text: "The Kiddies Town shuttle service is a lifesaver. My husband and I both work in Polokwane CBD, and knowing the driver picks up Thabo right on schedule makes working so stress-free.",
      author: "Nthabiseng Zulu",
      role: "High School Teacher & Mother",
      tag: "Verified Parent"
    },
    {
      text: "Seeing Leo's daily milestone charts and progress reports update in real-time has completely changed how involved we feel. We aren't just dropping him off; we are learning alongside him.",
      author: "Sarah Mbeki",
      role: "Public Service Administrator & Mother",
      tag: "Verified Parent"
    },
    {
      text: "Our child was extremely shy before joining the Giraffes class. After just three months of block construction, finger sciences, and care, her physical confidence is through the roof!",
      author: "Kabelo Molefe",
      role: "Local Banker & Father",
      tag: "Verified Parent"
    }
  ];

  const faqs = [
    {
      q: "Where is Kiddies Town located and what areas do you service?",
      a: "Our beautiful central campus is in Ster Park, Polokwane. We provide an integrated daily shuttle service that covers Polokwane CBD, Ster Park, Flora Park, and immediate surrounding suburbs."
    },
    {
      q: "Are you registered and compliant with South African ECD frameworks?",
      a: "Yes! Kiddies Town is fully registered with the Department of Basic Education (DBE). Our curriculum strictly aligns with the National Early Learning and Development Standards (NELDS) and CAPS Grade R preparation structures. We are also POPI Act compliant."
    },
    {
      q: "How can I apply for admission?",
      a: "You can apply right from this website! Simply click on the 'Apply Online' button or access the Admissions application wizard role from our navigation. It's a quick 6-step online form, with secure upload fields for immunization records and birth certificates."
    },
    {
      q: "What are the standard operational hours?",
      a: "We open every weekday from 07:00 AM to 05:30 PM. Breakfast, healthy morning fruit bowls, a warm balanced lunch, and afternoon snacks are prepared by our school dietitian and included in the base tuition."
    },
    {
      q: "How does the Parent Portal help me stay informed?",
      a: "Our integrated parent portal provides live message feeds directly to Teacher Anne and staff, offline-resilient payment history with digital receipts, automated alerts when school fee statements are due, and detailed progress reports with milestone score evaluations."
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 scroll-smooth selection:bg-indigo-500 selection:text-white font-sans">
      {/* Sticky Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 glass-nav border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <KiddiesTownLogo className="w-10 h-10 bg-white rounded-xl shadow-sm p-1 border border-slate-100" />
            <span className="font-black text-xl text-indigo-950 tracking-tight">Kiddies Town</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => onSelectRole('parent')} className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer">Parent Portal</button>
            <button onClick={() => onSelectRole('teacher')} className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer">Teacher Log</button>
            <button onClick={() => onSelectRole('enrolment')} className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-sm px-6 py-2.5 rounded-full transition-all shadow-md shadow-indigo-200/50 cursor-pointer">
              Apply Online
            </button>
          </div>
        </div>
      </nav>

      {/* Dynamic Announcement Banner */}
      <div className="bg-indigo-950 text-indigo-100/90 text-center py-2 px-4 text-xs font-semibold tracking-wider font-mono flex items-center justify-center gap-2 mt-20">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>GRADUATION CEREMONY & ANNUAL CONCERT: 15 NOVEMBER • TICKETS NOW AVAILABLE IN PARCEL PORTAL!</span>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-slate-50 isolate pt-12 pb-24 lg:pt-0 lg:pb-0">
        <FloatingBalloons count={7} seed={1} />
        
        {/* Soft Background Gradients */}
        <div className="absolute inset-0 opacity-20 gradient-mesh -z-20 pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-float -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-float-delayed -z-10" />
        
        <div className="max-w-7xl mx-auto px-6 md:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Info Column */}
            <div className="lg:col-span-6 space-y-8 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-indigo-700 text-xs font-bold uppercase tracking-wider shadow-sm">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                DSD & DBE Standard Compliant ECD Center
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-indigo-950 leading-[1.1] tracking-tight">
                Nurturing minds,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-rose-500">
                  building futures
                </span> <br />
                from first steps.
              </h1>

              <p className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-xl font-medium">
                Kiddies Town ECD & Academy is Ster Park’s premier early learning environment. We blend professional play-based CAPS curricula with safe, accredited daily CBD transport and real-time parent tracking.
              </p>

              {/* Comprehensive Entrance CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row gap-4">
                <button
                  id="btn-parent-portal-cta"
                  onClick={() => onSelectRole('parent')}
                  className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-sm px-8 py-4 rounded-2xl transition-all shadow-lg shadow-indigo-200/50 flex items-center justify-center gap-2 cursor-pointer group hover:-translate-y-1"
                >
                  Enter Parent Workspace
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  id="btn-enrol-cta"
                  onClick={() => onSelectRole('enrolment')}
                  className="bg-gradient-to-r from-amber-400 to-rose-400 hover:from-amber-500 hover:to-rose-500 text-white font-bold text-sm px-8 py-4 rounded-2xl transition-all shadow-lg shadow-rose-200/50 flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-1"
                >
                  Apply Online (Wizard)
                </button>
              </div>

              {/* Small credentials lines */}
              <div className="pt-8 grid grid-cols-3 gap-6 border-t border-slate-200/60 max-w-lg">
                <div className="glass-card px-4 py-3 rounded-2xl text-center">
                  <h4 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-violet-600 font-mono">100%</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">NELDS Syllabus</p>
                </div>
                <div className="glass-card px-4 py-3 rounded-2xl text-center">
                  <h4 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-500 to-rose-500 font-mono">Age 1-5</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Toddler Prep</p>
                </div>
                <div className="glass-card px-4 py-3 rounded-2xl text-center">
                  <h4 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-500 to-teal-500 font-mono">Ster Park</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Central Polokwane</p>
                </div>
              </div>
            </div>

            {/* Right Graphic Card Column */}
            <div className="lg:col-span-6 relative z-10 pt-10 lg:pt-0">
              <div className="animated-gradient-border rounded-[2rem] tilt-card shadow-2xl shadow-indigo-900/20">
                <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-[2rem] p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-100 to-transparent rounded-bl-[4rem] flex items-start justify-end p-6">
                    <span className="font-black text-[10px] text-indigo-400 font-mono uppercase tracking-widest text-right leading-tight">
                      ★ STATE-OF-<br/>THE-ART
                    </span>
                  </div>

                  <div className="flex items-center gap-4 border-b border-slate-100 pb-6 mb-6">
                    <KiddiesTownLogo className="w-14 h-14 bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-md border border-slate-100 p-1" />
                    <div>
                      <h3 className="text-lg font-black text-indigo-950 leading-tight">Town Portal Experience</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Secure Cloud Synchronization</p>
                    </div>
                  </div>

                  {/* Simulated App Roster Panel */}
                  <div className="space-y-4 relative z-10">
                    <div className="p-4 bg-white/95 shadow-sm border border-slate-100 rounded-2xl flex items-center justify-between hover:scale-[1.02] transition-transform">
                      <div className="flex items-center gap-4">
                        <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)] animate-pulse" />
                        <div>
                          <span className="text-xs font-extrabold text-indigo-950 block">Leo Mbeki Roster Status</span>
                          <span className="text-[11px] text-slate-500 block mt-0.5 font-medium">Arrived safely with CBD Shuttle</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">07:45 AM</span>
                    </div>

                    <div className="p-4 bg-white/95 shadow-sm border border-slate-100 rounded-2xl flex items-center justify-between hover:scale-[1.02] transition-transform">
                      <div className="flex items-center gap-4">
                        <span className="w-3 h-3 rounded-full bg-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.5)]" />
                        <div>
                          <span className="text-xs font-extrabold text-indigo-950 block">Curriculum Focus: Week 25</span>
                          <span className="text-[11px] text-indigo-600 block font-bold mt-0.5">"Ocean Life Exploration"</span>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-indigo-500" />
                      </div>
                    </div>

                    <div className="p-4 bg-white/95 shadow-sm border border-slate-100 rounded-2xl flex items-center justify-between hover:scale-[1.02] transition-transform">
                      <div className="flex items-center gap-4">
                        <span className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.5)]" />
                        <div>
                          <span className="text-xs font-extrabold text-indigo-950 block">Monthly Statements & Accounts</span>
                          <span className="text-[11px] text-amber-600 block font-bold mt-0.5">Secure auto-calculated POPI statements</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-black text-amber-700 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200 uppercase tracking-wider">Paid</span>
                    </div>
                  </div>

                  {/* Principal Message snippet */}
                  <div className="mt-6 p-5 bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-2xl text-[11px] text-slate-600 leading-relaxed font-medium shadow-inner">
                    <span className="font-black text-xs block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 mb-1.5 flex items-center gap-2">
                      <span>💻</span> Developer Interactive Staging
                    </span>
                    You are evaluating the live staging system. Toggle different perspectives in the sidebar or buttons above to test parent progress maps, admissions wizards, or administrative controls.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Play-Based Age Classes Area */}
      <section className="relative overflow-hidden py-24 bg-white border-b border-slate-200 isolate" id="classes-group">
        <FloatingBalloons count={6} seed={2} />
        <div className="absolute inset-0 bg-slate-50/50 -z-10" />
        
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
            <span className="inline-block py-1 px-3 rounded-full bg-rose-50 border border-rose-100 text-rose-600 font-bold text-[10px] uppercase tracking-widest font-mono">Our Educational Framework</span>
            <h2 className="text-4xl font-black text-indigo-950 tracking-tight">Accredited Child Development Groups</h2>
            <p className="text-slate-500 text-base leading-relaxed">
              We group children into age-specific developmental tiers that accommodate their physical, social, cognitive and motor skill milestones safely.
            </p>

            {/* In-page Tab Filter */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-2">
              {[
                { id: 'all', label: 'All Age Groups' },
                { id: 'roses', label: 'Roses (Age 1-2)' },
                { id: 'giraffes', label: 'Giraffes (Age 2-3)' },
                { id: 'tigers', label: 'Tigers (Age 4-5)' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all border-2 cursor-pointer relative overflow-hidden group ${
                    activeTab === tab.id 
                    ? 'border-indigo-600 text-indigo-700 bg-indigo-50 shadow-sm' 
                    : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span className="relative z-10">{tab.label}</span>
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 to-violet-500" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredClasses.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] overflow-hidden transition-all duration-300 flex flex-col group hover:-translate-y-2 relative"
              >
                {/* Colored Left Border Accent */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${item.badgeColor} z-10`} />
                
                {/* Class Image Preview */}
                <div className="h-56 relative bg-slate-200 overflow-hidden shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10" />
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-5 z-20">
                    <span className="bg-white/20 text-white border border-white/30 text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full backdrop-blur-md shadow-sm">
                      {item.ages}
                    </span>
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col justify-between relative z-20 bg-white">
                  <div className="space-y-5">
                    <div>
                      <div className={`inline-block px-3 py-1 text-[10px] uppercase font-mono font-bold tracking-wider rounded-lg border ${item.color} mb-3`}>
                        {item.pillText}
                      </div>
                      <h3 className="text-2xl font-black text-indigo-950 leading-tight">{item.name}</h3>
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed font-medium">{item.desc}</p>
                    
                    <div className="space-y-3 pt-4 border-t border-slate-100">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Weekly Activities Include:</span>
                      <div className="space-y-2.5">
                        {item.activities.map((act, i) => (
                          <div key={i} className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                            <CheckCircle className={`w-4 h-4 ${item.badgeColor.replace('bg-', 'text-')}`} />
                            <span>{act}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 mt-8 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-widest">CAPS & NELDS Aligned</span>
                    <button 
                      onClick={() => onSelectRole('enrolment')}
                      className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors inline-flex items-center gap-1 group/btn cursor-pointer bg-indigo-50 px-4 py-2 rounded-xl"
                    >
                      Enrol online <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features bento grid */}
      <section className="relative overflow-hidden py-24 bg-slate-50 border-b border-slate-200 isolate">
        <FloatingBalloons count={5} seed={3} />
        
        {/* Subtle pattern background */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#4f46e5 2px, transparent 2px)', backgroundSize: '32px 32px' }} />

        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
            <div className="lg:w-1/2 space-y-4">
              <span className="inline-block py-1 px-3 rounded-full bg-amber-50 border border-amber-100 text-amber-600 font-bold text-[10px] uppercase tracking-widest font-mono">Designed For Parents</span>
              <h2 className="text-4xl font-black text-indigo-950 tracking-tight">Kiddies Town Portal Integration</h2>
              <p className="text-slate-500 text-base leading-relaxed">
                We believe premium childcare goes hand-in-hand with absolute operational transparency. Our multi-role workspace connects parents, teachers, and school managers effortlessly.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:self-end">
              <button 
                onClick={() => onSelectRole('parent')} 
                className="bg-white hover:bg-indigo-50 text-indigo-700 text-sm font-bold px-6 py-3 rounded-xl border-2 border-indigo-100 transition-colors shadow-sm cursor-pointer flex items-center gap-2"
              >
                Inspect Parent View
              </button>
              <button 
                onClick={() => onSelectRole('admin')} 
                className="bg-white hover:bg-amber-50 text-amber-700 text-sm font-bold px-6 py-3 rounded-xl border-2 border-amber-100 transition-colors shadow-sm cursor-pointer flex items-center gap-2"
              >
                Inspect Principal Dashboard
              </button>
            </div>
          </div>

          {/* Asymmetric Bento grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
            {/* Box 1: Shuttle */}
            <div className="bg-white/80 backdrop-blur-lg border border-slate-200/60 rounded-3xl p-8 lg:col-span-5 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl hover:shadow-orange-200/30 transition-all duration-300 group">
              <div className="space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-rose-400 text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-orange-200/50 group-hover:scale-110 transition-transform">
                  🚍
                </div>
                <div>
                  <h3 className="text-xl font-black text-indigo-950">Accredited Shuttle Transport</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mt-3 font-medium">
                    Daily pick-up scheduled directly across Polokwane CBD and Ster Park. Keeps commuters secure, safe, and synchronized.
                  </p>
                </div>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-widest bg-orange-50/50 p-3 rounded-xl">
                <span className="text-slate-500">Ster Park • CBD Hub</span>
                <span className="text-orange-600">Arranged pickup</span>
              </div>
            </div>

            {/* Box 2: Reports */}
            <div className="bg-white/80 backdrop-blur-lg border border-slate-200/60 rounded-3xl p-8 lg:col-span-7 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl hover:shadow-emerald-200/30 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-100 rounded-full mix-blend-multiply blur-2xl opacity-50 group-hover:scale-150 transition-transform duration-700" />
              
              <div className="space-y-6 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-400 text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-emerald-200/50 group-hover:scale-110 transition-transform">
                  📊
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-black text-indigo-950">Dynamic Progress Reports</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mt-3 font-medium">
                      Our teachers update social development, vocabulary, fine motor milestones, and creative arts scores each term.
                    </p>
                  </div>
                  <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      <span>FINE MOTOR SCORING</span>
                      <span className="text-emerald-600 font-black text-sm">92%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-emerald-400 to-teal-400 h-full rounded-full w-[92%]" />
                    </div>
                    <p className="text-[11px] text-slate-500 italic leading-relaxed font-medium bg-slate-50 p-2 rounded-lg">"Excellent finger paint coordination (Leo Mbeki)."</p>
                  </div>
                </div>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-widest bg-emerald-50/50 p-3 rounded-xl relative z-10">
                <span className="text-slate-500">PDF Downloadable & Printable</span>
                <span className="text-emerald-600">Milestone Audited</span>
              </div>
            </div>

            {/* Box 3: POPI Compliance */}
            <div className="bg-white/80 backdrop-blur-lg border border-slate-200/60 rounded-3xl p-8 lg:col-span-7 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl hover:shadow-indigo-200/30 transition-all duration-300 group">
              <div className="space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-indigo-200/50 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-indigo-950">Strict South African POPI Act Compliance</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mt-3 font-medium">
                    Your family data, birth certificates, medical records, and digital statements are protected with state-of-the-art secure database protocols. We do not expose children's photos or personal directories to indices or non-authenticated guests.
                  </p>
                </div>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-widest bg-indigo-50/50 p-3 rounded-xl">
                <span className="text-slate-500">RSA POPIA compliant</span>
                <span className="text-indigo-600">Active Shield Protected</span>
              </div>
            </div>

            {/* Box 4: Financial Statement */}
            <div className="bg-white/80 backdrop-blur-lg border border-slate-200/60 rounded-3xl p-8 lg:col-span-5 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl hover:shadow-amber-200/30 transition-all duration-300 group">
              <div className="space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-400 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-amber-200/50 group-hover:scale-110 transition-transform">
                  R
                </div>
                <div>
                  <h3 className="text-xl font-black text-indigo-950">Account Statements & Real-time receipts</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mt-3 font-medium">
                    Instantly monitor school fee arrears, log manual banking transfers, download valid educational receipts, and receive immediate principal notifications.
                  </p>
                </div>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-widest bg-amber-50/50 p-3 rounded-xl">
                <span className="text-slate-500">Transparent billing</span>
                <span className="text-amber-600">Offline Buffers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Photo Gallery & Highlights */}
      <section className="relative overflow-hidden py-24 bg-white border-b border-slate-200 isolate">
        <FloatingBalloons count={7} seed={4} />
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 text-left">
            <div className="space-y-4 lg:w-1/2">
              <span className="inline-block py-1 px-3 rounded-full bg-violet-50 border border-violet-100 text-violet-600 font-bold text-[10px] uppercase tracking-widest font-mono">📸 Community Highlights Gallery</span>
              <h2 className="text-4xl font-black text-indigo-950 tracking-tight">Kiddies Town Photo Showcase</h2>
              <p className="text-slate-500 text-base leading-relaxed">
                Witness daily growth, graduations, family events, and creative sandbox moments captured on campus. Hover and click any card to view detailed milestone descriptions or check official community posts.
              </p>
            </div>
            
            {/* Category selection */}
            <div className="flex flex-wrap gap-2 shrink-0">
              {[
                { id: 'all', label: 'All Photos' },
                { id: 'grad', label: '🎓 Graduations' },
                { id: 'fun', label: '🎈 Fun Walks' },
                { id: 'art', label: '🎨 Art Classes' },
                { id: 'play', label: '🧸 Playground' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setGalleryCategory(cat.id as any)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold border-2 transition-all cursor-pointer ${
                    galleryCategory === cat.id 
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200' 
                      : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-200 hover:text-indigo-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Masonry-style Photos Grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredGallery.map((photo, i) => (
              <div 
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
                className="break-inside-avoid bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_10px_40px_rgb(99,102,241,0.15)] transition-all cursor-zoom-in group relative"
              >
                <div className="relative overflow-hidden bg-slate-100">
                  <img 
                    src={photo.image} 
                    alt={photo.title} 
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    style={{ height: i % 2 === 0 ? '300px' : '400px' }}
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Category Pill Overlaid */}
                  <div className="absolute top-4 left-4 z-20">
                    <span className="bg-white/90 text-indigo-950 font-mono font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-sm">
                      {photo.category === 'grad' && 'Graduation'}
                      {photo.category === 'fun' && 'Annual Walk'}
                      {photo.category === 'art' && 'Finger Arts'}
                      {photo.category === 'play' && 'Playground'}
                    </span>
                  </div>
                  
                  {/* Premium Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/90 via-indigo-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 space-y-2">
                       <h3 className="font-black text-white text-lg leading-tight">{photo.title}</h3>
                       <p className="text-indigo-100/80 text-xs leading-relaxed line-clamp-2">{photo.description}</p>
                       <div className="pt-3 flex items-center text-[10px] font-bold text-white uppercase tracking-widest gap-2">
                         <span className="w-6 h-[1px] bg-white" /> Click to Expand
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Official Photos Link Box */}
          <div className="mt-12 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-8 text-left shadow-sm">
            <div className="space-y-2">
              <h4 className="text-lg font-black text-blue-950 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Facebook className="w-4 h-4 fill-blue-600 text-blue-600" />
                </div>
                <span>Looking for the extensive, original photo albums?</span>
              </h4>
              <p className="text-blue-800/80 text-sm max-w-2xl leading-relaxed font-medium">
                Our main, authentic photo database is hosted directly on our Facebook community page. Click to browse hundreds of graduation, concert, fun walk, birthday parties, and classroom play pictures from 2022 to present!
              </p>
            </div>
            
            <a 
              href="https://www.facebook.com/people/Kiddies-Town-ECD/100084221528687/?sk=photos" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all text-white font-extrabold text-sm uppercase tracking-wider px-8 py-4 rounded-2xl shadow-lg shadow-blue-200/50 text-center w-full md:w-auto shrink-0 cursor-pointer block"
            >
              Browse Facebook Photo Albums &rarr;
            </a>
          </div>
        </div>

        {/* Photoviewer Modal Overlay */}
        {selectedPhoto && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-indigo-950/80 backdrop-blur-md p-4 lg:p-12 animate-fade-in-up">
            <div className="bg-white rounded-[2rem] overflow-hidden max-w-5xl w-full border border-slate-200 shadow-2xl relative flex flex-col lg:flex-row max-h-[90vh]">
              
              <button 
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-6 right-6 w-10 h-10 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-all cursor-pointer z-10 flex items-center justify-center font-bold"
                aria-label="Close modal"
              >
                ✕
              </button>

              <div className="lg:w-3/5 bg-slate-900 relative h-64 lg:h-auto">
                <img 
                  src={selectedPhoto.image} 
                  alt={selectedPhoto.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-6 left-6">
                  <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-xl shadow-lg">
                    {selectedPhoto.category === 'grad' && '🎓 Graduation Category'}
                    {selectedPhoto.category === 'fun' && '🎈 Annual Fun Walk'}
                    {selectedPhoto.category === 'art' && '🎨 Nursery Art Class'}
                    {selectedPhoto.category === 'play' && '🧸 Slide & Playground'}
                  </span>
                </div>
              </div>

              <div className="lg:w-2/5 p-8 md:p-10 flex flex-col overflow-y-auto">
                <div className="flex-1 space-y-6">
                  <h3 className="text-2xl font-black text-indigo-950 tracking-tight leading-tight">{selectedPhoto.title}</h3>
                  
                  <p className="text-slate-600 text-sm leading-relaxed font-medium">
                    {selectedPhoto.longDesc}
                  </p>

                  <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100 text-xs text-slate-600 space-y-3">
                    <p className="flex items-center gap-2 text-[10px] text-indigo-600 font-bold uppercase tracking-widest">
                      <Info className="w-4 h-4" />
                      <span>Compliance & Privacy Notice</span>
                    </p>
                    <p className="leading-relaxed font-medium">
                      This beautiful showcase utilizes high-grade, contextual illustrative imagery to display program features. For extensive actual parents-group photos and updates, visit our secure POPIA-audited Facebook posts.
                    </p>
                  </div>
                </div>

                <div className="pt-8 mt-8 border-t border-slate-100 flex flex-col gap-3">
                  <a 
                    href={selectedPhoto.link}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider py-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-center shadow-lg shadow-blue-200/50 hover:-translate-y-0.5"
                  >
                    <Facebook className="w-4 h-4 fill-white" />
                    <span>View original album on facebook</span>
                  </a>
                  
                  <button 
                    onClick={() => setSelectedPhoto(null)}
                    className="w-full px-6 py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer border-2 border-slate-100"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Testimonials */}
      <section className="relative overflow-hidden py-24 bg-slate-50 border-b border-slate-200 isolate">
        <FloatingBalloons count={6} seed={5} />
        
        {/* Subtle mesh background */}
        <div className="absolute inset-0 opacity-10 gradient-mesh pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
            <span className="inline-block py-1 px-3 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-[10px] uppercase tracking-widest font-mono">Parent Reviews</span>
            <h2 className="text-4xl font-black text-indigo-950 tracking-tight">What Our Families Say</h2>
            <p className="text-slate-500 text-base leading-relaxed">
              Real parent reviews taken directly from community responses and Facebook page highlights.
              Our community is built on trust.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test, idx) => (
              <div 
                key={idx} 
                className="bg-white border border-slate-100 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300 flex flex-col justify-between space-y-8 relative group"
              >
                {/* Decorative Quote Mark */}
                <div className="absolute top-6 right-6 text-6xl font-serif text-indigo-50 opacity-50 group-hover:scale-110 transition-transform">
                  "
                </div>

                <div className="space-y-6 relative z-10">
                  <div className="flex items-center gap-1.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed font-medium">
                    "{test.text}"
                  </p>
                </div>
                
                <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-md">
                    {test.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-indigo-950">{test.author}</h4>
                    <p className="text-[10px] text-slate-500 font-mono font-bold tracking-wide">{test.role}</p>
                    <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider mt-0.5">{test.tag}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <a 
              href="https://www.facebook.com/p/Kiddies-Town-ECD-100084221528687/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 p-3 px-6 rounded-2xl bg-blue-50 hover:bg-blue-100 border-2 border-blue-100 text-blue-700 text-xs font-black font-mono tracking-wider transition-all hover:-translate-y-1"
            >
              <Facebook className="w-5 h-5 fill-blue-600 text-blue-600 shrink-0" />
              <span>FOLLOW OUR COMMUNITY ON FACEBOOK &rarr;</span>
            </a>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="relative overflow-hidden py-24 bg-white border-b border-slate-200 isolate">
        <FloatingBalloons count={5} seed={6} />
        
        {/* Subtle patterned background */}
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <div className="max-w-4xl mx-auto px-6 md:px-8 relative z-10">
          <div className="text-center space-y-4 mb-16">
            <span className="inline-block py-1 px-3 rounded-full bg-amber-50 border border-amber-100 text-amber-600 font-bold text-[10px] uppercase tracking-widest font-mono">Answers At Hand</span>
            <h2 className="text-4xl font-black text-indigo-950 tracking-tight">Kiddies Town Admissions & Rulings FAQ</h2>
            <p className="text-slate-500 text-base leading-relaxed">
              We compile answers to the most common questions raised by parents during the application process.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div 
                  key={i} 
                  className={`border border-slate-200 rounded-2xl transition-all duration-300 overflow-hidden ${
                    isOpen ? 'bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] border-indigo-200' : 'bg-slate-50 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <button 
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full text-left p-6 flex items-center gap-6 cursor-pointer"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-black transition-colors ${isOpen ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                      0{i + 1}
                    </div>
                    <span className={`flex-1 font-bold text-sm md:text-base transition-colors ${isOpen ? 'text-indigo-950' : 'text-slate-700'}`}>
                      {faq.q}
                    </span>
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-all ${isOpen ? 'border-indigo-200 bg-indigo-50' : 'border-slate-200'}`}>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'text-indigo-600 rotate-180' : 'text-slate-400'}`} />
                    </div>
                  </button>
                  <div className={`faq-content ${isOpen ? 'open' : ''}`}>
                    <div className="px-6 pb-6 pt-2 pl-[4.5rem] text-slate-600 text-sm leading-relaxed font-medium">
                      {faq.a}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative overflow-hidden py-24 lg:py-32 bg-slate-900 text-white isolate">
        <FloatingBalloons count={8} seed={7} />
        
        {/* Dark dramatic gradient mesh */}
        <div className="absolute inset-0 opacity-40 gradient-mesh-dark pointer-events-none" />
        
        {/* Star/sparkle overlay effect */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center space-y-10 relative z-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark text-indigo-200 text-xs font-mono font-bold uppercase tracking-widest shadow-lg">
            ★ ADMISSIONS OPEN FOR TERM 3 2026
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
            Give your child a premium, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-400">accredited start</span> in Polokwane.
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-medium">
            Ready to secure a desk in our Tigers, Giraffes, or Roses groups? Connect with Sarah Mbeki, Teacher Anne, or administrativePrincipal Shineon in the staging dashboards.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onSelectRole('enrolment')}
              className="w-full sm:w-auto bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-black text-sm uppercase tracking-wider px-10 py-5 rounded-2xl shadow-xl shadow-rose-900/50 transition-all hover:-translate-y-1 cursor-pointer"
            >
              Open Steps Application Wizard
            </button>
            <button
              onClick={() => onSelectRole('parent')}
              className="w-full sm:w-auto glass-dark hover:bg-white/20 text-white font-bold text-sm uppercase tracking-wider px-10 py-5 rounded-2xl transition-all hover:-translate-y-1 cursor-pointer border border-white/30"
            >
              Test Parent Experience
            </button>
          </div>

          <p className="text-[11px] text-slate-400 font-bold font-mono uppercase tracking-widest pt-8">
            📍 Central ster-park Polokwane Campus | ☎ Phone Support: 015 023 0600
          </p>
        </div>
      </section>
    </div>
  );
}
