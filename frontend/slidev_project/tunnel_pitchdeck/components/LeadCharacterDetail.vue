<script setup>
defineProps({
  character: {
    type: Object,
    required: true,
    default: () => ({
      name: '',
      type: '',
      comps: [],
      gender: '',
      age_range: '',
      ethnicity: '',
      description: '',
      image: '' // add image property that is base64 img data
    })
  }
})
</script>

<template>
  <div class="flex w-full h-full gap-8 p-4">
    <!-- Left side: Character Image -->
    <div class="w-1/3">
      <div class="relative w-full pb-[150%]"> <!-- 2:3 aspect ratio -->
        <img 
          :src="character.image"
          :alt="character.name"
          class="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
        />
      </div>
    </div>

    <!-- Right side: Character Details -->
    <div class="w-2/3 flex flex-col gap-2">
      <h2 class="text-3xl font-bold mb-2">{{ character.name }}</h2>
      
      <!-- Basic Info Grid -->
      <div class="grid grid-cols-2 gap-3 mb-3">
        <div class="flex flex-col">
          <span class="text-sm text-gray-500">Role Type</span>
          <span class="font-semibold capitalize">{{ character.type }}</span>
        </div>
        <div class="flex flex-col">
          <span class="text-sm text-gray-500">Gender</span>
          <span class="font-semibold capitalize">{{ character.gender }}</span>
        </div>
        <div class="flex flex-col">
          <span class="text-sm text-gray-500">Age Range</span>
          <span class="font-semibold">{{ character.age_range }}</span>
        </div>
        <div class="flex flex-col">
          <span class="text-sm text-gray-500">Ethnicity</span>
          <span class="font-semibold capitalize">{{ character.ethnicity }}</span>
        </div>
      </div>

      <!-- Casting Comparables -->
      <div class="mb-4">
        <h3 class="text-sm text-gray-500 mb-2">Casting Comparables</h3>
        <div class="flex gap-2 flex-wrap">
          <span 
            v-for="comp in character.comps" 
            :key="comp"
            class="px-3 py-1 bg-gray-600 rounded-full text-sm font-medium"
          >
            {{ comp }}
          </span>
        </div>
      </div>

      <!-- Character Description -->
      <div>
        <h3 class="text-sm text-gray-500 mb-2">Character Description</h3>
        <p class="text-lg leading-relaxed">{{ character.description }}</p>
      </div>
    </div>
  </div>
</template> 