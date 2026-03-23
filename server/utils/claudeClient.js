const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const ANALYSIS_SYSTEM_PROMPT = `You are LexAI, an expert legal document analyzer. When given the text of a legal document, analyze it thoroughly and respond ONLY in the following JSON format with no extra text:
{
  "summary": "string (plain English summary 150-200 words)",
  "riskScore": "number (1-10, where 10 is extremely risky)",
  "recommendedAction": "SAFE | NEGOTIATE | AVOID",
  "clausesAgainstUser": ["specific clauses that harm the user"],
  "clausesForUser": ["clauses that protect the user"],
  "loopholes": ["ambiguous or exploitable language"],
  "missingProtections": ["standard clauses that are absent"],
  "summary_hindi": "string (same summary in Hindi)"
}
Return only valid JSON. No markdown, no backticks, no explanation.`;

const getChatSystemPrompt = (documentText) => {
  return `You are LexAI, a friendly legal document assistant. The user has uploaded this legal document:

---
${documentText}
---

Answer the user's questions about this document clearly, simply, and helpfully. Avoid complex legal jargon. Always end every response with:
'Note: This is AI-generated analysis, not official legal advice. Please consult a qualified lawyer for important legal decisions.'`;
};

async function analyzeDocument(documentText, language = 'en') {
  try {
    const languageInstruction = language === 'hi'
      ? '\n\nIMPORTANT: Provide the summary in Hindi. Also provide summary_hindi field.'
      : '';

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: ANALYSIS_SYSTEM_PROMPT + languageInstruction,
      messages: [
        {
          role: 'user',
          content: `Analyze this legal document:\n\n${documentText}`
        }
      ]
    });

    const content = response.content[0].text;

    // Try to parse JSON from the response
    try {
      return JSON.parse(content);
    } catch (parseErr) {
      // Try to extract JSON from response if it has extra text
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Failed to parse AI response as JSON');
    }
  } catch (error) {
    console.error('Claude analysis error:', error);
    throw error;
  }
}

async function chatWithDocument(documentText, messages, language = 'en') {
  try {
    const systemPrompt = getChatSystemPrompt(documentText);
    const languageNote = language === 'hi'
      ? '\n\nPlease respond in Hindi.'
      : '';

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: systemPrompt + languageNote,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    });

    return response.content[0].text;
  } catch (error) {
    console.error('Claude chat error:', error);
    throw error;
  }
}

module.exports = { analyzeDocument, chatWithDocument };
