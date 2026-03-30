/**
 * ClawCity - Claude Client via OpenRouter
 * Uses OpenRouter API (free tier) with OpenAI-compatible SDK
 */
import OpenAI from 'openai';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
  throw new Error('OPENROUTER_API_KEY not found in .env. Please set it before running ClawCity.');
}

export function createClient() {
  return new OpenAI({
    apiKey: OPENROUTER_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
      'HTTP-Referer': 'https://github.com/diego31-10/clawcity',
      'X-Title': 'ClawCity',
    },
  });
}

export async function askClaude(client, systemPrompt, userMessage, model = 'anthropic/claude-haiku-4-5') {
  const response = await client.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
    max_tokens: 1024,
  });
  return response.choices[0].message.content;
}
