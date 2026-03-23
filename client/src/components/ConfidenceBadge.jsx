export default function ConfidenceBadge({ confidence }) {
  if (confidence === null || confidence === undefined) return null;

  if (confidence > 80) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-success/10 text-success border border-success/20 mb-4">
        ✅ Document read successfully
      </div>
    );
  }

  if (confidence >= 60) {
    return (
      <div className="mb-4">
        <div className="flex items-start gap-2 px-4 py-3 rounded-xl text-sm border border-warning-yellow/30" style={{ background: 'rgba(245, 166, 35, 0.08)' }}>
          <span className="mt-0.5">⚠️</span>
          <div>
            <p className="text-warning-yellow font-medium">Medium Confidence Read</p>
            <p className="text-text-secondary text-xs mt-1">
              Some parts may not have been read accurately. Please verify the extracted text below before trusting this analysis.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
