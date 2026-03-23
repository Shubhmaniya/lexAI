import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import DisclaimerBanner from './components/DisclaimerBanner';

function AppContent() {
  const [language, setLanguage] = useState('en');
  const [user, setUser] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [activeDocument, setActiveDocument] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

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
    setDocuments(prev => [doc, ...prev]);
  };

  const handleDeleteDocument = (docId) => {
    setDocuments(prev => prev.filter(d => (d._id || d.id) !== docId));
    if (activeDocument && (activeDocument._id || activeDocument.id) === docId) {
      setActiveDocument(null);
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen bg-primary overflow-hidden text-white font-sans">
      <Sidebar
        documents={documents}
        activeDocument={activeDocument}
        onNewAnalysis={handleNewAnalysis}
        onDocumentSelect={handleDocumentSelect}
        onDeleteDocument={handleDeleteDocument}
        user={user}
        setUser={setUser}
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        language={language}
        setLanguage={setLanguage}
      />

      <div className={`flex-1 flex flex-col relative transition-all duration-300 w-full`}>
        {/* Top bar for mobile toggle & disclaimer */}
        <div className="absolute top-0 w-full z-10 flex flex-col pointer-events-none">
          <div className="flex justify-between items-center p-3">
            {!sidebarOpen && (
              <button
                onClick={toggleSidebar}
                className="pointer-events-auto p-2 rounded-xl text-text-secondary hover:text-white hover:bg-secondary transition-all"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                key={activeDocument ? activeDocument.id || activeDocument._id : 'new'}
                activeDocument={activeDocument}
                onDocumentAnalyzed={handleDocumentAnalyzed}
                language={language}
                user={user}
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
