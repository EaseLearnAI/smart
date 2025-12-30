<template>
  <nav class="bottom-nav">
    <NuxtLink 
      to="/" 
      class="nav-item" 
      :class="{ active: currentRoute === '/' }"
    >
      <FontAwesomeIcon :icon="['fas', 'microphone-alt']" />
      <span class="nav-label">智能输入</span>
    </NuxtLink>
    <NuxtLink 
      to="/devices" 
      class="nav-item" 
      :class="{ active: currentRoute === '/devices' }"
    >
      <FontAwesomeIcon :icon="['fas', 'th-large']" />
      <span class="nav-label">电器管理</span>
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
const route = useRoute()
const currentRoute = computed(() => route.path)
</script>

<style scoped>
.bottom-nav {
  display: flex;
  background: white;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  padding: 12px 0 28px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 8px;
  color: #adb5bd;
  text-decoration: none;
  transition: all 0.2s ease;
}

.nav-item.active {
  color: #667eea;
}

.nav-item svg {
  font-size: 24px;
  width: 24px;
  height: 24px;
}

.nav-label {
  font-size: 12px;
  font-weight: 500;
}
</style>
