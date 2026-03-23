import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import DisclaimerBanner from './components/DisclaimerBanner';

function AppContent() {
  const [authState, setAuthState] = useState('logged_out'); // 'logged_out' | 'demo' | 'logged_in'
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState('en');
  const [documents, setDocuments] = useState([]);
  const [activeDocument, setActiveDocument] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogin = (userData) => {
    setUser(userData);
    setAuthState('logged_in');
  };

  const handleDemo = () => {
    setUser({ email: 'demo@lexai.app', name: 'Demo User', type: 'demo' });
    setAuthState('demo');
  };

  const handleLogout = () => {
    setUser(null);
    setAuthState('logged_out');
    setDocuments([]);
    setActiveDocument(null);
  };

  const handleNewAnalysis = () => {
    setActiveDocument(null);
    navigate('/');
  };

  const handleDocumentSelect = (doc) => {
    setActiveDocument(doc);
    navigate('/');
  };

  const handleDocumentAnalyzed = (doc) => {
    setActiveDocument(doc);
    setDocuments(prev => [doc, ...prev.filter(d => (d._id || d.id) !== (doc._id || doc.id))]);
  };

  const handleDeleteDocument = (docId) => {
    setDocuments(prev => prev.filter(d => (d._id || d.id) !== docId));
    if (activeDocument && (activeDocument._id || activeDocument.id) === docId) {
      setActiveDocument(null);
    }
  };

  // Show login wall if not authenticated
  if (authState === 'logged_out') {
    return <Login onLogin={handleLogin} onDemo={handleDemo} />;
  }

  return (
    <div className="flex h-screen bg-black overflow-hidden text-white font-sans">
      <Sidebar
        documents={documents}
        activeDocument={activeDocument}
        onNewAnalysis={handleNewAnalysis}
        onDocumentSelect={handleDocumentSelect}
        onDeleteDocument={handleDeleteDocument}
        user={user}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        language={language}
        setLanguage={setLanguage}
        isDemo={authState === 'demo'}
      />

      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Mobile toggle / disclaimer area */}
        <div className="absolute top-0 w-full z-10 pointer-events-none">
          <div className="flex items-center p-3">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="pointer-events-auto p-2 rounded-xl text-[#555] hover:text-white hover:bg-[#111] transition-all border border-[#1f1f1f]"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
          </div>
          <div className="pointer-events-auto">
            <DisclaimerBanner />
          </div>
        </div>

        <Routes>
          <Route
            path="/"
            element={
              <Home
                key={activeDocument ? (activeDocument.id || activeDocument._id) : 'new'}
                activeDocument={activeDocument}
                onDocumentAnalyzed={handleDocumentAnalyzed}
                language={language}
                user={user}
                isDemo={authState === 'demo'}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
