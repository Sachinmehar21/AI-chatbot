import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const API_KEY = "AIzaSyC5-q6YFUi8n3iG9po9R9iEeKR0Pn_TqDo"; // put your key here

    const { message, history } = await req.json();
    if (!message) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const chat = model.startChat({
      history: history || [],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    });

    const result = await chat.sendMessage(message);
    const text = result.response.text();

    return NextResponse.json({ message: text });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Gemini API failed" }, { status: 500 });
  }
}