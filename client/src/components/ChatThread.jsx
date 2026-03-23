import { useEffect, useRef } from 'react';
import RichAIBubble from './RichAIBubble';

export default function ChatThread({ messages, processingState, isTyping, language }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, processingState, isTyping]);

  return (
    <div className="flex flex-col gap-8 pb-8 px-4 w-full">
      {messages.map((msg, i) => {
        const isUser = msg.role === 'user';
        
        return (
          <div key={msg.id || i} className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-4 max-w-full md:max-w-[-webkit-fill-available] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
              
              {/* Avatar */}
              {!isUser && (
                <div className="w-8 h-8 rounded-full bg-accent text-white shadow-lg flex items-center justify-center font-bold text-xs shrink-0 select-none">
                  ⚖️
                </div>
              )}

              {/* Message Content */}
              <div className="flex flex-col gap-2">
                {msg.isDocument && isUser ? (
                  /* User Document Upload Pill */
                  <div className="bg-[#27272a] border border-[#3f3f46] rounded-2xl p-4 flex items-center gap-4 text-[#f4f4f5] shadow-sm transform transition-all hover:scale-[1.02]">
                    <div className="text-3xl bg-[#3f3f46] p-3 rounded-xl shadow-inner">
                      {msg.fileType === 'pdf' ? '📄' : '🖼️'}
                    </div>
                    <div>
                      <p className="font-semibold text-sm max-w-[200px] truncate">{msg.fileName}</p>
                      <p className="text-xs text-[#a1a1aa] mt-1 uppercase tracking-wider font-semibold">Attached {msg.fileType}</p>
                    </div>
                  </div>
                ) : msg.isAnalysis ? (
                  /* Rich AI Analysis Widget */
                  <div className="mt-1 w-full max-w-3xl">
                    <RichAIBubble analysis={msg.analysis} confidence={msg.ocrConfidence} text={msg.extractedText} language={language} />
                  </div>
                ) : (
                  /* Standard text bubble */
                  <div className={`px-5 py-3.5 text-[15px] leading-relaxed shadow-sm whitespace-pre-wrap ${
                    isUser 
                      ? 'bg-[#3f3f46] text-[#f4f4f5] rounded-3xl rounded-tr-sm self-end'
                      : 'bg-transparent text-[#e4e4e7] self-start max-w-[90%]'
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
        <div className="flex w-full justify-start mt-2">
          <div className="flex gap-4 max-w-[85%] flex-row">
            <div className="w-8 h-8 rounded-full bg-accent text-white shadow-lg flex items-center justify-center font-bold text-xs shrink-0 animate-pulse">
              ⚖️
            </div>
            <div className="flex flex-col justify-center px-4 py-3 bg-[#18181a] border border-[#27272a] rounded-2xl text-[#a1a1aa] shadow-sm">
              <span className="text-sm font-medium animate-pulse">
                {processingState.step === 1 && "Document received..."}
                {processingState.step === 2 && "Reading text..."}
                {processingState.step === 3 && "Analyzing text..."}
                {processingState.step === 4 && "Generative AI is reviewing clauses..."}
              </span>
              {(processingState.step === 2 && processingState.ocrProgress !== null) && (
                <div className="w-48 mt-3 h-1.5 bg-[#27272a] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(108,99,255,0.5)]" 
                    style={{width: `${Math.round(processingState.ocrProgress)}%`}} 
                  />
                </div>
              )}
              {processingState.error && (
                <span className="text-[#f87171] mt-2 text-sm">
                  ⚠️ Error: {processingState.error.message || processingState.error}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Typing indicator */}
      {isTyping && !processingState && (
        <div className="flex w-full justify-start mt-2">
          <div className="flex gap-4 flex-row">
            <div className="w-8 h-8 rounded-full bg-accent text-white shadow-lg flex items-center justify-center font-bold text-xs shrink-0">
              ⚖️
            </div>
            <div className="flex items-center gap-2 px-4 py-3 h-[44px]">
              <div className="typing-dot" style={{background: '#71717a'}}></div>
              <div className="typing-dot" style={{background: '#71717a'}}></div>
              <div className="typing-dot" style={{background: '#71717a'}}></div>
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} className="h-4" />
    </div>
  );
}
