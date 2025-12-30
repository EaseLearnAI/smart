import mongoose, { Schema, Document } from 'mongoose'

// 指令接口
export interface ICommand extends Document {
  commandId: string
  deviceId: string
  action: 'on' | 'off' | 'set'
  parameters: Record<string, any>
  status: 'pending' | 'fetched' | 'completed'
  createdAt: Date
  fetchedAt?: Date
  completedAt?: Date
}

// 指令Schema
const CommandSchema = new Schema<ICommand>({
  commandId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  deviceId: {
    type: String,
    required: true,
    index: true
  },
  action: {
    type: String,
    enum: ['on', 'off', 'set'],
    required: true
  },
  parameters: {
    type: Schema.Types.Mixed,
    default: {}
  },
  status: {
    type: String,
    enum: ['pending', 'fetched', 'completed'],
    default: 'pending',
    index: true
  },
  fetchedAt: Date,
  completedAt: Date
}, {
  timestamps: true
})

// 防止模型重复编译
export const Command = mongoose.models.Command || mongoose.model<ICommand>('Command', CommandSchema)
