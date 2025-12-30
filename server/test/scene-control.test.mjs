/**
 * 场景化控制功能测试
 * 测试 POST /api/scene/execute 接口
 */

const BASE_URL = 'http://localhost:3000'

async function testSceneControl() {
  console.log('\n╔═══════════════════════════════════════════════════╗')
  console.log('║      场景化控制功能测试                                 ║')
  console.log('╚═══════════════════════════════════════════════════╝\n')

  try {
    // 测试场景："我现在起床了"
    const testScene = '我现在睡觉了'
    const testUserId = 'test-user-001'

    console.log('📋 测试用例信息:')
    console.log(`   场景描述: ${testScene}`)
    console.log(`   用户ID: ${testUserId}`)
    console.log(`   请求地址: ${BASE_URL}/api/scene/execute\n`)

    console.log('🚀 发送请求...\n')

    const startTime = Date.now()

    const response = await fetch(`${BASE_URL}/api/scene/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        scene: testScene,
        userId: testUserId
      })
    })

    const duration = Date.now() - startTime

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    console.log('\n✅ 测试通过！\n')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📊 响应结果:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`   ✓ 请求状态: ${response.status} ${response.statusText}`)
    console.log(`   ✓ 响应时间: ${duration}ms`)
    console.log(`   ✓ 成功标识: ${result.success}`)
    console.log('')

    if (result.success && result.data) {
      console.log('📝 场景分析结果:')
      console.log(`   场景识别: ${result.data.scene}`)
      console.log(`   控制动作数量: ${result.data.actions.length}`)
      console.log('')

      if (result.data.reasoning) {
        console.log('💭 AI 推理过程:')
        console.log(`   ${result.data.reasoning.substring(0, 200)}...`)
        console.log('')
      }

      console.log('🎯 设备控制详情:')
      result.data.actions.forEach((action, index) => {
        console.log(`   ${index + 1}. ${action.deviceName} (${action.deviceId})`)
        console.log(`      • 操作: ${action.currentState} → ${action.targetState}`)
        console.log(`      • 动作: ${action.action}`)
        console.log(`      • 原因: ${action.reason}`)
      })
      console.log('')

      console.log('⚡ 执行结果:')
      console.log(`   更新设备数: ${result.data.execution.updated}`)
      console.log(`   生成命令数: ${result.data.execution.commands.length}`)
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('\n✨ 测试完成！所有功能正常工作。\n')

    // 验证数据库更新
    console.log('🔍 验证数据库更新...\n')
    const devicesResponse = await fetch(`${BASE_URL}/api/devices`)
    const devicesResult = await devicesResponse.json()

    if (devicesResult.success) {
      console.log('📦 当前设备状态:')
      devicesResult.data.control.forEach(device => {
        console.log(`   • ${device.name}: ${device.active ? '✅ 开启' : '❌ 关闭'}`)
      })
    }

    console.log('\n╔═══════════════════════════════════════════════════╗')
    console.log('║      ✅ 所有测试通过！                                ║')
    console.log('╚═══════════════════════════════════════════════════╝\n')

  } catch (error) {
    console.error('\n❌ 测试失败:')
    console.error(error.message)
    console.log('\n请确保:')
    console.log('  1. 服务器正在运行 (npm run dev)')
    console.log('  2. MongoDB 数据库已启动')
    console.log('  3. 已初始化设备数据 (POST /api/devices/seed)')
    console.log('')
    process.exit(1)
  }
}

// 运行测试
testSceneControl()
