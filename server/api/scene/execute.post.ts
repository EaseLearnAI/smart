import { understandScene, executeSceneActions } from '../../utils/scene-understanding'
import { AILog } from '../../models/AILog'
import { logger } from '../../utils/logger'

/**
 * POST /api/scene/execute - 场景化控制接口
 * 
 * 功能：根据用户描述的场景（如"我起床了"），AI自动分析并控制相关设备
 */
export default defineEventHandler(async (event) => {
  const startTime = Date.now()
  
  try {
    // 读取请求体
    const body = await readBody(event)
    const { scene, userId } = body
    
    // 参数验证
    if (!scene || typeof scene !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: '参数错误：scene 必须是非空字符串'
      })
    }
    
    logger.info('🎬 收到场景控制请求', { scene, userId })
    
    // 1. AI 理解场景
    logger.info('🤖 开始 AI 场景理解...')
    
    const understanding = await understandScene(scene, userId)
    
    // 2. 执行设备控制
    logger.info('⚙️ 开始执行设备控制...')
    
    const execution = await executeSceneActions(understanding, userId)
    
    // 3. 记录到 AI 日志
    for (const action of understanding.actions) {
      const aiLog = new AILog({
        userInput: scene,
        intent: `场景控制：${understanding.scene}`,
        deviceId: action.deviceId,
        deviceName: action.deviceName,
        parameters: {
          action: action.action,
          reason: action.reason,
          currentState: action.currentState,
          targetState: action.targetState
        },
        executed: true
      })
      await aiLog.save()
    }
    
    const duration = Date.now() - startTime
    logger.api('POST', '/api/scene/execute', 200, duration)
    
    // 4. 返回结果
    return {
      success: true,
      data: {
        scene: understanding.scene,
        reasoning: understanding.reasoning,
        actions: understanding.actions,
        execution: {
          updated: execution.updated,
          commands: execution.commands
        }
      }
    }
    
  } catch (error: any) {
    logger.error('❌ 场景控制失败', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: '场景控制失败',
      data: { error: error.message }
    })
  }
})
