import { useEffect, useRef } from 'react';
import RichAIBubble from './RichAIBubble';

export default function ChatThread({ messages, processingState, isTyping, language }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, processingState, isTyping]);

  return (
    <div className="flex flex-col gap-6 pb-8 px-4 w-full">
      {messages.map((msg, i) => {
        const isUser = msg.role === 'user';

        return (
          <div key={msg.id || i} className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div className={`flex gap-3 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>

              {/* AI Avatar */}
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center text-base shrink-0 self-end shadow-lg shadow-accent/20">
                  ⚖️
                </div>
              )}

              {/* Message Content */}
              <div className="flex flex-col gap-1">
                {msg.isDocument && isUser ? (
                  /* User Document Upload Pill */
                  <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl rounded-tr-sm p-4 flex items-center gap-4 shadow-sm">
                    <div className="text-2xl bg-[#141414] p-2.5 rounded-xl border border-[#222]">
                      {msg.fileType === 'pdf' ? '📄' : '🖼️'}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-white max-w-[200px] truncate">{msg.fileName}</p>
                      <p className="text-[11px] text-[#444] mt-1 uppercase tracking-wider font-medium">{msg.fileType} attached</p>
                    </div>
                  </div>
                ) : msg.isAnalysis ? (
                  /* Rich Analysis AI Bubble */
                  <div className="mt-1 w-full max-w-3xl">
                    <RichAIBubble analysis={msg.analysis} confidence={msg.ocrConfidence} text={msg.extractedText} language={language} />
                  </div>
                ) : (
                  /* Standard text bubble */
                  <div className={`text-[14px] leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? 'bg-[#1a1a1a] border border-[#2a2a2a] text-[#f0f0f0] px-5 py-3 rounded-2xl rounded-tr-sm shadow-sm'
                      : 'text-[#d4d4d8] max-w-[90%]'
                  }`}>
                    {msg.content}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Processing indicator */}
      {processingState && (
        <div className="flex w-full justify-start">
          <div className="flex gap-3 flex-row">
            <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center text-base shrink-0 self-end shadow-lg shadow-accent/20 animate-pulse">
              ⚖️
            </div>
            <div className="flex flex-col justify-center px-4 py-3 bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl text-[#555] shadow-sm">
              <span className="text-sm font-medium">
                {processingState.step === 1 && "📥 Document received..."}
                {processingState.step === 2 && "🔍 Reading and extracting text..."}
                {processingState.step === 3 && "✅ Validating document..."}
                {processingState.step === 4 && "🧠 AI is reviewing clauses..."}
              </span>
              {(processingState.step === 2 && processingState.ocrProgress !== null) && (
                <div className="w-48 mt-3 h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-300"
                    style={{width: `${Math.round(processingState.ocrProgress)}%`}}
                  />
                </div>
              )}
              {processingState.error && (
                <div className="flex items-center gap-2 text-red-400 mt-2 text-sm">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  {processingState.error.message || processingState.error}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Typing indicator */}
      {isTyping && !processingState && (
        <div className="flex w-full justify-start">
          <div className="flex gap-3 flex-row">
            <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center text-base shrink-0 self-end shadow-lg shadow-accent/20">
              ⚖️
            </div>
            <div className="flex items-center gap-1.5 px-4 py-3 h-[44px] bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl">
              <div className="typing-dot" />
              <div className="typing-dot" />
              <div className="typing-dot" />
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} className="h-4" />
    </div>
  );
}
