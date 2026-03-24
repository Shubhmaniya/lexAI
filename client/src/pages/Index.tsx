import { useState, useEffect } from "react";
import LexSidebar from "@/components/LexSidebar";
import Dashboard from "@/components/Dashboard";
import FloatingBackground from "@/components/FloatingBackground";
import { getDocuments } from "@/lib/api";

const Index = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [activeDocument, setActiveDocument] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const data = await getDocuments();
        setDocuments(data.documents || []);
      } catch (err) {
        console.error("Failed to fetch documents:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  const handleDocumentSelect = (doc: any) => {
    setActiveDocument(doc);
  };

  const handleNewAnalysis = () => {
    setActiveDocument(null);
  };

  const handleAnalysisSuccess = (newDoc: any) => {
    setDocuments(prev => [newDoc, ...prev]);
    setActiveDocument(newDoc);
  };

  return (
    <div className="flex min-h-screen w-full">
      <FloatingBackground />
      <LexSidebar 
        documents={documents} 
        activeDocument={activeDocument} 
        onSelect={handleDocumentSelect}
        onNewAnalysis={handleNewAnalysis}
      />
      <Dashboard 
        activeDocument={activeDocument} 
        onAnalysisSuccess={handleAnalysisSuccess}
        onNewAnalysis={handleNewAnalysis}
      />
    </div>
  );
};

export default Index;
