import { useState } from 'react';

export default function Sidebar({ documents, activeDocument, onNewAnalysis, onDocumentSelect, onDeleteDocument, user, isOpen, onToggle }) {
  const [hoveredDoc, setHoveredDoc] = useState(null);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={onToggle} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 bottom-0 w-[280px] z-40 flex flex-col border-r border-border transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ background: '#0d0d1a' }}
      >
        {/* New Analysis button */}
        <div className="p-4">
          <button
            onClick={onNewAnalysis}
            className="w-full py-3 px-4 rounded-xl bg-accent hover:bg-accent-hover text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-accent/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Analysis
          </button>
        </div>

        {/* Document list */}
        <div className="flex-1 overflow-y-auto px-3">
          <p className="text-xs text-text-secondary uppercase tracking-wider px-2 mb-2">Recent Documents</p>
          {documents.length === 0 ? (
            <div className="text-center py-8 px-4">
              <div className="text-3xl mb-2">📄</div>
              <p className="text-sm text-text-secondary">No documents yet</p>
              <p className="text-xs text-text-secondary mt-1">Upload a document to get started</p>
            </div>
          ) : (
            <div className="space-y-1">
              {documents.map((doc, index) => {
                const docId = doc._id || doc.id || index;
                const isActive = activeDocument && (activeDocument._id || activeDocument.id) === docId;
                return (
                  <div
                    key={docId}
                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
                      isActive
                        ? 'bg-accent/15 border border-accent/30'
                        : 'hover:bg-secondary border border-transparent'
                    }`}
                    onClick={() => onDocumentSelect(doc)}
                    onMouseEnter={() => setHoveredDoc(docId)}
                    onMouseLeave={() => setHoveredDoc(null)}
                  >
                    <span className="text-lg">{doc.fileType === 'pdf' ? '📄' : '🖼️'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{doc.fileName || 'Untitled'}</p>
                      <p className="text-xs text-text-secondary">
                        {doc.analysis?.riskScore !== undefined ? `Risk: ${doc.analysis.riskScore}/10` : 'Analyzing...'}
                      </p>
                    </div>
                    {hoveredDoc === docId && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onDeleteDocument(docId); }}
                        className="p-1 rounded hover:bg-warning-red/20 text-text-secondary hover:text-warning-red transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* User profile at bottom */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center text-accent font-semibold text-sm">
              {user?.displayName?.charAt(0) || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{user?.displayName || 'Guest User'}</p>
              <p className="text-xs text-text-secondary">{user?.email || 'Sign in for full access'}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
