import { streamText } from 'ai';
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  try {
    const result = await streamText({
      model: openai("gpt-4o"), // Use gpt-4o
      prompt: "Create a list of three relevant and engaging profile messages " +
              "for an anonymous social media platform. Each message should be " +
              "separated by '||'. Keep them short and intriguing.",
    });

    return result.toTextStreamResponse();
  } catch (error) {
    return Response.json({ error: "AI Service Down" }, { status: 500 });
  }
}