import { NextRequest, NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(req: Request, res: Response) {
  const body = await req.json();
  const { message } = body;

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: message,
  });
  return NextResponse.json({ result: completion.data });
}
