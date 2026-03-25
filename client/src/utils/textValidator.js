/**
 * Client-side text validation - mirrors server-side checks
 * Returns { valid: boolean, error?: object }
 */
export function validateText(text, ocrConfidence) {
  // CHECK 1 - Minimum length
  if (!text || text.trim().length < 50) {
    return {
      valid: false,
      error: {
        errorType: 'TEXT_TOO_SHORT',
        error: 'Document Seems Incomplete',
        message: 'The extracted text is too short. Please ensure the document contains enough readable content.',
        tips: [
          'Ensure full document is in frame',
          'Check no pages are missing',
          'Try uploading a clearer version'
        ]
      }
    };
  }

  // CHECK 2 - Meaningful content
  const totalChars = text.replace(/\s/g, '').length;
  const meaningfulChars = text.replace(/[^a-zA-Z0-9\u0900-\u097F\s.,;:!?'"()\-]/g, '').replace(/\s/g, '').length;
  const meaningfulRatio = totalChars > 0 ? meaningfulChars / totalChars : 0;

  if (meaningfulRatio < 0.4) {
    return {
      valid: false,
      error: {
        errorType: 'GARBLED_TEXT',
        error: 'Could Not Extract Text',
        message: 'We could not read meaningful text. The file may be a scanned image PDF, corrupted, or unsupported format.',
        tips: [
          'Upload a clearer photo or image',
          'Try photographing the physical document',
          'Ensure document is in English or Hindi',
          'Avoid documents with heavy watermarks'
        ]
      }
    };
  }

  // CHECK 3 - Language detection
  const englishWords = text.match(/\b[a-zA-Z]{3,}\b/g) || [];
  const hindiChars = text.match(/[\u0900-\u097F]/g) || [];

  if (englishWords.length <= 10 && hindiChars.length <= 20) {
    return {
      valid: false,
      error: {
        errorType: 'UNRECOGNIZED_LANGUAGE',
        error: 'Could Not Extract Text',
        message: 'No recognizable English or Hindi content was found in this document.',
        tips: [
          'Ensure the document is in English or Hindi',
          'Upload a clearer version',
          'Try a different format'
        ]
      }
    };
  }

  // CHECK 4 - OCR confidence
  if (ocrConfidence !== undefined && ocrConfidence !== null && ocrConfidence < 60) {
    return {
      valid: false,
      error: {
        errorType: 'LOW_CONFIDENCE',
        error: 'Document Not Readable',
        message: "The image quality is too low for accurate analysis. We've stopped to protect you from incorrect results.",
        tips: [
          'Ensure good lighting when photographing',
          'Hold camera steady to avoid blur',
          'Make sure full document is in frame',
          'Try scanning instead of photographing',
          'For scanned PDFs, ensure 300 DPI or higher'
        ]
      }
    };
  }

  // CHECK 5 - Blank check
  const nonWhitespaceRatio = text.replace(/\s/g, '').length / text.length;
  if (nonWhitespaceRatio < 0.1) {
    return {
      valid: false,
      error: {
        errorType: 'BLANK_DOCUMENT',
        error: 'Document Seems Incomplete',
        message: 'The document appears to be mostly blank with no real content.',
        tips: [
          'Ensure the correct file was uploaded',
          'Check that the document contains text',
          'Try uploading a different version'
        ]
      }
    };
  }

  return { valid: true };
}
