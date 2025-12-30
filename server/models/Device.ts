import mongoose, { Schema, Document } from 'mongoose'

// 传感器数据接口
export interface ISensorData {
  temperature?: number
  humidity?: number
  pressure?: number
  light?: number
  uv?: number
  voc?: number
  unit?: string
}

// 设备接口
export interface IDevice extends Document {
  deviceId: string
  name: string
  type: 'control' | 'sensor'
  location: string
  icon: string
  iconColor: string
  active: boolean
  sensorData: ISensorData
  lastUpdate: Date
  createdAt: Date
  updatedAt: Date
}

// 设备Schema
const DeviceSchema = new Schema<IDevice>({
  deviceId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['control', 'sensor'],
    required: true
  },
  location: {
    type: String,
    default: '客厅'
  },
  icon: {
    type: String,
    required: true
  },
  iconColor: {
    type: String,
    default: 'blue'
  },
  active: {
    type: Boolean,
    default: false
  },
  sensorData: {
    temperature: Number,
    humidity: Number,
    pressure: Number,
    light: Number,
    uv: Number,
    voc: Number,
    unit: String
  },
  lastUpdate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// 防止模型重复编译
export const Device = mongoose.models.Device || mongoose.model<IDevice>('Device', DeviceSchema)
