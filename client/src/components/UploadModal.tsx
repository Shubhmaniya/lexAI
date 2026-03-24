import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, CheckCircle, X, Loader2, AlertCircle } from "lucide-react";
import { uploadDocument, analyzeDocument } from "@/lib/api";

type UploadState = "idle" | "dragging" | "uploading" | "processing" | "completed" | "error";

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  documentType: string;
  onSuccess?: (doc: any) => void;
}

const steps = ["Uploading", "Reading PDF", "Analyzing clauses", "Saving insights"];

const UploadModal = ({ open, onClose, documentType, onSuccess }: UploadModalProps) => {
  const [state, setState] = useState<UploadState>("idle");
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    try {
      setState("uploading");
      setError(null);
      setProgress(10);
      
      // Step 1: Upload and extract text
      const uploadResult = await uploadDocument(file);
      setProgress(50);
      setCurrentStep(1);
      
      setState("processing");
      setCurrentStep(2);
      
      // Step 2: Analyze with Claude
      const analysisResult = await analyzeDocument({
        text: uploadResult.extractedText,
        fileName: file.name,
        fileType: 'pdf',
        language: 'en'
      });
      
      setCurrentStep(3);
      setProgress(100);
      setState("completed");
      
      if (onSuccess) {
        onSuccess({
          _id: analysisResult.documentId,
          fileName: file.name,
          analysis: analysisResult.analysis,
          extractedText: uploadResult.extractedText
        });
      }
    } catch (err: any) {
      console.error("Upload/Analysis failed:", err);
      setState("error");
      setError(err.response?.data?.error || err.message || "Failed to process document");
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
    setProgress(0);
    setCurrentStep(0);
    setError(null);
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
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative glass-strong rounded-2xl p-8 w-full max-w-lg"
          >
            {/* Close */}
            <button onClick={handleClose} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors">
              <X size={18} />
            </button>

            <h2 className="text-xl font-semibold mb-1">{documentType}</h2>
            <p className="text-sm text-muted-foreground mb-6">Upload your document for AI analysis</p>

            {state === "idle" && (
              <motion.div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center cursor-pointer transition-all duration-300 ${
                  dragOver ? "border-primary bg-primary/5 scale-[1.02]" : "border-border hover:border-primary/50 hover:bg-muted/30"
                }`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept=".pdf,.txt"
                />
                <motion.div animate={dragOver ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}>
                  <Upload size={40} className={`mb-4 transition-colors ${dragOver ? "text-primary" : "text-muted-foreground"}`} />
                </motion.div>
                <p className="text-sm font-medium text-foreground">Drop your document here or <span className="text-primary underline underline-offset-4">click to upload</span></p>
                <p className="text-xs text-muted-foreground mt-1">PDF, TXT up to 10MB</p>
              </motion.div>
            )}

            {state === "uploading" && (
              <div className="py-8">
                <div className="flex items-center gap-3 mb-4">
                  <FileText size={20} className="text-primary" />
                  <span className="text-sm font-medium">Uploading document...</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">{progress}%</p>
              </div>
            )}

            {state === "processing" && (
              <div className="py-8">
                <div className="flex items-center gap-3 mb-6">
                  <Loader2 size={20} className="text-primary animate-spin" />
                  <span className="text-sm font-medium">Analyzing your document…</span>
                </div>
                <div className="space-y-3">
                  {steps.map((step, i) => (
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      {i < currentStep ? (
                        <CheckCircle size={16} className="text-green-400" />
                      ) : i === currentStep ? (
                        <motion.div
                          className="w-4 h-4 rounded-full bg-primary"
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-muted" />
                      )}
                      <span className={`text-sm ${i <= currentStep ? "text-foreground" : "text-muted-foreground"}`}>
                        {step}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {state === "completed" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 10 }}
                  className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4"
                >
                  <CheckCircle size={32} className="text-green-400" />
                </motion.div>
                <h3 className="font-semibold text-lg mb-1">Analysis Complete!</h3>
                <p className="text-sm text-muted-foreground">Your document has been analyzed successfully.</p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClose}
                  className="mt-6 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm"
                >
                  View Results
                </motion.button>
              </motion.div>
            )}

            {state === "error" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle size={32} className="text-destructive" />
                </div>
                <h3 className="font-semibold text-lg mb-1 text-destructive">Upload Failed</h3>
                <p className="text-sm text-muted-foreground">{error || "Something went wrong during analysis."}</p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setState("idle")}
                  className="mt-6 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm"
                >
                  Try Again
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UploadModal;
