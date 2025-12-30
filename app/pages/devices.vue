<template>
  <div class="page-container">
    <!-- 顶部栏 -->
    <TopBar 
      mode="project" 
      title="我的家" 
      :show-add-button="true"
      @add="handleAddDevice"
    />
    
    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 控制设备 -->
      <DeviceGrid title="控制设备">
        <DeviceCard
          v-for="device in controlDevices"
          :key="device.id"
          type="control"
          :name="device.name"
          :location="device.location"
          :icon="device.icon"
          :icon-color="device.iconColor"
          :active="device.active"
          @toggle="(active) => handleToggle(device.id, active)"
        />
      </DeviceGrid>
      
      <!-- 传感器设备 -->
      <DeviceGrid title="环境监测">
        <DeviceCard
          v-for="device in sensorDevices"
          :key="device.id"
          type="sensor"
          :name="device.name"
          :status="device.status"
          :location="device.location"
          :icon="device.icon"
          :icon-color="device.iconColor"
          @click="handleSensorClick(device)"
        />
      </DeviceGrid>
    </div>
    
    <!-- 底部导航 -->
    <BottomNavigation />
  </div>
</template>

<script setup lang="ts">
import TopBar from '~/component/common/TopBar.vue'
import BottomNavigation from '~/component/common/BottomNavigation.vue'
import DeviceGrid from '~/component/devices/DeviceGrid.vue'
import DeviceCard from '~/component/devices/DeviceCard.vue'

// 设备数据接口
type IconColor = 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'cyan' | 'gray'

interface ControlDevice {
  id: string
  name: string
  location: string
  icon: string
  iconColor: IconColor
  active: boolean
}

interface SensorDevice {
  id: string
  name: string
  status: string
  location: string
  icon: string
  iconColor: IconColor
  data?: any
}

// API 响应类型
interface DeviceListResponse {
  success: boolean
  data: {
    control: Array<{
      id: string
      name: string
      location: string
      icon: string
      iconColor: string
      active: boolean
    }>
    sensor: Array<{
      id: string
      name: string
      location: string
      icon: string
      iconColor: string
      data?: any
      lastUpdate?: string
    }>
  }
}

interface ToggleResponse {
  success: boolean
  data: {
    deviceId: string
    active: boolean
    message: string
    commandId: string
  }
}

// 响应式数据
const controlDevices = ref<ControlDevice[]>([])
const sensorDevices = ref<SensorDevice[]>([])
const isLoading = ref(true)

// 格式化传感器数据为显示状态
const formatSensorStatus = (device: any): string => {
  const data = device.data || {}
  
  if (data.temperature !== undefined && data.humidity !== undefined) {
    return `${data.temperature}°C<span style="font-size: 14px; margin-left: 8px; color: #6B7280;">${data.humidity}%</span>`
  }
  if (data.light !== undefined) {
    return `${data.light} Lux`
  }
  if (data.uv !== undefined) {
    const level = data.uv <= 2 ? '较低' : data.uv <= 5 ? '中等' : '较高'
    return level
  }
  if (data.voc !== undefined) {
    const level = data.voc <= 0.3 ? '优秀' : data.voc <= 0.5 ? '良好' : '一般'
    return level
  }
  return '--'
}

// 格式化传感器位置信息
const formatSensorLocation = (device: any): string => {
  const data = device.data || {}
  let extra = ''
  
  if (data.pressure !== undefined) {
    extra = ` · ${data.pressure}hPa`
  } else if (data.uv !== undefined) {
    extra = ` · UV-${data.uv}`
  } else if (data.voc !== undefined) {
    extra = ` · ${data.voc} ppm`
  }
  
  return device.location + extra
}

// 获取设备列表
const fetchDevices = async () => {
  isLoading.value = true
  try {
    const response = await $fetch<DeviceListResponse>('/api/devices')
    if (response.success) {
      // 处理控制设备
      controlDevices.value = response.data.control.map((d: any) => ({
        id: d.id,
        name: d.name,
        location: d.location,
        icon: d.icon,
        iconColor: d.iconColor,
        active: d.active
      }))
      
      // 处理传感器设备
      sensorDevices.value = response.data.sensor.map((d: any) => ({
        id: d.id,
        name: d.name,
        location: formatSensorLocation(d),
        icon: d.icon,
        iconColor: d.iconColor,
        status: formatSensorStatus(d),
        data: d.data
      }))
    }
  } catch (error) {
    console.error('获取设备列表失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 处理设备开关
const handleToggle = async (deviceId: string, active: boolean) => {
  try {
    const response = await $fetch<ToggleResponse>(`/api/devices/${deviceId}/toggle`, {
      method: 'POST',
      body: { active }
    })
    
    if (response.success) {
      // 更新本地状态
      const device = controlDevices.value.find(d => d.id === deviceId)
      if (device) {
        device.active = active
      }
      console.log(response.data.message)
    }
  } catch (error) {
    console.error('控制设备失败:', error)
    // 恢复状态
    const device = controlDevices.value.find(d => d.id === deviceId)
    if (device) {
      device.active = !active
    }
  }
}

// 处理传感器点击
const handleSensorClick = (device: SensorDevice) => {
  console.log(`读取设备数据: ${device.name}`, device.data)
}

// 添加设备
const handleAddDevice = () => {
  console.log('添加设备')
}

// 初始化加载
onMounted(() => {
  fetchDevices()
})
</script>

<style scoped>
.page-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #FFFFFF;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  color: #0B1226;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  padding-bottom: 100px;
}
</style>
