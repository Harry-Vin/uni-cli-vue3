// 环境感知配置管理
// 根据构建环境动态导入对应的配置文件

import devConfig from './dev.js'
import prodConfig from './prod.js'

const config = import.meta.env.PROD ? prodConfig : devConfig

export default config