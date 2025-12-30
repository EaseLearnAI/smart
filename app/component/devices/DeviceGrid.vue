<template>
  <div class="device-section">
    <div class="section-title">{{ title }}</div>
    <div class="device-grid">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
}

defineProps<Props>()
</script>

<style scoped>
.device-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 14px;
  color: #6B7280;
  margin-bottom: 12px;
  font-weight: 500;
}

.device-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

/* 响应式：小屏幕单列 */
@media (max-width: 320px) {
  .device-grid {
    grid-template-columns: 1fr;
  }
}
</style>
