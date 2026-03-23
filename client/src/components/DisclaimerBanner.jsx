export default function DisclaimerBanner() {
  return (
    <div className="bg-[#050505]/90 border-b border-[#141414] py-1.5 px-4 text-center" style={{ backdropFilter: 'blur(8px)' }}>
      <p className="text-[11px] text-[#444]">
        <span className="text-amber-500/80">⚠️</span>{' '}
        LexAI is an AI tool and <strong className="text-[#555]">does not</strong> provide official legal advice. Consult a qualified lawyer for important decisions.
      </p>
    </div>
  );
}
