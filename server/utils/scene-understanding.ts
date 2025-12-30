import OpenAI from 'openai'
import { Device } from '../models/Device'
import { logger } from './logger'

// 初始化 ModelScope AI 客户端
const client = new OpenAI({
  baseURL: 'https://api-inference.modelscope.cn/v1',
  apiKey: 'ms-778e4cd8-df62-46c7-84ca-c62ebd3404f8',
  defaultHeaders: {
    'X-DashScope-Enable-Thinking': 'false'
  }
})

/**
 * 场景理解接口 - AI 分析用户场景并生成设备控制计划
 */
export interface SceneUnderstanding {
  scene: string // 场景描述
  actions: Array<{
    deviceId: string
    deviceName: string
    currentState: any
    targetState: any
    action: 'on' | 'off' | 'set'
    reason: string
  }>
  reasoning: string // AI 推理过程
}

/**
 * 使用 AI 理解场景并生成设备控制方案
 * @param userInput 用户输入的场景描述（如：我现在起床了）
 * @param userId 用户ID（预留字段，用于多用户场景）
 */
export async function understandScene(
  userInput: string,
  userId?: string
): Promise<SceneUnderstanding> {
  try {
    logger.info('开始场景理解', { userInput, userId })

    // 1. 获取当前所有设备状态
    const devices = await Device.find()
    
    // 构建设备状态描述
    const deviceStates = devices.map(d => {
      if (d.type === 'control') {
        return `- ${d.name}（${d.deviceId}）：${d.active ? '开启' : '关闭'}，位置：${d.location}`
      } else {
        const dataStr = Object.entries(d.sensorData || {})
          .map(([k, v]) => `${k}=${v}`)
          .join(', ')
        return `- ${d.name}（${d.deviceId}）：${dataStr}，位置：${d.location}`
      }
    }).join('\n')

    // 2. 构建 AI 提示词
    const systemPrompt = `你是一个智能家居控制助手。用户会描述一个生活场景，你需要：
1. 理解场景的含义和用户需求
2. 根据当前设备状态，决定哪些设备需要调整
3. 给出每个设备调整的理由

当前可用设备状态：
${deviceStates}

请以 JSON 格式返回，格式如下：
{
  "scene": "场景名称",
  "actions": [
    {
      "deviceId": "设备ID",
      "deviceName": "设备名称",
      "currentState": "当前状态描述",
      "targetState": "目标状态描述",
      "action": "on/off",
      "reason": "调整理由"
    }
  ]
}

注意：
- 只返回 JSON，不要其他文字
- 如果设备已经是目标状态，不需要调整
- action 只能是 "on" 或 "off"（开启或关闭）
- 对于控制类设备，使用 on 表示开启，off 表示关闭`

    // 3. 调用 AI API
    const response = await client.chat.completions.create({
      model: 'Qwen/Qwen3-32B',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userInput }
      ],
      temperature: 0.7,
      stream: true
    })

    // 4. 收集流式响应
    let aiResponse = ''
    for await (const chunk of response) {
      const content = chunk.choices[0]?.delta?.content
      if (content) {
        aiResponse += content
      }
    }
    
    const reasoning = '场景理解完成'
    
    logger.info('AI 原始响应', { aiResponse })
    
    // 清理 AI 响应：移除可能的 markdown 代码块标记
    let cleanedResponse = aiResponse.trim()
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.substring(7)
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.substring(3)
    } else if (cleanedResponse.startsWith('`json')) {
      cleanedResponse = cleanedResponse.substring(5)
    } else if (cleanedResponse.startsWith('`')) {
      cleanedResponse = cleanedResponse.substring(1)
    }
    
    if (cleanedResponse.endsWith('```')) {
      cleanedResponse = cleanedResponse.substring(0, cleanedResponse.length - 3)
    } else if (cleanedResponse.endsWith('`')) {
      cleanedResponse = cleanedResponse.substring(0, cleanedResponse.length - 1)
    }
    
    cleanedResponse = cleanedResponse.trim()
    logger.info('清理后的响应', { cleanedResponse })
    
    // 解析 JSON
    let understanding: SceneUnderstanding
    try {
      const parsed = JSON.parse(cleanedResponse)
      understanding = {
        scene: parsed.scene || userInput,
        actions: parsed.actions || [],
        reasoning
      }
    } catch (e) {
      logger.error('JSON 解析失败，使用默认响应', e)
      understanding = {
        scene: userInput,
        actions: [],
        reasoning: cleanedResponse
      }
    }

    logger.info('场景理解完成', { understanding })
    return understanding

  } catch (error: any) {
    logger.error('场景理解失败', error)
    throw error
  }
}

/**
 * 执行场景控制方案
 */
export async function executeSceneActions(
  understanding: SceneUnderstanding,
  userId?: string
): Promise<{ updated: number; commands: string[] }> {
  try {
    logger.info('开始执行场景控制', { scene: understanding.scene, actionCount: understanding.actions.length })

    const commandIds: string[] = []
    let updatedCount = 0

    for (const action of understanding.actions) {
      try {
        // 更新设备状态
        const device = await Device.findOne({ deviceId: action.deviceId })
        if (!device) {
          logger.warn(`设备不存在: ${action.deviceId}`)
          continue
        }

        // 根据 action 类型更新设备（仅处理控制类设备）
        if (device.type === 'control') {
          if (action.action === 'on') {
            device.active = true
            device.lastUpdate = new Date()
            await device.save()
            updatedCount++
            logger.info(`✅ 设备已开启: ${action.deviceName}`, { deviceId: action.deviceId })
          } else if (action.action === 'off') {
            device.active = false
            device.lastUpdate = new Date()
            await device.save()
            updatedCount++
            logger.info(`✅ 设备已关闭: ${action.deviceName}`, { deviceId: action.deviceId })
          } else {
            logger.warn(`⚠️ 未知的 action 类型: ${action.action}，设备: ${action.deviceName}`)
          }
        } else {
          logger.info(`ℹ️ 跳过传感器设备: ${action.deviceName}`)
        }

        logger.info(`设备状态已更新: ${action.deviceName} -> ${action.action}`)

      } catch (err) {
        logger.error(`执行设备控制失败: ${action.deviceId}`, err)
      }
    }

    logger.info('场景控制执行完成', { updatedCount, commandIds })
    return { updated: updatedCount, commands: commandIds }

  } catch (error: any) {
    logger.error('执行场景控制失败', error)
    throw error
  }
}
