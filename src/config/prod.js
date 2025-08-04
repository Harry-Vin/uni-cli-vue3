export default {
  // API配置
  apiBaseUrl: 'https://api.example.com',
  
  // 缓存配置
  cache: {
    encryption: {
      enabled: true, // 生产环境启用缓存加密
      // ⚠️ 重要安全提醒：如果强调安全性，请不要将key明文存储
      // 1. 使用强密码（至少32位随机字符）
      // 2. 不要在代码中硬编码密钥
      // 3. 在CI/CD中安全地注入环境变量
      // 4. 定期轮换加密密钥
      key: "8H5u\CVr7xgUf@LyMwZW2A=iSESH1Lx%"
    }
  },
  
  // 应用配置
  app: {
    name: 'Uniapp生产环境',
    version: '1.0.0'
  }
}