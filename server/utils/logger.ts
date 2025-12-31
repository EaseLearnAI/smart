// 日志级别
type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG'

// 格式化时间
const formatTime = (): string => {
  return new Date().toISOString()
}

// 日志记录函数
export const logger = {
  info: (message: string, data?: any) => {
    // Log info
  },
  
  warn: (message: string, data?: any) => {
    // Log warning
  },
  
  error: (message: string, error?: any) => {
    // Log error
  },
  
  debug: (message: string, data?: any) => {
    // Log debug
  },
  
  api: (method: string, path: string, status: number, duration?: number) => {
    // Log API
  }
}
