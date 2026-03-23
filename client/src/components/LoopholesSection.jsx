export default function LoopholesSection({ loopholes, missingProtections }) {
  const hasLoopholes = loopholes && loopholes.length > 0;
  const hasMissing = missingProtections && missingProtections.length > 0;

  if (!hasLoopholes && !hasMissing) return null;

  return (
    <div className="fade-in-up bg-card rounded-2xl p-6 border border-border mb-6" style={{ animationDelay: '0.5s' }}>
      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
        <span>🕳️</span> Loopholes & Missing Protections
      </h3>

      {hasLoopholes && (
        <div className="mb-4">
          <p className="text-xs uppercase tracking-wider text-warning-yellow mb-2 font-medium">Potential Loopholes</p>
          <ul className="space-y-2">
            {loopholes.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-warning-yellow mt-0.5 shrink-0">🕳️</span>
                <span className="text-text-secondary px-3 py-1.5 rounded-lg" style={{ background: 'rgba(245, 166, 35, 0.08)' }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasMissing && (
        <div>
          <p className="text-xs uppercase tracking-wider text-warning-yellow mb-2 font-medium">Missing Standard Protections</p>
          <ul className="space-y-2">
            {missingProtections.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-warning-yellow mt-0.5 shrink-0">⚠️</span>
                <span className="text-text-secondary px-3 py-1.5 rounded-lg" style={{ background: 'rgba(245, 166, 35, 0.08)' }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
