<template>
  <Transition name="toast">
    <div v-if="visible" class="toast" :class="type">
      <FontAwesomeIcon :icon="['fas', 'check-circle']" />
      <span>{{ message }}</span>
    </div>
  </Transition>
</template>

<script setup lang="ts">
interface Props {
  visible?: boolean
  message?: string
  type?: 'success' | 'error' | 'info'
}

withDefaults(defineProps<Props>(), {
  visible: false,
  message: '',
  type: 'success'
})
</script>

<style scoped>
.toast {
  position: fixed;
  bottom: 120px;
  left: 50%;
  transform: translateX(-50%);
  padding: 16px 24px;
  border-radius: 16px;
  font-size: 15px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 200;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.toast.success {
  background: rgba(16, 185, 129, 0.95);
  color: white;
}

.toast.error {
  background: rgba(239, 68, 68, 0.95);
  color: white;
}

.toast.info {
  background: rgba(102, 126, 234, 0.95);
  color: white;
}

.toast svg {
  width: 18px;
  height: 18px;
}

/* 动画 */
.toast-enter-active {
  animation: fadeInUp 0.3s ease;
}

.toast-leave-active {
  animation: fadeInUp 0.3s ease reverse;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
</style>
