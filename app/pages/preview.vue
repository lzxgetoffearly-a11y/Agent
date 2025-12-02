<script setup>
import { reactive, ref, onUnmounted } from 'vue'

/* 文案内容 */
const postData = reactive({
  content:
    localStorage.getItem('generatedContent')||'Not generated Text...'
})

// 监听 localStorage 变化，实时更新文案
const handleStorageChange = (e) => {
  if (e.key === 'generatedContent') {
    postData.content = e.newValue || 'Not generated Text...'
  }
}
window.addEventListener('storage', handleStorageChange)
// 组件卸载时清理事件监听
onUnmounted(() => {
  window.removeEventListener('storage', handleStorageChange)
})

/* 上传图片预览 */
const images = ref([])

/* 主 tabs */
const currentMainTab = ref('xiaohongshu')
const mainTabs = [
  { id: 'xiaohongshu', name: 'RedNote Preview (Home Page & Publish Page)' },
  { id: 'wechat', name: 'WeChat Moments Preview (Detail Page & Profile Page)' }
]

/* 文件上传 */
const handleFileUpload = (e) => {
  const files = e.target.files
  Array.from(files).forEach((file) => {
    const url = URL.createObjectURL(file)
    images.value.push(url)
  })
  e.target.value = ''
}

/* 删除图片 */
const removeImage = (idx) => {
  URL.revokeObjectURL(images.value[idx])
  images.value.splice(idx, 1)
}

/* 微信九宫格 */
const getGridClass = (count) => {
  if (count === 1) return 'wx-grid-1'
  if (count === 4) return 'wx-grid-4'
  if (count <= 9) return 'wx-grid-3'
  return 'wx-grid-3'
}
</script>

