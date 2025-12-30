<template>
  <div class="top-bar" :class="{ 'with-overlay': hasOverlay }">
    <!-- 房间选择器模式 (input/feedback页面) -->
    <div v-if="mode === 'room'" class="room-selector">
      <FontAwesomeIcon :icon="['fas', 'home']" />
      <div>
        <div class="room-name">{{ title }}</div>
        <div v-if="showDropdown" class="room-dropdown">
          点击切换房间 
          <FontAwesomeIcon :icon="['fas', 'chevron-down']" />
        </div>
      </div>
    </div>
    
    <!-- 项目选择器模式 (devices页面) -->
    <div v-else class="project-selector" @click="$emit('select')">
      <h1>{{ title }}</h1>
      <FontAwesomeIcon :icon="['fas', 'chevron-down']" />
    </div>
    
    <!-- 右侧按钮 -->
    <button v-if="showAddButton" class="add-btn" @click="$emit('add')">
      <FontAwesomeIcon :icon="['fas', 'plus']" />
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  mode?: 'room' | 'project'
  title?: string
  showDropdown?: boolean
  showAddButton?: boolean
  hasOverlay?: boolean
}

withDefaults(defineProps<Props>(), {
  mode: 'room',
  title: '客厅',
  showDropdown: false,
  showAddButton: false,
  hasOverlay: false
})

defineEmits<{
  select: []
  add: []
}>()
</script>

<style scoped>
.top-bar {
  padding: 20px 24px;
  background: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.top-bar.with-overlay {
  position: relative;
  z-index: 0;
}

.room-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1a1a1a;
}

.room-selector > svg {
  font-size: 20px;
  width: 20px;
  height: 20px;
  color: #667eea;
}

.room-name {
  font-size: 22px;
  font-weight: 700;
}

.room-dropdown {
  font-size: 14px;
  color: #6c757d;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.room-dropdown svg {
  font-size: 12px;
  width: 12px;
  height: 12px;
}

.project-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #F9FAFB;
  padding: 10px 16px;
  border-radius: 12px;
  cursor: pointer;
  flex: 1;
  max-width: 280px;
}

.project-selector h1 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.project-selector svg {
  color: #6B7280;
  font-size: 14px;
  width: 14px;
  height: 14px;
}

.add-btn {
  width: 48px;
  height: 48px;
  background: #0A84FF;
  border-radius: 50%;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(10, 132, 255, 0.3);
  transition: transform 0.2s ease;
}

.add-btn:active {
  transform: scale(0.95);
}

.add-btn svg {
  width: 20px;
  height: 20px;
}
</style>
