import { GoogleGenAI } from '@google/genai';

let client;

function getClient() {
  if (!process.env.GEMINI_API_KEY) {
    const err = new Error('Gemini is not configured (missing GEMINI_API_KEY)');
    err.statusCode = 503;
    throw err;
  }
  if (!client) {
    client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return client;
}

export async function mentorChat({ messages, userContext }) {
  const gemini = getClient();
  const system = `You are AI Placement Mentor, a concise coach for Indian campus placements.
User context: ${JSON.stringify(userContext || {})}
Give actionable, short paragraphs. Prefer bullet lists for steps. If asked for code, keep it minimal.`;

  const formattedContents = messages.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));

  const response = await gemini.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: formattedContents,
    config: {
      systemInstruction: system,
      temperature: 0.6,
      maxOutputTokens: 900,
    }
  });

  return response.text || '';
}

export async function mockInterviewTurn({ history, userProfile }) {
  const gemini = getClient();
  const system = `You are a technical interviewer for campus placements.
User profile: ${JSON.stringify(userProfile || {})}
Ask ONE clear question at a time (DSA, CS fundamentals, or HR as appropriate).
After the user answers, respond with:
1) Brief feedback
2) A score from 0-10
3) Next question OR say "SESSION_COMPLETE" if 5+ exchanges done.
Format scores line as: SCORE: X/10`;

  const formattedContents = history.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));

  const response = await gemini.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: formattedContents,
    config: {
      systemInstruction: system,
      temperature: 0.5,
      maxOutputTokens: 600,
    }
  });

  return response.text || '';
}

export async function analyzeResume(text) {
  const gemini = getClient();
  const system = 'You are a resume reviewer for tech placements. Output: (1) Strengths (2) Gaps (3) 5 bullet improvements (4) ATS-style keywords to add. Keep under 350 words.';
  
  const response = await gemini.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      { role: 'user', parts: [{ text: text.slice(0, 12000) }] }
    ],
    config: {
      systemInstruction: system,
      temperature: 0.4,
      maxOutputTokens: 700,
    }
  });

  return response.text || '';
}