<template>
<div id="app" class="flex h-full">

    <div class="w-[400px] flex-shrink-0 border-r border-gray-200 bg-white flex flex-col p-8 h-full overflow-y-auto z-20 shadow-xl">
        <h2 class="text-2xl font-bold mb-6 text-black">Input Copy</h2>
        
        <div class="mb-8">
            <textarea 
                v-model="postData.content"
                class="w-full h-48 p-4 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-black focus:border-black outline-none resize-none placeholder-gray-400 shadow-sm"
                placeholder="Enter your copy here..."
            ></textarea>
        </div>

        <h2 class="text-xl font-bold mb-4 text-black">Upload Images</h2>
        
        <div class="flex flex-col gap-4">
            <div class="flex items-center gap-3">
                <label class="px-6 py-3 bg-gray-100 border border-gray-300 rounded-lg text-sm font-bold cursor-pointer hover:bg-gray-200 transition">
                    Select Files
                    <input type="file" multiple accept="image/*" class="hidden" @change="handleFileUpload">
                </label>
                <span class="text-sm text-gray-500 font-medium">{{ images.length > 0 ? `Selected ${images.length} images` : 'No files selected' }}</span>
            </div>

            <div class="grid grid-cols-3 gap-3 mt-2">
                <div v-for="(img, idx) in images" :key="idx" class="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <img :src="img" class="w-full h-full object-cover">
                    <button @click="removeImage(idx)" class="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white text-sm font-bold">删除</button>
                </div>
            </div>
        </div>
    </div>

    <div class="flex-1 bg-white flex flex-col h-full overflow-hidden relative">
        
        <div class="h-16 border-b border-gray-200 flex items-center px-10 gap-10 bg-white sticky top-0 z-10">
            <button 
                v-for="tab in mainTabs" 
                :key="tab.id"
                @click="currentMainTab = tab.id"
                class="h-full text-base font-medium relative transition-colors"
                :class="currentMainTab === tab.id ? 'text-black font-bold' : 'text-gray-400 hover:text-gray-600'"
            >
                {{ tab.name }}
                <div v-if="currentMainTab === tab.id" class="absolute bottom-0 left-0 w-full h-[3px] bg-blue-600"></div>
            </button>
        </div>

        <div class="flex-1 bg-white p-10 overflow-y-auto flex items-start justify-center">
            
            <div v-if="currentMainTab === 'xiaohongshu'" class="flex gap-20 items-start p-5">
                
                <div class="transform scale-[1.25] origin-top-left flex-shrink-0 w-[420px] mt-8">
                    <div class="text-sm font-bold text-gray-800 mb-4 ml-4">Home Page (Two-column Waterfall) Preview</div>
                    
                    <div class="iphone-frame w-[360px] h-[720px]">
                        <div class="dynamic-island"></div>
                        <div class="absolute top-0 w-full h-10 flex items-center justify-between px-4 text-xs font-medium z-10 text-white">
                            <span>12:20</span>
                            <span class="flex items-center gap-1"><i class="ri-signal-fill"></i> 100% <i class="ri-battery-fill"></i></span>
                        </div>
                        
                        <div class="absolute inset-0 pt-10 px-2 pb-5 overflow-y-auto hide-scrollbar bg-white">
                            <div class="sticky top-0 bg-white pt-2 pb-2 z-10">
                                <div class="flex items-center justify-center mb-3 text-lg font-bold">
                                    <span class="text-gray-900 mx-2">Following</span>
                                    <span class="text-black mx-2 border-b-2 border-black">Discover</span>
                                    <span class="text-gray-500 mx-2">Nearby</span>
                                </div>
                            </div>

                            <div class="flex justify-between gap-2 mt-2">
                                <div class="flex flex-col gap-3 w-1/2">
                                    <div class="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 pb-2">
                                        <div class="aspect-[3/4] bg-gray-100 relative">
                                            <img v-if="images.length" :src="images[0]" class="w-full h-full object-cover">
                                            <div v-else class="flex items-center justify-center h-full text-gray-300 text-xs">Image Preview</div>
                                        </div>
                                        <div class="px-2 pt-2">
                                            <div class="text-[11px] font-bold text-gray-900 line-clamp-2 leading-snug mb-1">
                                                {{ postData.content || 'Copy Preview Area...' }}
                                            </div>
                                            <div class="flex justify-between items-center text-[9px] text-gray-500">
                                                <div class="flex items-center gap-1">
                                                    <div class="w-3 h-3 bg-gray-200 rounded-full"></div>
                                                    <span>Bryce</span>
                                                </div>
                                                <span class="flex items-center gap-0.5"><i class="ri-heart-line"></i> 123</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 pb-2">
                                        <div class="aspect-[3/4] bg-gray-300 relative">
                                            <img src="https://picsum.photos/seed/xhs-a/300/400" class="w-full h-full object-cover">
                                        </div>
                                        <div class="px-2 pt-2"><div class="text-[11px] font-bold text-gray-900 line-clamp-2">Simulated Other Post Title</div></div>
                                    </div>
                                </div>
                                
                                <div class="flex flex-col gap-3 w-1/2">
                                    <div class="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 pb-2">
                                        <div class="aspect-[3/4] bg-gray-300 relative">
                                            <img src="https://picsum.photos/seed/xhs-b/300/500" class="w-full h-full object-cover">
                                        </div>
                                        <div class="px-2 pt-2"><div class="text-[11px] font-bold text-gray-900 line-clamp-2">Simulated Other Post Title</div></div>
                                    </div>
                                    <div class="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 pb-2">
                                        <div class="aspect-[3/4] bg-gray-300 relative">
                                            <img src="https://picsum.photos/seed/xhs-c/300/450" class="w-full h-full object-cover">
                                        </div>
                                        <div class="px-2 pt-2"><div class="text-[11px] font-bold text-gray-900 line-clamp-2">Another Popular Post</div></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="transform scale-[1.25] origin-top-left flex-shrink-0 w-[420px] mt-8">
                    <div class="text-sm font-bold text-gray-800 mb-4 ml-4">Publish Page (Detail Page) Preview</div>
                    <div class="iphone-frame w-[360px] h-[720px] bg-white">
                        <div class="dynamic-island"></div>
                        <div class="absolute top-0 w-full h-10 flex items-center justify-between px-4 text-xs font-medium z-10 text-white">
                            <span>12:20</span>
                            <span class="flex items-center gap-1"><i class="ri-signal-fill"></i> 100% <i class="ri-battery-fill"></i></span>
                        </div>
                        
                        <div class="absolute inset-0 pt-10 overflow-y-auto hide-scrollbar preview-content bg-[#111] rounded-3xl">
                            
                            <div class="aspect-[3/4] bg-[#222] relative flex items-center justify-center overflow-hidden">
                                <img v-if="images.length > 0" :src="images[0]" class="w-full h-full object-cover">
                                <div v-else class="text-gray-500 text-sm">Cover Preview</div>
                            </div>

                            <div class="p-5 min-h-[140px] flex flex-col justify-between">
                                <div>
                                    <h3 class="font-bold text-white text-lg mb-2 leading-snug">
                                        {{ postData.content ? postData.content.substring(0, 20) : 'How is 2025 passing so fast' }}...
                                    </h3>
                                    <div class="text-red-400 text-xs mb-4 font-medium">
                                        #ExampleTag #XiaohongshuLayout
                                    </div>
                                </div>

                                <div class="flex justify-between items-center text-gray-400 text-xs border-t border-white/10 pt-3">
                                    <div class="flex items-center gap-2">
                                        <div class="w-5 h-5 rounded-full bg-gray-500"></div>
                                        <span>Bryce</span>
                                    </div>
                                    <div class="flex gap-3">
                                        <span class="flex items-center gap-1"><i class="ri-heart-line"></i> 123</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>


            <div v-if="currentMainTab === 'wechat'" class="flex gap-20 items-start p-5">
                
                <div class="transform scale-[1.25] origin-top-left flex-shrink-0 w-[420px] mt-8">
                    <div class="text-sm font-bold text-gray-800 mb-4 ml-4">WeChat Details Page Preview</div>
                    <div class="iphone-frame w-[360px] h-[720px] bg-white">
                        <div class="dynamic-island"></div>
                        <div class="absolute top-0 w-full h-10 flex items-center justify-between px-4 text-xs font-medium z-10 text-white">
                            <span>23:34</span>
                            <span class="flex items-center gap-1"><i class="ri-signal-fill"></i> 72 <i class="ri-battery-fill"></i></span>
                        </div>

                        <div class="absolute inset-0 pt-10 overflow-y-auto hide-scrollbar preview-content bg-[#111] rounded-3xl p-5">
                            
                            <div class="flex items-center gap-4 mb-4">
                                <div class="w-10 h-10 bg-gray-700 rounded-lg overflow-hidden shrink-0"></div>
                                <div>
                                    <div class="font-bold text-lg text-white tracking-wide">Bryce</div>
                                </div>
                            </div>

                            <div class="text-white text-base mb-4 whitespace-pre-wrap leading-relaxed tracking-wide">
                                {{ postData.content || 'Here is the generated text...' }}
                            </div>

                            <div v-if="images.length > 0" class="wx-grid mb-4" :class="getGridClass(images.length)">
                                <div v-for="(img, idx) in images" :key="idx" 
                                    class="bg-gray-800 rounded-sm overflow-hidden cursor-pointer aspect-square"
                                    :class="images.length === 1 ? 'aspect-auto max-h-[250px]' : ''">
                                    <img :src="img" class="w-full h-full object-cover">
                                </div>
                            </div>

                            <div class="flex justify-between items-center mt-2">
                                <div class="text-gray-400 text-xs font-medium">2025年9月28日 00:34</div>
                                <div class="w-6 h-4 bg-[#2a2a2a] rounded"></div>
                            </div>
                            
                            <div class="mt-3 bg-[#222] rounded px-3 py-2 flex items-center gap-2">
                                <i class="ri-heart-line text-gray-400 text-sm"></i>
                                <div class="text-xs text-gray-400 font-bold"><i class="ri-heart-line"></i>123</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="transform scale-[1.25] origin-top-left flex-shrink-0 w-[420px] mt-8">
                    <div class="text-sm font-bold text-gray-800 mb-4 ml-4">WeChat Moments Page Preview</div>
                    <div class="iphone-frame w-[360px] h-[720px] bg-white">
                        <div class="dynamic-island"></div>
                        <div class="absolute top-0 w-full h-10 flex items-center justify-between px-4 text-xs font-medium z-10 text-white">
                            <span>23:34</span>
                            <span class="flex items-center gap-1"><i class="ri-signal-fill"></i> 72 <i class="ri-battery-fill"></i></span>
                        </div>

                        <div class="absolute inset-0 pt-10 overflow-y-auto hide-scrollbar preview-content bg-[#111] rounded-3xl">
                            
                            <div class="h-40 bg-gray-800 relative mb-14 shrink-0">
                                <img src="https://picsum.photos/seed/cover/800/600" class="w-full h-full object-cover opacity-60">
                                <div class="absolute -bottom-10 right-4 flex gap-4 items-end">
                                    <div class="text-white font-bold mb-4 text-lg drop-shadow-md">Bryce</div>
                                    <div class="w-16 h-16 bg-gray-600 rounded-xl border-4 border-[#111] overflow-hidden shadow-lg"></div>
                                </div>
                            </div>

                            <div class="px-4 flex flex-col gap-6 pb-10">
                                <div class="flex gap-3 items-start">
                                    <div class="w-10 pt-1">
                                        <span class="font-bold text-xl text-white leading-none block">Now</span>
                                    </div>
                                    <div class="flex-1">
                                        <div class="flex gap-2 mb-2 flex-wrap">
                                            <div v-if="images.length > 0" class="w-20 h-20 bg-[#222] overflow-hidden">
                                                <img :src="images[0]" class="w-full h-full object-cover">
                                            </div>
                                            <div v-if="images.length === 0" class="w-20 h-20 bg-[#222] flex items-center justify-center text-gray-600 text-xs">
                                                No images
                                            </div>
                                        </div>
                                        <div class="text-gray-400 text-xs leading-snug line-clamp-2 bg-[#1a1a1a] p-2 rounded h-10" v-if="postData.content">
                                            {{ postData.content }}
                                        </div>
                                    </div>
                                </div>

                                <div class="flex gap-3 items-start opacity-50">
                                    <div class="w-10 pt-1">
                                        <span class="font-bold text-xl text-white leading-none block">23</span>
                                        <span class="text-xs text-gray-400 block mt-0.5">Nov</span>
                                    </div>
                                    <div class="flex-1 flex gap-2">
                                        <div class="w-20 h-20 bg-[#222] overflow-hidden">
                                            <img src="https://picsum.photos/seed/old/200/200" class="w-full h-full object-cover grayscale">
                                        </div>
                                        <div class="text-gray-400 text-xs pt-1 line-clamp-2">
                                            Last year today, gracious！
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</div>

</template>

<!-- ↓↓↓ 你的原 CSS 全部迁移进来 ↓↓↓ -->
<style>
.preview-content {
  background-color: #111111;
  color: white;
  transition: all 0.3s ease;
}

.iphone-frame {
  box-sizing: content-box;
  border: 10px solid #1f2937;
  border-radius: 40px;
  padding: 5px;
  box-shadow: 0 0 0 1px #4b5563, 0 0 0 10px rgba(0, 0, 0, 0.15), 0 20px 50px rgba(0, 0, 0, 0.4);
  position: relative;
  overflow: hidden;
}

.dynamic-island {
  width: 100px;
  height: 25px;
  background: #111111;
  border-radius: 12px;
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
}

.wx-grid {
  display: grid;
  gap: 4px;
}
.wx-grid-1 {
  grid-template-columns: 1fr;
  max-width: 60%;
}
.wx-grid-3 {
  grid-template-columns: repeat(3, 1fr);
  width: 270px;
}
.wx-grid-4 {
  grid-template-columns: repeat(2, 1fr);
  width: 180px;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: 2;
}
</style>
