<template>
  <div class="code-block-wrapper my-4">
    <div class="bg-gray-800 rounded-t-lg px-4 py-2 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <UBadge v-if="language" color="teal" variant="soft">{{ language }}</UBadge>
        <span v-if="filename" class="text-sm text-gray-300">{{ filename }}</span>
      </div>
      <UButton
        @click="copyCode"
        icon="i-heroicons-clipboard-document"
        size="xs"
        color="gray"
        variant="ghost"
        :label="copied ? 'Copied!' : 'Copy'"
      />
    </div>
    <div class="relative">
      <MDCRenderer v-if="highlightedCode" :body="highlightedCode" tag="div" class="prose-code" />
      <pre v-else class="bg-gray-900 text-gray-100 p-4 rounded-b-lg overflow-x-auto"><code>{{ code }}</code></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { codeToHtml } from 'shiki'

const props = defineProps<{
  code: string
  language?: string
  filename?: string
}>()

const copied = ref(false)
const highlightedCode = ref<any>(null)

onMounted(async () => {
  if (props.language) {
    try {
      const html = await codeToHtml(props.code, {
        lang: props.language,
        theme: 'github-dark'
      })
      highlightedCode.value = { type: 'root', children: [{ type: 'element', tag: 'div', props: {}, children: [{ type: 'raw', value: html }] }] }
    } catch (e) {
      console.error('Failed to highlight code:', e)
    }
  }
})

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (e) {
    console.error('Failed to copy:', e)
  }
}
</script>

