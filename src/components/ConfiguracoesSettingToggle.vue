<script setup lang="ts">
defineProps<{
  icon: string
  title: string
  description: string
  modelValue: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{ 'update:modelValue': [] }>()
</script>

<template>
  <div
    class="flex items-center justify-between p-3.5 border-b border-[#E5D9C3] last:border-b-0 cursor-pointer"
    @click="!disabled && emit('update:modelValue')"
  >
    <div class="flex items-center gap-2.5">
      <span class="text-lg">{{ icon }}</span>
      <div>
        <div
          class="text-[13px] font-bold text-[#1A1008]"
          style="font-family: 'Baloo 2', cursive"
        >
          {{ title }}
        </div>
        <div class="text-[11px] text-[#7A6E5F]">{{ description }}</div>
      </div>
    </div>
    <button
      type="button"
      class="w-10.5 h-6 rounded-xl relative cursor-pointer border-0 transition-colors disabled:opacity-50"
      :class="modelValue ? 'bg-[#1E8C45]' : 'bg-[#E5D9C3]'"
      :disabled="disabled"
      @click.stop="!disabled && emit('update:modelValue')"
    >
      <span
        class="absolute w-5 h-5 bg-white rounded-full top-0.5 shadow-sm transition-all"
        :class="modelValue ? 'right-0.5' : 'left-0.5'"
      />
    </button>
  </div>
</template>
