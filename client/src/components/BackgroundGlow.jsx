import React from 'react';

export default function BackgroundGlow() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="glow-blob blob-orange" />
      <div className="glow-blob blob-green" />
      <div className="glow-blob blob-blue" />
      <div className="absolute inset-0 bg-[#05080d]/40 backdrop-blur-[20px]" />
    </div>
  );
}
