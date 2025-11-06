<template>
  <div class="space-y-3">
    <div class="flex gap-3">
      <UFormField label="Filename" class="flex-1">
        <UInput v-model="localFilename" placeholder="example.js" />
      </UFormField>
      <UFormField label="Language">
        <USelect
          v-model="localLanguage"
          :options="languages"
          placeholder="Select language"
        />
      </UFormField>
    </div>
    <UFormField label="Code">
      <UTextarea
        v-model="localCode"
        rows="15"
        placeholder="Paste your code here..."
        class="font-mono text-sm"
      />
    </UFormField>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  filename?: string
  language?: string
  code?: string
}>()

const emit = defineEmits<{
  update: [{ filename: string; language: string; code: string }]
}>()

const localFilename = ref(props.filename || '')
const localLanguage = ref(props.language || 'javascript')
const localCode = ref(props.code || '')

const languages = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Python', value: 'python' },
  { label: 'Go', value: 'go' },
  { label: 'Rust', value: 'rust' },
  { label: 'Java', value: 'java' },
  { label: 'C++', value: 'cpp' },
  { label: 'C#', value: 'csharp' },
  { label: 'PHP', value: 'php' },
  { label: 'Ruby', value: 'ruby' },
  { label: 'Swift', value: 'swift' },
  { label: 'Kotlin', value: 'kotlin' },
  { label: 'HTML', value: 'html' },
  { label: 'CSS', value: 'css' },
  { label: 'SQL', value: 'sql' },
  { label: 'Bash', value: 'bash' },
  { label: 'JSON', value: 'json' },
  { label: 'YAML', value: 'yaml' },
  { label: 'Markdown', value: 'markdown' },
]

watch([localFilename, localLanguage, localCode], () => {
  emit('update', {
    filename: localFilename.value,
    language: localLanguage.value,
    code: localCode.value,
  })
})
</script>
