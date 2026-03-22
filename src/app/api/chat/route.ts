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
            system: `You are an expert content creator for social media with great writing skills. You know what this platforms audience listens to and what they like. Help Crafting piece of content no explaination straight structured post with proper formatting and line breaks, ready to post. If the post is good reply its already good not need to optimize. Also make sure to support the user's writing style if it is already good, clean and easy to read. `,
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

