<script setup>
defineProps({
  loglineData: {
    type: Object,
    required: true,
    default: () => ({
      logline: '',
      genre: '',
      image: '/logline_images/logline_bad-ass-girls.jpeg'
    })
  }
})
</script>

<template>
  <div class="grid grid-cols-2 h-full ">
    <!-- Left side: Logline and Genre -->
    <div class="p-1 flex flex-col justify-start">
      <h1 class="text-4xl font-bold mb-12">Logline</h1>
      
      <div class="text-xl italic mb-8 leading-relaxed">
        {{ loglineData.logline }}
      </div>

      <!-- <div class="text-lg">
        <span class="text-gray-500">Genre: </span>
        <span class="font-semibold">{{ loglineData.genre }}</span>
      </div> -->
    </div>

    <!-- Right side: Image -->
    <div class="h-full">
      <img 
        :src="loglineData.image" 
        :alt="loglineData.genre"
        class="w-full h-full object-cover"
      />
    </div>
  </div>
</template> 