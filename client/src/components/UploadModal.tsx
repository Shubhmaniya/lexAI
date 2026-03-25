import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { uploadDocument } from "@/lib/api";

type UploadState = "idle" | "dragging" | "uploading" | "done" | "error";

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  documentType: string;
  onSuccess?: (doc: any) => void;
}

const UploadModal = ({ open, onClose, documentType, onSuccess }: UploadModalProps) => {
  const [state, setState] = useState<UploadState>("idle");
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    try {
      setState("uploading");
      setError(null);
      setFileName(file.name);
      
      // Step 1: Upload and extract text (no analysis — go straight to chat)
      let extractedText = "";
      let docId = `local-${Date.now()}`;

      try {
        const uploadResult = await uploadDocument(file);
        extractedText = uploadResult.extractedText || "";
        docId = uploadResult.documentId || docId;
      } catch (uploadErr) {
        // Even if upload fails, proceed with empty text
        console.warn("Upload extraction failed, proceeding anyway:", uploadErr);
      }
      
      // Go directly to chat view — no analysis step
      if (onSuccess) {
        onSuccess({
          _id: docId,
          fileName: file.name,
          analysis: null,
          extractedText
        });
      }
      
      handleClose();
    } catch (err: any) {
      console.error("Upload failed:", err);
      setState("error");
      setError(err.message || "Failed to upload document");
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleClose = () => {
    setState("idle");
    setError(null);
    setFileName("");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#0c0c10]/95 backdrop-blur-2xl border border-white/[0.06] rounded-2xl p-7 w-full max-w-md shadow-2xl"
          >
            {/* Close */}
            <button onClick={handleClose} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-colors">
              <X size={16} />
            </button>

            <h2 className="text-lg font-bold text-white mb-1">{documentType}</h2>
            <p className="text-sm text-slate-500 mb-5">Upload your document to start chatting with AI</p>

            {state === "idle" && (
              <motion.div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center cursor-pointer transition-all duration-300 ${
                  dragOver ? "border-primary bg-primary/5 scale-[1.02]" : "border-white/10 hover:border-primary/40 hover:bg-white/[0.02]"
                }`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept=".pdf,.txt,.doc,.docx,.jpg,.jpeg,.png,.webp,image/*,application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                />
                <Upload size={36} className={`mb-3 transition-colors ${dragOver ? "text-primary" : "text-slate-600"}`} />
                <p className="text-sm font-medium text-slate-300">Drop your file here or <span className="text-primary">browse</span></p>
                <p className="text-xs text-slate-600 mt-1">PDF, TXT, Word, Images up to 10MB</p>
              </motion.div>
            )}

            {state === "uploading" && (
              <div className="py-10 flex flex-col items-center">
                <Loader2 size={32} className="text-primary animate-spin mb-4" />
                <p className="text-sm text-white font-medium">Uploading {fileName}...</p>
                <p className="text-xs text-slate-500 mt-1">Preparing your document for chat</p>
              </div>
            )}

            {state === "error" && (
              <div className="py-8 text-center">
                <p className="text-sm text-red-400 mb-4">{error}</p>
                <button
                  onClick={() => setState("idle")}
                  className="px-5 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white hover:bg-white/10 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UploadModal;
