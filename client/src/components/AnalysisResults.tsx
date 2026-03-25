import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, ShieldAlert, ShieldCheck, Zap, MessageSquare,
  Send, Loader2, Bot, User, FileText, Upload, Globe
} from "lucide-react";
import { streamChatWithDocument, uploadDocument, analyzeDocument } from "@/lib/api";

interface AnalysisResultsProps {
  document: any;
  onBack: () => void;
  onAnalysisSuccess?: (doc: any) => void;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

const AnalysisResults = ({ document, onBack, onAnalysisSuccess }: AnalysisResultsProps) => {
  const { analysis, fileName, extractedText, _id } = document;
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showDocPanel, setShowDocPanel] = useState(true);
  const [language, setLanguage] = useState<"en" | "hi">("en");
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Auto-greet
  useEffect(() => {
    const welcome = language === "en" 
      ? `I've analyzed **${fileName}**. Ask me anything about it!`
      : `मैने **${fileName}** का विश्लेषण किया है। आप मुझसे इसके बारे में कुछ भी पूछ सकते हैं!`;

    setChatMessages([{
      role: "assistant",
      content: welcome
    }]);
  }, [language]);

  const handleSendChat = async () => {
    const msg = chatInput.trim();
    if (!msg || isSending) return;

    setChatInput("");
    setChatMessages(prev => [...prev, { role: "user", content: msg }]);
    setIsSending(true);

    // Add placeholder for streaming
    setChatMessages(prev => [...prev, { role: "assistant", content: "", isStreaming: true }]);

    try {
      await streamChatWithDocument(_id, msg, (chunk) => {
        setChatMessages(prev => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last && last.role === "assistant") {
            updated[updated.length - 1] = { ...last, content: last.content + chunk };
          }
          return updated;
        });
      }, language); // Pass language

