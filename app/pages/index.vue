<script setup lang="ts">
import { useModels } from '@/composables/useModels'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const input = ref('')
const loading = ref(false)
const { model } = useModels()
const router = useRouter()

const quickChats = [
  { label: 'Why use Nuxt UI?', icon: 'i-logos-nuxt-icon' },
  { label: 'Help me create a Vue composable', icon: 'i-logos-vue' },
  { label: 'Tell me more about UnJS', icon: 'i-logos-unjs' },
  { label: 'Why should I consider VueUse?', icon: 'i-logos-vueuse' },
  { label: 'Tailwind CSS best practices', icon: 'i-logos-tailwindcss-icon' },
  { label: 'What is the weather in Bordeaux?', icon: 'i-lucide-sun' },
  { label: 'Show me a chart of sales data', icon: 'i-lucide-line-chart' },
]

async function createChat(prompt: string) {
  input.value = prompt
  loading.value = true

  let text = ''
  let error = ''

  try {
    const res = await $fetch('http://localhost:1338/ai', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: { input: prompt },
    })

    text = (res as any).result || ''
    error = (res as any).error || ''
  } catch (err: any) {
    error = err?.message || '网络错误'
  } finally {
    loading.value = false
  }

  // 跳转 result 页，传递用户输入 + 结果 + 错误
  router.push({
    path: '/result',
    query: {
      prompt,
      text,
      error,
    },
  })
}

function onSubmit() {
  createChat(input.value)
}
</script>

<template>
  <UDashboardPanel id="home" :ui="{ body: 'p-0 sm:p-0' }">
    <template #header>
      <DashboardNavbar />
    </template>

    <template #body>
      <UContainer class="flex-1 flex flex-col justify-center gap-4 sm:gap-6 py-8">
        <h1 class="text-3xl sm:text-4xl text-highlighted font-bold">
          How can I help you today?
        </h1>

        <UChatPrompt
          v-model="input"
          :status="loading ? 'streaming' : 'ready'"
          class="[view-transition-name:chat-prompt]"
          variant="subtle"
          @submit="onSubmit"
        >
          <UChatPromptSubmit color="neutral"/>
          <template #footer>
            <ModelSelect v-model="model" />
          </template>
        </UChatPrompt>

        <div class="flex flex-wrap gap-2">
          <UButton
            v-for="quickChat in quickChats"
            :key="quickChat.label"
            :icon="quickChat.icon"
            :label="quickChat.label"
            size="sm"
            color="neutral"
            variant="outline"
            class="rounded-full"
            @click="createChat(quickChat.label)"
          />
        </div>
      </UContainer>
    </template>
  </UDashboardPanel>
</template>
