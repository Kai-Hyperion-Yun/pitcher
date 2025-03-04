<script setup>
defineProps({
  frames: {
    type: Array,
    required: true,
    default: () => [],
    // Each frame should have: { image, description, reference }
  }
})
</script>

<template>
  <div class="style-frame-grid">
    <div v-for="(frame, index) in frames" :key="index" class="grid-item">
      <img :src="frame.image" alt="" />
      <!-- <div class="description">{{ frame.description }}</div> -->
      <div class="reference"> Reference: {{ frame.reference }}</div>
    </div>
  </div>
</template>

<style scoped>
.style-frame-grid {
  display: grid;
  /* Adjust columns as needed (here we use auto-fit with a minimum width) */
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  /* Reduce vertical/horizontal gaps */
  gap: 8px;
  /* Add padding so images aren’t flush against the edges */
  padding: 8px;
  /* there should be a padding from top */
  padding-top: 2rem;
  box-sizing: border-box;
}

.grid-item {
  position: relative;
  overflow: hidden;
}

.grid-item img {
  /* Ensure images fill the item but keep aspect ratio */
  width: 100%;
  height: 10rem;
  /* Optionally, set a maximum height to keep consistency */
  max-height: 300px;
  object-fit: cover;
  border-radius: 6px;
}

.reference {
  position: absolute;
  bottom: 4px;
  left: 4px;
  background-color: rgba(0,0,0,0.5);
  color: #fff;
  padding: 4px 8px;
  font-size: 0.6rem;
  border-radius: 4px;
}
</style>