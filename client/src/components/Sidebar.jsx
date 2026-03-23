import { useState } from 'react';

export default function Sidebar({ 
  documents, activeDocument, onNewAnalysis, onDocumentSelect, 
  onDeleteDocument, user, onLogout, isOpen, onToggle, 
  language, setLanguage, isDemo 
}) {
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleDelete = (e, docId) => {
    e.stopPropagation();
    if (confirmDelete === docId) {
      onDeleteDocument(docId);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(docId);
      setTimeout(() => setConfirmDelete(null), 2000);
    }
  };

  const getRiskColor = (score) => {
    if (!score) return '#555';
    if (score <= 3) return '#22c55e';
    if (score <= 6) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 md:hidden" onClick={onToggle} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:relative z-30 h-full flex flex-col
        bg-[#080808] border-r border-[#141414]
        transition-all duration-300 ease-in-out
        ${isOpen ? 'w-[260px] translate-x-0' : 'w-0 -translate-x-full md:w-[260px] md:translate-x-0 md:opacity-0 md:w-0'}
        overflow-hidden shrink-0
      `}>
        <div className="flex flex-col h-full w-[260px]">
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#141414]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-lg shrink-0">
                ⚖️
              </div>
              <div>
                <span className="font-bold text-white text-sm">LexAI</span>
                {isDemo && (
                  <span className="ml-1.5 text-[10px] font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded px-1.5 py-0.5">DEMO</span>
                )}
              </div>
            </div>
            <button onClick={onToggle} className="p-1.5 rounded-lg text-[#555] hover:text-white hover:bg-[#1a1a1a] transition-all md:flex hidden">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>

          {/* New Analysis button */}
          <div className="p-3">
            <button
              onClick={onNewAnalysis}
              className="w-full flex items-center gap-3 bg-[#111] hover:bg-[#1a1a1a] border border-[#1f1f1f] hover:border-accent/30 text-[#ccc] hover:text-white rounded-xl px-4 py-3 text-sm font-medium transition-all group"
            >
              <svg className="w-4 h-4 text-accent group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Analysis
            </button>
          </div>

          {/* Language toggle */}
          <div className="px-3 pb-3">
            <div className="flex bg-[#111] border border-[#1f1f1f] rounded-xl p-1">
              <button
                onClick={() => setLanguage('en')}
                className={`flex-1 text-xs py-1.5 rounded-lg font-medium transition-all ${language === 'en' ? 'bg-accent text-white' : 'text-[#555] hover:text-white'}`}
              >
                🇺🇸 EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`flex-1 text-xs py-1.5 rounded-lg font-medium transition-all ${language === 'hi' ? 'bg-accent text-white' : 'text-[#555] hover:text-white'}`}
              >
                🇮🇳 HI
              </button>
            </div>
          </div>

          {/* Documents list */}
          <div className="flex-1 overflow-y-auto px-3 flex flex-col gap-1">
            {documents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-3xl mb-3 opacity-30">📂</div>
                <p className="text-[#444] text-xs leading-relaxed">Analyzed documents<br/>will appear here</p>
              </div>
            ) : (
              <>
                <p className="text-[10px] font-semibold text-[#444] uppercase tracking-widest mb-2 px-1">Recent</p>
                {documents.map((doc) => {
                  const docId = doc._id || doc.id;
                  const isActive = activeDocument && (activeDocument._id || activeDocument.id) === docId;
                  return (
                    <button
                      key={docId}
                      onClick={() => onDocumentSelect(doc)}
                      className={`group w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all ${
                        isActive ? 'bg-accent/10 border border-accent/20 text-white' : 'text-[#888] hover:text-white hover:bg-[#111] border border-transparent'
                      }`}
                    >
                      <span className="text-base shrink-0">{doc.fileType === 'image' ? '🖼️' : '📄'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{doc.fileName || 'Document'}</p>
                        {doc.analysis?.riskScore && (
                          <div className="flex items-center gap-1.5 mt-1">
                            <div className="w-1.5 h-1.5 rounded-full" style={{background: getRiskColor(doc.analysis.riskScore)}} />
                            <span className="text-[10px] text-[#555]">Risk: {doc.analysis.riskScore}/10</span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={(e) => handleDelete(e, docId)}
                        className={`shrink-0 p-1 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${
                          confirmDelete === docId ? 'text-red-400 bg-red-900/30 opacity-100' : 'text-[#555] hover:text-red-400 hover:bg-red-900/20'
                        }`}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </button>
                  );
                })}
              </>
            )}
          </div>

          {/* User profile / logout */}
          <div className="p-3 border-t border-[#141414]">
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#111] transition-all group">
              <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-sm font-bold text-accent shrink-0">
                {user?.name?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{user?.name || 'User'}</p>
                <p className="text-[10px] text-[#444] truncate">{isDemo ? 'Demo Mode' : user?.email}</p>
              </div>
              <button 
                onClick={onLogout}
                className="shrink-0 p-1.5 rounded-lg text-[#444] hover:text-red-400 hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100"
                title="Sign out"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
