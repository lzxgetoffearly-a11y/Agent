<script setup lang="ts">
import { useModels } from '@/composables/useModels'
import { getTextFromMessage } from '@nuxt/ui/utils/ai'
import { useClipboard } from '@vueuse/core'
import type { DefineComponent, UIMessage } from 'vue'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import ProseStreamPre from '../components/prose/PreStream.vue'

const route = useRoute()
const { model } = useModels()
const clipboard = useClipboard()
const copied = ref(false)

// 顶部显示 index.vue 传来的结果/错误
const text = route.query.text as string || ''
const error = route.query.error as string || ''

const input = ref('')
const chat = ref<any>(null)

const components = { pre: ProseStreamPre as unknown as DefineComponent }


// 发送消息函数
async function sendMessage(msg: string) {
  if (!msg.trim()) return

  // 添加用户消息
  chat.value.messages.push({
    id: `user-${Date.now()}`,
    role: 'user',
    parts: [{ type: 'text', text: msg }],
  })

  try {
    const res = await fetch('http://localhost:1338/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: msg }),
    })

    if (!res.ok) {
      const errText = await res.text()
      throw new Error(errText)
    }

  const raw = await res.text()             // 拿到字符串
  let data: { result?: string; error?: string } = {}

  try {
    data = JSON.parse(raw)                 // ⭐ 解析成对象
  } catch (err) {
    console.error('JSON parse failed:', err)
    data.result = raw                      // 如果解析失败，就原样显示
  }

  const resultText = data.result || ''
  const errorText = data.error || ''

  if (resultText) {
    chat.value.messages.push({
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      parts: [{ type: 'text', text: resultText }],
    })
  }

  if (errorText) {
    chat.value.messages.push({
      id: `error-${Date.now()}`,
      role: 'assistant',
      parts: [{ type: 'text', text: `🔥 ERROR: ${errorText}` }],
    })
  }
   

  } catch (err: any) {
    chat.value.messages.push({
      id: `error-${Date.now()}`,
      role: 'assistant',
      parts: [{ type: 'text', text: err.message || String(err) }],
    })
  }
}

// 输入框提交
function handleSubmit(e: Event) {
  e.preventDefault()
  sendMessage(input.value)
  input.value = ''
}

// 复制消息
function copy(e: MouseEvent, message: UIMessage) {
  clipboard.copy(getTextFromMessage(message))
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

onMounted(async () => {
  chat.value = {
    messages: [],
  }

  const prompt = route.query.prompt as string || ''

  // ⭐ 如果首页传来了 prompt，就主动请求一次后端
  if (prompt) {
    // 先把用户消息放进去
    chat.value.messages.push({
      id: `user-${Date.now()}`,
      role: 'user',
      parts: [{ type: 'text', text: prompt }],
    })
  try {
      const res = await fetch('http://localhost:1338/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: prompt }),
      })

      if (!res.ok) {
        const errText = await res.text()
        throw new Error(errText)
      }

    const raw = await res.text()             // 拿到字符串
    let data: { result?: string; error?: string } = {}

    try {
      data = JSON.parse(raw)                 // ⭐ 解析成对象
    } catch (err) {
      console.error('JSON parse failed:', err)
      data.result = raw                      // 如果解析失败，就原样显示
    }

    const resultText = data.result || ''
    const errorText = data.error || ''

    if (resultText) {
      chat.value.messages.push({
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        parts: [{ type: 'text', text: resultText }],
      })
    }

    if (errorText) {
      chat.value.messages.push({
        id: `error-${Date.now()}`,
        role: 'assistant',
        parts: [{ type: 'text', text: `🔥 ERROR: ${errorText}` }],
      })
    }
    

    } catch (err: any) {
      chat.value.messages.push({
        id: `error-${Date.now()}`,
        role: 'assistant',
        parts: [{ type: 'text', text: err.message || String(err) }],
      })
    }
  }
})

</script>

<template>
  <UDashboardPanel id="chat" class="relative" :ui="{ body: 'p-0 sm:p-0' }">
    <template #header>
      <DashboardNavbar />
    </template>

    <template #body>
      <UContainer class="flex-1 flex flex-col gap-4 sm:gap-6 pt-6 pb-32 items-center">

        <!-- 顶部显示 index.vue 传来的结果/错误 -->
        <div class="w-full max-w-lg flex flex-col gap-2">
          <div
            v-if="text"
            class="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-2xl shadow"
          >
            <p class="text-base whitespace-pre-line">{{ text }}</p>
          </div>

          <div
            v-if="error"
            class="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 p-4 rounded-2xl shadow"
          >
            <p class="text-base">{{ error }}</p>
          </div>
        </div>

        <!-- Chat 消息列表 -->
        <UChatMessages
          should-auto-scroll
          :messages="chat?.messages"
          :status="'ready'"
          :assistant="{ actions: [{ label: copied ? 'Copied' : 'Copy', icon: copied ? 'i-lucide-copy-check' : 'i-lucide-copy', onClick: copy }] }"
          :spacing-offset="160"
          class="lg:pt-(--ui-header-height) pb-4 sm:pb-6 w-full max-w-lg"
        >
          <template #content="{ message }">
            <div class="*:first:mt-0 *:last:mb-0">
              <template v-for="(part, index) in message.parts" :key="`${message.id}-${part.type}-${index}${'state' in part ? `-${part.state}` : ''}`">
                <Reasoning
                  v-if="part.type === 'reasoning'"
                  :text="part.text"
                  :is-streaming="part.state !== 'done'"
                />
                <MDCCached
                  v-else-if="part.type === 'text'"
                  :value="part.text"
                  :cache-key="`${message.id}-${index}`"
                  :components="components"
                  :parser-options="{ highlight: false }"
                  class="*:first:mt-0 *:last:mb-0"
                />
              </template>
            </div>
          </template>
        </UChatMessages>

      </UContainer>

      <!-- 底部发送框 -->
      <div
        class="fixed left-1/2 transform -translate-x-1/2 bg-white dark:bg-black p-4
               border-t border-neutral-200 dark:border-neutral-800 rounded-t-xl shadow-lg"
        :style="{ bottom: 'calc(var(--ui-navbar-height, 64px))', maxWidth: '640px', width: '95%' }"
      >
        <UChatPrompt
          v-model="input"
          variant="subtle"
          class="[view-transition-name:chat-prompt]"
          @submit="handleSubmit"
        >
        <UChatPromptSubmit color="neutral" />
          <!-- <template #footer>
            <ModelSelect v-model="model" />
          </template> -->
        </UChatPrompt>
      </div>

    </template>
  </UDashboardPanel>
</template>