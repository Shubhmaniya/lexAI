import Tesseract from 'tesseract.js';

export async function processImageOCR(file, onProgress) {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await Tesseract.recognize(
        file,
        'eng+hin',
        {
          logger: (info) => {
            if (info.status === 'recognizing text' && onProgress) {
              onProgress(info.progress * 100);
            }
          }
        }
      );

      const confidence = result.data.confidence;
      const text = result.data.text;

      resolve({
        text,
        confidence,
        words: result.data.words?.length || 0
      });
    } catch (error) {
      reject(new Error('OCR processing failed: ' + error.message));
    }
  });
}
