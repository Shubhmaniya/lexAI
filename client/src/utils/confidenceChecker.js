/**
 * Evaluate OCR confidence and return badge config
 */
export function checkConfidence(confidence) {
  if (confidence === null || confidence === undefined) {
    return { level: 'unknown', show: false };
  }

  if (confidence > 80) {
    return {
      level: 'high',
      show: true,
      color: '#00d4a0',
      message: 'Document read successfully',
      icon: '✅'
    };
  }

  if (confidence >= 60) {
    return {
      level: 'medium',
      show: true,
      color: '#f5a623',
      message: 'Medium confidence read — some parts may not have been read accurately',
      icon: '⚠️',
      showExtractedText: true
    };
  }

  return {
    level: 'low',
    show: true,
    color: '#ff4f4f',
    message: 'Document not readable — image quality too low',
    icon: '❌',
    blocked: true
  };
}
