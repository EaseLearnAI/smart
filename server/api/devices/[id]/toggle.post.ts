import { Device } from '../../../models/Device'
import { Command } from '../../../models/Command'
import { logger } from '../../../utils/logger'
import { generateCommandId } from '../../../utils/ai-client'

// POST /api/devices/:id/toggle - 控制设备开关
export default defineEventHandler(async (event) => {
  const startTime = Date.now()
  const deviceId = getRouterParam(event, 'id')
  
  try {
    logger.info('控制设备', { deviceId })
    
    // 读取请求体
    const body = await readBody(event)
    const { active } = body
    
    // 验证参数
    if (typeof active !== 'boolean') {
      throw createError({
        statusCode: 400,
        statusMessage: '参数错误：active 必须是布尔值'
      })
    }
    
    // 更新设备状态
    const device = await Device.findOneAndUpdate(
      { deviceId },
      { active, lastUpdate: new Date() },
      { new: true }
    )
    
    if (!device) {
      throw createError({
        statusCode: 404,
        statusMessage: '设备不存在'
      })
    }
    
    // 创建控制命令（供单片机获取）
    const command = new Command({
      commandId: generateCommandId(),
      deviceId,
      action: active ? 'on' : 'off',
      parameters: {},
      status: 'pending'
    })
    await command.save()
    
    logger.api('POST', `/api/devices/${deviceId}/toggle`, 200, Date.now() - startTime)
    
    return {
      success: true,
      data: {
        deviceId,
        active,
        message: active ? '设备已开启' : '设备已关闭',
        commandId: command.commandId
      }
    }
  } catch (error: any) {
    logger.error('控制设备失败', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: '控制设备失败',
      data: { error: error.message }
    })
  }
})
