import { useState, useRef } from 'react';

export default function ChatInputBar({ onSendMessage, onFileSelect, isProcessing }) {
  const [text, setText] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const handleSend = () => {
    if (!text.trim() || isProcessing) return;
    onSendMessage(text.trim());
    setText('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e) => {
    setText(e.target.value);
    // Auto resize
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px';
  };

  const attachFile = (accept) => {
    setMenuOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.accept = accept;
      fileInputRef.current.click();
    }
  };

  return (
    <div className="relative">
      {/* Attachment popover */}
      {menuOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
          <div className="absolute bottom-16 left-0 z-50 bg-[#111] border border-[#222] rounded-2xl overflow-hidden shadow-2xl w-52 animate-fade-in">
            <div className="p-1.5">
              <button
                onClick={() => attachFile('.pdf')}
                className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#1a1a1a] text-[#ccc] hover:text-white transition-all text-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-900/30 border border-blue-800/40 flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-xs">PDF Document</div>
                  <div className="text-[10px] text-[#555]">Contracts, agreements</div>
                </div>
              </button>
              <button
                onClick={() => attachFile('image/*')}
                className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#1a1a1a] text-[#ccc] hover:text-white transition-all text-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-900/30 border border-purple-800/40 flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-xs">Image / Photo</div>
                  <div className="text-[10px] text-[#555]">JPG, PNG, WebP</div>
                </div>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Input bar */}
      <div className={`flex items-end gap-2 bg-[#0f0f0f] border rounded-2xl px-3 py-2.5 shadow-xl transition-all duration-200 ${
        text ? 'border-[#2a2a2a] shadow-[0_0_0_1px_rgba(108,99,255,0.15),0_4px_24px_rgba(0,0,0,0.6)]' : 'border-[#1a1a1a]'
      }`}>
        {/* Attach button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          disabled={isProcessing}
          className={`shrink-0 mb-1 p-2 rounded-xl text-[#444] hover:text-[#888] hover:bg-[#1a1a1a] transition-all disabled:opacity-40 ${menuOpen ? 'text-accent bg-accent/10' : ''}`}
          title="Attach document"
        >
          <svg className="w-5 h-5 -rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </button>

        {/* Hidden file input */}
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={e => {
            if (e.target.files?.[0]) {
              onFileSelect(e.target.files[0]);
              e.target.value = null;
            }
          }}
        />

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={isProcessing ? "Analyzing your document..." : "Ask a legal question or attach a document…"}
          disabled={isProcessing}
          rows={1}
          className="flex-1 bg-transparent text-white placeholder:text-[#333] outline-none resize-none text-sm leading-relaxed py-1.5 max-h-40 disabled:opacity-50"
        />

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!text.trim() || isProcessing}
          className={`shrink-0 mb-1 w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
            text.trim() && !isProcessing
              ? 'bg-accent text-white hover:bg-accent-hover shadow-lg shadow-accent/20 scale-100'
              : 'bg-[#1a1a1a] text-[#333] scale-95'
          }`}
        >
          <svg className="w-4 h-4 translate-x-px" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>

      {/* Bottom hint */}
      {!isProcessing && (
        <p className="text-center text-[#2a2a2a] text-[11px] mt-2">
          Press <kbd className="text-[#333] font-mono">Enter</kbd> to send · <kbd className="text-[#333] font-mono">Shift+Enter</kbd> for new line · <kbd className="text-[#333] font-mono">📎</kbd> to attach a document
        </p>
      )}
    </div>
  );
}
