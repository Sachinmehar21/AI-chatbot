import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }
    if (!request.body) {
      return NextResponse.json({ error: 'Request body required' }, { status: 400 });
    }
    const { message, history } = await request.json();
    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const chat = model.startChat({
      history: history || [],
      generationConfig: { maxOutputTokens: 1000, temperature: 0.7 }
    });
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();
    return NextResponse.json({ message: text, history: chat.getHistory() });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Failed to get response' }, { status: 500 });
  }
} 