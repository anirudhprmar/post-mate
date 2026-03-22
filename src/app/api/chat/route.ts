import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, convertToModelMessages } from "ai";
import { NextResponse } from "next/server";

// Initialize the Google provider with the API key
const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        const result = streamText({
            model: google("gemini-2.5-flash"),
            messages: await convertToModelMessages(messages),
            system: `You are an expert AI assistant for 'PostSpark', a content creation, planner, and scheduling application for social media. 
               You are brilliant, articulate, and creative. You provide insightful, detailed, and highly formatted responses using markdown. 
               Never be basic or generic. If the user asks for ideas, hooks, or captions, provide multiple highly engaging and distinct options.
               Keep the tone energetic and professional.`,
        });

        return result.toUIMessageStreamResponse({
            sendReasoning: true
        });
    } catch (error) {
        console.log('error', error);
        return new NextResponse(
            JSON.stringify({ error: 'Internal Server Error' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}

