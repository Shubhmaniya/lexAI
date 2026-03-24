import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, FileText, Globe, ChevronLeft, ChevronRight,
  User, LogOut, Settings, FolderOpen
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface LexSidebarProps {
  documents: any[];
  activeDocument: any;
  onSelect: (doc: any) => void;
  onNewAnalysis: () => void;
}

const LexSidebar = ({ documents, activeDocument, onSelect, onNewAnalysis }: LexSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [lang, setLang] = useState<"EN" | "HI">("EN");

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 300 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="h-screen flex flex-col glass-strong border-r border-white/5 relative z-50 shrink-0 shadow-2xl"
    >
      {/* Header */}
      <div className="p-6 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
          <span className="text-white font-black text-lg">L</span>
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex flex-col"
            >
              <span className="font-bold text-foreground text-xl tracking-tight leading-none">
                Lex<span className="text-gradient">AI</span>
              </span>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.2em] mt-1">
                Legal Intelligence
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* New Analysis Button */}
      <div className="px-4 py-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(124, 58, 237, 0.3)" }}
              whileTap={{ scale: 0.98 }}
              onClick={onNewAnalysis}
              className={`w-full flex items-center gap-3 rounded-xl bg-primary text-white font-semibold transition-all group overflow-hidden relative ${collapsed ? "justify-center p-3" : "px-5 py-4"}`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:animate-shimmer" />
              <Plus size={20} className="relative z-10" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative z-10"
                  >
                    New Analysis
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </TooltipTrigger>
          {collapsed && <TooltipContent side="right">New Analysis</TooltipContent>}
        </Tooltip>
      </div>

      {/* Language Toggle */}
      <div className="px-4 mt-4">
        <div className={`flex rounded-xl bg-white/5 p-1 border border-white/5 ${collapsed ? "flex-col gap-1" : ""}`}>
          {(["EN", "HI"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`flex-1 text-[10px] font-bold py-2 rounded-lg transition-all uppercase tracking-widest ${
                lang === l ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Section */}
      <div className="flex-1 px-4 py-6 overflow-y-auto custom-scrollbar">
        <div className="flex items-center gap-2 px-2 mb-4">
          <FolderOpen size={14} className="text-primary/60 shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]"
              >
                Archive
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          {documents.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-2"
            >
              {documents.map((doc) => (
                <button
                  key={doc._id || doc.id}
                  onClick={() => onSelect(doc)}
                  className={`w-full flex items-center gap-4 rounded-xl p-3 transition-all group border ${
                    activeDocument?._id === doc._id || activeDocument?.id === doc.id
                      ? "bg-primary/10 border-primary/20 text-primary shadow-inner"
                      : "border-transparent text-muted-foreground hover:bg-white/5 hover:text-foreground hover:border-white/5"
                  }`}
                >
                  <div className={`p-2 rounded-lg transition-colors ${
                    activeDocument?._id === doc._id || activeDocument?.id === doc.id
                    ? "bg-primary/20"
                    : "bg-muted group-hover:bg-muted-foreground/10"
                  }`}>
                    <FileText size={16} className="shrink-0" />
                  </div>
                  {!collapsed && (
                    <div className="flex flex-col items-start overflow-hidden">
                      <span className="text-xs font-semibold truncate w-full">
                        {doc.fileName}
                      </span>
                      <span className="text-[10px] opacity-50">
                        {new Date(doc.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </button>
              ))}
            </motion.div>
          ) : !collapsed ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center py-12 px-4 text-center glass rounded-2xl border-dashed border-white/10"
            >
              <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center mb-4">
                <FileText size={20} className="text-muted-foreground/30" />
              </div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">No Data</p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-white/5 bg-white/[0.02]">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`flex items-center gap-4 rounded-xl p-3 hover:bg-white/5 cursor-pointer transition-all ${collapsed ? "justify-center" : ""}`}>
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-muted to-secondary flex items-center justify-center shrink-0 border border-white/5 overflow-hidden">
                  <User size={20} className="text-muted-foreground" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-background" />
              </div>
              <AnimatePresence>
                {!collapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex-1 min-w-0"
                  >
                    <p className="text-sm font-bold truncate">Shubhmaniya</p>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Premium Access</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </TooltipTrigger>
          {collapsed && <TooltipContent side="right">Shubhmaniya</TooltipContent>}
        </Tooltip>
      </div>

      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-secondary border border-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all z-50 shadow-xl group"
      >
        {collapsed ? (
          <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        ) : (
          <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
        )}
      </button>
    </motion.aside>
  );
};

export default LexSidebar;

