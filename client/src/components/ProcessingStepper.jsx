export default function ProcessingStepper({ currentStep, ocrProgress, error }) {
  const steps = [
    { id: 1, icon: '📸', text: 'Image received...' },
    { id: 2, icon: '🔍', text: 'Reading text from document...' },
    { id: 3, icon: '✅', text: 'Text extracted successfully' },
    { id: 4, icon: '🧠', text: 'Analyzing with AI...' },
    { id: 5, icon: '✅', text: 'Analysis complete!' }
  ];

  // For PDF uploads, modify the steps
  const pdfSteps = [
    { id: 1, icon: '📄', text: 'PDF received...' },
    { id: 2, icon: '🔍', text: 'Extracting text from PDF...' },
    { id: 3, icon: '✅', text: 'Text extracted successfully' },
    { id: 4, icon: '🧠', text: 'Analyzing with AI...' },
    { id: 5, icon: '✅', text: 'Analysis complete!' }
  ];

  const activeSteps = currentStep <= 0 ? pdfSteps : steps;

  return (
    <div className="w-full max-w-md mx-auto py-8 px-4">
      <div className="space-y-1">
        {activeSteps.map((step) => {
          const isComplete = step.id < currentStep;
          const isActive = step.id === currentStep;
          const isPending = step.id > currentStep;
          const isError = error && step.id === currentStep;

          return (
            <div key={step.id} className="flex items-start gap-4">
              {/* Step line */}
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-500 ${
                  isError ? 'bg-warning-red/20 ring-2 ring-warning-red' :
                  isComplete ? 'bg-success/20 ring-2 ring-success' :
                  isActive ? 'bg-accent/20 ring-2 ring-accent animate-pulse' :
                  'bg-secondary ring-2 ring-border'
                }`}>
                  {isError ? '⚠️' : isComplete ? '✅' : step.icon}
                </div>
                {step.id < activeSteps.length && (
                  <div className={`w-0.5 h-6 transition-colors duration-500 ${
                    isComplete ? 'bg-success/40' : 'bg-border'
                  }`} />
                )}
              </div>

              {/* Step content */}
              <div className="pt-2">
                <p className={`text-sm font-medium transition-colors duration-300 ${
                  isError ? 'text-warning-red' :
                  isComplete ? 'text-success' :
                  isActive ? 'text-white' :
                  'text-text-secondary/50'
                }`}>
                  {isError ? 'Error occurred' : step.text}
                </p>
                {isActive && step.id === 2 && ocrProgress !== undefined && (
                  <div className="mt-2 w-48">
                    <div className="flex justify-between text-xs text-text-secondary mb-1">
                      <span>Processing</span>
                      <span>{Math.round(ocrProgress)}%</span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all duration-300"
                        style={{ width: `${ocrProgress}%` }}
                      />
                    </div>
                  </div>
                )}
                {isActive && step.id === 4 && (
                  <div className="mt-2 flex gap-1">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
