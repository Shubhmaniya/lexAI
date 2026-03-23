import { useState } from 'react';

export default function Navbar({ language, setLanguage, user, setUser, sidebarOpen, setSidebarOpen }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 md:px-6"
      style={{
        background: 'rgba(15, 15, 15, 0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(108, 99, 255, 0.15)'
      }}>
      {/* Left: hamburger + logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-secondary transition-colors md:hidden"
        >
          <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚖️</span>
          <span className="text-xl font-bold">
            <span className="text-accent">Lex</span>
            <span className="text-white">AI</span>
          </span>
        </div>
      </div>

      {/* Center: Language toggle */}
      <div className="flex items-center">
        <div className="flex items-center bg-secondary rounded-full p-1 border border-border">
          <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
              language === 'en'
                ? 'bg-accent text-white shadow-lg'
                : 'text-text-secondary hover:text-white'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
              language === 'hi'
                ? 'bg-accent text-white shadow-lg'
                : 'text-text-secondary hover:text-white'
            }`}
          >
            HI
          </button>
        </div>
      </div>

      {/* Right: Auth */}
      <div className="flex items-center">
        {user ? (
          <div className="flex items-center gap-2">
            <img
              src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'U'}&background=6c63ff&color=fff`}
              alt="avatar"
              className="w-8 h-8 rounded-full border-2 border-accent"
            />
            <span className="text-sm text-text-secondary hidden md:block">{user.displayName}</span>
          </div>
        ) : (
          <button
            onClick={() => setUser({ displayName: 'User', uid: 'anonymous' })}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary border border-border text-sm text-text-secondary hover:text-white hover:border-accent transition-all duration-200"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
}
