<script setup>
defineProps({
  characters: {
    type: Array,
    required: true,
    default: () => []
  }
})
</script>

<template>
  <div class="p-4">
    <h2 class="text-2xl mb-4">Lead Characters</h2>
    <div class="flex w-full">
      <div 
        v-for="char in characters" 
        :key="char.name"
        class="flex-1 flex flex-col items-center"
      >
        <div class="relative w-full pb-[150%]"> <!-- 2:3 aspect ratio -->
          <img 
            :src="char.image" 
            class="absolute top-0 left-0 w-full h-full object-cover"
            :alt="char.name"
          />
        </div>
        <h3 class="text-xl font-bold mt-2">{{ char.name }}</h3>
      </div>
    </div>
  </div>
</template>
