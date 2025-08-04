export default {
  // API配置
  apiBaseUrl: 'https://api.example.com',
  
  // 缓存配置
  cache: {
    encryption: {
      enabled: true, // 生产环境启用缓存加密
      // ⚠️ 重要安全提醒：请确保VITE_APP_CACHE_ENCRYPTION_KEY环境变量的安全性
      // 1. 使用强密码（至少32位随机字符）
      // 2. 不要在代码中硬编码密钥
      // 3. 在CI/CD中安全地注入环境变量
      // 4. 定期轮换加密密钥
      key: import.meta.env.VITE_APP_CACHE_ENCRYPTION_KEY || ''
    }
  },
  
  // 应用配置
  app: {
    name: 'Uniapp生产环境',
    version: '1.0.0'
  }
}