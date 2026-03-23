export default function DisclaimerBanner() {
  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-secondary/90 border-b border-border py-2 px-4 text-center" style={{ backdropFilter: 'blur(8px)' }}>
      <p className="text-xs text-text-secondary">
        <span className="text-warning-yellow">⚖️ Disclaimer:</span> LexAI is an AI tool and does not provide official legal advice. Consult a qualified lawyer for legal decisions.
      </p>
    </div>
  );
}
