import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Shield, Upload, Camera } from "lucide-react";
import AnalysisCard from "./AnalysisCard";
import UploadModal from "./UploadModal";

const cards = [
  {
    icon: FileText,
    title: "Employment Contract",
    description: "Analyze employment terms, clauses, and obligations",
    gradient: "bg-gradient-to-br from-primary to-primary/60",
  },
  {
    icon: Shield,
    title: "NDA Analysis",
    description: "Examine confidentiality terms and scope",
    gradient: "bg-gradient-to-br from-emerald-500 to-emerald-500/60",
  },
  {
    icon: Camera,
    title: "Document Photo",
    description: "Upload a photo of any legal document for AI analysis",
    gradient: "bg-gradient-to-br from-amber-500 to-amber-500/60",
  },
  {
    icon: Upload,
    title: "Quick Document Upload",
    description: "Upload any legal document — PDF, TXT, or Word — for instant AI feedback",
    gradient: "bg-gradient-to-br from-accent to-accent/60",
  },
];

import AnalysisResults from "./AnalysisResults";

interface DashboardProps {
  activeDocument: any;
  onAnalysisSuccess: (doc: any) => void;
  onNewAnalysis: () => void;
}

const Dashboard = ({ activeDocument, onAnalysisSuccess, onNewAnalysis }: DashboardProps) => {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("");

  const handleCardClick = (title: string) => {
    setSelectedType(title);
    setUploadOpen(true);
  };

  if (activeDocument) {
    return <AnalysisResults document={activeDocument} onBack={onNewAnalysis} onAnalysisSuccess={onAnalysisSuccess} />;
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen overflow-y-auto relative custom-scrollbar">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.08)_0%,transparent_50%)] pointer-events-none" />
      
      {/* Disclaimer */}
      <div className="px-8 pt-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-primary/80 bg-primary/5 backdrop-blur-md rounded-2xl px-8 py-3 border border-primary/20 max-w-3xl mx-auto shadow-2xl shadow-primary/5"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span>Non-Legal Advice AI Protocol Activated</span>
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pb-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="text-center mb-16 relative"
        >
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-px h-12 bg-gradient-to-b from-transparent to-primary/30" />
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-[10px] font-black uppercase tracking-[0.4em] mb-8 hover:bg-white/10 transition-colors cursor-default">
            <Shield size={12} className="text-primary" />
            Mission Control
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-[1.1] text-white">
            What are we <br />
            <span className="text-gradient">working on</span>?
          </h1>
          <p className="text-muted-foreground text-xl max-w-lg mx-auto font-medium leading-relaxed">
            Initialize your AI-powered legal analysis by selecting a specialized protocol below.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-[900px]">
          {cards.map((card, i) => (
            <AnalysisCard
              key={card.title}
              {...card}
              delay={0.2 + i * 0.1}
              onClick={() => handleCardClick(card.title)}
            />
          ))}
        </div>
        
        {/* Footer info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1 }}
          className="mt-16 flex items-center gap-6"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="text-[10px] font-black uppercase tracking-[0.2em]">Encrypted</div>
            <div className="h-0.5 w-8 bg-primary/40 rounded-full" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="text-[10px] font-black uppercase tracking-[0.2em]">AI-Powered</div>
            <div className="h-0.5 w-8 bg-accent/40 rounded-full" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="text-[10px] font-black uppercase tracking-[0.2em]">Secure</div>
            <div className="h-0.5 w-8 bg-primary/40 rounded-full" />
          </div>
        </motion.div>
      </div>

      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        documentType={selectedType}
        onSuccess={onAnalysisSuccess}
      />
    </div>
  );

};


export default Dashboard;
