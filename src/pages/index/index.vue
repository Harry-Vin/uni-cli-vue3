<template>
  <view class="content">
    <image class="logo" src="/static/logo.png"></image>
    <view class="text-area">
      <text class="title">{{ title }}</text>
    </view>
    <view class="demo-btn-area">
      <button class="demo-btn" @click="goToDemo">查看框架功能演示</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      title: 'Uniapp 基础框架模板',
    }
  },
  onLoad() {},
  methods: {
    goToDemo() {
      uni.navigateTo({
        url: '/pages/demo/index'
      })
    }
  },
}
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
  margin-bottom: 60rpx;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}

.demo-btn-area {
  margin-top: 40rpx;
}

.demo-btn {
  background-color: #007aff;
  color: white;
  border: none;
  border-radius: 8rpx;
  padding: 24rpx 48rpx;
  font-size: 32rpx;
  cursor: pointer;
  transition: background-color 0.2s;
}

.demo-btn:hover {
  background-color: #0056cc;
}
</style>
