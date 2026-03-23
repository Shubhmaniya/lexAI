import { useState, useRef, useEffect, useCallback } from 'react';
import ChatInputBar from '../components/ChatInputBar';
import ChatThread from '../components/ChatThread';
import { extractTextFromPDF } from '../utils/pdfParser';
import { processImageOCR } from '../utils/ocrProcessor';
import { validateText } from '../utils/textValidator';

export default function Home({ activeDocument, onDocumentAnalyzed, language, user }) {
  const [messages, setMessages] = useState([]);
  const [processingState, setProcessingState] = useState(null); // { step, ocrProgress, error }
  const [isTyping, setIsTyping] = useState(false);

  // Initialize with active document if provided
  useEffect(() => {
    if (activeDocument) {
      setMessages([
        {
          id: 'doc-' + activeDocument.id,
          role: 'user',
          isDocument: true,
          fileName: activeDocument.fileName,
          fileType: activeDocument.fileType
        },
        {
          id: 'analysis-' + activeDocument.id,
          role: 'assistant',
          isAnalysis: true,
          analysis: activeDocument.analysis,
          ocrConfidence: activeDocument.ocrConfidence,
          extractedText: activeDocument.extractedText
        }
      ]);

      // If there's chat history for this document in the backend, we should fetch it.
      // For simplicity in this UI refactor, we just start fresh or the user can continue chat.
    } else {
      setMessages([]);
      setProcessingState(null);
    }
  }, [activeDocument]);

  const processFile = useCallback(async (file) => {
    const isPDF = file.type === 'application/pdf';
    const isImage = file.type.startsWith('image/');

    if (!isPDF && !isImage) {
      setProcessingState({ step: 1, error: { message: 'Please upload a PDF or image file.' } });
      return;
    }

    // Add user message for document upload
    const userMsgId = Date.now().toString();
    setMessages(prev => [...prev, {
      id: userMsgId,
      role: 'user',
      isDocument: true,
      fileName: file.name,
      fileType: isPDF ? 'pdf' : 'image',
      content: ''
    }]);

    setProcessingState({ step: 1, isPDF });

    try {
      let text = '';
      let confidence = null;

      await sleep(500);
      setProcessingState({ step: 2, isPDF, ocrProgress: isPDF ? null : 0 });

      if (isPDF) {
        const result = await extractTextFromPDF(file);
        text = result.text;
      } else {
        const result = await processImageOCR(file, (progress) => {
          setProcessingState(prev => ({ ...prev, ocrProgress: progress }));
        });
        text = result.text;
        confidence = result.confidence;
      }

      const validation = validateText(text, confidence);
      if (!validation.valid) {
        setProcessingState({ step: 3, error: validation.error });
        return;
      }

      await sleep(500);
      setProcessingState({ step: 4 });

      // Call API
      try {
        const API_URL = import.meta.env.VITE_API_URL || '';
        const response = await fetch(`${API_URL}/api/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-user-id': user?.uid || 'anonymous' },
          body: JSON.stringify({
            text,
            fileName: file.name,
            fileType: isPDF ? 'pdf' : 'image',
            ocrConfidence: confidence,
            language
          })
        });

        if (!response.ok) throw new Error('Analysis failed');

        const data = await response.json();
        
        onDocumentAnalyzed({
          _id: data.documentId,
          id: data.documentId,
          fileName: file.name,
          fileType: isPDF ? 'pdf' : 'image',
          extractedText: text,
          analysis: data.analysis,
          ocrConfidence: confidence
        });
        
        setProcessingState(null);
      } catch (apiErr) {
        // Mock fallback
        const mockAnalysis = {
          summary: "This appears to be a legal document. To get a full AI-powered analysis, please ensure the backend server is running on port 5001 with a valid ANTHROPIC_API_KEY configured in the .env file.",
          riskScore: 5,
          recommendedAction: 'NEGOTIATE',
          clausesAgainstUser: ['Backend server not fully connected.'],
          clausesForUser: ['Text extraction was successful.'],
          loopholes: ['Full analysis requires backend connection.'],
          missingProtections: ['Connect server for complete analysis.'],
        };

        const docObj = {
          id: 'local-' + Date.now(),
          fileName: file.name,
          fileType: isPDF ? 'pdf' : 'image',
          extractedText: text,
          analysis: mockAnalysis,
          ocrConfidence: confidence
        };
        
        onDocumentAnalyzed(docObj);
        setProcessingState(null);
      }
    } catch (err) {
      setProcessingState({ step: 4, error: { message: err.message || 'Processing failed' } });
    }
  }, [language, user, onDocumentAnalyzed]);

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content: text
    }]);

    if (!activeDocument) {
      // If no document is active, just answer generically or ask for document
      setIsTyping(true);
      await sleep(1000);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Please attach a legal document first so I can analyze it for you."
      }]);
      setIsTyping(false);
      return;
    }

    setIsTyping(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': 'anonymous' },
        body: JSON.stringify({
          documentId: activeDocument._id || activeDocument.id,
          message: text,
          language
        })
      });

      const data = await res.json();
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.success ? data.response : 'Sorry, I encountered an error.'
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I'd answer, but the mock fallback is active. Please start the backend server."
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFileSelect = (file) => {
    if (file.size > 10 * 1024 * 1024) {
      alert("File too large. Max 10MB.");
      return;
    }
    processFile(file);
  };

  return (
    <div className="flex flex-col h-full bg-black relative">
      <div className="flex-1 overflow-y-auto px-4 md:px-0">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-accent border border-accent/60 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-accent/20 glow-purple">
              <span className="text-3xl">⚖️</span>
            </div>
            <h1 className="text-3xl font-bold mb-2 tracking-tight">What are we working on?</h1>
            <p className="text-[#444] text-sm mb-10 max-w-md">
              Attach a contract, lease, NDA, or any legal document to get an instant AI-powered analysis — risk rating, key clauses, and plain English summary.
            </p>

            <div className="grid grid-cols-2 gap-3 w-full max-w-md">
              {[
                { icon: '📄', emoji: '🏢', t: 'Employment Contract', sub: 'Review NDA & non-compete' },
                { icon: '🏠', emoji: '🔑', t: 'Rental Agreement', sub: 'Check tenant protections' },
                { icon: '🤝', emoji: '📝', t: 'NDA Analysis', sub: 'Understand restrictions' },
                { icon: '📷', emoji: '🧾', t: 'Photo of document', sub: 'Capture with your camera' },
              ].map((item, idx) => (
                <button key={idx} className="bg-[#0d0d0d] hover:bg-[#111] border border-[#1a1a1a] hover:border-[#2a2a2a] p-4 rounded-2xl text-left transition-all flex flex-col gap-2 group">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-[#e4e4e7] group-hover:text-white transition-colors">{item.t}</p>
                    <p className="text-xs text-[#444] mt-0.5">{item.sub}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 mt-10 text-[#333] text-xs">
              <svg className="w-4 h-4 text-accent/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              Use the 📎 button below to attach a PDF or image to get started
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto w-full pt-16 pb-36">
            <ChatThread
              messages={messages}
              processingState={processingState}
              isTyping={isTyping}
              language={language}
            />
          </div>
        )}
      </div>

      <div className="absolute bottom-0 w-full bg-gradient-to-t from-black via-black/95 to-transparent pt-12 pb-6">
        <div className="max-w-3xl mx-auto px-4 w-full">
          <ChatInputBar
            onSendMessage={handleSendMessage}
            onFileSelect={handleFileSelect}
            isProcessing={!!processingState || isTyping}
          />
        </div>
      </div>
    </div>
  );
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
