export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const inputs = body.inputs; // 前端就是发的 inputs

  console.log("Nuxt API 收到请求:", inputs);

  try {
    const res = await $fetch("http://localhost:1338/", {
      method: "POST",
      body: { inputs }
    });

    return {
      ok: true,
      result: res.result || res // 返回 result，前端才能显示
    };
  } catch (err: any) {
    return {
      ok: false,
      error: err?.message || "后端 AI 调用失败"
    };
  }
});
