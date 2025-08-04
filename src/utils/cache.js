import CryptoJS from 'crypto-js'
import config from '@/config'

class Cache {
  constructor() {
    this.encryptionEnabled = config.cache.encryption.enabled
    this.encryptionKey = config.cache.encryption.key
  }

  /**
   * 数据加密
   * @param {any} data 待加密的数据
   * @returns {string} 加密后的字符串
   */
  _encrypt(data) {
    try {
      const jsonString = JSON.stringify(data)
      const encrypted = CryptoJS.AES.encrypt(jsonString, this.encryptionKey).toString()
      return encrypted
    } catch (error) {
      console.error('数据加密失败:', error)
      throw new Error('数据加密失败')
    }
  }

  /**
   * 数据解密
   * @param {string} encryptedData 加密的数据
   * @returns {any} 解密后的数据
   */
  _decrypt(encryptedData) {
    try {
      const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey)
      const decryptedString = decryptedBytes.toString(CryptoJS.enc.Utf8)
      
      if (!decryptedString) {
        throw new Error('解密结果为空')
      }
      
      return JSON.parse(decryptedString)
    } catch (error) {
      console.error('数据解密失败:', error)
      throw new Error('数据解密失败，缓存可能已损坏')
    }
  }

  /**
   * 设置缓存
   * @param {string} key 缓存键
   * @param {any} value 缓存值
   * @param {number} expire 过期时间（秒），可选
   */
  set(key, value, expire) {
    try {
      const data = {
        value,
        timestamp: Date.now(),
        expire: expire ? expire * 1000 : null
      }

      let storageData
      if (this.encryptionEnabled && this.encryptionKey) {
        // 生产环境加密存储
        storageData = this._encrypt(data)
      } else {
        // 开发环境直接存储
        storageData = JSON.stringify(data)
      }

      uni.setStorageSync(key, storageData)
    } catch (error) {
      console.error('缓存设置失败:', error)
      throw error
    }
  }

  /**
   * 获取缓存
   * @param {string} key 缓存键
   * @param {any} defaultValue 默认值
   * @returns {any} 缓存值或默认值
   */
  get(key, defaultValue = null) {
    try {
      const storageData = uni.getStorageSync(key)
      
      if (!storageData) {
        return defaultValue
      }

      let data
      if (this.encryptionEnabled && this.encryptionKey) {
        // 生产环境解密
        try {
          data = this._decrypt(storageData)
        } catch (decryptError) {
          console.warn(`缓存解密失败，清理受损缓存: ${key}`, decryptError)
          this.remove(key)
          return defaultValue
        }
      } else {
        // 开发环境直接解析
        data = JSON.parse(storageData)
      }

      // 检查是否过期
      if (data.expire && Date.now() > data.timestamp + data.expire) {
        console.log(`缓存已过期，自动清理: ${key}`)
        this.remove(key)
        return defaultValue
      }

      return data.value
    } catch (error) {
      console.error('缓存获取失败:', error)
      // 尝试清理可能损坏的缓存
      try {
        this.remove(key)
      } catch (removeError) {
        console.warn('清理损坏缓存失败:', removeError)
      }
      return defaultValue
    }
  }

  /**
   * 移除缓存
   * @param {string} key 缓存键
   */
  remove(key) {
    try {
      uni.removeStorageSync(key)
    } catch (error) {
      console.error('缓存移除失败:', error)
      throw error
    }
  }

  /**
   * 清空所有缓存
   */
  clear() {
    try {
      uni.clearStorageSync()
    } catch (error) {
      console.error('缓存清空失败:', error)
      throw error
    }
  }

  /**
   * 获取缓存信息
   * @returns {Object} 缓存信息
   */
  getInfo() {
    try {
      const info = uni.getStorageInfoSync()
      return {
        keys: info.keys,
        currentSize: info.currentSize,
        limitSize: info.limitSize,
        encryptionEnabled: this.encryptionEnabled
      }
    } catch (error) {
      console.error('获取缓存信息失败:', error)
      return {
        keys: [],
        currentSize: 0,
        limitSize: 0,
        encryptionEnabled: this.encryptionEnabled
      }
    }
  }
}

// 创建缓存实例
const cache = new Cache()

export default cache