// Crisis phrases — check locally before any API call
const CRISIS_PHRASES = [
  'want to die', 'kill myself', 'end it all', 'end my life',
  'no reason to live', 'can\'t go on', 'don\'t want to live',
  'want to disappear', 'hopeless', 'suicidal', 'suicide',
  'hurt myself', 'self harm', 'harm myself', 'not worth it',
  'give up on life', 'can\'t take it anymore', 'wish i was dead',
  'better off without me', 'nothing matters anymore',
];

export function detectCrisisLocal(text) {
  const lower = text.toLowerCase();
  return CRISIS_PHRASES.some(phrase => lower.includes(phrase));
}

// All Claude API calls — using fetch directly (avoids CORS issues with SDK in browser)
async function callClaude(systemPrompt, userMessage, maxTokens = 300) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  if (!apiKey || apiKey === 'your_anthropic_api_key_here') {
    // Demo mode — return canned response
    return getDemoResponse(userMessage);
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5',
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `API error ${response.status}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

async function callClaudeChat(systemPrompt, messages, maxTokens = 400) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  if (!apiKey || apiKey === 'your_anthropic_api_key_here') {
    return getDemoChatResponse(messages[messages.length - 1]?.content || '');
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5',
      max_tokens: maxTokens,
      system: systemPrompt,
      messages,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `API error ${response.status}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

// Check-in response
export async function getCheckInResponse(mood, moodLabel, text, language = 'English') {
  const langNote = language === 'Hindi'
    ? 'Respond in simple, warm Hindi (Devanagari script is fine). Mix a little English if needed.'
    : 'Respond in warm, simple English.';

  const systemPrompt = `You are Bridge, a warm and supportive mental wellness companion for Indian youth aged 14–28. You are empathetic, non-judgmental, and never diagnostic.
${langNote}
RULES: Keep response to 2–3 sentences max. Be validating, not prescriptive. Never give medical advice. Never say "you should see a doctor." If mood is Low (2) or Really Struggling (1), ask one gentle follow-up question at the end.`;

  const userMessage = `The user's mood today: ${moodLabel} (score ${mood}/5).
What they shared: "${text || 'They did not add any note.'}"
Please respond to them warmly.`;

  return callClaude(systemPrompt, userMessage, 200);
}

// Conversational chat
export async function getChatResponse(messages, language = 'English', userName = '') {
  const langNote = language === 'Hindi'
    ? 'Respond in warm, simple Hindi. You may mix English naturally.'
    : 'Respond in warm, empathetic English.';

  const systemPrompt = `You are Bridge, a compassionate mental wellness companion for Indian youth. The user's name is ${userName || 'friend'}.
${langNote}
RULES:
- Be warm, gentle, and empathetic. Never clinical.
- You are a support companion, not a therapist. You do not diagnose.
- Never dismiss distress. Always validate feelings.
- Keep responses conversational and concise (2–4 sentences usually).
- If someone seems to be in crisis, gently suggest talking to a counselor (mention iCall: 9152987821).
- You are culturally aware of Indian youth pressures: exams, family expectations, peer pressure, career anxiety.
- Do NOT give medical advice.`;

  return callClaudeChat(systemPrompt, messages, 400);
}

// Weekly reflection
export async function getWeeklyReflection(moodData, language = 'English') {
  const langNote = language === 'Hindi'
    ? 'Write in warm, poetic Hindi.' : 'Write in warm, poetic English.';

  const systemPrompt = `You are Bridge. Generate a brief, warm weekly reflection for a user based on their mood data. 2–3 sentences. Be encouraging, not alarming. ${langNote}`;

  const avgMood = moodData.length
    ? (moodData.reduce((s, e) => s + e.mood, 0) / moodData.length).toFixed(1)
    : 3;
  const lowest = moodData.length ? Math.min(...moodData.map(e => e.mood)) : 3;
  const highest = moodData.length ? Math.max(...moodData.map(e => e.mood)) : 3;

  const userMessage = `This week's mood summary: Average score ${avgMood}/5, lowest day was ${lowest}/5, highest was ${highest}/5. There were ${moodData.length} check-ins.`;

  return callClaude(systemPrompt, userMessage, 150);
}

// Demo mode responses
function getDemoResponse(message) {
  const responses = [
    "Thank you for sharing how you're feeling today. It takes courage to check in with yourself, and I'm really glad you're here. 💜 What's been on your mind lately?",
    "I hear you, and what you're feeling is completely valid. Sometimes our emotions feel bigger than we can carry alone — that's what I'm here for. How long have you been feeling this way?",
    "You showed up today, and that matters more than you know. 🌱 Even on hard days, checking in is a small act of self-care that adds up. What would make today feel a little lighter?",
    "That sounds really tough, and I want you to know you're not alone in feeling this way. Many young people feel the same pressure you're describing. Can you tell me more?",
    "I'm here, and I'm listening. Your feelings deserve space and attention. 💙 What's been the heaviest thing on your heart today?",
  ];
  return new Promise(resolve =>
    setTimeout(() => resolve(responses[Math.floor(Math.random() * responses.length)]), 1200)
  );
}

function getDemoChatResponse(lastMessage) {
  const lower = lastMessage.toLowerCase();
  if (lower.includes('exam') || lower.includes('study') || lower.includes('marks')) {
    return new Promise(resolve => setTimeout(() =>
      resolve("Exam pressure in India is incredibly real — the weight of expectations from family, teachers, and yourself is a lot to carry. 📚 It makes sense that you're feeling overwhelmed. What feels most stressful about it right now?"), 1200));
  }
  if (lower.includes('lonely') || lower.includes('alone') || lower.includes('no one')) {
    return new Promise(resolve => setTimeout(() =>
      resolve("Feeling alone even when surrounded by people is one of the loneliest feelings there is. You're not broken for feeling this way. 💜 Has something specific happened that made loneliness feel stronger lately?"), 1200));
  }
  if (lower.includes('anxi') || lower.includes('worry') || lower.includes('stress')) {
    return new Promise(resolve => setTimeout(() =>
      resolve("Anxiety has a way of making everything feel urgent and overwhelming all at once. Your nervous system is working overtime — that's exhausting. 🌿 When does the anxiety feel heaviest — mornings, evenings, or a specific situation?"), 1200));
  }
  return getDemoResponse(lastMessage);
}
