import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: uni.getStorageSync('token') || '',
    userInfo: uni.getStorageSync('userInfo') || {}
  }),

  getters: {
    isLoggedIn: (state) => !!state.token
  },

  actions: {
    setToken(token) {
      this.token = token
      uni.setStorageSync('token', token)
    },

    setUserInfo(userInfo) {
      this.userInfo = userInfo
      uni.setStorageSync('userInfo', userInfo)
    },

    async login(loginData) {
      try {
        // 模拟异步登录请求
        const response = await new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              token: 'mock-token-' + Date.now(),
              userInfo: {
                id: 1,
                username: loginData.username || 'testuser',
                nickname: '测试用户',
                avatar: ''
              }
            })
          }, 1000)
        })

        if (response.success) {
          this.setToken(response.token)
          this.setUserInfo(response.userInfo)
          return { success: true, data: response }
        } else {
          throw new Error('登录失败')
        }
      } catch (error) {
        console.error('登录错误:', error)
        throw error
      }
    },

    logout() {
      this.token = ''
      this.userInfo = {}
      uni.removeStorageSync('token')
      uni.removeStorageSync('userInfo')
    }
  }
})