import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Play, LogIn, UserPlus, AlertCircle, Sparkles } from 'lucide-react';

export default function Login({ onLogin, onDemo }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    
    if (mode === 'signup' && !name) {
      setError('Please provide your full name.');
      return;
    }

    setLoading(true);
    // Simulate network delay for premium feel
    await new Promise(r => setTimeout(r, 800));
    
    try {
      onLogin({ 
        email, 
        name: name || email.split('@')[0], 
        type: 'user',
        uid: 'user_' + Date.now()
      });
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5, 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="relative min-h-screen overflow-hidden px-4 text-slate-100 flex items-center justify-center bg-[#050505]">
      {/* Premium Ambient Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Dynamic Blobs */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -left-20 top-0 h-[500px] w-[500px] rounded-full bg-orange-600/10 blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -45, 0],
            x: [0, -40, 0],
            y: [0, 60, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -right-20 -bottom-20 h-[600px] w-[600px] rounded-full bg-cyan-500/5 blur-[100px]" 
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)]" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-sm"
      >
        {/* Logo Section */}
        <motion.div variants={itemVariants} className="flex flex-col items-center mb-10">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mb-5 shadow-2xl shadow-orange-500/20"
          >
            <span className="text-3xl drop-shadow-md">⚖️</span>
          </motion.div>
          <h1 className="text-3xl font-bold tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
            LexAI Navigator
          </h1>
          <p className="mt-2 text-sm text-slate-400 text-center font-medium max-w-[280px] leading-relaxed">
            Analyze contracts with AI precision. <br/>Fast, legal-grade, accessible.
          </p>
        </motion.div>

        {/* Auth Card */}
        <div className="relative group">
          {/* Card Border Glow */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500/20 to-cyan-500/20 rounded-[2.5rem] blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
          
          <div className="relative rounded-[2.2rem] border border-white/10 bg-black/40 p-1 backdrop-blur-3xl shadow-2xl">
            {/* Tab Selector */}
            <div className="relative flex p-1.5 mb-6">
              <div className="absolute inset-1.5 w-full flex pointer-events-none">
                <motion.div 
                  animate={{ x: mode === 'login' ? '0%' : '100%' }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="w-1/2 h-full bg-white/5 border border-white/10 rounded-2xl"
                />
              </div>
              <button
                onClick={() => setMode('login')}
                className={`relative z-10 flex-1 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${mode === 'login' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Sign In
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`relative z-10 flex-1 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${mode === 'signup' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Join Now
              </button>
            </div>

            <div className="px-6 pb-6">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <AnimatePresence mode="wait">
                  {mode === 'signup' && (
                    <motion.div 
                      key="signup-name"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-1.5"
                    >
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em] ml-1">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type="text" value={name} onChange={e => setName(e.target.value)}
                          placeholder="Legal Representative"
                          className="w-full h-12 pl-11 pr-4 rounded-2xl bg-white/5 border border-white/5 focus:border-orange-500/50 focus:bg-white/[0.08] focus:outline-none transition-all text-sm"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em] ml-1">Work Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="name@firm.com"
                      className="w-full h-12 pl-11 pr-4 rounded-2xl bg-white/5 border border-white/5 focus:border-orange-500/50 focus:bg-white/[0.08] focus:outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-end ml-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em]">Password</label>
                    <button type="button" className="text-[10px] text-orange-400/80 hover:text-orange-400 font-bold uppercase transition-colors">Forgot?</button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="password" value={password} onChange={e => setPassword(e.target.value)}
                      placeholder={mode === 'signup' ? 'Create Secure PW' : 'Enter Password'}
                      className="w-full h-12 pl-11 pr-4 rounded-2xl bg-white/5 border border-white/5 focus:border-orange-500/50 focus:bg-white/[0.08] focus:outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 text-red-400 text-xs bg-red-400/5 border border-red-400/20 rounded-xl px-4 py-3"
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
                  </motion.div>
                )}

                <button
                  type="submit" disabled={loading}
                  className="group mt-2 h-12 rounded-2xl bg-orange-500 hover:bg-orange-400 text-black font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 disabled:opacity-50 overflow-hidden relative shadow-xl shadow-orange-500/10"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{mode === 'login' ? 'Sign Into Vault' : 'Secure Account'}</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 flex flex-col gap-3">
                <button className="w-full flex items-center justify-center gap-3 rounded-2xl border border-white/5 bg-white/5 h-11 text-xs font-bold text-slate-300 hover:bg-white/[0.08] hover:border-white/10 transition-all">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" className="opacity-70"/>
                  </svg>
                  Connect with G-Cloud
                </button>

                <button
                  onClick={onDemo}
                  className="w-full h-11 flex items-center justify-center gap-2 rounded-2xl border border-orange-500/20 bg-orange-500/10 text-[10px] font-black uppercase tracking-widest text-orange-400 hover:bg-orange-500/20 transition-all border-dashed"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Instant Demo — Zero Credentials
                </button>
              </div>
            </div>
          </div>
        </div>

        <motion.p variants={itemVariants} className="mt-8 text-center text-slate-600 text-[10px] leading-relaxed max-w-[280px] mx-auto uppercase tracking-tighter font-semibold">
          LexAI uses highly advanced neural logic. Verification by legal counsel is always recommended.
        </motion.p>
      </motion.div>
    </div>
  );
}
