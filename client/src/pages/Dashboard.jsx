import { useState, useEffect } from 'react';

export default function Dashboard({ documents, setDocuments, onDocumentSelect, onDeleteDocument }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Try to fetch documents from backend
    const fetchDocs = async () => {
      setLoading(true);
      try {
        const API_URL = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${API_URL}/api/documents`, {
          headers: { 'x-user-id': 'anonymous' }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.documents) setDocuments(data.documents);
        }
      } catch (err) {
        // Backend not available, use local state
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  const getRiskColor = (score) => {
    if (!score) return '#a0a0b0';
    if (score <= 3) return '#00d4a0';
    if (score <= 7) return '#f5a623';
    return '#ff4f4f';
  };

  const getActionBadge = (action) => {
    const config = {
      SAFE: { bg: 'rgba(0,212,160,0.15)', text: '#00d4a0', label: '✅ Safe' },
      NEGOTIATE: { bg: 'rgba(245,166,35,0.15)', text: '#f5a623', label: '⚠️ Negotiate' },
      AVOID: { bg: 'rgba(255,79,79,0.15)', text: '#ff4f4f', label: '🚫 Avoid' }
    };
    return config[action] || config.NEGOTIATE;
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto pt-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">📋 Document History</h1>
        <p className="text-text-secondary text-sm mt-1">View and manage your analyzed documents</p>
      </div>

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton h-20 rounded-2xl" />
          ))}
        </div>
      )}

      {!loading && documents.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="text-white font-semibold text-lg mb-2">No documents yet</h3>
          <p className="text-text-secondary text-sm mb-6">Upload your first document to get started with AI analysis</p>
          <a href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent hover:bg-accent-hover text-white font-semibold transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Analysis
          </a>
        </div>
      )}

      {!loading && documents.length > 0 && (
        <div className="space-y-3">
          {documents.map((doc, index) => {
            const docId = doc._id || doc.id || index;
            const badge = getActionBadge(doc.analysis?.recommendedAction);

            return (
              <div
                key={docId}
                className="fade-in-up bg-card rounded-2xl p-4 md:p-5 border border-border hover:border-accent/30 transition-all cursor-pointer group"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => onDocumentSelect(doc)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-2xl">{doc.fileType === 'pdf' ? '📄' : '🖼️'}</span>
                    <div className="min-w-0">
                      <p className="text-white font-medium truncate">{doc.fileName || 'Untitled'}</p>
                      <p className="text-text-secondary text-xs mt-0.5">
                        {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric'
                        }) : 'Recently'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {doc.analysis?.riskScore !== undefined && (
                      <div className="text-center">
                        <div className="text-lg font-bold" style={{ color: getRiskColor(doc.analysis.riskScore) }}>
                          {doc.analysis.riskScore}/10
                        </div>
                        <div className="text-xs text-text-secondary">Risk</div>
                      </div>
                    )}

                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium hidden sm:inline-block"
                      style={{ background: badge.bg, color: badge.text }}
                    >
                      {badge.label}
                    </span>

                    <button
                      onClick={(e) => { e.stopPropagation(); onDeleteDocument(docId); }}
                      className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-warning-red/20 text-text-secondary hover:text-warning-red transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
