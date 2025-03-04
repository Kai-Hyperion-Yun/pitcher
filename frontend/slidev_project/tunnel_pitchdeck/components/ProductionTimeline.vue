<template>
  <div class="text-white">
    <h1 class="text-4xl font-bold mb-8">Production Timeline</h1>
    <div class="relative">
      <ul class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
        <li v-for="(item, index) in timelineData" :key="index" class="relative flex flex-col items-center">
          <!-- Timeline Item -->
          <div class="bg-white p-4 rounded-full shadow text-center text-black mt-12 md:mt-12">
            <div class="text-lg font-semibold">{{ item.phase }}</div>
            <div class="text-sm text-gray-600">{{ item.start }} - {{ item.end }}</div>
          </div>
          <!-- Vertical Line -->
          <div class="w-0.5 h-12 bg-gray-500"></div>
        </li>
      </ul>
      <!-- Horizontal Arrow -->
      <div class="absolute bottom-0 w-full h-2 bg-gray-500">
        <div class="absolute right-0 top--1 transform translate-x-full border-t-8 border-b-8 border-l-8 border-transparent border-l-gray-500"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  timelineData: {
    type: Array,
    required: true,
    default: () => ([
      { phase: 'Pre-Production', start: 'Jan 2024', end: 'Mar 2024' },
      { phase: 'Production', start: 'Apr 2024', end: 'Jun 2024' },
      { phase: 'Post-Production', start: 'Jul 2024', end: 'Sep 2024' },
      { phase: 'Release', start: 'Oct 2024', end: 'Dec 2024' }
    ])
  }
})
</script>