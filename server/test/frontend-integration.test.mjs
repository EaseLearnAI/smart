/**
 * 前端集成测试
 * 模拟前端调用场景控制 API
 */

const BASE_URL = 'http://localhost:3001'

console.log('\n╔═══════════════════════════════════════════╗')
console.log('║   🧪 前端集成测试 - 场景化控制         ║')
console.log('╚═══════════════════════════════════════════╝\n')

// 测试用例
const testScenes = [
  {
    name: '测试场景1',
    description: '起床场景',
    input: '我现在起床了',
    expectedDevices: ['LED 台灯', '电机窗帘']
  },
  {
    name: '测试场景2',
    description: '睡觉场景',
    input: '我要睡觉了',
    expectedDevices: ['LED 台灯', '电机窗帘']
  }
]

// 执行测试
for (const testCase of testScenes) {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`📋 ${testCase.name}: ${testCase.description}`)
  console.log(`${'='.repeat(60)}`)
  console.log(`💬 用户输入: "${testCase.input}"`)
  console.log('')

  try {
    const startTime = Date.now()
    
    // 调用 API
    const response = await fetch(`${BASE_URL}/api/scene/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        scene: testCase.input,
        userId: 'web-user-001'
      })
    })

    const duration = Date.now() - startTime
    const data = await response.json()

    console.log(`⏱️  响应时间: ${duration}ms`)
    console.log(`📊 状态码: ${response.status}`)
    console.log(`✅ 请求成功: ${data.success}`)
    console.log('')

    if (data.success && data.data) {
      console.log(`🎯 场景识别: ${data.data.scene}`)
      console.log(`🤖 AI 推理:`)
      console.log(`   ${data.data.reasoning}`)
      console.log('')
      
      if (data.data.actions && data.data.actions.length > 0) {
        console.log(`📋 设备控制计划 (${data.data.actions.length} 个动作):`)
        data.data.actions.forEach((action, index) => {
          console.log(`   ${index + 1}. ${action.deviceName} (${action.deviceId})`)
          console.log(`      状态变化: ${action.currentState} → ${action.targetState}`)
          console.log(`      执行动作: ${action.action}`)
          console.log(`      理由: ${action.reason}`)
        })
        console.log('')
      } else {
        console.log(`ℹ️  无需调整设备（设备已处于目标状态）`)
        console.log('')
      }
      
      console.log(`📊 执行结果:`)
      console.log(`   更新设备数: ${data.data.execution.updated}`)
      console.log(`   生成命令数: ${data.data.execution.commands.length}`)
      
      console.log(`\n✅ ${testCase.name} 测试通过！`)
    } else {
      console.log(`❌ ${testCase.name} 测试失败: 响应数据无效`)
    }

  } catch (error) {
    console.error(`❌ ${testCase.name} 测试失败:`, error.message)
  }
}

console.log('\n\n╔═══════════════════════════════════════════╗')
console.log('║   ✅ 前端集成测试完成                  ║')
console.log('╚═══════════════════════════════════════════╝\n')

console.log('\n📝 前端使用说明:')
console.log('1. 打开浏览器访问: http://localhost:3001')
console.log('2. 在文本输入框中输入场景描述（如"我现在起床了"）')
console.log('3. 点击发送按钮或按回车键')
console.log('4. 打开浏览器控制台查看详细日志输出')
console.log('5. 页面会显示反馈卡片，展示 AI 的控制计划')
console.log('6. 点击确认即可完成场景控制\n')
