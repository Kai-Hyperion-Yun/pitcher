<script setup>
defineProps({
  budgetData: {
    type: Object,
    required: true,
    default: () => ({
      totalBudget: '',
      breakdowns: [],
      notes: []
    })
  }
})
</script>

<template>
  <div class="p-1">
    <!-- Total Budget Header -->
    <div class="text-center mb-3">
      <h3 class="font-bold" style="color: var(--theme-primary)">Total Budget: {{ budgetData.totalBudget }}</h3>
    </div>

    <!-- Budget Breakdown Grid -->
    <div class="grid grid-cols-2 gap-2 mb-5">
      <div 
        v-for="breakdown in budgetData.breakdowns" 
        :key="breakdown.category"
        class="rounded-lg p-1.5"
        :style="{ backgroundColor : 'var(--theme-background)' }"
      >
        <div class="flex justify-between items-center mb-1">
          <h3 class="text-xl font-semibold" style="color: var(--theme-text);">{{ breakdown.category }}</h3>
          <div class="text-right">
            <div class="text-2xl font-bold" style="color: var(--theme-text);">{{ breakdown.amount }}</div>
            <div class="text-sm" style="color: var(--theme-text);">{{ breakdown.percentage }}%</div>
          </div>
        </div>
        <ul class="text-sm space-y-0.5">
          <li 
            v-for="item in breakdown.items" 
            :key="item"
            class="flex items-center"
          >
            <span class="w-2 h-2 rounded-full mr-2" style="background-color: var(--theme-primary);"></span>
            <span style="color: var(--theme-text);">{{ item }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Notes Section -->
    <div class="rounded-lg p-4" style="background-color: var(--theme-secondary);">
      <h3 class="text-lg font-semibold mb-3" style="color: var(--theme-text);">Notes</h3>
      <ul class="space-y-2">
        <li 
          v-for="note in budgetData.notes" 
          :key="note"
          class="flex items-start"
        >
          <span class="mr-2" style="color: var(--theme-primary);">•</span>
          <span style="color: var(--theme-text);">{{ note }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.text-primary {
  color: white;
}
.bg-primary {
  background-color: #3B82F6;
}
</style> 