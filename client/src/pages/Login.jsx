import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Login({ onLogin, onDemo }) {
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [loginErrors, setLoginErrors] = useState({});

  // Signup State
  const [signupFirst, setSignupFirst] = useState('');
  const [signupLast, setSignupLast] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPass, setSignupPass] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');
  const [showSignupPass, setShowSignupPass] = useState(false);
  const [showSignupConfirm, setShowSignupConfirm] = useState(false);
  const [signupTerms, setSignupTerms] = useState(false);
  const [signupErrors, setSignupErrors] = useState({});

  const checkStrength = (val) => {
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    return score;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginErrors({});
    let valid = true;
    let errors = {};

    if (!loginEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail)) {
      errors.email = true;
      valid = false;
    }
    if (!loginPass || loginPass.length < 6) {
      errors.password = true;
      valid = false;
    }

    if (!valid) {
      setLoginErrors(errors);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const name = loginEmail.split('@')[0];
      onLogin({ 
        email: loginEmail, 
        name: name.charAt(0).toUpperCase() + name.slice(1),
        type: 'user',
        uid: 'user_' + Date.now()
      });
    }, 1200);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setSignupErrors({});
    let valid = true;
    let errors = {};

    if (!signupFirst) { errors.first = true; valid = false; }
    if (!signupLast) { errors.last = true; valid = false; }
    if (!signupEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupEmail)) { errors.email = true; valid = false; }
    if (!signupPass || signupPass.length < 8) { errors.password = true; valid = false; }
    if (signupPass !== signupConfirm) { errors.confirm = true; valid = false; }
    if (!signupTerms) { errors.terms = true; valid = false; }

    if (!valid) {
      setSignupErrors(errors);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAlert({ type: 'success', text: 'Account created! Welcome to LexAI.' });
      setTimeout(() => {
        onLogin({ 
          email: signupEmail, 
          name: signupFirst + ' ' + signupLast,
          type: 'user',
          uid: 'user_' + Date.now()
        });
      }, 900);
    }, 1400);
  };

  const passStrength = checkStrength(signupPass);
  const strengthColors = ['#E05A5A', '#E09A5A', '#C9A84C', '#4CAF8C'];
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];

  return (
    <div 
      style={{ 
        display: 'flex', 
        flexDirection: 'row', 
        width: '100%', 
        minHeight: '100vh',
        backgroundColor: '#0B1220',
        color: '#F5F0E8',
        fontFamily: "'DM Sans', sans-serif",
        overflow: 'hidden'
      }}
    >
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        
        .lex-input {
          width: 100%;
          padding: 13px 14px 13px 42px;
          background: rgba(255,255,255,0.05);
          border: 0.5px solid rgba(201,168,76,0.2);
          border-radius: 12px;
          color: #F5F0E8;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          outline: none;
          transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
        }
        .lex-input:focus {
          border-color: #C9A84C;
          background: rgba(201,168,76,0.06);
          box-shadow: 0 0 0 3px rgba(201,168,76,0.12);
        }
        .lex-input.error {
          border-color: #E05A5A;
          box-shadow: 0 0 0 3px rgba(224,90,90,0.12);
        }
        .lex-input::placeholder { color: #6B7F99; }
        
        .lex-btn {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #C9A84C 0%, #B8922E 100%);
          color: #0B1220;
          border: none;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          letter-spacing: 0.3px;
          transition: all 0.25s;
          box-shadow: 0 4px 20px rgba(201,168,76,0.3);
          position: relative;
        }
        .lex-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 28px rgba(201,168,76,0.45);
        }
        .lex-btn:active {
          transform: translateY(0);
          box-shadow: 0 2px 12px rgba(201,168,76,0.3);
        }
        .lex-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          transform: none;
        }

        @media (max-width: 900px) {
          .split-container { flex-direction: column !important; }
          .left-panel { width: 100% !important; height: auto !important; padding: 40px 20px !important; }
          .right-panel { width: 100% !important; border-left: none !important; border-top: 0.5px solid rgba(201,168,76,0.15); padding: 40px 20px !important; }
        }
      `}} />

      {/* LEFT PANEL */}
      <div 
        className="left-panel"
        style={{ 
          width: '55%', 
          background: 'linear-gradient(135deg, #0B1220 0%, #13203A 50%, #0F1A2E 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '60px 70px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'absolute', top: '-120px', left: '-120px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '-80px', right: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(30,48,87,0.6) 0%, transparent 70%)' }} />

        <div className="text-center mb-14 relative z-10">
          <div style={{ width: '72px', height: '72px', background: 'linear-gradient(135deg, #C9A84C, #8B6914)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '32px', boxShadow: '0 8px 32px rgba(201,168,76,0.3)' }}>
            ⚖️
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '38px', fontWeight: '700', color: '#F5F0E8', letterSpacing: '-0.5px' }}>
            Lex<span style={{ color: '#C9A84C' }}>AI</span>
          </h1>
          <p style={{ fontSize: '15px', color: '#A8B8CC', marginTop: '8px', fontWeight: '300', letterSpacing: '0.3px' }}>Legal Document Intelligence Platform</p>
        </div>

        <div style={{ width: '60px', height: '2px', background: 'linear-gradient(90deg, #C9A84C, transparent)', margin: '40px auto', position: 'relative', zIndex: 1 }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>
          {[
            { icon: "📄", title: "Deep Document Analysis", desc: "Instant breakdown of contracts, NDAs, court orders, patents & more" },
            { icon: "🔍", title: "Clause Detection", desc: "Identify risky clauses, obligations, deadlines & penalties automatically" },
            { icon: "⚡", title: "Live AI Responses", desc: "Powered by advanced inference for real-time legal insights" },
            { icon: "🔒", title: "Secure & Confidential", desc: "Bank-grade encryption for all your sensitive legal documents" }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(201,168,76,0.2)', borderRadius: '16px', padding: '20px 24px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}
            >
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(201,168,76,0.12)', border: '0.5px solid rgba(201,168,76,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                {feature.icon}
              </div>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#F5F0E8', marginBottom: '4px' }}>{feature.title}</h3>
                <p style={{ fontSize: '13px', color: '#6B7F99', lineHeight: '1.5' }}>{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div 
        className="right-panel"
        style={{ 
          width: '45%', 
          background: '#0D1626',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '60px 50px',
          borderLeft: '0.5px solid rgba(201,168,76,0.15)',
          position: 'relative'
        }}
      >
        <div style={{ width: '100%', maxWidth: '400px' }}>
          
          {/* TABS */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(201,168,76,0.2)', borderRadius: '12px', padding: '4px', marginBottom: '36px' }}>
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-[11px] rounded-[9px] text-[14px] font-medium tracking-[0.2px] transition-all duration-300 ${
                mode === 'login'
                  ? 'bg-gradient-to-br from-[#C9A84C] to-[#B8922E] text-[#0B1220] shadow-[0_4px_16px_rgba(201,168,76,0.35)]'
                  : 'text-[#6B7F99] bg-transparent hover:text-[#A8B8CC] hover:bg-white/[0.06]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-[11px] rounded-[9px] text-[14px] font-medium tracking-[0.2px] transition-all duration-300 ${
                mode === 'signup'
                  ? 'bg-gradient-to-br from-[#C9A84C] to-[#B8922E] text-[#0B1220] shadow-[0_4px_16px_rgba(201,168,76,0.35)]'
                  : 'text-[#6B7F99] bg-transparent hover:text-[#A8B8CC] hover:bg-white/[0.06]'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* ALERT */}
          <AnimatePresence>
            {alert && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '13px 16px', borderRadius: '12px', fontSize: '13px', marginBottom: '20px' }}
                className={`${alert.type === 'success' ? 'bg-[#4CAF8C1A] border-[0.5px] border-[#4CAF8C4D] text-[#6DD5AE]' : 'bg-[#E05A5A1A] border-[0.5px] border-[#E05A5A4D] text-[#E88B8B]'}`}
              >
                <span>{alert.type === 'success' ? '✓' : '✕'}</span>
                <span>{alert.text}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <motion.form
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleLogin}
            >
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', fontWeight: '600', color: '#F5F0E8', marginBottom: '6px' }}>Welcome back</h2>
                <p style={{ fontSize: '14px', color: '#6B7F99' }}>Sign in to your LexAI account</p>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#A8B8CC', marginBottom: '8px', letterSpacing: '0.2px' }}>Email address</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: '#6B7F99', pointerEvents: 'none' }}>📧</span>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className={`lex-input ${loginErrors.email ? 'error' : ''}`}
                  />
                </div>
                {loginErrors.email && <div style={{ fontSize: '12px', color: '#E05A5A', marginTop: '6px' }}>Please enter a valid email address</div>}
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#A8B8CC', marginBottom: '8px', letterSpacing: '0.2px' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: '#6B7F99', pointerEvents: 'none' }}>🔑</span>
                  <input
                    type={showLoginPass ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    className={`lex-input ${loginErrors.password ? 'error' : ''}`}
                  />
                  <button type="button" onClick={() => setShowLoginPass(!showLoginPass)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#6B7F99', cursor: 'pointer', fontSize: '16px' }}>
                    {showLoginPass ? '🙈' : '👁️'}
                  </button>
                </div>
                {loginErrors.password && <div style={{ fontSize: '12px', color: '#E05A5A', marginTop: '6px' }}>Password must be at least 6 characters</div>}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px', marginTop: '-10px' }}>
                <a href="#" style={{ fontSize: '13px', color: '#C9A84C', textDecoration: 'none', opacity: 0.8 }} className="hover:opacity-100">Forgot password?</a>
              </div>

              <button type="submit" className="lex-btn" disabled={loading}>
                {loading ? <div className="btn-loader" /> : "Sign In to LexAI"}
              </button>
              
              <button 
                type="button"
                onClick={onDemo}
                style={{ width: '100%', marginTop: '12px', padding: '15px', background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.05)', borderRadius: '12px', color: '#C9A84C', fontSize: '13px', fontWeight: '600', cursor: 'pointer', letterSpacing: '0.3px' }}
                className="hover:bg-white/[0.06] transition-all"
              >
                TRY DEMO — NO ACCOUNT NEEDED
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', margin: '24px 0' }}>
                <div style={{ flex: 1, height: '0.5px', background: 'rgba(201,168,76,0.2)' }} />
                <span style={{ fontSize: '12px', color: '#6B7F99' }}>or continue with</span>
                <div style={{ flex: 1, height: '0.5px', background: 'rgba(201,168,76,0.2)' }} />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(201,168,76,0.2)', borderRadius: '12px', color: '#A8B8CC', fontSize: '13px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} className="hover:bg-[rgba(201,168,76,0.05)] hover:border-[rgba(201,168,76,0.5)] transition-all">
                  <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Google
                </button>
                <button type="button" style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(201,168,76,0.2)', borderRadius: '12px', color: '#A8B8CC', fontSize: '13px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} className="hover:bg-[rgba(201,168,76,0.05)] hover:border-[rgba(201,168,76,0.5)] transition-all">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                  GitHub
                </button>
              </div>
            </motion.form>
          )}

          {/* SIGNUP FORM */}
          {mode === 'signup' && (
            <motion.form
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleSignup}
            >
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', fontWeight: '600', color: '#F5F0E8', marginBottom: '6px' }}>Get started free</h2>
                <p style={{ fontSize: '14px', color: '#6B7F99' }}>Create your LexAI account in seconds</p>
              </div>

              <div style={{ display: 'flex', gap: '14px' }}>
                <div style={{ marginBottom: '18px', flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#A8B8CC', marginBottom: '8px', letterSpacing: '0.2px' }}>First name</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: '#6B7F99', pointerEvents: 'none' }}>👤</span>
                    <input type="text" placeholder="Arjun" value={signupFirst} onChange={(e) => setSignupFirst(e.target.value)} className={`lex-input ${signupErrors.first ? 'error' : ''}`} />
                  </div>
                </div>
                <div style={{ marginBottom: '18px', flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#A8B8CC', marginBottom: '8px', letterSpacing: '0.2px' }}>Last name</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: '#6B7F99', pointerEvents: 'none' }}>👤</span>
                    <input type="text" placeholder="Mehta" value={signupLast} onChange={(e) => setSignupLast(e.target.value)} className={`lex-input ${signupErrors.last ? 'error' : ''}`} />
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#A8B8CC', marginBottom: '8px', letterSpacing: '0.2px' }}>Email address</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: '#6B7F99', pointerEvents: 'none' }}>📧</span>
                  <input type="email" placeholder="you@example.com" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} className={`lex-input ${signupErrors.email ? 'error' : ''}`} />
                </div>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#A8B8CC', marginBottom: '8px', letterSpacing: '0.2px' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: '#6B7F99', pointerEvents: 'none' }}>🔑</span>
                  <input type={showSignupPass ? 'text' : 'password'} placeholder="Create a strong password" value={signupPass} onChange={(e) => setSignupPass(e.target.value)} className={`lex-input ${signupErrors.password ? 'error' : ''}`} />
                  <button type="button" onClick={() => setShowSignupPass(!showSignupPass)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#6B7F99', cursor: 'pointer', fontSize: '16px' }}>{showSignupPass ? '🙈' : '👁️'}</button>
                </div>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#A8B8CC', marginBottom: '8px', letterSpacing: '0.2px' }}>Confirm password</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: '#6B7F99', pointerEvents: 'none' }}>🔐</span>
                  <input type={showSignupConfirm ? 'text' : 'password'} placeholder="Repeat your password" value={signupConfirm} onChange={(e) => setSignupConfirm(e.target.value)} className={`lex-input ${signupErrors.confirm ? 'error' : ''}`} />
                  <button type="button" onClick={() => setShowSignupConfirm(!showSignupConfirm)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#6B7F99', cursor: 'pointer', fontSize: '16px' }}>{showSignupConfirm ? '🙈' : '👁️'}</button>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                <input type="checkbox" id="agree-terms" checked={signupTerms} onChange={(e) => setSignupTerms(e.target.checked)} style={{ width: '17px', height: '17px', borderRadius: '5px', border: '0.5px solid rgba(201,168,76,0.5)', background: 'transparent', cursor: 'pointer', accentColor: '#C9A84C' }} />
                <label htmlFor="agree-terms" style={{ fontSize: '13px', color: '#6B7F99', cursor: 'pointer', lineHeight: '1.4' }}>
                  I agree to the <a href="#" style={{ color: '#C9A84C', textDecoration: 'none', opacity: 0.9 }}>Terms of Service</a> and <a href="#" style={{ color: '#C9A84C', textDecoration: 'none', opacity: 0.9 }}>Privacy Policy</a>
                </label>
              </div>

              <button type="submit" className="lex-btn" disabled={loading}>
                {loading ? <div className="btn-loader" /> : "Create My Account"}
              </button>
              
              <button 
                type="button"
                onClick={onDemo}
                style={{ width: '100%', marginTop: '12px', padding: '15px', background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.05)', borderRadius: '12px', color: '#C9A84C', fontSize: '13px', fontWeight: '600', cursor: 'pointer', letterSpacing: '0.3px' }}
                className="hover:bg-white/[0.06] transition-all"
              >
                TRY DEMO — NO ACCOUNT NEEDED
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', margin: '24px 0' }}>
                <div style={{ flex: 1, height: '0.5px', background: 'rgba(201,168,76,0.2)' }} />
                <span style={{ fontSize: '12px', color: '#6B7F99' }}>or sign up with</span>
                <div style={{ flex: 1, height: '0.5px', background: 'rgba(201,168,76,0.2)' }} />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(201,168,76,0.2)', borderRadius: '12px', color: '#A8B8CC', fontSize: '13px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} className="hover:bg-[rgba(201,168,76,0.05)] hover:border-[rgba(201,168,76,0.5)] transition-all">
                  <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Google
                </button>
                <button type="button" style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(201,168,76,0.2)', borderRadius: '12px', color: '#A8B8CC', fontSize: '13px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} className="hover:bg-[rgba(201,168,76,0.05)] hover:border-[rgba(201,168,76,0.5)] transition-all">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                  GitHub
                </button>
              </div>
            </motion.form>
          )}

        </div>
      </div>
    </div>
  );
}
