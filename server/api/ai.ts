export default defineEventHandler(async (event) => {
  const { input } = await readBody(event);
  console.log("Nuxt API 收到请求:", input);

  const res = await fetch('http://localhost:1338/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input })
  });

  const reader = res.body?.getReader();
  const decoder = new TextDecoder();

  return new ReadableStream({
    async start(controller) {
      if (!reader) return controller.close();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        chunk.split("\n\n").forEach(line => {
          if (line.startsWith("data: ")) {
            const data = line.replace(/^data: /, "");
            controller.enqueue(new TextEncoder().encode(data));
          }
        });
      }
      controller.close();
    }
  });
});
