<script setup lang="ts">
import { getTextFromMessage } from '@nuxt/ui/utils/ai'
import { useClipboard } from '@vueuse/core'
import type { DefineComponent, UIMessage } from 'vue'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProseStreamPre from '../components/prose/PreStream.vue'

const router = useRouter()
function goPreview() {
  router.push('/preview')
}

const route = useRoute()
const clipboard = useClipboard()
const copied = ref(false)

const input = ref('')
const chat = ref<any>(null)

const components = { pre: ProseStreamPre as unknown as DefineComponent }

async function callAI(msg: string) {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ inputs: msg })
  })

  const raw = await res.text()
  try {
    return JSON.parse(raw)
  } catch {
    return { result: raw }
  }
}

async function sendMessage(msg: string) {
  if (!msg.trim()) return

  chat.value.messages.push({
    id: `user-${Date.now()}`,
    role: 'user',
    parts: [{ type: 'text', text: msg }]
  })

  const data = await callAI(msg)

  chat.value.messages.push({
    id: `assistant-${Date.now()}`,
    role: 'assistant',
    parts: [{ type: 'text', text: data.result || data.error || 'Unknown error' }]
  })
}

function handleSubmit(e: Event) {
  e.preventDefault()
  sendMessage(input.value)
  input.value = ''
}

function copy(e: MouseEvent, message: UIMessage) {
  clipboard.copy(getTextFromMessage(message))
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}

onMounted(async () => {
  chat.value = { messages: [] }

  const prompt = (route.query.q as string) || ''
  if (!prompt) return

  chat.value.messages.push({
    id: `user-${Date.now()}`,
    role: 'user',
    parts: [{ type: 'text', text: prompt }]
  })

  const data = await callAI(prompt)

  chat.value.messages.push({
    id: `assistant-${Date.now()}`,
    role: 'assistant',
    parts: [{ type: 'text', text: data.result || data.error || 'Unknown error' }]
  })
})
</script>

<template>
  <UDashboardPanel id="chat" class="relative" :ui="{ body: 'p-0 sm:p-0' }">
    <template #header>
      <DashboardNavbar />
    </template>

    <template #body>
      <UContainer class="flex-1 flex flex-col gap-4 sm:gap-6 pt-6 pb-32 items-center">
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
              <template v-for="(part, index) in message.parts" :key="index">
                <MDCCached
                  v-if="part.type === 'text'"
                  :value="part.text"
                  :cache-key="`${message.id}-${index}`"
                  :components="components"
                />
              </template>
            </div>
          </template>
        </UChatMessages>
      </UContainer>

      <div
        class="fixed left-1/2 transform -translate-x-1/2 bg-white dark:bg-black p-4
               border-t border-neutral-200 dark:border-neutral-800 rounded-t-xl shadow-lg"
        :style="{ bottom: 'calc(var(--ui-navbar-height, 64px))', maxWidth: '640px', width: '95%' }"
      >

        <!-- 增加底部外边距 mb-4，让按钮与输入框分开 -->
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

        <UChatPrompt
          v-model="input"
          variant="subtle"
          @submit="handleSubmit"
        >
          <UChatPromptSubmit color="neutral" />
        </UChatPrompt>
      </div>
    </template>
  </UDashboardPanel>
</template>
