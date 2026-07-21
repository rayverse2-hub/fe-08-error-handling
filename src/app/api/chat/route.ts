import { streamText, convertToModelMessages } from "ai";
import { openrouter } from "@/lib/ai";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openrouter("openai/gpt-4o-mini"),
    system: "You are a helpful AI assistant.",
    messages: await convertToModelMessages(messages),
  });

  return result.toTextStreamResponse();
}