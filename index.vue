<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const input = ref('')
const loading = ref(false)

// 进入 result 页面（只负责跳转，不负责请求）
function onSubmit() {
  if (!input.value) return

  router.push({
    path: '/result',
    query: {
      q: input.value
    }
  })
}

// 快捷按钮跳 result（不会重复发送）
function goQuick(text: string) {
  router.push({
    path: '/result',
    query: {
      q: text
    }
  })
}

const quickChats = [
  { label: 'Why use Nuxt UI?', icon: 'i-logos-nuxt-icon' },
  { label: 'Help me create a Vue composable', icon: 'i-logos-vue' },
  { label: 'Tell me more about UnJS', icon: 'i-logos-unjs' },
  { label: 'Why should I consider VueUse?', icon: 'i-logos-vueuse' },
  { label: 'Tailwind CSS best practices', icon: 'i-logos-tailwindcss-icon' },
  { label: 'What is the weather in Bordeaux?', icon: 'i-lucide-sun' },
  { label: 'Show me a chart of sales data', icon: 'i-lucide-line-chart' }
]

function goPreview() {
  router.push('/preview')
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

        <!-- 输入框 -->
        <UChatPrompt
          v-model="input"
          :status="loading ? 'streaming' : 'ready'"
          class="[view-transition-name:chat-prompt]"
          variant="subtle"
          @submit="onSubmit"
        >
          <UChatPromptSubmit color="neutral" />
          <template #footer>
            <ModelSelect />
          </template>
        </UChatPrompt>

        <!-- 快捷按钮 -->
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
            @click="goQuick(quickChat.label)"
          />
        </div>

        <div class="mt-8">
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
      </UContainer>
    </template>
  </UDashboardPanel>
</template>
