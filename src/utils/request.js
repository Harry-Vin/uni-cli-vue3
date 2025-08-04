import config from '@/config'
import { useUserStore } from '@/store/modules/user'

class Request {
  constructor() {
    this.baseUrl = config.apiBaseUrl
    this.timeout = 10000
  }

  /**
   * 统一请求方法
   * @param {Object} options 请求配置
   * @param {string} options.url 请求地址
   * @param {string} options.method 请求方法 GET|POST|PUT|DELETE
   * @param {Object} options.data 请求数据
   * @param {Object} options.header 请求头
   * @param {boolean} options.showLoading 是否显示loading
   * @param {boolean} options.handleError 是否统一处理错误
   */
  request(options = {}) {
    const {
      url,
      method = 'GET',
      data = {},
      header = {},
      showLoading = true,
      handleError = true
    } = options

    // 显示loading
    if (showLoading) {
      uni.showLoading({
        title: '加载中...',
        mask: true
      })
    }

    // 处理请求头
    const requestHeader = {
      'Content-Type': 'application/json',
      ...header
    }

    // 添加token到请求头（如果已登录）
    // 注意：这里使用了Pinia store的示例，实际使用时需要确保store已正确初始化
    try {
      const userStore = useUserStore()
      if (userStore.token) {
        requestHeader.Authorization = `Bearer ${userStore.token}`
      }
    } catch (error) {
      console.warn('获取用户token失败:', error)
    }

    return new Promise((resolve, reject) => {
      uni.request({
        url: this.baseUrl + url,
        method,
        data,
        header: requestHeader,
        timeout: this.timeout,
        success: (response) => {
          if (showLoading) {
            uni.hideLoading()
          }

          const { statusCode, data: responseData } = response

          // HTTP状态码处理
          if (statusCode === 200) {
            // 业务状态码处理
            if (responseData.code === 200 || responseData.success === true) {
              resolve(responseData)
            } else {
              // 业务错误处理
              const errorMsg = responseData.message || responseData.msg || '请求失败'
              if (handleError) {
                uni.showToast({
                  title: errorMsg,
                  icon: 'none',
                  duration: 2000
                })
              }
              reject(new Error(errorMsg))
            }
          } else {
            // HTTP错误处理
            const errorMsg = this.getHttpErrorMsg(statusCode)
            if (handleError) {
              uni.showToast({
                title: errorMsg,
                icon: 'none',
                duration: 2000
              })
            }
            reject(new Error(errorMsg))
          }
        },
        fail: (error) => {
          if (showLoading) {
            uni.hideLoading()
          }

          const errorMsg = this.getNetworkErrorMsg(error)
          if (handleError) {
            uni.showToast({
              title: errorMsg,
              icon: 'none',
              duration: 2000
            })
          }
          reject(new Error(errorMsg))
        }
      })
    })
  }

  /**
   * GET请求
   */
  get(url, data = {}, options = {}) {
    return this.request({
      url,
      method: 'GET',
      data,
      ...options
    })
  }

  /**
   * POST请求
   */
  post(url, data = {}, options = {}) {
    return this.request({
      url,
      method: 'POST',
      data,
      ...options
    })
  }

  /**
   * PUT请求
   */
  put(url, data = {}, options = {}) {
    return this.request({
      url,
      method: 'PUT',
      data,
      ...options
    })
  }

  /**
   * DELETE请求
   */
  delete(url, data = {}, options = {}) {
    return this.request({
      url,
      method: 'DELETE',
      data,
      ...options
    })
  }

  /**
   * 获取HTTP错误信息
   */
  getHttpErrorMsg(statusCode) {
    const errorMap = {
      400: '请求参数错误',
      401: '未授权，请重新登录',
      403: '拒绝访问',
      404: '请求资源不存在',
      405: '请求方法不允许',
      408: '请求超时',
      500: '服务器内部错误',
      502: '网关错误',
      503: '服务不可用',
      504: '网关超时'
    }
    return errorMap[statusCode] || `请求失败（${statusCode}）`
  }

  /**
   * 获取网络错误信息
   */
  getNetworkErrorMsg(error) {
    if (error.errMsg) {
      if (error.errMsg.includes('timeout')) {
        return '请求超时，请检查网络连接'
      }
      if (error.errMsg.includes('fail')) {
        return '网络连接失败，请检查网络'
      }
    }
    return '网络错误，请稍后重试'
  }
}

// 创建请求实例
const request = new Request()

export default request