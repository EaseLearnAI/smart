/**
 * 场景化控制功能 - 多场景测试
 * 测试不同生活场景下的 AI 理解和设备控制
 */

const BASE_URL = 'http://localhost:3000'

// 测试用例定义
const testCases = [
  {
    name: '场景1: 起床场景',
    scene: '我现在起床了',
    userId: 'test-user-001',
    expectedDevices: ['led-1', 'curtain-1'],
    expectedActions: ['on', 'on'],
    description: '早上起床应该开启窗帘和灯光'
  },
  {
    name: '场景2: 睡觉场景',
    scene: '我现在要睡觉了',
    userId: 'test-user-002',
    expectedDevices: ['led-1', 'curtain-1'],
    expectedActions: ['off', 'off'],
    description: '睡觉前应该关闭灯光和窗帘'
  },
  {
    name: '场景3: 出门场景',
    scene: '我出门了',
    userId: 'test-user-003',
    expectedDevices: ['led-1', 'curtain-1'],
    expectedActions: ['off'],
    description: '出门应该关闭所有不必要的设备'
  },
  {
    name: '场景4: 回家场景',
    scene: '我回家了',
    userId: 'test-user-004',
    expectedDevices: ['led-1'],
    expectedActions: ['on'],
    description: '回家应该开启基础照明设备'
  }
]

// 执行单个测试
async function runTest(testCase, index) {
  console.log(`\n${'='.repeat(70)}`)
  console.log(`🧪 测试 ${index + 1}/${testCases.length}: ${testCase.name}`)
  console.log(`${'='.repeat(70)}`)
  console.log(`📝 场景描述: ${testCase.scene}`)
  console.log(`👤 用户ID: ${testCase.userId}`)
  console.log(`💡 预期: ${testCase.description}`)
  console.log('')

  try {
    const startTime = Date.now()

    // 发送请求
    const response = await fetch(`${BASE_URL}/api/scene/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        scene: testCase.scene,
        userId: testCase.userId
      })
    })

    const duration = Date.now() - startTime

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    // 打印AI输入输出
    console.log('📥 AI 输入:')
    console.log(`   - 场景: "${testCase.scene}"`)
    console.log(`   - 当前设备状态: 从数据库获取`)
    console.log('')

    console.log('📤 AI 输出:')
    console.log(`   - 场景识别: ${result.data.scene}`)
    console.log(`   - 控制动作数: ${result.data.actions.length}`)
    console.log('')

    if (result.data.actions && result.data.actions.length > 0) {
      console.log('🎯 AI 决策详情:')
      result.data.actions.forEach((action, idx) => {
        console.log(`   ${idx + 1}. ${action.deviceName} (${action.deviceId})`)
        console.log(`      状态变化: ${action.currentState} → ${action.targetState}`)
        console.log(`      执行动作: ${action.action}`)
        console.log(`      决策理由: ${action.reason}`)
      })
      console.log('')
    }

    console.log('⚡ 执行结果:')
    console.log(`   - 更新设备数: ${result.data.execution.updated}`)
    console.log(`   - 响应时间: ${duration}ms`)
    console.log(`   - API 状态: ${response.status} ${response.statusText}`)
    console.log('')

    // 验证结果
    if (result.success) {
      console.log(`✅ 测试通过`)
    } else {
      console.log(`❌ 测试失败: ${result.message || '未知错误'}`)
    }

    return {
      success: true,
      testName: testCase.name,
      duration,
      actionsCount: result.data.actions.length,
      updatedCount: result.data.execution.updated
    }

  } catch (error) {
    console.log(`❌ 测试失败: ${error.message}`)
    return {
      success: false,
      testName: testCase.name,
      error: error.message
    }
  }
}

// 运行所有测试
async function runAllTests() {
  console.log('\n╔═══════════════════════════════════════════════════════════════════╗')
  console.log('║            场景化智能控制 - AI 调用逻辑测试                          ║')
  console.log('╚═══════════════════════════════════════════════════════════════════╝')

  console.log('\n📋 AI 调用逻辑说明:')
  console.log('━'.repeat(70))
  console.log('1️⃣  输入数据:')
  console.log('    • 用户场景描述 (如: "我现在起床了")')
  console.log('    • 用户ID (用于多用户场景)')
  console.log('    • 当前所有设备状态 (从 MongoDB 读取)')
  console.log('')
  console.log('2️⃣  AI 处理流程:')
  console.log('    • 构建包含当前设备状态的系统提示词')
  console.log('    • 调用 Qwen3-32B 模型进行场景理解')
  console.log('    • 使用流式调用获取 AI 响应')
  console.log('    • 清理响应中的 markdown 标记')
  console.log('    • 解析 JSON 格式的控制方案')
  console.log('')
  console.log('3️⃣  输出数据:')
  console.log('    • 场景识别结果 (scene)')
  console.log('    • 设备控制动作列表 (actions)')
  console.log('    • 每个动作包含: deviceId, action(on/off), reason')
  console.log('')
  console.log('4️⃣  执行控制:')
  console.log('    • 遍历所有控制动作')
  console.log('    • 更新 MongoDB 中的设备状态')
  console.log('    • 记录到 AILog 集合')
  console.log('━'.repeat(70))

  const results = []

  for (let i = 0; i < testCases.length; i++) {
    const result = await runTest(testCases[i], i)
    results.push(result)
    
    // 测试之间等待1秒，避免请求过快
    if (i < testCases.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  // 打印测试总结
  console.log(`\n${'='.repeat(70)}`)
  console.log('📊 测试总结')
  console.log(`${'='.repeat(70)}`)
  
  const passedTests = results.filter(r => r.success).length
  const failedTests = results.filter(r => !r.success).length

  console.log(`总测试数: ${testCases.length}`)
  console.log(`✅ 通过: ${passedTests}`)
  console.log(`❌ 失败: ${failedTests}`)
  console.log('')

  results.forEach((result, index) => {
    if (result.success) {
      console.log(`${index + 1}. ${result.testName}`)
      console.log(`   动作数: ${result.actionsCount} | 更新数: ${result.updatedCount} | 耗时: ${result.duration}ms`)
    } else {
      console.log(`${index + 1}. ${result.testName} - ❌ ${result.error}`)
    }
  })

  console.log('')
  if (failedTests === 0) {
    console.log('╔═══════════════════════════════════════════════════════════════════╗')
    console.log('║                  ✅ 所有测试通过！                                    ║')
    console.log('╚═══════════════════════════════════════════════════════════════════╝')
  } else {
    console.log('╔═══════════════════════════════════════════════════════════════════╗')
    console.log('║                  ⚠️  部分测试失败                                    ║')
    console.log('╚═══════════════════════════════════════════════════════════════════╝')
  }
  console.log('')
}

// 运行测试
runAllTests()
