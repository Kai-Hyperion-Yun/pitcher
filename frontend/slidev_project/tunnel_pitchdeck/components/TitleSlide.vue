<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  background: {
    type: String,
    default: 'https://cover.sli.dev',
  },
  titleData: {
    type: Object,
    required: true,
    default: () => ({
      title: '',
      writer: '',
      backgroundImage: 'https://cover.sli.dev',
    })
  }
})

// Define the background style directly
const style = computed(() => {
  // Use the backgroundImage from titleData
  const background = props.titleData.backgroundImage || 'https://cover.sli.dev';
  const isColor = background.startsWith('#') ||
                  background.startsWith('rgb') ||
                  background.startsWith('hsl');
  
  return {
    background: isColor ? background : undefined,
    backgroundImage: isColor ? undefined : `url(${background})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  };
});
</script>

<template>
  <div class="slidev-layout cover" :style="style">
    <div class="my-auto w-full text-center">
      <h1 class="text-7xl font-bold text-white mb-4">
        {{ titleData.title }}
      </h1>
      <h3 class="text-2xl text-gray-300">
        Written by {{ titleData.writer }}
      </h3>
    </div>
  </div>
</template> 