      // Mark streaming as done
      setChatMessages(prev => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last) updated[updated.length - 1] = { ...last, isStreaming: false };
        return updated;
      });
    } catch (err: any) {
      setChatMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { 
          role: "assistant", 
          content: language === "en" ? "Sorry, something went wrong." : "क्षमा करें, कुछ गलत हो गया।",
          isStreaming: false
        };
        return updated;
      });
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  const handleNewUpload = async (file: File) => {
    try {
      const uploadResult = await uploadDocument(file);
      const analysisResult = await analyzeDocument({
        text: uploadResult.extractedText,
        fileName: file.name,
        fileType: file.name.endsWith('.pdf') ? 'pdf' : 'txt',
        language
      });
      if (onAnalysisSuccess) {
        onAnalysisSuccess({
          _id: analysisResult.documentId,
          fileName: file.name,
          analysis: analysisResult.analysis,
          extractedText: uploadResult.extractedText
        });
      }
    } catch (err) {
      if (onAnalysisSuccess) {
        onAnalysisSuccess({
          _id: `local-${Date.now()}`,
          fileName: file.name,
          analysis: null,
          extractedText: ""
        });
      }
    }
  };

  const getRiskColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "high": return "text-red-500 bg-red-500/10 border-red-500/20";
      case "medium": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "low": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      default: return "text-primary bg-primary/10 border-primary/20";
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(124,58,237,0.05)_0%,transparent_50%)] pointer-events-none" />
      
      {/* Header */}
      <header className="px-5 py-3 border-b border-white/5 flex items-center justify-between glass-strong sticky top-0 z-50 shadow-2xl">
        <div className="flex items-center gap-4">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="p-2.5 rounded-xl bg-white/5 border border-white/5 transition-all text-muted-foreground hover:text-white"
          >
            <ArrowLeft size={18} />
          </motion.button>
          <div className="hidden sm:block">
            <h2 className="text-lg font-bold text-white tracking-tight truncate max-w-[200px]">{fileName}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <p className="text-[9px] text-muted-foreground uppercase font-black tracking-[0.25em]">Session Active</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <div className="flex bg-white/5 rounded-xl p-1 border border-white/5 mr-2">
            <button
              onClick={() => setLanguage("en")}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${language === "en" ? "bg-primary text-white" : "text-muted-foreground hover:text-white"}`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("hi")}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${language === "hi" ? "bg-primary text-white" : "text-muted-foreground hover:text-white"}`}
            >
              हिन्दी
            </button>
          </div>

          {analysis?.riskLevel && (
            <div className={`px-4 py-1.5 rounded-lg border flex items-center gap-2 text-[10px] font-black uppercase tracking-wider ${getRiskColor(analysis.riskLevel)}`}>
              Risk: {analysis.riskLevel}
            </div>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => uploadRef.current?.click()}
            className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all text-xs font-bold flex items-center gap-1.5"
          >
            <Upload size={14} />
            <span className="hidden lg:inline">Quick Upload</span>
          </motion.button>
          <input 
            ref={uploadRef}
            type="file" 
            className="hidden" 
            accept=".pdf,.txt,.doc,.docx"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleNewUpload(file);
              e.target.value = '';
            }}
          />
        </div>
      </header>

      {/* Main content: Document (LEFT) + Chat (RIGHT) */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Document Panel (LEFT) */}
        <AnimatePresence>
          {showDocPanel && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "50%", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="border-r border-white/5 flex flex-col bg-black/40 backdrop-blur-3xl overflow-hidden relative"
            >
              {/* Document Header */}
              <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <FileText size={14} className="text-primary" />
                  </div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-widest">Document View</h4>
                </div>
              </div>

              {/* Analysis Summary */}
              {analysis && (
                <div className="p-5 border-b border-white/5 bg-gradient-to-b from-primary/[0.03] to-transparent">
                  <div className="glass rounded-2xl p-6 border-primary/20 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
                    <div className="flex items-center gap-2 mb-3">
                      <Zap size={14} className="text-primary animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Executive Summary</span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed italic line-clamp-6">"{analysis.summary}"</p>
                  </div>
                </div>
              )}

              {/* Document Text */}
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <div className="glass rounded-2xl p-6 border border-white/5 bg-black/20">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Source Text Extraction</span>
                    <div className="h-px flex-1 bg-white/5" />
                  </div>
                  <pre className="text-xs text-slate-400 leading-loose whitespace-pre-wrap font-sans selection:bg-primary/30">
                    {extractedText || (language === "en" ? "Processing document text..." : "दस्तावेज़ टेक्स्ट संसाधित किया जा रहा है...")}
                  </pre>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Panel (RIGHT) */}
        <div className={`flex flex-col transition-all duration-300 relative bg-black/10 ${showDocPanel ? "w-1/2" : "w-full"}`}>
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {chatMessages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center shrink-0 mt-1 shadow-lg shadow-primary/5">
                    <Bot size={16} className="text-primary" />
                  </div>
                )}
                <div className={`max-w-[85%] rounded-[1.5rem] px-5 py-4 text-sm shadow-xl ${
                  msg.role === "user"
                    ? "bg-primary text-white rounded-br-none"
                    : "glass border border-white/10 text-slate-200 rounded-bl-none leading-relaxed"
                }`}>
                  <span className="whitespace-pre-wrap">{msg.content}</span>
                  {msg.isStreaming && <span className="inline-block w-1.5 h-4 bg-primary/50 ml-1.5 animate-pulse rounded-full" />}
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-1">
                    <User size={16} className="text-slate-400" />
                  </div>
                )}
              </motion.div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Actions */}
          {chatMessages.length <= 1 && (
            <div className="px-6 pb-4 flex flex-wrap gap-2">
              {[
                language === "en" ? "Summarize key terms" : "मुख्य शर्तों का सारांश",
                language === "en" ? "Any hidden risks?" : "कोई छिपे हुए जोखिम?",
                language === "en" ? "Who are the parties?" : "पक्ष कौन हैं?",
              ].map(q => (
                <button
                  key={q}
                  onClick={() => { setChatInput(q); inputRef.current?.focus(); }}
                  className="text-[10px] px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all font-bold uppercase tracking-wider"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Chat Input */}
          <div className="p-6 border-t border-white/5 bg-black/20">
            <div className="flex items-center gap-3 glass-strong rounded-2xl px-5 py-3 border border-white/10 focus-within:border-primary/50 focus-within:ring-1 ring-primary/20 transition-all shadow-2xl">
              <input
                ref={inputRef}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendChat()}
                disabled={isSending}
                placeholder={language === "en" ? "Ask something about the document..." : "दस्तावेज़ के बारे में कुछ पूछें..."}
                className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-600 focus:outline-none disabled:opacity-50"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSendChat}
                disabled={!chatInput.trim() || isSending}
                className="p-2.5 rounded-xl bg-primary text-white disabled:opacity-20 disabled:grayscale transition-all shadow-lg shadow-primary/20"
              >
                <Send size={18} />
              </motion.button>
            </div>
            <div className="flex justify-center mt-3">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.02] border border-white/5">
                <Globe size={10} className="text-slate-500" />
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  AI Protocol: {language === "en" ? "English" : "हिन्दी"} Mode
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnalysisResults;
