import React from "react";
import { motion } from "framer-motion";
import { 
  AlertTriangle, CheckCircle, Info, ArrowLeft, 
  ShieldAlert, ShieldCheck, Zap, MessageSquare 
} from "lucide-react";

interface AnalysisResultsProps {
  document: any;
  onBack: () => void;
}

const AnalysisResults = ({ document, onBack }: AnalysisResultsProps) => {
  const { analysis, fileName } = document;
  
  if (!analysis) return null;

  const getRiskColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "high": return "text-red-500 bg-red-500/10 border-red-500/20";
      case "medium": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "low": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      default: return "text-primary bg-primary/10 border-primary/20";
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level?.toLowerCase()) {
      case "high": return <ShieldAlert size={20} />;
      case "medium": return <AlertTriangle size={20} />;
      case "low": return <ShieldCheck size={20} />;
      default: return <Info size={20} />;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(124,58,237,0.05)_0%,transparent_50%)] pointer-events-none" />
      
      {/* Header */}
      <header className="p-6 border-b border-white/5 flex items-center justify-between glass-strong sticky top-0 z-50 shadow-2xl">
        <div className="flex items-center gap-6">
          <motion.button 
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="p-3 rounded-xl bg-white/5 border border-white/5 transition-all text-muted-foreground hover:text-white"
          >
            <ArrowLeft size={20} />
          </motion.button>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight truncate max-w-[400px]">{fileName}</h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.3em]">Protocol Active: Analysis Results</p>
            </div>
          </div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`px-6 py-2.5 rounded-xl border-2 flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] shadow-lg ${getRiskColor(analysis.riskLevel)}`}
        >
          {getRiskIcon(analysis.riskLevel)}
          Risk Profile: <span className="opacity-80">{analysis.riskLevel || "N/A"}</span>
        </motion.div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8 space-y-12 pb-32 custom-scrollbar relative z-10">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Summary Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary shadow-lg shadow-primary/10">
                <Zap size={20} />
              </div>
              <h3 className="text-2xl font-extrabold tracking-tight text-white">Executive Summary</h3>
            </div>
            <div className="glass p-10 rounded-3xl leading-relaxed text-lg text-slate-300 italic border-primary/20 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative z-10">
                "{analysis.summary}"
              </div>
            </div>
          </motion.section>

          {/* Key Risks and Clauses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400 shadow-lg shadow-red-500/10">
                  <ShieldAlert size={20} />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-white">Critical Red Flags</h3>
              </div>
              <div className="space-y-4">
                {analysis.risks?.map((risk: string, i: number) => (
                  <motion.div 
                    key={i}
                    whileHover={{ x: 8 }}
                    className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-red-500/30 hover:bg-red-500/[0.02] flex gap-4 transition-all duration-300 shadow-xl"
                  >
                    <div className="mt-1 w-2 h-2 rounded-full bg-red-500 shrink-0" />
                    <p className="text-sm font-medium text-slate-400 leading-relaxed">{risk}</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-white">Recommendations</h3>
              </div>
              <div className="space-y-4">
                {analysis.recommendations?.map((rec: string, i: number) => (
                  <motion.div 
                    key={i}
                    whileHover={{ x: -8 }}
                    className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/[0.02] flex gap-4 transition-all duration-300 shadow-xl"
                  >
                    <div className="mt-1 w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <p className="text-sm font-medium text-slate-400 leading-relaxed">{rec}</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;
