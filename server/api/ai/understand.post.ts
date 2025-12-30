import { AILog } from '../../models/AILog'
import { Device } from '../../models/Device'
import { logger } from '../../utils/logger'
import { understandUserInput } from '../../utils/ai-client'

// POST /api/ai/understand - AI理解用户输入
export default defineEventHandler(async (event) => {
  const startTime = Date.now()
  
  try {
    const body = await readBody(event)
    const { input, location = '客厅' } = body
    
    // 验证参数
    if (!input || typeof input !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: '参数错误：input 必须是非空字符串'
      })
    }
    
    logger.info('AI理解请求', { input, location })
    
    // 调用AI理解服务
    const result = await understandUserInput(input, location)
    
    // 保存AI日志
    const aiLog = new AILog({
      userInput: input,
      intent: result.intent,
      deviceId: result.deviceId,
      deviceName: result.deviceName,
      parameters: result.parameters,
      executed: false
    })
    await aiLog.save()
    
    logger.api('POST', '/api/ai/understand', 200, Date.now() - startTime)
    
    return {
      success: true,
      understanding: {
        intent: result.intent,
        deviceId: result.deviceId,
        deviceName: result.deviceName,
        deviceIcon: result.deviceIcon,
        parameters: result.displayParams
      }
    }
  } catch (error: any) {
    logger.error('AI理解失败', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'AI理解失败',
      data: { error: error.message }
    })
  }
})
