import { Device } from '../../models/Device'
import { Command } from '../../models/Command'
import { AILog } from '../../models/AILog'
import { logger } from '../../utils/logger'
import { generateCommandId } from '../../utils/ai-client'

// POST /api/ai/execute - 执行AI推荐的操作
export default defineEventHandler(async (event) => {
  const startTime = Date.now()
  
  try {
    const body = await readBody(event)
    const { deviceId, action, parameters = {} } = body
    
    // 验证参数
    if (!deviceId || !action) {
      throw createError({
        statusCode: 400,
        statusMessage: '参数错误：deviceId 和 action 必填'
      })
    }
    
    logger.info('执行AI操作', { deviceId, action, parameters })
    
    // 查找设备
    const device = await Device.findOne({ deviceId })
    if (!device) {
      throw createError({
        statusCode: 404,
        statusMessage: '设备不存在'
      })
    }
    
    // 创建控制命令
    const commandId = generateCommandId()
    const command = new Command({
      commandId,
      deviceId,
      action,
      parameters,
      status: 'pending'
    })
    await command.save()
    
    // 更新设备状态（对于开关操作）
    if (action === 'on' || action === 'off') {
      device.active = action === 'on'
      device.lastUpdate = new Date()
      await device.save()
    }
    
    // 更新最近的AI日志为已执行
    await AILog.findOneAndUpdate(
      { deviceId, executed: false },
      { executed: true },
      { sort: { timestamp: -1 } }
    )
    
    // 构建响应消息
    let message = `已控制${device.name}`
    if (parameters.temperature) {
      message = `已将${device.name}调整到 ${parameters.temperature}°C`
    } else if (action === 'on') {
      message = `已开启${device.name}`
    } else if (action === 'off') {
      message = `已关闭${device.name}`
    }
    
    logger.api('POST', '/api/ai/execute', 200, Date.now() - startTime)
    
    return {
      success: true,
      message,
      commandId
    }
  } catch (error: any) {
    logger.error('执行AI操作失败', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: '执行AI操作失败',
      data: { error: error.message }
    })
  }
})
