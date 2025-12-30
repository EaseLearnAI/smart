<template>
  <div class="understanding-section">
    <div class="understanding-item">
      <div class="item-label">
        <FontAwesomeIcon :icon="['fas', 'lightbulb']" />
        理解的意图
      </div>
      <div class="item-value">{{ intent }}</div>
    </div>

    <div class="understanding-item">
      <div class="item-label">
        <FontAwesomeIcon :icon="['fas', 'crosshairs']" />
        目标设备
      </div>
      <div class="item-value">
        <div class="device-badge">
          <FontAwesomeIcon :icon="['fas', deviceIcon]" />
          <span>{{ deviceName }}</span>
        </div>
      </div>
    </div>

    <div class="understanding-item">
      <div class="item-label">
        <FontAwesomeIcon :icon="['fas', 'sliders-h']" />
        建议参数
      </div>
      <div class="item-value">
        <div 
          v-for="(param, index) in params" 
          :key="index" 
          class="param-chip"
        >
          <FontAwesomeIcon :icon="['fas', param.icon]" />
          <span>{{ param.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Param {
  icon: string
  value: string
}

interface Props {
  intent: string
  deviceName: string
  deviceIcon?: string
  params?: Param[]
}

withDefaults(defineProps<Props>(), {
  deviceIcon: 'wind',
  params: () => []
})
</script>

<style scoped>
.understanding-section {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
}

.understanding-item {
  margin-bottom: 16px;
}

.understanding-item:last-child {
  margin-bottom: 0;
}

.item-label {
  font-size: 13px;
  color: #6c757d;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.item-label svg {
  font-size: 12px;
  width: 12px;
  height: 12px;
}

.item-value {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.device-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: white;
  border-radius: 8px;
  font-size: 14px;
}

.device-badge svg {
  color: #667eea;
  width: 14px;
  height: 14px;
}

.param-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: white;
  border-radius: 8px;
  font-size: 14px;
}

.param-chip svg {
  width: 14px;
  height: 14px;
  color: #667eea;
}
</style>
