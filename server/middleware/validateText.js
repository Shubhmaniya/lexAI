/**
 * Text validation middleware
 * Runs 5 quality checks before allowing text to be sent to AI
 */

function validateText(req, res, next) {
  const { text, ocrConfidence } = req.body;

  if (!text) {
    return res.status(400).json({
      error: 'No text provided',
      errorType: 'NO_TEXT'
    });
  }

  // CHECK 1 - Minimum length: if text < 100 characters
  if (text.trim().length < 100) {
    return res.status(400).json({
      error: 'Document Seems Incomplete',
      errorType: 'TEXT_TOO_SHORT',
      message: 'Only a very small amount of text was extracted. The document may be cut off or partially visible.',
      tips: [
        'Ensure full document is in frame',
        'Check no pages are missing',
        'Try uploading a clearer version'
      ]
    });
  }

  // CHECK 2 - Meaningful content: if >60% characters are symbols/garbled
  const totalChars = text.replace(/\s/g, '').length;
  const meaningfulChars = text.replace(/[^a-zA-Z0-9\u0900-\u097F\s.,;:!?'"()\-]/g, '').replace(/\s/g, '').length;
  const meaningfulRatio = totalChars > 0 ? meaningfulChars / totalChars : 0;

  if (meaningfulRatio < 0.4) {
    return res.status(400).json({
      error: 'Could Not Extract Text',
      errorType: 'GARBLED_TEXT',
      message: 'We could not read meaningful text. The file may be a scanned image PDF, corrupted, or unsupported format.',
      tips: [
        'Upload a clearer photo or image',
        'Try photographing the physical document',
        'Ensure document is in English or Hindi',
        'Avoid documents with heavy watermarks'
      ]
    });
  }

  // CHECK 3 - Language detection: English or Hindi words
  const englishWords = text.match(/\b[a-zA-Z]{3,}\b/g) || [];
  const hindiChars = text.match(/[\u0900-\u097F]/g) || [];
  const hasRecognizableLanguage = englishWords.length > 10 || hindiChars.length > 20;

  if (!hasRecognizableLanguage) {
    return res.status(400).json({
      error: 'Could Not Extract Text',
      errorType: 'UNRECOGNIZED_LANGUAGE',
      message: 'No recognizable English or Hindi content was found in this document.',
      tips: [
        'Ensure the document is in English or Hindi',
        'Upload a clearer version',
        'Try a different format'
      ]
    });
  }

  // CHECK 4 - OCR confidence check
  if (ocrConfidence !== undefined && ocrConfidence !== null && ocrConfidence < 60) {
    return res.status(400).json({
      error: 'Document Not Readable',
      errorType: 'LOW_CONFIDENCE',
      message: 'The image quality is too low for accurate analysis. We\'ve stopped to protect you from incorrect results.',
      tips: [
        'Ensure good lighting when photographing',
        'Hold camera steady to avoid blur',
        'Make sure full document is in frame',
        'Try scanning instead of photographing',
        'For scanned PDFs, ensure 300 DPI or higher'
      ]
    });
  }

  // CHECK 5 - Blank check: mostly whitespace
  const nonWhitespaceRatio = text.replace(/\s/g, '').length / text.length;
  if (nonWhitespaceRatio < 0.1) {
    return res.status(400).json({
      error: 'Document Seems Incomplete',
      errorType: 'BLANK_DOCUMENT',
      message: 'The document appears to be mostly blank with no real content.',
      tips: [
        'Ensure the correct file was uploaded',
        'Check that the document contains text',
        'Try uploading a different version'
      ]
    });
  }

  next();
}

module.exports = validateText;
