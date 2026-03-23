export default function RecommendedAction({ action }) {
  const config = {
    SAFE: {
      bg: 'rgba(0, 212, 160, 0.1)',
      border: '#00d4a0',
      icon: '✅',
      label: 'Safe to Sign',
      description: 'This document appears to be fair and balanced. Standard protections are in place.'
    },
    NEGOTIATE: {
      bg: 'rgba(245, 166, 35, 0.1)',
      border: '#f5a623',
      icon: '⚠️',
      label: 'Negotiate First',
      description: 'Some clauses need attention. Consider negotiating before signing.'
    },
    AVOID: {
      bg: 'rgba(255, 79, 79, 0.1)',
      border: '#ff4f4f',
      icon: '🚫',
      label: 'Avoid Signing',
      description: 'This document contains significant risks. Consult a lawyer before proceeding.'
    }
  };

  const c = config[action] || config.NEGOTIATE;

  return (
    <div
      className="fade-in-up rounded-2xl p-5 mb-6 flex items-center gap-4 border"
      style={{ background: c.bg, borderColor: c.border, animationDelay: '0.6s' }}
    >
      <span className="text-3xl">{c.icon}</span>
      <div>
        <p className="text-white font-bold text-lg">{c.label}</p>
        <p className="text-text-secondary text-sm">{c.description}</p>
      </div>
    </div>
  );
}
