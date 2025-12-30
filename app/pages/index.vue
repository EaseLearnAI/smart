<template>
  <div class="page-container">
    <!-- 遮罩层 -->
    <div v-if="showFeedback" class="overlay" @click="closeFeedback" />
    
    <!-- 顶部栏 -->
    <TopBar 
      mode="room" 
      title="客厅" 
      :show-dropdown="true"
      :has-overlay="showFeedback"
    />
    
    <!-- 主内容区 -->
    <div class="main-content">
      <VoiceButton 
        :dimmed="showFeedback"
        @result="handleVoiceResult"
      />
      
      <div class="secondary-inputs">
        <TextInput @send="handleTextSend" :loading="isLoading" />
      </div>
    </div>
    
    <!-- 命令反馈卡片 -->
    <FeedbackCard
      :visible="showFeedback"
      :user-text="userCommand"
      :intent="feedbackData.intent"
      :device-name="feedbackData.deviceName"
      :device-icon="feedbackData.deviceIcon"
      :params="feedbackData.params"
      @confirm="handleConfirm"
      @cancel="closeFeedback"
    />
    
    <!-- 成功提示 -->
    <Toast
      :visible="showToast"
      :message="toastMessage"
      type="success"
    />
    
    <!-- 底部导航 -->
    <BottomNavigation />
  </div>
</template>

<script setup lang="ts">
import TopBar from '~/component/common/TopBar.vue'
import BottomNavigation from '~/component/common/BottomNavigation.vue'
import Toast from '~/component/common/Toast.vue'
import VoiceButton from '~/component/home/VoiceButton.vue'
import TextInput from '~/component/home/TextInput.vue'
import FeedbackCard from '~/component/feedback/FeedbackCard.vue'
import { executeScene, type SceneAction } from '~/api/scene'

// 状态
const showFeedback = ref(false)
const showToast = ref(false)
const userCommand = ref('')
const toastMessage = ref('')
const isLoading = ref(false)

// 反馈数据
const feedbackData = ref({
  intent: '',
  deviceId: '',
  deviceName: '',
  deviceIcon: '',
  params: [] as Array<{ icon: string; value: string }>
})

// 使用场景化控制 API
const handleSceneControl = async (input: string) => {
  isLoading.value = true
  userCommand.value = input
  
  console.log('\n╔════════════════════════════════════════╗')
  console.log('║     🎬 开始场景化智能控制流程          ║')
  console.log('╚════════════════════════════════════════╝')
  console.log('📝 用户输入:', input)
  console.log('⏰ 开始时间:', new Date().toLocaleString('zh-CN'))
  console.log('')
  
  try {
    // 调用场景控制 API
    const response = await executeScene(input, 'web-user-001')
    
    if (response.success && response.data) {
      console.log('\n🎯 准备显示反馈界面...')
      
      // 构建反馈数据
      const actions = response.data.actions || []
      const intent = response.data.scene || '场景控制'
      
      // 如果有控制动作，显示第一个设备的信息
      if (actions.length > 0) {
        const firstAction = actions[0]!
        feedbackData.value = {
          intent: `${intent}：${actions.map(a => a.deviceName).join('、')}`,
          deviceId: firstAction.deviceId,
          deviceName: firstAction.deviceName,
          deviceIcon: getDeviceIcon(firstAction.deviceId),
          params: actions.map(action => ({
            icon: action.action === 'on' ? 'power-off' : 'circle-stop',
            value: `${action.deviceName}: ${action.targetState}`
          }))
        }
        showFeedback.value = true
        
        console.log('✅ 反馈界面数据已准备')
        console.log('   意图:', feedbackData.value.intent)
        console.log('   参数数量:', feedbackData.value.params.length)
      } else {
        // 无需调整设备
        console.log('ℹ️ 设备已处于目标状态，无需调整')
        toastMessage.value = '设备状态已正确，无需调整'
        showToast.value = true
        setTimeout(() => {
          showToast.value = false
        }, 2000)
      }
      
      console.log('\n╔════════════════════════════════════════╗')
      console.log('║     ✅ 场景控制流程完成                ║')
      console.log('╚════════════════════════════════════════╝\n')
    }
    
  } catch (error: any) {
    console.error('\n❌ 场景控制失败')
    console.error('错误信息:', error.message || error)
    console.error('\n╔════════════════════════════════════════╗')
    console.error('║     ❌ 场景控制流程失败                ║')
    console.error('╚════════════════════════════════════════╝\n')
    
    // 显示错误提示
    toastMessage.value = '场景控制失败，请重试'
    showToast.value = true
    setTimeout(() => {
      showToast.value = false
    }, 2000)
  } finally {
    isLoading.value = false
  }
}

// 获取设备图标
const getDeviceIcon = (deviceId: string): string => {
  const iconMap: Record<string, string> = {
    'led-1': 'lightbulb',
    'curtain-1': 'bars-staggered',
    'temp-1': 'temperature-half',
    'light-1': 'sun',
    'uv-1': 'sun-plant-wilt',
    'voc-1': 'wind'
  }
  return iconMap[deviceId] || 'circle-question'
}

// 处理语音识别结果
const handleVoiceResult = (text: string) => {
  console.log('\n🎤 收到语音输入:', text)
  handleSceneControl(text)
}

// 处理文字输入
const handleTextSend = (text: string) => {
  console.log('\n⌨️ 收到文字输入:', text)
  handleSceneControl(text)
}

// 确认执行（场景已自动执行，这里只是关闭反馈）
const handleConfirm = () => {
  console.log('\n✅ 用户确认操作')
  showFeedback.value = false
  
  toastMessage.value = '场景控制已完成'
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 2000)
}

// 关闭反馈
const closeFeedback = () => {
  console.log('\n❌ 用户取消操作')
  showFeedback.value = false
}
</script>

<style scoped>
.page-container {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  padding-bottom: 120px;
}

.secondary-inputs {
  margin-top: 60px;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
