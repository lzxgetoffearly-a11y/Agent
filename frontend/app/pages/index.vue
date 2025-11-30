<script setup lang="ts">
import { useModels } from '@/composables/useModels'
import { nextTick, ref } from 'vue'
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

  // ⭐ 立刻跳转，让 result.vue 自己请求后端
  router.push({
    path: '/result',
    query: { prompt }
  })

  loading.value = false
}

function onSubmit() {
  createChat(input.value)
}

function setQuickChat(label: string) {
  input.value = label
  nextTick(() => {
    // 触发 UI 刷新，如果需要可聚焦输入框
    const el = document.querySelector<HTMLInputElement>('.u-chat-prompt-input')
    el?.focus()
  })
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
          Input needs, AI crafts tailored copy instantly!
        </h1>

        <UChatPrompt
          v-model="input"
          :status="loading ? 'streaming' : 'ready'"
          class="[view-transition-name:chat-prompt]"
          variant="subtle"
          @submit="onSubmit"
        >
          <UChatPromptSubmit color="neutral"/>
         <!--  <template #footer>
            <ModelSelect v-model="model" />
          </template> -->
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
            @click="setQuickChat(quickChat.label)"
          />
        </div>
      </UContainer>
    </template>
  </UDashboardPanel>
</template>