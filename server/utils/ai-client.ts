import { logger } from './logger'

// AI理解结果接口
export interface AIUnderstandingResult {
  intent: string
  deviceId: string
  deviceName: string
  deviceIcon: string
  action: 'on' | 'off' | 'set'
  parameters: Record<string, any>
  displayParams: Array<{ icon: string; value: string }>
}

// 设备映射（用于模拟AI理解）
const deviceMapping: Record<string, { id: string; name: string; icon: string }> = {
  '空调': { id: 'ac-1', name: '客厅空调', icon: 'wind' },
  '灯': { id: 'led-1', name: 'LED 台灯', icon: 'lightbulb' },
  '台灯': { id: 'led-1', name: 'LED 台灯', icon: 'lightbulb' },
  '窗帘': { id: 'curtain-1', name: '电机窗帘', icon: 'bars-staggered' }
}

// 意图识别映射
const intentMapping: Record<string, { intent: string; action: 'on' | 'off' | 'set'; params: any; display: Array<{ icon: string; value: string }> }> = {
  '热': {
    intent: '降低温度，开启空调',
    action: 'set',
    params: { temperature: 24, mode: 'cooling' },
    display: [
      { icon: 'thermometer-half', value: '24°C' },
      { icon: 'snowflake', value: '制冷模式' }
    ]
  },
  '冷': {
    intent: '提高温度，开启暖气',
    action: 'set',
    params: { temperature: 26, mode: 'heating' },
    display: [
      { icon: 'thermometer-half', value: '26°C' },
      { icon: 'sun', value: '制热模式' }
    ]
  },
  '开灯': {
    intent: '开启灯光',
    action: 'on',
    params: {},
    display: [{ icon: 'lightbulb', value: '开启' }]
  },
  '关灯': {
    intent: '关闭灯光',
    action: 'off',
    params: {},
    display: [{ icon: 'lightbulb', value: '关闭' }]
  },
  '打开窗帘': {
    intent: '打开窗帘',
    action: 'on',
    params: {},
    display: [{ icon: 'bars-staggered', value: '打开' }]
  },
  '关闭窗帘': {
    intent: '关闭窗帘',
    action: 'off',
    params: {},
    display: [{ icon: 'bars-staggered', value: '关闭' }]
  }
}

/**
 * 模拟AI理解用户输入
 * TODO: 接入真实大模型API
 */
export async function understandUserInput(input: string, location: string): Promise<AIUnderstandingResult> {
  logger.info('AI理解用户输入', { input, location })
  
  // 模拟处理延迟
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // 简单关键词匹配（实际应接入大模型API）
  let matchedIntent = null
  let matchedDevice = null
  
  // 匹配意图
  for (const [keyword, data] of Object.entries(intentMapping)) {
    if (input.includes(keyword)) {
      matchedIntent = { keyword, ...data }
      break
    }
  }
  
  // 匹配设备
  for (const [keyword, device] of Object.entries(deviceMapping)) {
    if (input.includes(keyword)) {
      matchedDevice = device
      break
    }
  }
  
  // 默认值
  if (!matchedIntent) {
    matchedIntent = {
      keyword: '',
      intent: '调整设备状态',
      action: 'set' as const,
      params: {},
      display: []
    }
  }
  
  if (!matchedDevice) {
    // 根据意图推断设备
    if (input.includes('热') || input.includes('冷')) {
      matchedDevice = deviceMapping['空调']
    } else if (input.includes('灯') || input.includes('亮') || input.includes('暗')) {
      matchedDevice = deviceMapping['灯']
    } else {
      matchedDevice = deviceMapping['空调'] // 默认空调
    }
  }
  
  const result: AIUnderstandingResult = {
    intent: matchedIntent.intent,
    deviceId: matchedDevice.id,
    deviceName: matchedDevice.name,
    deviceIcon: matchedDevice.icon,
    action: matchedIntent.action,
    parameters: matchedIntent.params,
    displayParams: matchedIntent.display
  }
  
  logger.info('AI理解结果', result)
  return result
}

/**
 * 生成唯一命令ID
 */
export function generateCommandId(): string {
  return `cmd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
