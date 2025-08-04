```markdown
# Uniapp 多端应用基础框架构建任务列表

**致AI的通用前言：**

你是一个经验丰富的前端架构师和编程专家，擅长使用 Vue 3、Vite 和 Uniapp 构建高性能、可维护的多端应用。我将为你布置一系列任务，请你严格按照每条指令的要求，生成精确、可执行的代码或详细的实现说明。请确保代码的安全性、性能和可维护性。在每个任务完成后，请将该任务末尾的“❌”标记替换为“✔”。


## 任务 1: 构建目录结构 ✔

**AI提示词：**
“鉴于我们后续的开发需求（网络请求、缓存、状态管理、组件、工具函数等），请设计并生成一份清晰、可扩展且符合 Uniapp 实践的 `/src` 目录结构。该结构应包含以下关键部分及其子目录：

*   `api/` (模块化 API 定义)
*   `assets/` (静态资源)
*   `components/` (通用和业务组件)
*   `composables/` (可复用逻辑 Hook)
*   `constants/` (常量定义)
*   `config/` (环境配置)
*   `pages/` (页面目录)
*   `store/` (Pinia 状态管理模块)
*   `styles/` (全局样式)
*   `utils/` (工具函数，包含`request.js`和`cache.js`)
*   以及 `App.vue` 和 `main.js`。

请以树形结构的形式清晰列出每个目录和文件的路径。请勿生成文件内容，只需目录结构。”

---

## 任务 2: Pinia 状态管理集成 ✔

**AI提示词：**
“请为 `my-uniapp-base-project` 集成 Pinia 作为全局状态管理方案。

1.  **安装依赖:** 列出需要安装的 Pinia 相关 npm/yarn 依赖。
2.  **`src/store/index.js`:** 创建 Pinia 的入口文件，负责 `createPinia()` 并导出 `setupStore` 函数供 `main.js` 调用。
3.  **`src/store/modules/user.js`:** 创建一个示例的 `user` 模块 store。该 store 应该包含：
    *   `state` (例如 `token`, `userInfo`)
    *   `getters` (例如 `isLoggedIn`)
    *   `actions` (例如 `setToken`, `setUserInfo`, `login` 模拟异步登录, `logout`)
4.  **`src/main.js` 更新:** 修改 `main.js` 以便正确地使用 `createSSRApp` 创建应用实例，并挂载 Pinia。

请提供上述所有文件的完整代码内容。”

---

## 3. 环境感知配置管理 ✔

**AI提示词：**
“请实现应用的按需加载配置文件功能，以支持开发环境和生产环境的不同配置，并为缓存加密功能预留配置项。

1.  **`src/config/dev.js`:** 创建开发环境配置文件，其中 `cache.encryption.enabled` 设为 `false`，并包含 `apiBaseUrl`。
2.  **`src/config/prod.js`:** 创建生产环境配置文件，其中 `cache.encryption.enabled` 设为 `true`，且 `cache.encryption.key` 从 `import.meta.env.VITE_APP_CACHE_ENCRYPTION_KEY` 获取。请务必添加关于该密钥安全性的重要警告注释。
3.  **`src/config/index.js`:** 创建配置文件的入口，通过 `import.meta.env.PROD` 条件判断，动态导出 `dev.js` 或 `prod.js` 的配置。

请提供这三个文件的完整代码内容。”

---

## 4. 网络请求统一封装 ✔

**AI提示词：**
“请对 Uniapp 的 `uni.request` 进行统一封装，以提供更健壮的网络请求服务。

1.  **`src/utils/request.js`:**
    *   从 `src/config` 导入配置，获取 `apiBaseUrl`。
    *   实现统一的 `request` 函数，支持 `GET`, `POST`, `PUT`, `DELETE` 等 HTTP 方法。
    *   集成请求拦截（例如添加 `Authorization` 请求头，可从 Pinia `userStore` 获取 token）。
    *   集成响应拦截（处理 HTTP 状态码和业务错误码，并统一弹窗提示）。
    *   集成错误拦截（处理网络中断、超时等）。
    *   支持请求时显示 `uni.showLoading` 和请求完成后 `uni.hideLoading`。
    *   支持通过参数控制是否显示 loading 和是否统一处理错误。
2.  **`src/api/modules/user.js` (示例):** 创建一个简单的用户 API 模块，包含 `login` 和 `getUserInfo` 等示例函数，并导入和使用 `request`。

请提供 `src/utils/request.js` 和 `src/api/modules/user.js` 的完整代码。并在 `request.js` 中添加引入 `useUserStore` 的示例代码行。”

---

## 5. 缓存操作统一封装与加密 ✔

**AI提示词：**
“请对 Uniapp 的本地缓存操作（`uni.setStorageSync`, `uni.getStorageSync`）进行统一封装，并集成生产环境的缓存加密功能。

1.  **安装依赖:** 列出需要安装的 `crypto-js` 依赖。
2.  **`src/utils/cache.js`:**
    *   从 `src/config` 导入环境配置，判断 `cache.encryption.enabled` 和获取 `cache.encryption.key`。
    *   实现 `_encrypt(data)` 和 `_decrypt(encryptedData)` 方法，使用 `crypto-js` 的 AES 算法进行加密和解密，并处理解密失败的情况。
    *   重构 `set(key, value, expire)` 方法，在写入本地存储前，根据配置决定是否对 `JSON.stringify` 后的数据进行加密。
    *   重构 `get(key, defaultValue)` 方法，在读取本地存储后，根据配置决定是否进行解密，并在解密失败时抛出错误或返回默认值并清理受损缓存。
    *   保持 `remove(key)` 和 `clear()` 方法。

请提供 `src/utils/cache.js` 的完整代码。”

---

## 6. UnoCSS 集成与小程序兼容性 ✔

**AI提示词：**
“请将 UnoCSS 集成到项目中，并确保其在微信小程序的兼容性。

1.  **安装依赖:** 列出需要安装的 UnoCSS 相关 npm/yarn 依赖，包括核心库、预设 (`preset-uno`, `preset-attributify`) 以及变压器 (`transformer-directives`)。
2.  **`vite.config.js` 更新:** 在 `vite.config.js` 中添加 UnoCSS 插件。
3.  **`uno.config.js`:** 创建 UnoCSS 配置文件，配置 `presets` 和 `transformers`。请添加 `rules` 和 `shortcuts` 的简单示例，并详细说明 UnoCSS 在微信小程序中 `rpx` 兼容性的处理策略（可以依赖 Uniapp 内部转换机制，或者提及 PostCSS 插件 `postcss-pxtorpx-pro` 作为备选方案）。
4.  **`src/main.js` 更新:** 确保在 `main.js` 中导入 `virtual:uno.css`。

请提供更新后的 `vite.config.js`、`uno.config.js` 的完整代码以及针对小程序 `rpx` 兼容性的详细文字说明。”

---

## 7. 更新 `package.json` 构建脚本 ✔

**AI提示词：**
“请更新 `package.json` 中的 `scripts` 部分，为 H5、微信小程序和 App 平台添加 `dev` 和 `build` 命令。

1.  **环境变量注入:** 在 `build` 命令中，通过 `cross-env` 注入 `NODE_ENV=production`、`VITE_APP_ENV=production` 和 `VITE_APP_BASE_API`。
2.  **加密密钥注入:** 额外地，在 `build` 命令中通过 `cross-env` 注入 `VITE_APP_CACHE_ENCRYPTION_KEY` 并使用占位符 `YOUR_SECURE_PROD_CACHE_KEY_HERE` 提示用户替换。
3.  **开发环境:** `dev` 命令应设置 `NODE_ENV=development` 和 `VITE_APP_ENV=development`，并配置相应的 API 地址。

请提供 `package.json` 中完整更新后的 `scripts` 部分内容，并提醒用户安装 `cross-env`。”

---

## 8. 示例页面和组件使用 ✔

**AI提示词：**
“现在，请创建一个示例 Vue 页面，展示如何使用我们搭建的基础框架功能。

1.  **`src/pages/demo/index.vue`:**
    *   在该页面中，演示如何通过 `src/utils/request.js` 进行网络请求（例如调用之前定义的 `user.js` 中的 API）。
    *   演示如何通过 `src/utils/cache.js` 进行缓存的存取和移除，重点展示在生产环境会被加密的数据存储。
    *   在该页面的 `template` 中使用 UnoCSS 的原子类，以及我们定义的 `shortcuts` 和 `theme` 中的颜色，以验证 UnoCSS 的集成效果。
    *   演示如何通过 Pinia 获取和更新 store 中的状态。
    *   （可选）可以添加一些按钮来触发这些操作。

请提供 `src/pages/demo/index.vue` 的完整代码。”
```