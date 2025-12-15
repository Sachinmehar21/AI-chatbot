  import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const API_KEY = "AIzaSyDwSN4wDp_VR8zC06SqHyOow2hBjgF5f0o"; // direct key ok for demo

    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro", // more stable than flash
    });

    const result = await model.generateContent(message);
    const text = result.response.text();

    return NextResponse.json({ message: text });

  } catch (err) {
    console.error("Gemini Error:", err);
    return NextResponse.json({ error: "Gemini API failed" }, { status: 500 });
  }
}