import { blModel } from "@blaxel/vercel";
import { generateText } from "ai";
import fs from "fs";

interface Stream {
  write: (data: string) => void;
  end: () => void;
}

export default async function agent(input: string, stream: Stream) {
  try {
    console.log("Agent received input:", input);

    const system = fs.readFileSync("./src/prompt.md", "utf8");
    const model = await blModel("sandbox-openai");

    const response = await generateText({
      model,
      prompt: `${system}\n\nUser: ${input}`,
    });

    stream.write(response.text);
    stream.end();
  } catch (err: any) {
    console.error("🔥 AGENT ERROR:", err);
    stream.write(`🔥 AGENT ERROR: ${err?.message}`);
    stream.end();
  }
}

