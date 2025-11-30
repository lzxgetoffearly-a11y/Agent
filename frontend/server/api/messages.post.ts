export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const db = useDrizzle()

  const msg = await db.insert(tables.messages)
    .values({
      chatId: body.chatId,
      role: body.role,
      content: body.content,
    }).returning()

  return msg[0]
})
