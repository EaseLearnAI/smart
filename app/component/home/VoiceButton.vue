<template>
  <div class="voice-button-container" :class="{ dimmed: dimmed }">
    <button 
      class="voice-button" 
      :class="{ recording: isRecording }"
      @mousedown="startRecording"
      @mouseup="stopRecording"
      @mouseleave="cancelRecording"
      @touchstart.prevent="startRecording"
      @touchend.prevent="stopRecording"
    >
      <FontAwesomeIcon :icon="['fas', 'microphone']" />
    </button>
    <div class="voice-info">
      <div class="voice-hint">{{ hint }}</div>
      <div class="voice-status">{{ status }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  dimmed?: boolean
}

withDefaults(defineProps<Props>(), {
  dimmed: false
})

const emit = defineEmits<{
  start: []
  stop: []
  result: [text: string]
}>()

const isRecording = ref(false)
const hint = ref('点击并说话')
const status = ref('长按录音，松手识别')

const startRecording = () => {
  isRecording.value = true
  status.value = '正在录音...'
  emit('start')
}

const stopRecording = () => {
  if (isRecording.value) {
    isRecording.value = false
    status.value = '识别中...'
    emit('stop')
    
    // 模拟识别完成
    setTimeout(() => {
      status.value = '长按录音，松手识别'
      // 模拟识别结果
      emit('result', '有点热了')
    }, 1500)
  }
}

const cancelRecording = () => {
  if (isRecording.value) {
    isRecording.value = false
    status.value = '长按录音，松手识别'
  }
}
</script>

<style scoped>
.voice-button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  transition: opacity 0.3s ease;
}

.voice-button-container.dimmed {
  opacity: 0.3;
  pointer-events: none;
}

.voice-button {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  position: relative;
}

.voice-button:active {
  transform: scale(0.95);
}

.voice-button.recording {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.voice-button svg {
  font-size: 80px;
  width: 80px;
  height: 80px;
  color: white;
}

.voice-info {
  text-align: center;
}

.voice-hint {
  font-size: 18px;
  color: #495057;
  font-weight: 500;
}

.voice-status {
  font-size: 14px;
  color: #6c757d;
  margin-top: 8px;
}
</style>
