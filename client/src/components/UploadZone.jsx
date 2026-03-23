import { useState, useRef } from 'react';
import CameraModal from './CameraModal';

export default function UploadZone({ onFileSelect, onImageCapture }) {
  const [cameraOpen, setCameraOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const pdfInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) onFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const cards = [
    {
      icon: '📄',
      title: 'Upload PDF',
      subtitle: 'From your device',
      accept: '.pdf',
      ref: pdfInputRef,
      onClick: () => pdfInputRef.current?.click()
    },
    {
      icon: '🖼️',
      title: 'Upload Image',
      subtitle: 'JPG, PNG from gallery',
      accept: 'image/*',
      ref: imageInputRef,
      onClick: () => imageInputRef.current?.click()
    },
    {
      icon: '📷',
      title: 'Take Photo',
      subtitle: 'Use camera instantly',
      accept: null,
      onClick: () => setCameraOpen(true)
    }
  ];

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[60vh] px-4"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={() => setDragOver(false)}
    >
      {/* Drag overlay */}
      {dragOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/90 border-4 border-dashed border-accent">
          <div className="text-center">
            <div className="text-6xl mb-4">📥</div>
            <p className="text-xl text-white font-semibold">Drop your document here</p>
          </div>
        </div>
      )}

      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
          Analyze Legal Documents with <span className="text-accent">AI</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-xl mx-auto">
          Upload a contract, agreement, or legal document and get instant AI-powered analysis
        </p>
      </div>

      {/* Upload cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 w-full max-w-2xl mb-8">
        {cards.map((card, i) => (
          <button
            key={i}
            onClick={card.onClick}
            className="group flex flex-col items-center gap-3 p-6 md:p-8 rounded-2xl border-2 border-dashed border-accent/40 bg-secondary/50 hover:border-accent hover:glow-purple transition-all duration-300 cursor-pointer"
          >
            <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{card.icon}</span>
            <span className="text-white font-semibold">{card.title}</span>
            <span className="text-text-secondary text-sm">{card.subtitle}</span>
          </button>
        ))}
      </div>

      {/* Hidden file inputs */}
      <input
        ref={pdfInputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={(e) => e.target.files[0] && onFileSelect(e.target.files[0])}
      />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files[0] && onFileSelect(e.target.files[0])}
      />

      <p className="text-text-secondary text-sm text-center">
        <span className="text-accent">Supported:</span> Rent agreements • Contracts • NDAs • Offer letters • Loan documents
      </p>

      {/* Camera Modal */}
      {cameraOpen && (
        <CameraModal
          onCapture={(imgData) => { setCameraOpen(false); onImageCapture(imgData); }}
          onClose={() => setCameraOpen(false)}
        />
      )}
    </div>
  );
}
