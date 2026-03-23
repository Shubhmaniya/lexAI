import RiskGauge from './RiskGauge';
import RecommendedAction from './RecommendedAction';
import ConfidenceBadge from './ConfidenceBadge';

export default function RichAIBubble({ analysis, confidence, language }) {
  if (!analysis) return null;

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      <div className="bg-[#27272a] border border-[#3f3f46] rounded-3xl p-6 shadow-md transition-all">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold bg-gradient-to-r from-[#8b85ff] to-[#6c63ff] bg-clip-text text-transparent">
            Document Analysis Complete
          </h3>
          {confidence && <ConfidenceBadge confidence={confidence} />}
        </div>
        
        <p className="text-[#e4e4e7] leading-relaxed text-[15px] mb-6 whitespace-pre-wrap">
          {analysis.summary}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-[#1f1f22] rounded-2xl p-5 border border-[#3f3f46] flex flex-col items-center justify-center">
            <h4 className="text-sm font-semibold text-[#a1a1aa] mb-4 uppercase tracking-wider">Risk Assessment</h4>
            <RiskGauge score={analysis.riskScore || 0} />
          </div>
          
          <div className="bg-[#1f1f22] rounded-2xl p-5 border border-[#3f3f46] flex flex-col justify-center">
            <RecommendedAction action={analysis.recommendedAction} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Clauses Against You */}
          <div className="bg-red-950/20 border border-red-900/40 rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">⚠️</span>
              <h3 className="font-semibold text-red-400">Clauses Against You</h3>
            </div>
            {analysis.clausesAgainstUser?.length > 0 ? (
              <ul className="space-y-3">
                {analysis.clausesAgainstUser.map((clause, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-red-200/90 text-[14px] leading-snug">
                    <span className="text-red-500 mt-0.5 mt-0.5 shrink-0 text-xs">◆</span>
                    <span>{clause}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[#a1a1aa] text-sm italic">No restrictive clauses found.</p>
            )}
          </div>

          {/* Clauses For You */}
          <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">✅</span>
              <h3 className="font-semibold text-emerald-400">Clauses For You</h3>
            </div>
            {analysis.clausesForUser?.length > 0 ? (
              <ul className="space-y-3">
                {analysis.clausesForUser.map((clause, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-emerald-200/90 text-[14px] leading-snug">
                    <span className="text-emerald-500 mt-0.5 shrink-0 text-xs">◆</span>
                    <span>{clause}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[#a1a1aa] text-sm italic">No protective clauses found.</p>
            )}
          </div>
        </div>

        {/* Loopholes Section */}
        {(analysis.loopholes?.length > 0 || analysis.missingProtections?.length > 0) && (
          <div className="mt-6 bg-yellow-950/20 border border-yellow-900/40 rounded-2xl p-5 backdrop-blur-sm">
            <h3 className="font-semibold text-yellow-500 mb-4 flex items-center gap-2">
              <span className="text-xl">🔍</span> Loopholes & Missing Protections
            </h3>
            <div className="space-y-4">
              {analysis.loopholes?.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-yellow-600/80 mb-2">Ambiguities / Loopholes</h4>
                  <ul className="space-y-2">
                    {analysis.loopholes.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-yellow-200/90 text-[14px]">
                        <span className="text-yellow-600/70 shrink-0 text-xs mt-1">▸</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {analysis.missingProtections?.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-yellow-600/80 mb-2 mt-4">Missing Standard Protections</h4>
                  <ul className="space-y-2">
                    {analysis.missingProtections.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-yellow-200/90 text-[14px]">
                        <span className="text-yellow-600/70 shrink-0 text-xs mt-1">▸</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
        
      </div>
      
      <p className="text-[#a1a1aa] text-[13px] ml-4 italic border-l-2 border-[#3f3f46] pl-3">
        I've summarized the document and evaluated the core risks above. Feel free to ask me any specific questions!
      </p>
    </div>
  );
}
