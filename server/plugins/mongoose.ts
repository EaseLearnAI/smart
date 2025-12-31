import mongoose from 'mongoose'

export default defineNitroPlugin(async () => {
  const config = useRuntimeConfig()
  
  try {
    await mongoose.connect('mongodb://localhost:27017/smarthome')
  } catch (error) {
    // MongoDB connection error
  }
})
