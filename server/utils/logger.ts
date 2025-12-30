// 日志级别
type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG'

// 格式化时间
const formatTime = (): string => {
  return new Date().toISOString()
}

// 日志记录函数
export const logger = {
  info: (message: string, data?: any) => {
    console.log(`[${formatTime()}] [INFO] ${message}`, data ? JSON.stringify(data) : '')
  },
  
  warn: (message: string, data?: any) => {
    console.warn(`[${formatTime()}] [WARN] ${message}`, data ? JSON.stringify(data) : '')
  },
  
  error: (message: string, error?: any) => {
    console.error(`[${formatTime()}] [ERROR] ${message}`, error instanceof Error ? error.message : error)
  },
  
  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${formatTime()}] [DEBUG] ${message}`, data ? JSON.stringify(data) : '')
    }
  },
  
  api: (method: string, path: string, status: number, duration?: number) => {
    console.log(`[${formatTime()}] [API] ${method} ${path} - ${status} ${duration ? `(${duration}ms)` : ''}`)
  }
}
