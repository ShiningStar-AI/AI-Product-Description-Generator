import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// This function handles POST requests to /api/generate
export async function POST(req: Request) {
  // Get the product name from the request body
  const { productName } = await req.json();

  // Make sure we have the API key from the .env.local file
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key not found." }, { status: 500 });
  }

  try {
    // Initialize the AI model with your key
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Create the instruction (prompt) for the AI
    // Short
    //const prompt = `Write a compelling and short marketing description for the following product: "${productName}". Focus on its key benefits.`;
    // Detailed
    const prompt = `Write a detailed and compelling multi-paragraph product description for "${productName}". The description should be optimized for an e-commerce platform. Elaborate on the following key features: ${keyFeatures}. The target audience is ${targetAudience}. The tone must be ${tone} and the style should be ${style}. Aim for a description between 100 and 150 words.`;
    // Ask the AI to generate the content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const description = response.text();

    // Send the generated description back to the frontend
    return NextResponse.json({ description });
    
  } catch (error) {
    // This will log the actual error to your server's terminal
    console.error(error); 
    return NextResponse.json(
      { error: "Failed to generate description." },
      { status: 500 }
    );
  }
}
