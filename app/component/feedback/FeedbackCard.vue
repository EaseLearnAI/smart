<template>
  <Transition name="slide-up">
    <div v-if="visible" class="feedback-card">
      <div class="feedback-header">
        <div class="feedback-icon">
          <FontAwesomeIcon :icon="['fas', 'brain']" />
        </div>
        <div class="feedback-title">
          <div class="feedback-label">您刚才说</div>
          <div class="feedback-text">"{{ userText }}"</div>
        </div>
      </div>

      <UnderstandingSection
        :intent="intent"
        :device-name="deviceName"
        :device-icon="deviceIcon"
        :params="params"
      />

      <div class="action-buttons">
        <button class="btn btn-cancel" @click="handleCancel">
          <FontAwesomeIcon :icon="['fas', 'times']" />
          <span>取消</span>
        </button>
        <button class="btn btn-primary" @click="handleConfirm">
          <FontAwesomeIcon :icon="['fas', 'check']" />
          <span>确认执行</span>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import UnderstandingSection from './UnderstandingSection.vue'

interface Param {
  icon: string
  value: string
}

interface Props {
  visible?: boolean
  userText?: string
  intent?: string
  deviceName?: string
  deviceIcon?: string
  params?: Param[]
}

withDefaults(defineProps<Props>(), {
  visible: false,
  userText: '',
  intent: '',
  deviceName: '',
  deviceIcon: 'wind',
  params: () => []
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<style scoped>
.feedback-card {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: calc(100% - 48px);
  max-width: 500px;
  background: white;
  border-radius: 24px;
  padding: 28px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  z-index: 150;
}

.feedback-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.feedback-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.feedback-icon svg {
  width: 24px;
  height: 24px;
}

.feedback-title {
  flex: 1;
}

.feedback-label {
  font-size: 13px;
  color: #6c757d;
  margin-bottom: 4px;
}

.feedback-text {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

.action-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.btn {
  padding: 16px;
  border-radius: 16px;
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn:active {
  transform: scale(0.97);
}

.btn svg {
  width: 16px;
  height: 16px;
}

.btn-cancel {
  background: #fff5f5;
  color: #ff6b6b;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

/* 动画 */
.slide-up-enter-active {
  animation: slideUp 0.3s ease;
}

.slide-up-leave-active {
  animation: slideUp 0.3s ease reverse;
}

@keyframes slideUp {
  from {
    transform: translate(-50%, -50%) scale(0.9);
    opacity: 0;
  }
  to {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
}
</style>
