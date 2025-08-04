import request from '@/utils/request'

/**
 * 用户相关API
 */
export const userAPI = {
  /**
   * 用户登录
   * @param {Object} data 登录数据
   * @param {string} data.username 用户名
   * @param {string} data.password 密码
   */
  login(data) {
    return request.post('/auth/login', data)
  },

  /**
   * 获取用户信息
   */
  getUserInfo() {
    return request.get('/user/info')
  },

  /**
   * 更新用户信息
   * @param {Object} data 用户信息
   */
  updateUserInfo(data) {
    return request.put('/user/info', data)
  },

  /**
   * 修改密码
   * @param {Object} data 密码数据
   * @param {string} data.oldPassword 旧密码
   * @param {string} data.newPassword 新密码
   */
  changePassword(data) {
    return request.post('/user/change-password', data)
  },

  /**
   * 用户退出登录
   */
  logout() {
    return request.post('/auth/logout')
  }
}

export default userAPI