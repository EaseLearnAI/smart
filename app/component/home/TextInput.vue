<template>
  <div class="text-input-wrapper">
    <input 
      v-model="inputText"
      type="text" 
      class="text-input" 
      :class="{ 'input-loading': loading }"
      :placeholder="placeholder"
      :disabled="loading"
      @keyup.enter="handleSend"
    >
    <button class="send-button" :class="{ 'button-loading': loading }" @click="handleSend" :disabled="loading">
      <FontAwesomeIcon v-if="!loading" :icon="['fas', 'paper-plane']" />
      <div v-else class="loading-spinner"></div>
    </button>
    
    <!-- 加载状态提示 -->
    <transition name="fade">
      <div v-if="loading" class="loading-hint">
        <div class="loading-dots">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
        <span class="loading-text">AI 正在智能分析场景...</span>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
interface Props {
  placeholder?: string
  modelValue?: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '或者输入文字指令...',
  modelValue: '',
  loading: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  send: [text: string]
}>()

const loading = computed(() => props.loading)

const inputText = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  inputText.value = val
})

watch(inputText, (val) => {
  emit('update:modelValue', val)
})

const handleSend = () => {
  if (inputText.value.trim()) {
    emit('send', inputText.value.trim())
    inputText.value = ''
  }
}
</script>

<style scoped>
.text-input-wrapper {
  position: relative;
  width: 100%;
}

.text-input {
  width: 100%;
  padding: 16px 50px 16px 20px;
  border: 2px solid #e9ecef;
  border-radius: 24px;
  font-size: 16px;
  background: white;
  transition: all 0.2s ease;
}

.text-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.text-input::placeholder {
  color: #adb5bd;
}

.send-button {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #667eea;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.send-button:active {
  transform: translateY(-50%) scale(0.95);
}

.send-button svg {
  width: 16px;
  height: 16px;
}

.send-button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.input-loading {
  border-color: #667eea !important;
  background: #f8f9ff !important;
}

/* 加载旋转动画 */
.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 加载提示框 */
.loading-hint {
  position: absolute;
  top: calc(100% + 12px);
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 12px 20px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 10;
}

.loading-dots {
  display: flex;
  gap: 4px;
}

.dot {
  width: 6px;
  height: 6px;
  background: white;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out;
}

.dot:nth-child(1) {
  animation-delay: -0.32s;
}

.dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.loading-text {
  color: white;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.3px;
}

/* 渐入渐出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
