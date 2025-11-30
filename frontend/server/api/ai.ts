export default defineEventHandler(async (event) => {
  const { input } = await readBody(event);
    console.log("Nuxt API 收到请求:", input)

  try {
    const res = await $fetch("http://localhost:1338/ai", {
      method: "POST",
      body: { input }
    });

    return {
      ok: true,
      data: res
    };
  } catch (err: any) {
    return {
      ok: false,
      error: err?.message || "后端 AI 调用失败"
    };
  }
});
