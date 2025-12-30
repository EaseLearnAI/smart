import { logger } from '../utils/logger'

// 全局错误处理中间件
export default defineEventHandler((event) => {
  // 记录请求开始
  const startTime = Date.now()
  const method = event.method
  const path = event.path
  
  // 请求日志
  if (path?.startsWith('/api/')) {
    logger.info(`请求开始: ${method} ${path}`)
  }
  
  // 错误处理将在具体API中处理
})
