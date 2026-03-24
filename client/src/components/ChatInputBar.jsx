import { useState, useRef } from 'react';
import { Paperclip, ArrowUp, FileText, Image } from 'lucide-react';

export default function ChatInputBar({ onSendMessage, onFileSelect, isProcessing }) {
  const [text, setText] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const textareaRef = useRef(null);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || isProcessing) return;
    onSendMessage(trimmed);
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    // Auto-resize textarea
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 160) + 'px';
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
      setShowAttachMenu(false);
    }
    e.target.value = '';
  };

  const canSend = text.trim().length > 0 && !isProcessing;

  return (
    <div className="relative">
      {/* Attach menu */}
      {showAttachMenu && (
        <div className="absolute bottom-full mb-2 left-0 flex flex-col gap-1 bg-[#111] border border-[#1f1f1f] rounded-2xl p-2 shadow-xl z-50 min-w-[180px]">
          <button
            onClick={() => { fileInputRef.current?.click(); }}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#ccc] hover:text-white hover:bg-[#1a1a1a] rounded-xl transition-all"
          >
            <FileText className="w-4 h-4 text-orange-400" />
            Upload PDF
          </button>
          <button
            onClick={() => { imageInputRef.current?.click(); }}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#ccc] hover:text-white hover:bg-[#1a1a1a] rounded-xl transition-all"
          >
            <Image className="w-4 h-4 text-sky-400" />
            Upload Image
          </button>
        </div>
      )}

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Input row */}
      <div
        className="flex items-end gap-2 bg-[#0d0d0d] border border-[#1f1f1f] rounded-2xl px-3 py-2 shadow-lg focus-within:border-[#333] transition-all"
        onClick={() => showAttachMenu && setShowAttachMenu(false)}
      >
        {/* Attach button */}
        <button
          type="button"
          disabled={isProcessing}
          onClick={(e) => { e.stopPropagation(); setShowAttachMenu(v => !v); }}
          className={`shrink-0 mb-0.5 p-2 rounded-xl transition-all ${
            showAttachMenu
              ? 'bg-orange-500/20 text-orange-400'
              : 'text-[#555] hover:text-white hover:bg-[#1a1a1a]'
          } disabled:opacity-40`}
          title="Attach file"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          disabled={isProcessing}
          rows={1}
          placeholder={isProcessing ? 'Processing…' : 'Ask about the document, or attach a file…'}
          className="flex-1 bg-transparent resize-none text-sm text-[#e4e4e7] placeholder:text-[#444] focus:outline-none py-1.5 max-h-40 leading-relaxed disabled:opacity-50"
          style={{ minHeight: '36px' }}
        />

        {/* Send button */}
        <button
          type="button"
          disabled={!canSend}
          onClick={handleSend}
          className={`shrink-0 mb-0.5 p-2 rounded-xl transition-all ${
            canSend
              ? 'bg-orange-500 hover:bg-orange-400 text-white shadow-lg shadow-orange-500/25'
              : 'bg-[#1a1a1a] text-[#333]'
          }`}
          title="Send"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      </div>

      <p className="text-center text-[10px] text-[#2a2a2a] mt-2">
        LexAI may make mistakes. Verify important legal information.
      </p>
    </div>
  );
}
