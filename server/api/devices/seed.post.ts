import { Device } from '../../models/Device'
import { logger } from '../../utils/logger'

// 默认设备数据
const defaultDevices = [
  // 控制设备
  {
    deviceId: 'led-1',
    name: 'LED 台灯',
    type: 'control',
    location: '客厅',
    icon: 'lightbulb',
    iconColor: 'orange',
    active: false
  },
  {
    deviceId: 'curtain-1',
    name: '电机窗帘',
    type: 'control',
    location: '客厅',
    icon: 'bars-staggered',
    iconColor: 'purple',
    active: false
  },
  // 传感器设备
  {
    deviceId: 'temp-1',
    name: '温湿度气压',
    type: 'sensor',
    location: '客厅',
    icon: 'temperature-half',
    iconColor: 'green',
    sensorData: {
      temperature: 27,
      humidity: 78,
      pressure: 1013
    }
  },
  {
    deviceId: 'light-1',
    name: '环境光强度',
    type: 'sensor',
    location: '客厅',
    icon: 'sun',
    iconColor: 'orange',
    sensorData: {
      light: 452,
      unit: 'Lux'
    }
  },
  {
    deviceId: 'uv-1',
    name: '紫外线强度',
    type: 'sensor',
    location: '窗边',
    icon: 'sun-plant-wilt',
    iconColor: 'red',
    sensorData: {
      uv: 3,
      unit: 'UV'
    }
  },
  {
    deviceId: 'voc-1',
    name: '空气质量 VOC',
    type: 'sensor',
    location: '客厅',
    icon: 'wind',
    iconColor: 'cyan',
    sensorData: {
      voc: 0.2,
      unit: 'ppm'
    }
  }
]

// POST /api/devices/seed - 初始化默认设备数据
export default defineEventHandler(async (event) => {
  try {
    logger.info('初始化设备数据')
    
    // 清空现有设备
    await Device.deleteMany({})
    
    // 插入默认设备
    const devices = await Device.insertMany(defaultDevices)
    
    logger.info('设备数据初始化完成', { count: devices.length })
    
    return {
      success: true,
      message: `已初始化 ${devices.length} 个设备`,
      data: devices
    }
  } catch (error: any) {
    logger.error('初始化设备数据失败', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: '初始化设备数据失败',
      data: { error: error.message }
    })
  }
})
