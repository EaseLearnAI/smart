# SmartHome API 文档

基础 URL: `http://8.138.250.17:3000/api`

> **注意**: 单片机通信请使用上述 IP 地址进行 HTTP 请求

## 目录

- [设备管理 API](#设备管理-api)
- [AI 智能控制 API](#ai-智能控制-api)
- [场景化控制 API](#场景化控制-api-新)
- [单片机通信 API](#单片机通信-api)

---

## 设备管理 API

### GET /api/devices
获取所有设备，按类型分类。

**响应示例:**
```json
{
  "success": true,
  "data": {
    "control": [
      {
        "id": "led-1",
        "name": "LED 台灯",
        "location": "客厅",
        "icon": "lightbulb",
        "iconColor": "orange",
        "active": false
      }
    ],
    "sensor": [
      {
        "id": "temp-1",
        "name": "温湿度气压",
        "location": "客厅",
        "icon": "temperature-half",
        "iconColor": "green",
        "data": {
          "temperature": 27,
          "humidity": 78,
          "pressure": 1013
        },
        "lastUpdate": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

---

### POST /api/devices/seed
初始化数据库，插入默认设备数据。

**响应示例:**
```json
{
  "success": true,
  "message": "已初始化 6 个设备",
  "data": [...]
}
```

---

### POST /api/devices/{id}/toggle
切换设备开关状态。

**请求体:**
```json
{
  "active": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "deviceId": "led-1",
    "active": true,
    "message": "设备已开启",
    "commandId": "cmd_xxxxx"
  }
}
```

---

## AI 智能控制 API

### POST /api/ai/understand
解析用户语音/文字输入，理解控制意图。

**请求体:**
```json
{
  "input": "帮我打开客厅的灯",
  "location": "客厅"
}
```

**Response:**
```json
{
  "success": true,
  "understanding": {
    "intent": "开启灯光",
    "deviceId": "led-1",
    "deviceName": "LED 台灯",
    "deviceIcon": "lightbulb",
    "parameters": [
      { "icon": "power-off", "value": "开启" }
    ]
  }
}
```

---

### POST /api/ai/execute
执行 AI 推荐的设备控制操作。

**请求体:**
```json
{
  "deviceId": "led-1",
  "action": "on",
  "parameters": {}
}
```

**Response:**
```json
{
  "success": true,
  "message": "已开启LED 台灯",
  "commandId": "cmd_xxxxx"
}
```

--

## 场景化控制 API ⭐新

### POST /api/scene/execute
🎯 **核心功能**：根据用户描述的生活场景，AI 自动分析并控制相关设备。

**功能特性:**
- ✅ 支持模糊场景描述（如"我起床了"、"我要睡觉了"）
- ✅ AI 自动分析当前设备状态
- ✅ 智能决策需要调整的设备和目标状态
- ✅ 自动更新数据库中的设备状态
- ✅ 轻量化日志输出（已优化CPU占用）
- ✅ 支持用户 ID 绑定（预留多用户功能）

**请求体:**
```json
{
  "scene": "我现在起床了",
  "userId": "user123"  // 可选，用于多用户场景
}
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "scene": "起床场景",
    "reasoning": "用户起床了，需要打开照明设备方便活动，同时打开窗帘让室内采光更好...",
    "actions": [
      {
        "deviceId": "led-1",
        "deviceName": "LED 台灯",
        "currentState": "关闭",
        "targetState": "开启",
        "action": "on",
        "reason": "起床后需要照明"
      },
      {
        "deviceId": "curtain-1",
        "deviceName": "电机窗帘",
        "currentState": "关闭",
        "targetState": "开启",
        "action": "on",
        "reason": "打开窗帘增加室内采光"
      }
    ],
    "execution": {
      "updated": 2,
      "commands": []
    }
  }
}
```

**单片机调用示例 (ESP32/Arduino):**
```cpp
// 使用 HTTPClient 调用 API
#include <HTTPClient.h>

const char* serverUrl = "http://8.138.250.17:3000";

// 获取待执行命令
void getCommands() {
  HTTPClient http;
  http.begin(serverUrl + String("/api/mcu/commands"));
  int httpCode = http.GET();
  if (httpCode == 200) {
    String payload = http.getString();
    // 解析 JSON 并执行命令
  }
  http.end();
}

// 上报传感器数据
void reportSensorData(float temp, float humidity) {
  HTTPClient http;
  http.begin(serverUrl + String("/api/mcu/report"));
  http.addHeader("Content-Type", "application/json");
  String json = "{\"type\":\"sensor_data\",\"sensorData\":[{";
  json += "\"deviceId\":\"temp-1\",";
  json += "\"temperature\":" + String(temp) + ",";
  json += "\"humidity\":" + String(humidity) + "}]}";
  http.POST(json);
  http.end();
}
```

**使用场景示例:**
- `"我起床了"` → 打开灯光、窗帘
- `"我要睡觉了"` → 关闭灯光、窗帘
- `"我出门了"` → 关闭所有电器
- `"我回家了"` → 打开照明设备
- `"天气太热了"` → 根据温度传感器数据调整设备

---

## 单片机通信 API

### GET /api/mcu/commands
单片机获取待执行的命令。

**响应示例:**
```json
{
  "success": true,
  "commands": [
    {
      "commandId": "cmd_xxxxx",
      "deviceId": "led-1",
      "action": "on",
      "parameters": {}
    }
  ]
}
```

---

### POST /api/mcu/report
单片机上报传感器数据或命令执行完成状态。

**请求体（上报传感器数据）:**
```json
{
  "type": "sensor_data",
  "sensorData": [
    {
      "deviceId": "temp-1",
      "temperature": 25.5,
      "humidity": 65,
      "pressure": 1015
    }
  ]
}
```

**请求体（确认命令完成）:**
```json
{
  "type": "command_complete",
  "completedCommands": ["cmd_xxxxx", "cmd_yyyyy"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "数据上报成功"
}
```

---

## 错误响应

所有接口的错误响应格式如下：

```json
{
  "statusCode": 400,
  "statusMessage": "错误描述",
  "data": {
    "error": "详细错误信息"
  }
}
```

常见 HTTP 状态码：
- `200` - 成功
- `400` - 请求错误（参数无效）
- `404` - 资源不存在
- `500` - 服务器内部错误

---

## 功能改进总结

### 新增功能

#### 1. 场景化智能控制 ⭐
- **接口**: `POST /api/scene/execute`
- **核心价值**: 用户只需描述场景，AI 自动决策设备控制方案
- **技术实现**:
  - 集成 ModelScope AI (Qwen3-32B 模型)
  - 实时获取所有设备当前状态
  - AI 分析并生成设备控制计划
  - 自动更新数据库设备状态
  - 记录到 AILog 集合

#### 2. 用户 ID 绑定支持
- 所有 AI 相关接口支持 `userId` 参数
- 为未来多用户场景预留扩展能力
- 日志记录包含用户追踪信息

#### 3. 生产环境优化
- 移除所有终端日志打印，降低 CPU 占用
- PM2 进程管理，自动重启
- 支持外网 IP 访问（`8.138.250.17:3000`）

### 模块化设计

**新增文件**:
1. `/server/utils/scene-understanding.ts` - AI 场景理解服务
   - `understandScene()` - 场景分析
   - `executeSceneActions()` - 执行控制方案

2. `/server/api/scene/execute.post.ts` - 场景控制 API
   - 参数验证
   - AI 调用
   - 数据库更新
   - 日志记录

**保持原有逻辑**:
- ✅ 未修改任何现有 API 接口
- ✅ 未修改数据模型结构
- ✅ 完全独立的新功能模块
- ✅ 可选择性使用，不影响现有功能

### 数据流程

```
用户输入场景描述
     ↓
POST /api/scene/execute
     ↓
获取当前所有设备状态
     ↓
AI 分析生成控制方案
     ↓
更新数据库设备状态
     ↓
记录到 AILog
     ↓
返回执行结果
```

### 技术栈
- **服务器地址**: `http://8.138.250.17:3000`
- **AI 模型**: Qwen3-32B (ModelScope)
- **数据库**: MongoDB + Mongoose
- **进程管理**: PM2 (自动重启)
- **架构**: Nuxt 3 Server API

---

## 单片机通信摘要

### 快速开始

**服务器基础信息:**
- IP: `8.138.250.17`
- 端口: `3000`
- 协议: HTTP

**单片机常用端点:**

| 操作 | 方法 | URL | 用途 |
|------|------|-----|------|
| 获取命令 | GET | `/api/mcu/commands` | 拉取待执行的设备控制命令 |
| 上报数据 | POST | `/api/mcu/report` | 上报传感器数据/确认命令执行 |
| 查询设备 | GET | `/api/devices` | 获取所有设备状态 |

**建议轮询间隔:** 1-5 秒
