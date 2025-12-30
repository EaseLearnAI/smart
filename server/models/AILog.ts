import mongoose, { Schema, Document } from 'mongoose'

// AI日志接口
export interface IAILog extends Document {
  userInput: string
  intent: string
  deviceId: string
  deviceName: string
  parameters: Record<string, any>
  executed: boolean
  timestamp: Date
}

// AI日志Schema
const AILogSchema = new Schema<IAILog>({
  userInput: {
    type: String,
    required: true
  },
  intent: {
    type: String,
    required: true
  },
  deviceId: {
    type: String,
    required: true
  },
  deviceName: {
    type: String,
    required: true
  },
  parameters: {
    type: Schema.Types.Mixed,
    default: {}
  },
  executed: {
    type: Boolean,
    default: false
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
})

// 防止模型重复编译
export const AILog = mongoose.models.AILog || mongoose.model<IAILog>('AILog', AILogSchema)
