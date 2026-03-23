import { useState, useRef } from 'react';

export default function ChatInputBar({ onSendMessage, onFileSelect, isProcessing }) {
  const [text, setText] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const fileInputRef = useRef(null);

  const handleSend = () => {
    if (!text.trim() || isProcessing) return;
    onSendMessage(text);
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const attachFile = (type) => {
    setMenuOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === 'pdf' ? '.pdf' : 'image/*';
      fileInputRef.current.click();
    }
  };

  return (
    <div className="relative bg-[#1f1f22] border border-[#27272a] rounded-2xl flex items-end p-2 px-3 shadow-lg focus-within:ring-1 focus-within:ring-[#52525b] transition-all">
      {/* Attachment popover */}
      {menuOpen && (
        <div className="absolute bottom-16 left-0 bg-[#27272a] border border-[#3f3f46] shadow-xl rounded-xl w-48 p-2 z-50 overflow-hidden flex flex-col items-start text-sm">
          <button onClick={() => attachFile('pdf')} className="w-fulltext-left flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#3f3f46] text-[#e4e4e7] transition-all">
            <span className="text-lg">📄</span> PDF Document
          </button>
          <button onClick={() => attachFile('image')} className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#3f3f46] text-[#e4e4e7] transition-all">
            <span className="text-lg">🖼️</span> Image/Photo
          </button>
        </div>
      )}

      {/* Attachment Button */}
      <button 
        onClick={() => setMenuOpen(!menuOpen)}
        disabled={isProcessing}
        className="p-2.5 rounded-full text-[#a1a1aa] hover:bg-[#3f3f46] hover:text-white transition-all mr-2 disabled:opacity-50 flex items-center justify-center shrink-0 mb-0.5"
      >
        <svg className="w-5 h-5 -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
        </svg>
      </button>

      {/* Hidden File Input */}
      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={e => {
          if (e.target.files?.[0]) {
            onFileSelect(e.target.files[0]);
            e.target.value = null; // reset
          }
        }} 
      />

      {/* Text Area */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={isProcessing ? "Analyzing..." : "Ask a legal question or attach a document..."}
        disabled={isProcessing}
        className="w-full bg-transparent text-[#f4f4f5] placeholder:text-[#71717a] outline-none resize-none py-3 max-h-40 min-h-[44px] text-sm md:text-base pr-2 leading-relaxed"
        rows={text.split('\n').length > 1 ? Math.min(text.split('\n').length, 5) : 1}
      />

      {/* Send Button */}
      <button 
        onClick={handleSend}
        disabled={!text.trim() || isProcessing}
        className="p-2 rounded-full bg-accent text-white hover:bg-accent-hover transition-all disabled:opacity-30 disabled:hover:bg-accent flex items-center justify-center shrink-0 mb-0.5 shadow-md shadow-accent/20"
      >
        <svg className="w-5 h-5 translate-x-px" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>

      {/* Backdrop for mobile menu close */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-black/10" onClick={() => setMenuOpen(false)} />
      )}
    </div>
  );
}
