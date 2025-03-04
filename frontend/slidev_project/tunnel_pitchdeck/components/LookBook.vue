<script setup>
defineProps({
  section: {
    type: Object,
    required: true,
    default: () => ({
      title: '',
      description: '',
      images: [],
      colorPalette: []
    })
  }
})
</script>

<template>
  <div class="w-full">
    <h2 class="text-2xl font-bold mb-4">{{ section.title }}</h2>
    <p class="text-lg mb-6">{{ section.description }}</p>
    
    <!-- Color Palette -->
    <div v-if="section.colorPalette" class="flex gap-4 mb-6">
      <div 
        v-for="color in section.colorPalette" 
        :key="color"
        class="w-16 h-16 rounded-lg shadow-md"
        :style="{ backgroundColor: color }"
      />
    </div>

    <!-- Reference Images Grid -->
    <div class="grid grid-cols-3 gap-4">
      <div 
        v-for="image in section.images" 
        :key="image.url"
        class="relative"
      >
        <img 
          :src="image.url" 
          class="w-full h-40 object-cover rounded-lg shadow-lg"
          :alt="image.caption"
        />
        <p class="text-sm mt-1">{{ image.caption }}</p>
      </div>
    </div>
  </div>
</template> 