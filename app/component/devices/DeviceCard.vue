<template>
  <div 
    class="device-card" 
    :class="{ active: isActive }"
    @click="handleClick"
  >
    <div class="device-header">
      <div class="device-icon" :class="iconColor">
        <FontAwesomeIcon :icon="['fas', icon]" />
      </div>
      
      <!-- 控制设备显示开关 -->
      <div 
        v-if="type === 'control'" 
        class="toggle-switch" 
        :class="{ active: isActive }"
        @click.stop="handleToggle"
      />
      
      <!-- 传感器设备显示标签 -->
      <span v-else class="sensor-badge">传感器</span>
    </div>
    
    <div class="device-name">{{ name }}</div>
    <div class="device-status" :class="{ 'status-on': isActive }">
      <template v-if="type === 'control'">
        {{ isActive ? '开启' : '关闭' }}
      </template>
      <template v-else>
        <span v-html="statusDisplay"></span>
      </template>
    </div>
    <div class="device-location">{{ location }}</div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  type?: 'control' | 'sensor'
  name: string
  status?: string
  location: string
  icon: string
  iconColor?: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'cyan' | 'gray'
  active?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'control',
  status: '',
  iconColor: 'blue',
  active: false
})

const emit = defineEmits<{
  toggle: [active: boolean]
  click: []
}>()

const isActive = ref(props.active)

watch(() => props.active, (val) => {
  isActive.value = val
})

const statusDisplay = computed(() => {
  return props.status
})

const handleToggle = () => {
  isActive.value = !isActive.value
  emit('toggle', isActive.value)
}

const handleClick = () => {
  if (props.type === 'sensor') {
    emit('click')
  }
}
</script>

<style scoped>
.device-card {
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 16px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.device-card:active {
  transform: scale(0.98);
  background: #F9FAFB;
}

.device-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.device-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #0A84FF 0%, #0066CC 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.device-icon svg {
  width: 20px;
  height: 20px;
}

.device-icon.green {
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
}

.device-icon.orange {
  background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
}

.device-icon.purple {
  background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
}

.device-icon.red {
  background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
}

.device-icon.cyan {
  background: linear-gradient(135deg, #06B6D4 0%, #0891B2 100%);
}

.device-icon.gray {
  background: linear-gradient(135deg, #6B7280 0%, #4B5563 100%);
}

.device-name {
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 4px;
  color: #0B1226;
}

.device-status {
  font-size: 24px;
  font-weight: 700;
  color: #0A84FF;
  margin-bottom: 4px;
}

.device-status.status-on {
  color: #10B981;
}

.device-location {
  font-size: 13px;
  color: #6B7280;
}

/* Toggle Switch */
.toggle-switch {
  width: 51px;
  height: 31px;
  background: #E5E7EB;
  border-radius: 16px;
  position: relative;
  cursor: pointer;
  transition: background 0.2s;
  flex-shrink: 0;
}

.toggle-switch.active {
  background: #0A84FF;
}

.toggle-switch::after {
  content: '';
  position: absolute;
  width: 27px;
  height: 27px;
  background: white;
  border-radius: 50%;
  top: 2px;
  left: 2px;
  transition: transform 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.toggle-switch.active::after {
  transform: translateX(20px);
}

/* Sensor Badge */
.sensor-badge {
  display: inline-block;
  padding: 2px 8px;
  background: #F3F4F6;
  border-radius: 6px;
  font-size: 11px;
  color: #6B7280;
}
</style>
