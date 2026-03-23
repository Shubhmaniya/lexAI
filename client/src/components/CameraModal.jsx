import { useState, useRef, useEffect, useCallback } from 'react';

export default function CameraModal({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [captured, setCaptured] = useState(null);
  const [error, setError] = useState(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError('Could not access camera. Please check permissions.');
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg', 0.9);
      setCaptured(imageData);
    }
  };

  const handleRetake = () => {
    setCaptured(null);
  };

  const handleUse = () => {
    if (captured) {
      // Convert data URL to blob
      fetch(captured)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], `camera-capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
          onCapture(file);
        });
    }
  };

  const handleClose = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={handleClose}>
      <div className="relative bg-secondary rounded-2xl overflow-hidden max-w-xl w-full mx-4" onClick={e => e.stopPropagation()}>
        {/* Close button */}
        <button onClick={handleClose} className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {error ? (
          <div className="p-8 text-center">
            <div className="text-4xl mb-4">📷</div>
            <p className="text-warning-red mb-4">{error}</p>
            <button onClick={handleClose} className="px-6 py-2 bg-accent rounded-lg text-white hover:bg-accent-hover transition-colors">
              Close
            </button>
          </div>
        ) : captured ? (
          /* Preview captured image */
          <div className="flex flex-col">
            <img src={captured} alt="Captured" className="w-full" />
            <div className="p-4 flex gap-3">
              <button onClick={handleRetake} className="flex-1 py-3 rounded-xl border border-border text-text-secondary hover:text-white hover:border-accent transition-all flex items-center justify-center gap-2">
                🔄 Retake
              </button>
              <button onClick={handleUse} className="flex-1 py-3 rounded-xl bg-accent text-white hover:bg-accent-hover transition-all flex items-center justify-center gap-2 font-semibold">
                ✅ Use this photo
              </button>
            </div>
          </div>
        ) : (
          /* Live camera */
          <div className="flex flex-col">
            <video ref={videoRef} autoPlay playsInline className="w-full" />
            <canvas ref={canvasRef} className="hidden" />
            <div className="p-4 flex flex-col gap-2">
              <button onClick={handleClose} className="w-full py-2 rounded-xl border border-border text-text-secondary hover:text-white transition-all text-sm">
                Cancel
              </button>
              <button onClick={handleCapture} className="w-full py-3 rounded-xl bg-accent text-white hover:bg-accent-hover transition-all font-semibold flex items-center justify-center gap-2">
                📸 Capture
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
