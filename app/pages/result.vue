<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { DefineComponent, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProseStreamPre from '../components/prose/PreStream.vue'

const router = useRouter()
const route = useRoute()
const clipboard = useClipboard()
const copied = ref(false)

const input = ref('')
const chat = ref<any>(null)
const components = { pre: ProseStreamPre as unknown as DefineComponent }

function goPreview() { router.push('/preview') }

// 流式请求后端 SSE
async function callAI(msg: string, onChunk: (chunk: string) => void) {
  const res = await fetch('http://localhost:1338/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input: msg })
  })

  const reader = res.body?.getReader()
  const decoder = new TextDecoder()
  if (!reader) return

  while (true) {
    const { value, done } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value)
    chunk.split("\n").forEach(line => {
  line = line.trim()
  if (!line) return

  // 如果有 data: 就截掉，没有也允许
  if (line.startsWith("data: ")) {
    line = line.replace(/^data: /, "")
  }

  try {
    const data = JSON.parse(line)
    if (data.error === "[DONE]") return
    onChunk(data.result)
  } catch (e) {
    console.warn("Non-JSON line:", line)
  }
})
  }
}

// 发送消息并更新 UI
async function sendMessage(msg: string) {
  if (!msg.trim()) return

  // 用户消息
  chat.value.messages.push({
    id: `user-${Date.now()}`,
    role: 'user',
    parts: [{ type: 'text', text: msg }]
  })

  // 助手消息
  const assistantMsg = {
    id: `assistant-${Date.now()}`,
    role: 'assistant',
    parts: [{ type: 'text', text: "" }]
  }
  chat.value.messages.push(assistantMsg)

  // 流式更新文本
  await callAI(msg, (chunk) => {
    assistantMsg.parts[0].text += chunk
    chat.value = { ...chat.value }
  })
}

function handleSubmit(e: Event) {
  e.preventDefault()
  sendMessage(input.value)
  input.value = ''
}

function copy(e: MouseEvent, message: any) {
  clipboard.copy(message.parts.map((p: any) => p.text).join(''))
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

onMounted(() => {
  chat.value = { messages: [] }
  const prompt = (route.query.q as string) || ''
  if (prompt) sendMessage(prompt)
})
</script>

<template>
  <UDashboardPanel id="chat" class="relative" :ui="{ body: 'p-0 sm:p-0' }">
    <template #header><DashboardNavbar /></template>
    <template #body>
      <UContainer class="flex-1 flex flex-col gap-4 sm:gap-6 pt-6 pb-32 items-center">
        <UChatMessages
          :messages="chat?.messages"
          should-auto-scroll
          :assistant="{ actions: [{ label: copied ? 'Copied' : 'Copy', icon: copied ? 'i-lucide-copy-check' : 'i-lucide-copy', onClick: copy }] }"
        >
          <template #content="{ message }">
            <div>
              <template v-for="(part, index) in message.parts" :key="index">
                <pre>{{ part.text }}</pre>
              </template>
            </div>
          </template>
        </UChatMessages>
      </UContainer>

      <div class="fixed left-1/2 transform -translate-x-1/2 bg-white dark:bg-black p-4 border-t border-neutral-200 dark:border-neutral-800 rounded-t-xl shadow-lg" :style="{ bottom:'64px', maxWidth:'640px', width:'95%'}">
        <div class="flex justify-center mb-4">
          <UButton
            label="进入素材预览生成器"
            icon="i-lucide-arrow-right"
            size="lg"
            variant="soft"
            color="neutral"
            class="text-gray-600 hover:text-gray-800 hover:bg-gray-200/60 rounded-xl shadow-sm transition"
            @click="goPreview"
          />
        </div>
        <UChatPrompt v-model="input" variant="subtle" @submit="handleSubmit">
          <UChatPromptSubmit color="neutral"/>
        </UChatPrompt>
      </div>
    </template>
  </UDashboardPanel>
</template>
