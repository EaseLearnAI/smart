import { Device } from '../../models/Device'
import { logger } from '../../utils/logger'

// GET /api/devices - 获取所有设备
export default defineEventHandler(async (event) => {
  const startTime = Date.now()
  
  try {
    logger.info('获取设备列表')
    
    // 查询所有设备
    const devices = await Device.find().sort({ type: 1, name: 1 })
    
    // 分类设备
    const controlDevices = devices
      .filter(d => d.type === 'control')
      .map(d => ({
        id: d.deviceId,
        name: d.name,
        location: d.location,
        icon: d.icon,
        iconColor: d.iconColor,
        active: d.active
      }))
    
    const sensorDevices = devices
      .filter(d => d.type === 'sensor')
      .map(d => ({
        id: d.deviceId,
        name: d.name,
        location: d.location,
        icon: d.icon,
        iconColor: d.iconColor,
        data: d.sensorData,
        lastUpdate: d.lastUpdate
      }))
    
    logger.api('GET', '/api/devices', 200, Date.now() - startTime)
    
    return {
      success: true,
      data: {
        control: controlDevices,
        sensor: sensorDevices
      }
    }
  } catch (error: any) {
    logger.error('获取设备列表失败', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: '获取设备列表失败',
      data: { error: error.message }
    })
  }
})
