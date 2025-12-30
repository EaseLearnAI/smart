/**
 * 场景化智能控制 API
 * 提供场景理解和执行功能
 */

export interface SceneExecuteRequest {
  scene: string
  userId?: string
}

export interface SceneAction {
  deviceId: string
  deviceName: string
  currentState: string
  targetState: string
  action: 'on' | 'off'
  reason: string
}

export interface SceneExecuteResponse {
  success: boolean
  data: {
    scene: string
    reasoning: string
    actions: SceneAction[]
    execution: {
      updated: number
      commands: string[]
    }
  }
}

/**
 * 执行场景化控制
 * @param scene 场景描述
 * @param userId 用户ID（可选）
 */
export async function executeScene(scene: string, userId?: string): Promise<SceneExecuteResponse> {
  const requestData: SceneExecuteRequest = {
    scene,
    userId
  }

  console.log('\n========== 🚀 发起场景控制请求 ==========')
  console.log('📝 场景描述:', scene)
  console.log('👤 用户ID:', userId || '未指定')
  console.log('🌐 请求地址: POST /api/scene/execute')
  console.log('📦 请求数据:', JSON.stringify(requestData, null, 2))
  console.log('⏰ 请求时间:', new Date().toLocaleString('zh-CN'))
  console.log('=====================================\n')

  const startTime = Date.now()

  try {
    const response = await $fetch<SceneExecuteResponse>('/api/scene/execute', {
      method: 'POST',
      body: requestData
    })

    const duration = Date.now() - startTime

    console.log('\n========== ✅ 收到服务器响应 ==========')
    console.log('⏱️ 响应时间:', duration + 'ms')
    console.log('📊 响应状态:', response.success ? '成功' : '失败')
    console.log('🎯 场景识别:', response.data.scene)
    console.log('🔧 控制动作数:', response.data.actions.length)
    console.log('📝 更新设备数:', response.data.execution.updated)
    console.log('')
    
    if (response.data.actions && response.data.actions.length > 0) {
      console.log('📋 设备控制详情:')
      response.data.actions.forEach((action, index) => {
        console.log(`  ${index + 1}. ${action.deviceName} (${action.deviceId})`)
        console.log(`     状态变化: ${action.currentState} → ${action.targetState}`)
        console.log(`     执行动作: ${action.action}`)
        console.log(`     理由: ${action.reason}`)
      })
    } else {
      console.log('ℹ️ 无需调整设备状态（设备已处于目标状态）')
    }
    
    console.log('\n📦 完整响应数据:', JSON.stringify(response, null, 2))
    console.log('========== 请求完成 ==========\n')

    return response

  } catch (error: any) {
    const duration = Date.now() - startTime
    
    console.error('\n========== ❌ 请求失败 ==========')
    console.error('⏱️ 失败时间:', duration + 'ms')
    console.error('❌ 错误类型:', error.name || 'Unknown')
    console.error('📝 错误信息:', error.message || error)
    console.error('📦 错误详情:', error)
    console.error('========== 请求结束 ==========\n')
    
    throw error
  }
}
