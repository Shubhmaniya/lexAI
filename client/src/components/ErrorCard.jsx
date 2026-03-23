export default function ErrorCard({ errorType, error, message, tips, onRetry }) {
  return (
    <div className="max-w-lg mx-auto my-8 fade-in-up">
      <div className="rounded-2xl p-6 border border-warning-red" style={{ background: '#2d1515' }}>
        <div className="text-center mb-4">
          <span className="text-4xl">⚠️</span>
        </div>
        <h3 className="text-white font-bold text-lg text-center mb-2">{error}</h3>
        <p className="text-text-secondary text-sm text-center mb-5">{message}</p>

        {tips && tips.length > 0 && (
          <div className="mb-5">
            <p className="text-text-secondary text-xs uppercase tracking-wider mb-2 font-medium">Tips to fix this:</p>
            <ul className="space-y-1.5">
              {tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                  <span className="text-accent mt-0.5">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={onRetry}
          className="w-full py-3 rounded-xl bg-accent hover:bg-accent-hover text-white font-semibold transition-all duration-200"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
