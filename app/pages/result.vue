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

let loadingInterval: any = null

// SSE 流式请求，每个字符逐字输出
async function callAI(msg: string, onChar: (char: string) => void, assistantMsg: any) {
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
    if (done){
      localStorage.setItem('generatedContent',assistantMsg.parts[0].text)//使用localStorage暂时存储
      break
    }

    const chunk = decoder.decode(value)
    const lines = chunk.split("\n").map(l => l.trim()).filter(Boolean)

    for (const line of lines) {
      const dataLine = line.startsWith("data: ") ? line.replace(/^data: /, "") : line
      try {
        const data = JSON.parse(dataLine)
        if (data.error === "[DONE]") continue

        // 逐字输出
        await writeChars(data.result, onChar, assistantMsg)
      } catch (e) {
        console.warn("Non-JSON line:", line)
      }
    }
  }
}

async function writeChars(text: string, onChar: (char: string) => void, assistantMsg: any, maxLineLength = 80 ) {
  let currentLineLength = 0;
  for (const char of text) {
    //换行逻辑
    if (currentLineLength >= maxLineLength || char === '\n') {
      const newLine = char === '\n' ? '' : '\n'; // 避免重复换行
      if (newLine) {
        onChar(newLine); // 输出自动换行符
        chat.value = { ...chat.value }; 
      }
      currentLineLength = 0; // 重置
    }
    onChar(char)
    chat.value = { ...chat.value }
    if (char !== '\n') {
      currentLineLength++;//非换行符才累计
    }
    await new Promise(r => setTimeout(r, 1)) // 控制每个字符的输出
  } 
  // 打印当前生成的内容（调试用）
  console.log('当前生成的内容：', assistantMsg.parts[0].text)
}

// 发送消息并更新 UI，带动态 Loading
async function sendMessage(msg: string) {
  if (!msg.trim()) return

  // 用户消息
  chat.value.messages.push({
    id: `user-${Date.now()}`,
    role: 'user',
    parts: [{ type: 'text', text: msg }]
  })

  // 助手消息，初始化显示占位提示
  const assistantMsg = {
    id: `assistant-${Date.now()}`,
    role: 'assistant',
    parts: [{ type: 'text', text: "Getting Result" }]
  }
  chat.value.messages.push(assistantMsg)

  // 等待微任务保证 Vue 渲染
  await new Promise(r => setTimeout(r, 0))

  // 开启动态 Loading 动画
  let dotCount = 1
  loadingInterval = setInterval(() => {
    if (!assistantMsg.parts[0]) return
    assistantMsg.parts = [{ type: 'text', text: `Getting Result${'.'.repeat(dotCount)}` }]
    dotCount = dotCount < 3 ? dotCount + 1 : 1
    chat.value = { ...chat.value }
  }, 500)

  // 流式逐字更新
  await callAI(msg, (char) => {
    // 停止 Loading 动画
    if (loadingInterval) {
      clearInterval(loadingInterval)
      loadingInterval = null
    }
    // 如果当前显示还是提示词，先清空
    if (assistantMsg.parts[0].text.startsWith("Getting Result")) {
      assistantMsg.parts = [{ type: 'text', text: '' }]
    }
    assistantMsg.parts = [{ type: 'text', text: assistantMsg.parts[0].text + char }]}, assistantMsg)
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
            label="Theme Preview Generator"
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
