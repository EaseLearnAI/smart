import { Device } from '../../models/Device'
import { Command } from '../../models/Command'
import { logger } from '../../utils/logger'

// POST /api/mcu/report - 单片机上报数据
export default defineEventHandler(async (event) => {
  const startTime = Date.now()
  
  try {
    const body = await readBody(event)
    const { type, sensorData, completedCommands } = body
    
    logger.info('单片机上报数据', { type })
    
    // 处理传感器数据上报
    if (type === 'sensor_data' && Array.isArray(sensorData)) {
      for (const sensor of sensorData) {
        const { deviceId, ...data } = sensor
        
        await Device.findOneAndUpdate(
          { deviceId },
          {
            sensorData: data,
            lastUpdate: new Date()
          },
          { upsert: false }
        )
      }
      
      logger.info('传感器数据已更新', { count: sensorData.length })
    }
    
    // 处理命令执行确认
    if (type === 'command_complete' && Array.isArray(completedCommands)) {
      await Command.updateMany(
        { commandId: { $in: completedCommands } },
        { status: 'completed', completedAt: new Date() }
      )
      
      logger.info('命令执行已确认', { count: completedCommands.length })
    }
    
    // 混合模式：同时上报传感器数据和确认命令
    if (!type) {
      // 处理传感器数据
      if (Array.isArray(sensorData)) {
        for (const sensor of sensorData) {
          const { deviceId, ...data } = sensor
          await Device.findOneAndUpdate(
            { deviceId },
            { sensorData: data, lastUpdate: new Date() }
          )
        }
      }
      
      // 处理命令确认
      if (Array.isArray(completedCommands)) {
        await Command.updateMany(
          { commandId: { $in: completedCommands } },
          { status: 'completed', completedAt: new Date() }
        )
      }
    }
    
    logger.api('POST', '/api/mcu/report', 200, Date.now() - startTime)
    
    return {
      success: true,
      message: '数据上报成功'
    }
  } catch (error: any) {
    logger.error('数据上报失败', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: '数据上报失败',
      data: { error: error.message }
    })
  }
})
