import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Mail, Users, User, Shield, CheckCircle2, AlertCircle, Key, Sparkles, Smile, UserPlus, LogIn, ChevronRight, Quote } from 'lucide-react';
import KiddiesTownLogo from './KiddiesTownLogo';
import FloatingBalloons from './FloatingBalloons';
import { api } from '../lib/apiClient';

interface LoginPageProps {
  initialRole?: 'parent' | 'admin' | 'teacher';
  onLoginSuccess: (user: { role: 'parent' | 'admin' | 'teacher'; name: string; email: string }) => void;
  onCancel: () => void;
}

export default function LoginPage({ initialRole = 'parent', onLoginSuccess, onCancel }: LoginPageProps) {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [selectedRole, setSelectedRole] = useState<'parent' | 'admin' | 'teacher'>(initialRole);
  
  // Registration and Authentication inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Base styling and config (safe for production)
  const roleStyles = {
    parent: {
      roleLabel: "Parent Profile",
      desc: "Sarah M. linked to child Leo Mbeki (Grade R)",
      color: "indigo",
      bgStyle: "bg-indigo-50 border-indigo-200 text-indigo-700",
      accentBg: "bg-indigo-600 hover:bg-indigo-700 font-extrabold text-xs",
      placeholderEmail: "parent@example.com"
    },
    teacher: {
      roleLabel: "Classroom Instructor",
      desc: "Anne, lead mentor for Roses Class (2-3 Years)",
      color: "emerald",
      bgStyle: "bg-emerald-50 border-emerald-200 text-emerald-700",
      accentBg: "bg-emerald-600 hover:bg-emerald-700 font-extrabold text-xs",
      placeholderEmail: "teacher@example.com"
    },
    admin: {
      roleLabel: "Chief Principal / Board Auditor",
      desc: "Shineon M. with absolute database & regulatory override",
      color: "amber",
      bgStyle: "bg-amber-50 border-amber-200 text-amber-700",
      accentBg: "bg-amber-600 hover:bg-amber-700 font-extrabold text-xs",
      placeholderEmail: "admin@example.com"
    }
  };

  // Demo preflight accounts (only in DEV)
  const rolePresets = import.meta.env.DEV ? {
    parent: {
      name: "Sarah Mbeki",
      email: "parent@kiddiestown.co.za",
      password: "parent",
      ...roleStyles.parent
    },
    teacher: {
      name: "Teacher Anne",
      email: "teacher@kiddiestown.co.za",
      password: "teacher",
      ...roleStyles.teacher
    },
    admin: {
      name: "Shineon M.",
      email: "admin@kiddiestown.co.za",
      password: "admin",
      ...roleStyles.admin
    }
  } : null;

  const currentConfig = import.meta.env.DEV && rolePresets 
    ? rolePresets[selectedRole] 
    : { ...roleStyles[selectedRole], email: roleStyles[selectedRole].placeholderEmail };

  const getThemeClasses = (role: string) => {
    switch(role) {
      case 'parent': return {
        gradientFrom: 'from-indigo-600',
        gradientTo: 'to-indigo-500',
        hoverFrom: 'hover:from-indigo-500',
        hoverTo: 'hover:to-indigo-400',
        shadow: 'shadow-indigo-500/25',
        ring: 'focus:ring-indigo-500/20',
        borderFocus: 'focus:border-indigo-400',
        border: 'border-indigo-300',
        bgLight: 'bg-indigo-50/90',
        text: 'text-indigo-600',
        textDark: 'text-indigo-700',
        ringGlow: 'ring-indigo-500/10',
        bgIndicator: 'from-indigo-100/50',
        iconBg: 'bg-indigo-100',
        bgGlow: 'from-indigo-500',
        textFocus: 'group-focus-within:text-indigo-500'
      };
      case 'teacher': return {
        gradientFrom: 'from-emerald-600',
        gradientTo: 'to-emerald-500',
        hoverFrom: 'hover:from-emerald-500',
        hoverTo: 'hover:to-emerald-400',
        shadow: 'shadow-emerald-500/25',
        ring: 'focus:ring-emerald-500/20',
        borderFocus: 'focus:border-emerald-400',
        border: 'border-emerald-300',
        bgLight: 'bg-emerald-50/90',
        text: 'text-emerald-600',
        textDark: 'text-emerald-700',
        ringGlow: 'ring-emerald-500/10',
        bgIndicator: 'from-emerald-100/50',
        iconBg: 'bg-emerald-100',
        bgGlow: 'from-emerald-500',
        textFocus: 'group-focus-within:text-emerald-500'
      };
      case 'admin': return {
        gradientFrom: 'from-amber-600',
        gradientTo: 'to-amber-500',
        hoverFrom: 'hover:from-amber-500',
        hoverTo: 'hover:to-amber-400',
        shadow: 'shadow-amber-500/25',
        ring: 'focus:ring-amber-500/20',
        borderFocus: 'focus:border-amber-400',
        border: 'border-amber-300',
        bgLight: 'bg-amber-50/90',
        text: 'text-amber-600',
        textDark: 'text-amber-700',
        ringGlow: 'ring-amber-500/10',
        bgIndicator: 'from-amber-100/50',
        iconBg: 'bg-amber-100',
        bgGlow: 'from-amber-500',
        textFocus: 'group-focus-within:text-amber-500'
      };
      default: return getThemeClasses('parent');
    }
  };

  const theme = getThemeClasses(selectedRole);

  const handleQuickFill = (role: 'parent' | 'admin' | 'teacher') => {
    if (!import.meta.env.DEV || !rolePresets) return;
    setSelectedRole(role);
    setEmail(rolePresets[role].email);
    setPassword(rolePresets[role].password);
    setError(null);
    setActiveTab('signin');
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!email) {
      setError("Please provide an email or school username");
      setLoading(false);
      return;
    }
    if (!password) {
      setError("Please key in your security credentials");
      setLoading(false);
      return;
    }

    if (activeTab === 'signup' && !fullName) {
      setError("Please state your Full Name to register your school credentials");
      setLoading(false);
      return;
    }

    try {
      if (activeTab === 'signin') {
        const data = await api.post<{ success: boolean; token?: string; refreshToken?: string; user?: { role: string; name: string; email: string }; error?: string }>('/auth/login', { email, password, role: selectedRole });

        if (data.success && data.token) {
          localStorage.setItem('kt_session_token', data.token);
          if (data.refreshToken) {
            localStorage.setItem('kt_refresh_token', data.refreshToken);
          }
          setSuccessMessage(`Welcome back, ${data.user!.name}!`);
          setSuccess(true);
          setLoading(false);
          setTimeout(() => {
            onLoginSuccess({ ...data.user!, role: data.user!.role as 'parent' | 'admin' | 'teacher' });
          }, 1200);
        } else {
          setError(data.error || "The credentials provided do not match the authorized profile.");
          setLoading(false);
        }
      } else {
        const data = await api.post<{ success: boolean; token?: string; refreshToken?: string; user?: { role: string; name: string; email: string }; error?: string }>('/auth/signup', {
          email,
          password,
          role: selectedRole,
          name: fullName
        });

        if (data.success && data.token) {
          localStorage.setItem('kt_session_token', data.token);
          if (data.refreshToken) {
            localStorage.setItem('kt_refresh_token', data.refreshToken);
          }
          setSuccessMessage(`Account created successfully! Welcome, ${data.user!.name}.`);
          setSuccess(true);
          setLoading(false);
          setTimeout(() => {
            onLoginSuccess({ ...data.user!, role: data.user!.role as 'parent' | 'admin' | 'teacher' });
          }, 1250);
        } else {
          setError(data.error || "Failed to create account. Please try a different email.");
          setLoading(false);
        }
      }
    } catch (err) {
      setError("Unable to complete transaction. Please check your local connection.");
      setLoading(false);
    }
  };

  return (
    <div id="login_screen_container" className="min-h-screen w-full flex bg-slate-50 font-sans select-none overflow-hidden relative">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <FloatingBalloons count={8} seed={10} />
      </div>
      
      {/* Left Panel - Decorative Brand Panel */}
      <div className="hidden lg:flex w-1/2 relative p-12 items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 animate-gradient-xy z-0">
        {/* Glassmorphism elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-rose-400/30 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-amber-400/30 rounded-full mix-blend-multiply filter blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-indigo-400/30 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
        
        <div className="relative z-10 max-w-lg text-white">
           <div className="mb-10 flex justify-start">
             <div className="relative group cursor-pointer">
               <div className="absolute -inset-2 bg-gradient-to-r from-amber-400 to-rose-400 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
               <KiddiesTownLogo className="relative w-20 h-20 bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rounded-3xl p-2 animate-float" />
             </div>
           </div>
           
           <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6 }}
             className="text-4xl xl:text-5xl font-black mb-4 tracking-tight leading-tight"
           >
             KIDDIES TOWN
             <br />
             <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-rose-200">
               PORTAL GATEWAY
             </span>
           </motion.h1>
           
           <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, delay: 0.2 }}
             className="text-white/80 font-mono text-sm tracking-wider uppercase mb-12 border-l-2 border-amber-400 pl-4 py-1"
           >
             Compliant Academic Access • Ster Park Campus
           </motion.p>
           
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.6, delay: 0.4 }}
             className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl relative animate-float-delayed"
           >
             <div className="absolute -top-5 -left-5 bg-gradient-to-br from-amber-400 to-rose-400 p-3 rounded-2xl shadow-lg">
               <Quote className="w-5 h-5 text-white fill-white" />
             </div>
             <p className="text-white/90 italic font-medium relative z-10 leading-relaxed text-lg">
               "Providing a secure, nurturing, and innovative digital environment for our academic community. Together, we shape the leaders of tomorrow."
             </p>
             <div className="mt-6 flex items-center gap-4">
               <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-rose-400 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                 KT
               </div>
               <div>
                 <div className="font-bold text-white tracking-wide">Principal Board</div>
                 <div className="text-white/60 text-sm font-medium">Ster Park Campus</div>
               </div>
             </div>
           </motion.div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 md:p-12 relative z-10">
        <div className="w-full max-w-md relative">
          
          {/* Mobile header (hidden on large screens) */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-indigo-400 to-rose-400 rounded-full blur opacity-30"></div>
                <KiddiesTownLogo className="relative w-16 h-16 mx-auto bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-xl rounded-2xl p-1.5" />
              </div>
            </div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">KIDDIES TOWN PORTAL</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1.5 font-mono">
              Compliant Academic Access • Ster Park Campus
            </p>
          </div>

          {/* Frosted Glass Login Card */}
          <div className="relative group">
            <div className={`absolute -inset-0.5 bg-gradient-to-r ${theme.bgGlow} to-rose-400 rounded-3xl blur opacity-20 transition duration-1000`}></div>
            
            <div className="relative bg-white/80 backdrop-blur-xl border border-white shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden flex flex-col">
              
              {/* Form Content */}
              <div className="p-6 md:p-8 space-y-6 flex-1">
                
                {/* SIGN IN / SIGN UP TABS SELECTOR */}
                <div className="relative p-1 bg-slate-100/60 backdrop-blur-md rounded-xl grid grid-cols-2 border border-slate-200/50">
                  <motion.div 
                    className="absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] bg-white rounded-lg shadow-sm border border-slate-200/50 z-0"
                    animate={{ x: activeTab === 'signin' ? 0 : '100%' }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                  <button
                    onClick={() => {
                      setActiveTab('signin');
                      setError(null);
                    }}
                    className={`relative z-10 py-2.5 px-3 rounded-lg text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      activeTab === 'signin' 
                        ? 'text-indigo-600' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('signup');
                      setError(null);
                    }}
                    className={`relative z-10 py-2.5 px-3 rounded-lg text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      activeTab === 'signup' 
                        ? 'text-indigo-600' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <UserPlus className="w-4 h-4" />
                    Register
                  </button>
                </div>

                {/* SECURE PERSPECTIVE TOGGLE */}
                <div>
                  <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 block mb-2 px-1">
                    Select Your School Role Workspace
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['parent', 'teacher', 'admin'] as const).map((r) => {
                      const isSel = selectedRole === r;
                      const rTheme = getThemeClasses(r);
                      return (
                        <button
                          key={r}
                          type="button"
                          onClick={() => {
                            setSelectedRole(r);
                            setError(null);
                          }}
                          className={`relative overflow-hidden group flex flex-col items-center justify-center py-3.5 px-2 rounded-2xl border transition-all duration-300 cursor-pointer ${
                            isSel 
                              ? `${rTheme.bgLight} ${rTheme.border} shadow-md scale-105 ring-4 ${rTheme.ringGlow}` 
                              : 'bg-white/50 hover:bg-white border-slate-200/60 hover:shadow-sm'
                          }`}
                        >
                          {isSel && (
                            <motion.div 
                              layoutId="role-indicator"
                              className={`absolute inset-0 bg-gradient-to-br ${rTheme.bgIndicator} to-transparent z-0`}
                            />
                          )}
                          <div className={`relative z-10 p-2.5 rounded-full mb-1.5 transition-colors ${
                            isSel ? `${rTheme.iconBg} ${rTheme.text}` : 'bg-slate-100 text-slate-400 group-hover:text-slate-600'
                          }`}>
                            {r === 'parent' && <User className="w-5 h-5" />}
                            {r === 'teacher' && <Users className="w-5 h-5" />}
                            {r === 'admin' && <Shield className="w-5 h-5" />}
                          </div>
                          <span className={`relative z-10 text-[11px] font-extrabold capitalize select-none transition-colors ${
                            isSel ? rTheme.textDark : 'text-slate-500 group-hover:text-slate-700'
                          }`}>{r}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {success ? (
                    <motion.div
                      key="success_block"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className={`p-8 rounded-2xl border text-center ${currentConfig.bgStyle} relative overflow-hidden`}
                    >
                      <div className="absolute inset-0 bg-white/40 backdrop-blur-xs z-0" />
                      <div className="relative z-10">
                        <div className="inline-flex p-4 bg-white rounded-2xl shadow-sm mb-4">
                          <CheckCircle2 className={`w-8 h-8 text-${selectedRole === 'parent' ? 'indigo' : selectedRole === 'teacher' ? 'emerald' : 'amber'}-500 animate-bounce`} />
                        </div>
                        <h4 className="text-sm font-black uppercase tracking-wide">Validation Successful</h4>
                        <p className="text-xs font-semibold text-slate-600 mt-2">
                          {successMessage} Loading secure academic views...
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form_block"
                      onSubmit={handleAuthSubmit}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="space-y-5"
                    >
                      {/* Full name field when signing up */}
                      <AnimatePresence>
                        {activeTab === 'signup' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                            className="overflow-hidden"
                          >
                            <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 block mb-1.5 px-1">
                              Full Legal Name
                            </label>
                            <div className="relative group">
                              <User className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${fullName ? theme.text : 'text-slate-400 ' + theme.textFocus}`} />
                              <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="e.g. Sipho Nkosi"
                                className={`w-full text-sm font-semibold bg-white/50 hover:bg-white focus:bg-white text-slate-800 border border-slate-200/80 rounded-xl pl-10 pr-4 py-3.5 placeholder:text-slate-400 focus:outline-hidden ${theme.ring} ${theme.borderFocus} transition-all shadow-sm`}
                                required
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Email Entry */}
                      <div>
                        <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 block mb-1.5 px-1">
                          Academic ID / Email Address
                        </label>
                        <div className="relative group">
                          <Mail className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${email ? theme.text : 'text-slate-400 ' + theme.textFocus}`} />
                          <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={activeTab === 'signup' ? `Enter new email for ${selectedRole}` : currentConfig.email}
                            className={`w-full text-sm font-semibold bg-white/50 hover:bg-white focus:bg-white text-slate-800 border border-slate-200/80 rounded-xl pl-10 pr-4 py-3.5 placeholder:text-slate-400 focus:outline-hidden ${theme.ring} ${theme.borderFocus} transition-all shadow-sm`}
                            required
                          />
                        </div>
                      </div>

                      {/* Password Entry */}
                      <div>
                        <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 block mb-1.5 px-1 flex justify-between">
                          <span>{activeTab === 'signup' ? 'Create Your Personal Secret Code / Password' : 'Authorized Key Code / Password'}</span>
                          {activeTab === 'signin' && (
                            <span className="text-slate-400 font-semibold font-mono tracking-normal">Pass: "{selectedRole}"</span>
                          )}
                        </label>
                        <div className="relative group">
                          <Lock className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${password ? theme.text : 'text-slate-400 ' + theme.textFocus}`} />
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={activeTab === 'signup' ? "Choose your own password/code (minimum 4 characters)" : "••••••••"}
                            className={`w-full text-sm font-semibold bg-white/50 hover:bg-white focus:bg-white text-slate-800 border border-slate-200/80 rounded-xl pl-10 pr-4 py-3.5 placeholder:text-slate-400 focus:outline-hidden ${theme.ring} ${theme.borderFocus} transition-all shadow-sm`}
                            required
                          />
                        </div>
                      </div>

                      {/* Alert Warning Box */}
                      <AnimatePresence>
                        {error && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="p-3.5 bg-rose-50/80 backdrop-blur-sm border border-rose-200 rounded-xl flex items-start gap-3 mt-2">
                              <AlertCircle className="w-4.5 h-4.5 text-rose-500 shrink-0 mt-0.5" />
                              <p className="text-xs text-rose-700 font-semibold leading-relaxed">
                                {error}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Submit Action Block */}
                      <div className="grid grid-cols-2 gap-3 pt-3">
                        <button
                          type="button"
                          onClick={onCancel}
                          className="w-full text-center text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-50 rounded-xl text-xs font-black py-3.5 px-4 cursor-pointer select-none transition-all border border-slate-200/80 shadow-sm"
                          disabled={loading}
                        >
                          Return Home
                        </button>

                        <button
                          type="submit"
                          disabled={loading}
                          className={`w-full relative overflow-hidden group flex items-center justify-center gap-2 text-white rounded-xl text-xs font-black py-3.5 px-4 transition-all shadow-lg ${theme.shadow} cursor-pointer select-none bg-gradient-to-r ${theme.gradientFrom} ${theme.gradientTo} ${theme.hoverFrom} ${theme.hoverTo} active:scale-[0.98]`}
                        >
                          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                          <span className="relative z-10 flex items-center gap-2">
                            {loading ? (
                              <span className="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <>
                                <Key className="w-4 h-4" />
                                <span>{activeTab === 'signin' ? 'Verify Credentials' : 'Create & Login'}</span>
                              </>
                            )}
                          </span>
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>

              {/* DEMO ACCOUNTS PRE-FLIGHT SHORTCUTS FOR CONVENIENT USER TESTING */}
              {import.meta.env.DEV && rolePresets && (
                <div className="p-6 md:p-8 bg-slate-50/80 backdrop-blur-md border-t border-slate-100/80 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-violet-100/80 rounded-lg shadow-sm border border-violet-200/50">
                      <Sparkles className="w-4 h-4 text-violet-600 shrink-0" />
                    </div>
                    <h5 className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-500">
                      Quick Preflight Sandbox Accounts (Click to Fill)
                    </h5>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2.5">
                    {(['parent', 'teacher', 'admin'] as const).map((r) => {
                      const preset = rolePresets![r];
                      const isSelected = selectedRole === r;
                      const rTheme = getThemeClasses(r);
                      return (
                        <button
                          key={r}
                          type="button"
                          onClick={() => handleQuickFill(r)}
                          className={`w-full text-left p-3 rounded-xl border text-xs transition-all duration-300 cursor-pointer flex justify-between items-center bg-white/80 backdrop-blur-sm ${
                            isSelected 
                              ? `${rTheme.border} ${rTheme.bgLight} ring-1 ${rTheme.ringGlow} shadow-sm` 
                              : 'border-slate-200/60 hover:border-slate-300 hover:bg-white hover:shadow-sm'
                          }`}
                          title={`Instantly pre-populate and authorize matching inputs for ${preset.name}`}
                        >
                          <div className="leading-snug">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-extrabold text-slate-800 text-sm">{preset.name}</span>
                              <span className={`text-[9px] px-2 py-0.5 rounded-md font-extrabold font-mono uppercase border ${
                                r === 'parent' ? 'text-indigo-600 bg-indigo-50 border-indigo-100' : 
                                r === 'teacher' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 
                                'text-amber-600 bg-amber-50 border-amber-100'
                              }`}>
                                {r}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                              {preset.desc}
                            </p>
                          </div>
                          <div className={`p-2 ${rTheme.iconBg} ${rTheme.text} rounded-xl shrink-0 flex items-center justify-center transition-transform ${isSelected ? 'scale-110' : 'group-hover:scale-105'}`}>
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
