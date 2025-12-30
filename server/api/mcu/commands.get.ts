import { Command } from '../../models/Command'
import { logger } from '../../utils/logger'

// GET /api/mcu/commands - 单片机获取待执行指令
export default defineEventHandler(async (event) => {
  const startTime = Date.now()
  
  try {
    logger.info('单片机获取待执行指令')
    
    // 查询所有pending状态的命令
    const commands = await Command.find({ status: 'pending' })
      .sort({ createdAt: 1 })
      .limit(10)
    
    // 更新状态为fetched
    const commandIds = commands.map(c => c.commandId)
    if (commandIds.length > 0) {
      await Command.updateMany(
        { commandId: { $in: commandIds } },
        { status: 'fetched', fetchedAt: new Date() }
      )
    }
    
    // 格式化返回数据
    const formattedCommands = commands.map(c => ({
      commandId: c.commandId,
      deviceId: c.deviceId,
      action: c.action,
      parameters: c.parameters
    }))
    
    logger.api('GET', '/api/mcu/commands', 200, Date.now() - startTime)
    
    return {
      success: true,
      commands: formattedCommands
    }
  } catch (error: any) {
    logger.error('获取待执行指令失败', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: '获取待执行指令失败',
      data: { error: error.message }
    })
  }
})
