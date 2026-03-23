const pdf = require('pdf-parse');

async function extractTextFromPDF(buffer) {
  try {
    const data = await pdf(buffer);
    return {
      text: data.text,
      numPages: data.numpages,
      info: data.info
    };
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF. The file may be corrupted or password-protected.');
  }
}

module.exports = { extractTextFromPDF };
