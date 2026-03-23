import RiskGauge from './RiskGauge';

export default function AnalysisCards({ analysis, language }) {
  if (!analysis) return null;

  const summary = language === 'hi' && analysis.summary_hindi ? analysis.summary_hindi : analysis.summary;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {/* Summary Card */}
      <div className="fade-in-up fade-in-up-1 bg-card rounded-2xl p-6 border border-border border-l-4 border-l-accent">
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Summary
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed">{summary}</p>
      </div>

      {/* Risk Score Card */}
      <div className="fade-in-up fade-in-up-2 bg-card rounded-2xl p-6 border border-border flex items-center justify-center"
        style={{ borderLeftWidth: '4px', borderLeftColor: analysis.riskScore <= 3 ? '#00d4a0' : analysis.riskScore <= 7 ? '#f5a623' : '#ff4f4f' }}>
        <RiskGauge score={analysis.riskScore} />
      </div>

      {/* Clauses Against Card */}
      <div className="fade-in-up fade-in-up-3 bg-card rounded-2xl p-6 border border-border border-l-4 border-l-warning-red">
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          <span className="text-warning-red">⚠️</span> Clauses Against You
        </h3>
        {analysis.clausesAgainstUser?.length > 0 ? (
          <ul className="space-y-2">
            {analysis.clausesAgainstUser.map((clause, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                <span className="text-warning-red mt-0.5">⚠️</span>
                <span>{clause}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-text-secondary text-sm">No concerning clauses found.</p>
        )}
      </div>

      {/* Clauses For Card */}
      <div className="fade-in-up fade-in-up-4 bg-card rounded-2xl p-6 border border-border border-l-4 border-l-success">
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          <span className="text-success">✅</span> Clauses For You
        </h3>
        {analysis.clausesForUser?.length > 0 ? (
          <ul className="space-y-2">
            {analysis.clausesForUser.map((clause, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                <span className="text-success mt-0.5">✅</span>
                <span>{clause}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-text-secondary text-sm">No protective clauses found.</p>
        )}
      </div>
    </div>
  );
}
