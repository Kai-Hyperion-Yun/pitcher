<script setup>
import { computed } from 'vue'

const props = defineProps({
  crew: {
    type: Array,
    required: true,
    default: () => []
  }
})

const gridCols = computed(() => {
    const count = props.crew.length
    return Math.min(4, count)
})
</script>

<template>
    <div
        class="grid gap-4 w-full h-full p-4"
        :style="{
            'grid-template-columns': `repeat(${gridCols}, minmax(0, 1fr))`
        }"
    >
        <div 
        v-for="member in crew"
        :key="member.name"
        class="flex flex-col items-center"
        >
            <div class="relative w-full pb-[100%] mb-2">
                <img
                    :src="member.image"
                    class="absolute top-0 left-0 w-full h-full object-cover rounded-full shadow-lg"
                    :alt="member.name"
                />
            </div>
            <p class="text-lg font-bold mb-0">{{ member.name }}</p>
            <p class="text-sm text-gray-500 mt-0">{{ member.role }}</p>
        </div>
    </div>
</template>