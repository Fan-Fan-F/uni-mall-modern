<template>
  <div class="my-page">
    <!-- 用户信息卡片 -->
    <header class="user-header">
      <div class="user-profile">
        <img :src="userInfo.avatar" :alt="userInfo.name" class="avatar" />
        <div class="profile-info">
          <div class="name-row">
            <span class="user-name">{{ userInfo.name }}</span>
            <span class="level-tag">{{ userInfo.level }}</span>
          </div>
          <span class="user-id">会员号: 8820261118</span>
        </div>
      </div>
    </header>

    <!-- 订单快捷状态入口卡片 -->
    <div class="card order-hub-card">
      <div class="hub-header" @click="goToOrders(ORDER_STATUS.ALL)">
        <span class="hub-title">我的订单</span>
        <span class="all-orders-link">全部订单 ›</span>
      </div>
      <div class="order-status-grid">
        <div class="status-item" @click="goToOrders(ORDER_STATUS.PENDING_PAYMENT)">
          <div class="icon-wrap">
            <span class="icon">💳</span>
            <span v-if="orderStore.statusCounts.pending_payment > 0" class="badge">
              {{ orderStore.statusCounts.pending_payment }}
            </span>
          </div>
          <span class="label">待付款</span>
        </div>

        <div class="status-item" @click="goToOrders(ORDER_STATUS.PENDING_DISPATCH)">
          <div class="icon-wrap">
            <span class="icon">📦</span>
            <span v-if="orderStore.statusCounts.pending_dispatch > 0" class="badge">
              {{ orderStore.statusCounts.pending_dispatch }}
            </span>
          </div>
          <span class="label">待发货</span>
        </div>

        <div class="status-item" @click="goToOrders(ORDER_STATUS.PENDING_RECEIPT)">
          <div class="icon-wrap">
            <span class="icon">🚚</span>
            <span v-if="orderStore.statusCounts.pending_receipt > 0" class="badge">
              {{ orderStore.statusCounts.pending_receipt }}
            </span>
          </div>
          <span class="label">待收货</span>
        </div>

        <div class="status-item" @click="goToOrders(ORDER_STATUS.COMPLETED)">
          <div class="icon-wrap">
            <span class="icon">⭐</span>
          </div>
          <span class="label">已完成</span>
        </div>
      </div>
    </div>

    <!-- 资产面板 -->
    <div class="card asset-card">
      <div class="asset-item" @click="showAssetTip('优惠券')">
        <span class="num">3</span>
        <span class="label">优惠券</span>
      </div>
      <div class="asset-item" @click="showAssetTip('账户余额')">
        <span class="num">¥{{ formatPrice(userInfo.balance) }}</span>
        <span class="label">账户余额</span>
      </div>
      <div class="asset-item" @click="showAssetTip('积分')">
        <span class="num">{{ userInfo.points }}</span>
        <span class="label">会员积分</span>
      </div>
      <div class="asset-item" @click="goToFavorites">
        <span class="num">{{ userStore.favorites.length }}</span>
        <span class="label">我的收藏</span>
      </div>
    </div>

    <!-- 常用服务列表 -->
    <div class="card service-menu-card">
      <div class="menu-item" @click="goToAddress">
        <div class="menu-left">
          <span class="menu-icon">📍</span>
          <span class="menu-title">收货地址管理</span>
        </div>
        <span class="menu-arrow">›</span>
      </div>

      <div class="menu-item" @click="showServiceCustomer">
        <div class="menu-left">
          <span class="menu-icon">🎧</span>
          <span class="menu-title">官方在线客服</span>
        </div>
        <span class="menu-arrow">›</span>
      </div>

      <div class="menu-item" @click="handleClearCache">
        <div class="menu-left">
          <span class="menu-icon">🧹</span>
          <span class="menu-title">重置演示数据与缓存</span>
        </div>
        <span class="menu-arrow">›</span>
      </div>

      <div class="menu-item" @click="showAbout">
        <div class="menu-left">
          <span class="menu-icon">ℹ️</span>
          <span class="menu-title">关于 uni-mall-modern</span>
        </div>
        <span class="menu-arrow">›</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../stores/user.js';
import { useOrderStore, ORDER_STATUS } from '../../stores/order.js';
import { formatPrice } from '../../utils/format.js';

const router = useRouter();
const userStore = useUserStore();
const orderStore = useOrderStore();

const userInfo = computed(() => userStore.userInfo);

function goToOrders(status) {
  router.push(`/order/list?status=${status}`);
}

function goToAddress() {
  router.push('/address');
}

function goToFavorites() {
  alert(`您已收藏 ${userStore.favorites.length} 件商品。可在首页或分类页查看心仪好物。`);
}

function showAssetTip(name) {
  alert(`您的${name}状态正常，下单时已支持自动抵扣。`);
}

function showServiceCustomer() {
  alert('官方客服热线：400-888-2026\n在线服务时间：每日 09:00 - 22:00');
}

function handleClearCache() {
  if (confirm('是否重置商城本地缓存数据？')) {
    window.localStorage.clear();
    location.reload();
  }
}

function showAbout() {
  alert('uni-mall-modern v1.0.0\n现代 Vue 3 + Vite + Pinia 电商重构模板');
}
</script>

<style scoped>
.my-page {
  padding-bottom: 30px;
}

.user-header {
  background: var(--primary-gradient);
  padding: 30px 16px 40px;
  color: #fff;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 14px;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.8);
  object-fit: cover;
}

.profile-info {
  display: flex;
  flex-direction: column;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-name {
  font-size: 18px;
  font-weight: 700;
}

.level-tag {
  background: rgba(255, 255, 255, 0.25);
  font-size: 11px;
  padding: 2px 8px;
  border-radius: var(--radius-round);
}

.user-id {
  font-size: 11px;
  opacity: 0.85;
  margin-top: 4px;
}

.order-hub-card {
  margin-top: -20px;
  padding: 14px;
}

.hub-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
}

.hub-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-main);
}

.all-orders-link {
  font-size: 12px;
  color: var(--text-muted);
}

.order-status-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding-top: 14px;
}

.status-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.icon-wrap {
  position: relative;
  font-size: 24px;
  line-height: 1;
}

.icon-wrap .badge {
  position: absolute;
  top: -4px;
  right: -8px;
  background-color: var(--danger-color);
  color: #fff;
  font-size: 9px;
  font-weight: bold;
  border-radius: 10px;
  padding: 1px 4px;
  line-height: 1;
}

.status-item .label {
  font-size: 12px;
  color: var(--text-regular);
  margin-top: 6px;
}

.asset-card {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 16px 0;
  text-align: center;
}

.asset-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.asset-item .num {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-main);
  font-family: 'DIN Alternate', PingFangSC-Medium, sans-serif;
}

.asset-item .label {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 4px;
}

.service-menu-card {
  padding: 0 14px;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.menu-icon {
  font-size: 18px;
}

.menu-title {
  font-size: 14px;
  color: var(--text-main);
}

.menu-arrow {
  font-size: 18px;
  color: var(--text-muted);
}
</style>
