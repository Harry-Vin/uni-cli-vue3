export default {
  // API配置
  apiBaseUrl: 'https://dev-api.example.com',
  
  // 缓存配置
  cache: {
    encryption: {
      enabled: false, // 开发环境不启用缓存加密
      key: ''
    }
  },
  
  // 应用配置
  app: {
    name: 'Uniapp开发环境',
    version: '1.0.0'
  }
}