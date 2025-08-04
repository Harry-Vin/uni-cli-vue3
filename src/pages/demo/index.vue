<template>
  <view class="demo-page min-h-screen bg-gray-50 p-4">
    <!-- 页面标题 -->
    <view class="card mb-4">
      <text class="text-2xl font-bold text-primary mb-2 block">Uniapp基础框架演示</text>
      <text class="text-gray-600">展示Pinia、Request、Cache、UnoCSS等功能</text>
    </view>

    <!-- 用户状态展示 -->
    <view class="card mb-4">
      <text class="text-lg font-semibold mb-3 block">用户状态管理 (Pinia)</text>
      <view class="flex-between mb-2">
        <text>登录状态:</text>
        <text :class="userStore.isLoggedIn ? 'text-success' : 'text-danger'">
          {{ userStore.isLoggedIn ? '已登录' : '未登录' }}
        </text>
      </view>
      <view v-if="userStore.isLoggedIn" class="mb-3">
        <text class="text-sm text-gray-600 block mb-1">用户信息:</text>
        <text class="text-sm">{{ userStore.userInfo.nickname || '暂无昵称' }}</text>
      </view>
      <view class="flex gap-2">
        <button 
          v-if="!userStore.isLoggedIn"
          class="btn-primary flex-1" 
          @click="handleLogin"
          :disabled="loading.login"
        >
          {{ loading.login ? '登录中...' : '模拟登录' }}
        </button>
        <button 
          v-else
          class="btn-danger flex-1" 
          @click="handleLogout"
        >
          退出登录
        </button>
      </view>
    </view>

    <!-- 网络请求演示 -->
    <view class="card mb-4">
      <text class="text-lg font-semibold mb-3 block">网络请求演示 (Request)</text>
      <view class="flex gap-2 mb-3">
        <button 
          class="btn-primary flex-1" 
          @click="handleApiRequest"
          :disabled="loading.api"
        >
          {{ loading.api ? '请求中...' : '发起API请求' }}
        </button>
        <button 
          class="btn flex-1 bg-orange-500 hover:bg-orange-600" 
          @click="handleApiError"
          :disabled="loading.error"
        >
          {{ loading.error ? '请求中...' : '测试错误处理' }}
        </button>
      </view>
      <view v-if="apiResult" class="bg-gray-100 p-3 rounded">
        <text class="text-sm text-gray-700">API返回结果:</text>
        <text class="text-xs text-gray-600 block mt-1">{{ apiResult }}</text>
      </view>
    </view>

    <!-- 缓存操作演示 -->
    <view class="card mb-4">
      <text class="text-lg font-semibold mb-3 block">缓存操作演示 (Cache)</text>
      <view class="mb-3">
        <text class="text-sm text-gray-600 block mb-2">
          当前环境: {{ isProduction ? '生产环境(加密)' : '开发环境(不加密)' }}
        </text>
        <input 
          v-model="cacheTestData" 
          class="w-full p-2 border border-gray-300 rounded mb-2"
          placeholder="输入要缓存的数据"
        />
      </view>
      <view class="flex gap-2 mb-3">
        <button class="btn-success flex-1" @click="handleSetCache">
          设置缓存
        </button>
        <button class="btn-primary flex-1" @click="handleGetCache">
          读取缓存
        </button>
        <button class="btn-danger flex-1" @click="handleClearCache">
          清除缓存
        </button>
      </view>
      <view v-if="cachedData" class="bg-gray-100 p-3 rounded">
        <text class="text-sm text-gray-700">缓存数据:</text>
        <text class="text-xs text-gray-600 block mt-1">{{ cachedData }}</text>
      </view>
    </view>

    <!-- UnoCSS样式演示 -->
    <view class="card mb-4">
      <text class="text-lg font-semibold mb-3 block">UnoCSS样式演示</text>
      <view class="grid grid-cols-2 gap-2 mb-3">
        <view class="bg-primary text-white text-center py-2 rounded">
          Primary色彩
        </view>
        <view class="bg-success text-white text-center py-2 rounded">
          Success色彩
        </view>
        <view class="bg-warning text-white text-center py-2 rounded">
          Warning色彩
        </view>
        <view class="bg-danger text-white text-center py-2 rounded">
          Danger色彩
        </view>
      </view>
      <view class="flex-center bg-gradient-to-r from-blue-400 to-purple-500 text-white py-4 rounded">
        <text>渐变背景 + Flex居中</text>
      </view>
    </view>

    <!-- 缓存信息 -->
    <view class="card">
      <text class="text-lg font-semibold mb-3 block">缓存信息</text>
      <view class="text-sm text-gray-600">
        <view class="mb-1">缓存键数量: {{ cacheInfo.keys.length }}</view>
        <view class="mb-1">加密状态: {{ cacheInfo.encryptionEnabled ? '已启用' : '未启用' }}</view>
        <view>当前大小: {{ cacheInfo.currentSize }}KB</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { userAPI } from '@/api/modules/user'
