import cors from "@fastify/cors";
import Fastify from "fastify";
import agent from "./agent";

async function main() {
  const app = Fastify({ logger: true });

  await app.register(cors, {
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  });

  // POST /api/ai
  app.post("/ai", async (req, reply) => {
    const { input } = req.body as { input: string };

    let resultText = "";
    let errorText = "";

    try {
      await agent(input, {
        write: (chunk: string) => { resultText += chunk; },
        end: () => {},
      });
    } catch (err: any) {
      console.error("Server caught agent error:", err);
      errorText = err?.message || "Unknown server error";
    }

    return { result: resultText, error: errorText };
  });

  await app.listen({ port: 1338, host: "0.0.0.0" });
  console.log("Backend running: http://localhost:1338");
}

main();
