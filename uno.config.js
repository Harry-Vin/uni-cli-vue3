import { defineConfig, presetUno, presetAttributify, transformerDirectives } from 'unocss'

export default defineConfig({
  // 预设配置
  presets: [
    presetUno(), // 默认预设，包含常用工具类
    presetAttributify(), // 属性化模式预设
  ],

  // 变压器配置
  transformers: [
    transformerDirectives(), // 支持 @apply, @screen 等指令
  ],

  // 自定义规则示例
  rules: [
    // 自定义边框圆角规则
    [/^rounded-(\d+)$/, ([, d]) => ({ 'border-radius': `${d}px` })],
    // 自定义间距规则
    [/^m-(\d+)$/, ([, d]) => ({ margin: `${d}px` })],
    [/^p-(\d+)$/, ([, d]) => ({ padding: `${d}px` })],
  ],

  // 快捷方式配置
  shortcuts: {
    // 按钮样式快捷方式
    'btn': 'px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors',
    'btn-primary': 'btn bg-blue-500 hover:bg-blue-600',
    'btn-success': 'btn bg-green-500 hover:bg-green-600',
    'btn-danger': 'btn bg-red-500 hover:bg-red-600',
    
    // 卡片样式快捷方式
    'card': 'bg-white rounded-lg shadow-md p-4',
    
    // 布局快捷方式
    'flex-center': 'flex items-center justify-center',
    'flex-between': 'flex items-center justify-between',
  },

  // 主题配置
  theme: {
    colors: {
      primary: '#409eff',
      success: '#67c23a',
      warning: '#e6a23c',
      danger: '#f56c6c',
      info: '#909399',
    },
    fontFamily: {
      sans: ['PingFang SC', 'Helvetica Neue', 'Arial', 'sans-serif'],
    },
  },

  // 微信小程序兼容性处理
  // UnoCSS 在微信小程序中的 rpx 兼容性说明：
  // 
  // 1. 基本兼容性：
  //    - UnoCSS 生成的 CSS 单位主要是 px、rem、em 等
  //    - 在微信小程序中，Uniapp 会自动将 px 转换为 rpx（根据配置）
  //    - 这个转换是通过 Uniapp 的内部机制处理的，不需要额外配置
  // 
  // 2. 转换策略：
  //    - Uniapp 默认会将 CSS 中的 px 按比例转换为 rpx
  //    - 可以通过 pages.json 中的 "globalStyle" -> "rpxCalcMaxDeviceWidth" 控制转换
  //    - 或通过 manifest.json 中的 "mp-weixin" -> "setting" -> "postcss" 配置
  // 
  // 3. 备选方案（如需更精确控制）：
  //    - 可以使用 PostCSS 插件如 postcss-pxtorpx-pro 进行更精确的 px 到 rpx 转换
  //    - 安装：npm install postcss-pxtorpx-pro --save-dev
  //    - 在 vite.config.js 中配置 css.postcss.plugins
  // 
  // 4. 推荐做法：
  //    - 依赖 Uniapp 内置的转换机制（推荐）
  //    - 在开发时使用标准的 CSS 单位（px、rem 等）
  //    - 让 Uniapp 自动处理小程序端的适配

  // 排除文件（可选）
  exclude: [
    'node_modules/**/*',
  ],
})

/*
 * 微信小程序 rpx 兼容性详细说明：
 * 
 * UnoCSS 与微信小程序的集成主要依赖于 Uniapp 框架的转换机制：
 * 
 * 1. 自动转换：
 *    - Uniapp 编译到微信小程序时，会自动将 CSS 中的 px 单位转换为 rpx
 *    - 转换比例基于设计稿宽度（默认 750px）
 *    - 这确保了在不同屏幕尺寸的设备上保持一致的视觉效果
 * 
 * 2. 配置选项：
 *    在 pages.json 中可以配置：
 *    {
 *      "globalStyle": {
 *        "rpxCalcMaxDeviceWidth": 960,
 *        "rpxCalcBaseDeviceWidth": 375
 *      }
 *    }
 * 
 * 3. 如果需要更精确的控制，可以使用 PostCSS 插件：
 *    
 *    安装插件：
 *    npm install postcss-pxtorpx-pro --save-dev
 *    
 *    在 vite.config.js 中配置：
 *    export default defineConfig({
 *      css: {
 *        postcss: {
 *          plugins: [
 *            require('postcss-pxtorpx-pro')({
 *              transform: (size, unit) => {
 *                if (unit === 'px') {
 *                  return size * 2 + 'rpx'
 *                }
 *                return size + unit
 *              }
 *            })
 *          ]
 *        }
 *      }
 *    })
 * 
 * 4. 最佳实践：
 *    - 在开发时使用标准 UnoCSS 工具类（如 w-4, h-8, p-2 等）
 *    - 让 Uniapp 处理到小程序的适配转换
 *    - 在真机上测试以确保样式效果符合预期
 */