import cache from '@/utils/cache'
import request from '@/utils/request'

// 状态管理
const userStore = useUserStore()

// 响应式数据
const loading = reactive({
  login: false,
  api: false,
  error: false
})

const apiResult = ref('')
const cacheTestData = ref('测试缓存数据 - ' + new Date().toLocaleTimeString())
const cachedData = ref('')
const cacheInfo = reactive({
  keys: [],
  currentSize: 0,
  limitSize: 0,
  encryptionEnabled: false
})

// 计算属性
const isProduction = computed(() => {
  return import.meta.env.PROD
})

// 方法定义
const handleLogin = async () => {
  loading.login = true
  try {
    await userStore.login({
      username: 'testuser',
      password: '123456'
    })
    uni.showToast({
      title: '登录成功',
      icon: 'success'
    })
  } catch (error) {
    uni.showToast({
      title: '登录失败: ' + error.message,
      icon: 'none'
    })
  } finally {
    loading.login = false
  }
}

const handleLogout = () => {
  userStore.logout()
  uni.showToast({
    title: '已退出登录',
    icon: 'success'
  })
}

const handleApiRequest = async () => {
  loading.api = true
  try {
    // 模拟成功的API请求
    const mockResponse = {
      success: true,
      code: 200,
      data: {
        message: '这是一个模拟的API响应',
        timestamp: new Date().toISOString(),
        userAgent: 'Uniapp Demo'
      }
    }
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    apiResult.value = JSON.stringify(mockResponse, null, 2)
    
    uni.showToast({
      title: 'API请求成功',
      icon: 'success'
    })
  } catch (error) {
    apiResult.value = `请求失败: ${error.message}`
  } finally {
    loading.api = false
  }
}

const handleApiError = async () => {
  loading.error = true
  try {
    // 模拟失败的API请求
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('模拟的网络错误'))
      }, 800)
    })
  } catch (error) {
    apiResult.value = `错误处理演示: ${error.message}`
    // request.js中的错误处理会自动显示toast
  } finally {
    loading.error = false
  }
}

const handleSetCache = () => {
  if (!cacheTestData.value.trim()) {
    uni.showToast({
      title: '请输入要缓存的数据',
      icon: 'none'
    })
    return
  }
  
  try {
    const testObject = {
      content: cacheTestData.value,
      timestamp: new Date().toISOString(),
      type: 'demo-data'
    }
    
    cache.set('demo-cache-key', testObject, 3600) // 缓存1小时
    
    uni.showToast({
      title: '缓存设置成功',
      icon: 'success'
    })
    
    updateCacheInfo()
  } catch (error) {
    uni.showToast({
      title: '缓存设置失败: ' + error.message,
      icon: 'none'
    })
  }
}

const handleGetCache = () => {
  try {
    const cached = cache.get('demo-cache-key')
    if (cached) {
      cachedData.value = JSON.stringify(cached, null, 2)
      uni.showToast({
        title: '缓存读取成功',
        icon: 'success'
      })
    } else {
      cachedData.value = '未找到缓存数据'
      uni.showToast({
        title: '未找到缓存',
        icon: 'none'
      })
    }
  } catch (error) {
    cachedData.value = `读取失败: ${error.message}`
    uni.showToast({
      title: '缓存读取失败: ' + error.message,
      icon: 'none'
    })
  }
}

const handleClearCache = () => {
  try {
    cache.remove('demo-cache-key')
    cachedData.value = ''
    
    uni.showToast({
      title: '缓存清除成功',
      icon: 'success'
    })
    
    updateCacheInfo()
  } catch (error) {
    uni.showToast({
      title: '缓存清除失败: ' + error.message,
      icon: 'none'
    })
  }
}

const updateCacheInfo = () => {
  try {
    const info = cache.getInfo()
    Object.assign(cacheInfo, info)
  } catch (error) {
    console.error('获取缓存信息失败:', error)
  }
}

// 生命周期
onMounted(() => {
  updateCacheInfo()
})
</script>

<style scoped>
/* 这里可以添加局部样式，但主要依赖UnoCSS */
.demo-page {
  /* UnoCSS类名：min-h-screen bg-gray-50 p-4 */
}

input {
  /* 输入框样式补充 */
  box-sizing: border-box;
}

button {
  /* 按钮样式补充 */
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>