<script setup lang="ts">
import { useModels } from '@/composables/useModels'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const input = ref('')
const loading = ref(false)
const result = ref('')

const { model } = useModels()
const router = useRouter()

async function createChat(prompt: string) {
  input.value = prompt;
  loading.value = true;
  result.value = '';

  let text = '';
  let error = '';

  try {
    // 调用 Nuxt server API
    const res = await $fetch('/api/ai', {
      method: 'POST',
      body: { input: prompt },
    });

    // Fastify 返回格式为 { result: "..." }
    if (res && (res as any).result) {
      text = (res as any).result;
    } else {
      error = '后端未返回结果';
    }
  } catch (err: any) {
    error = err?.message || '网络错误';
  } finally {
    loading.value = false;
  }

  // 无论成功或失败都跳转到 result 页，结果通过 query 传递
  router.push({
    path: '/result',
    query: {
      text,
      error,
    },
  });
}

function onSubmit() {
  console.log('onSubmit triggered', input.value);
  createChat(input.value);
}

const quickChats = [
  {
    label: 'Why use Nuxt UI?',
    icon: 'i-logos-nuxt-icon',
  },
  {
    label: 'Help me create a Vue composable',
    icon: 'i-logos-vue',
  },
  {
    label: 'Tell me more about UnJS',
    icon: 'i-logos-unjs',
  },
  {
    label: 'Why should I consider VueUse?',
    icon: 'i-logos-vueuse',
  },
  {
    label: 'Tailwind CSS best practices',
    icon: 'i-logos-tailwindcss-icon',
  },
  {
    label: 'What is the weather in Bordeaux?',
    icon: 'i-lucide-sun',
  },
  {
    label: 'Show me a chart of sales data',
    icon: 'i-lucide-line-chart',
  },
];
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
