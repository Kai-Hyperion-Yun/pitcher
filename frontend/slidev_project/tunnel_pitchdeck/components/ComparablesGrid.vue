<script setup>
import { computed } from 'vue'

const props = defineProps({
  comparables: {
    type: Array,
    required: true,
    default: () => []
  }
})

// Compute the number of columns based on the number of comparables
const gridCols = computed(() => {
  const count = props.comparables.length
  if (count <= 3) return count
  if (count === 4) return 4
  return Math.min(5, count)
})

console.log('Number of comparables:', props.comparables.length) // Debug log
console.log('Grid columns:', gridCols.value) // Debug log
</script>

<template>
  <div 
    class="grid gap-4 w-full h-full p-4"
    :style="{
      'grid-template-columns': `repeat(${gridCols}, minmax(0, 1fr))`
    }"
  >
    <div 
      v-for="comp in comparables" 
      :key="comp.title"
      class="flex flex-col items-center"
    >
      <div class="relative w-full pb-[150%] mb-2">
        <img 
          :src="comp.base64Image" 
          class="absolute top-0 left-0 w-full h-full object-cover rounded-lg shadow-lg"
          :alt="comp.title"
        />
      </div>
      <p class="title text-center font-bold">{{ comp.title }}</p>
      <p class="text-center text-sm text-gray-500">{{ comp.budget }}</p>
      <p class="text-center text-sm text-gray-500">{{ comp.revenue }}</p>
    </div>
  </div>
</template>
<style scoped>
.grid {
  grid-template-columns: repeat(4, minmax(200px, 1fr));
}

img {
  aspect-ratio: 2/3;
  object-fit: cover;
  width: 100%;
}

.flex {
  min-height: 400px; /* Adjust as needed */
  justify-content: space-between;
  
}

.title {
  font-size: auto; /* Default size */
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.title:hover {
  white-space: normal;
  overflow: visible;
  text-overflow: clip;
}

@media (max-width: 768px) {
  .title {
    font-size: 1rem; /* Smaller size for smaller screens */
  }
}
</style>