<template>
  <div class="order-list-page">
    <NavBar title="我的订单" :show-back="true" />

    <!-- 顶部状态分类 Tab -->
    <div class="tabs-nav">
      <div
        v-for="tab in statusTabs"
        :key="tab.status"
        class="tab-nav-item"
        :class="{ active: currentTab === tab.status }"
        @click="switchTab(tab.status)"
      >
        <span class="tab-label">{{ tab.label }}</span>
        <span
          v-if="orderStore.statusCounts[tab.status] > 0"
          class="count-badge"
        >
          {{ orderStore.statusCounts[tab.status] }}
        </span>
      </div>
    </div>

    <!-- 空订单展示 -->
    <div v-if="filteredOrders.length === 0" class="empty-orders-view">
      <div class="empty-icon">📦</div>
      <p class="empty-title">暂无相关订单</p>
      <button class="btn-primary go-shop-btn" @click="goShopping">去首页逛逛</button>
    </div>

    <!-- 订单列表 -->
    <div v-else class="orders-container">
      <div
        v-for="order in filteredOrders"
        :key="order.orderId"
        class="card order-card"
      >
        <!-- 订单头部：单号与状态文案 -->
        <div class="order-header">
          <span class="order-id">单号: {{ order.orderId }}</span>
          <span class="order-status-text" :class="order.status">
            {{ order.statusText }}
          </span>
        </div>

        <!-- 订单商品明细 -->
        <div class="order-items">
          <div
            v-for="(item, idx) in order.items"
            :key="idx"
            class="order-item-row"
            @click="viewProduct(item.productId)"
          >
            <img :src="item.cover" :alt="item.title" class="item-img" />
            <div class="item-meta">
              <h5 class="item-title ellipsis-2">{{ item.title }}</h5>
              <span class="item-specs">{{ formatSpecs(item.specs) }}</span>
            </div>
            <div class="item-price-side">
              <span class="price">¥{{ formatPrice(item.price) }}</span>
              <span class="qty">x{{ item.quantity }}</span>
            </div>
          </div>
        </div>

        <!-- 订单金额汇总 -->
        <div class="order-summary-row">
          <span class="time-text">{{ formatDate(order.createdAt) }}</span>
          <div class="summary-text">
            <span>共 {{ calcTotalQty(order.items) }} 件商品，实付: </span>
            <span class="price-tag">
              <span class="symbol">¥</span>
              <span class="amount">{{ formatPrice(order.payAmount) }}</span>
            </span>
          </div>
        </div>

        <!-- 订单操作按钮组 -->
        <div class="order-actions-bar">
          <button
            v-if="order.status === ORDER_STATUS.PENDING_PAYMENT"
            class="btn-default"
            @click="handleCancel(order.orderId)"
          >
            取消订单
          </button>
          <button
            v-if="order.status === ORDER_STATUS.PENDING_PAYMENT"
            class="btn-primary-sm"
            @click="handlePay(order)"
          >
            立即付款
          </button>

          <button
            v-if="order.status === ORDER_STATUS.PENDING_DISPATCH"
            class="btn-default"
            @click="handleRemind(order.orderId)"
          >
            提醒发货
          </button>

          <button
            v-if="order.status === ORDER_STATUS.PENDING_RECEIPT"
            class="btn-default"
            @click="handleLogistics(order.orderId)"
          >
            查看物流
          </button>
          <button
            v-if="order.status === ORDER_STATUS.PENDING_RECEIPT"
            class="btn-primary-sm"
            @click="handleConfirmReceipt(order.orderId)"
          >
            确认收货
          </button>

          <button
            v-if="order.status === ORDER_STATUS.COMPLETED"
            class="btn-default"
            @click="handleBuyAgain(order)"
          >
            再次购买
          </button>
        </div>
      </div>
    </div>

    <!-- 支付弹窗 -->
    <PayModal
      v-model:visible="payModalVisible"
      :amount="payModalAmount"
      @success="onPaySuccess"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useOrderStore, ORDER_STATUS } from '../../stores/order.js';
import { useCartStore } from '../../stores/cart.js';
import { formatPrice, formatDate } from '../../utils/format.js';
import NavBar from '../../components/NavBar.vue';
import PayModal from '../../components/PayModal.vue';

const route = useRoute();
const router = useRouter();
const orderStore = useOrderStore();
const cartStore = useCartStore();

const currentTab = ref(ORDER_STATUS.ALL);
const payModalVisible = ref(false);
const payModalAmount = ref(0);
let payingOrderId = null;

const statusTabs = [
  { label: '全部', status: ORDER_STATUS.ALL },
  { label: '待付款', status: ORDER_STATUS.PENDING_PAYMENT },
  { label: '待发货', status: ORDER_STATUS.PENDING_DISPATCH },
  { label: '待收货', status: ORDER_STATUS.PENDING_RECEIPT },
  { label: '已完成', status: ORDER_STATUS.COMPLETED }
];

onMounted(() => {
  if (route.query.status) {
    currentTab.value = route.query.status;
  }
});

const filteredOrders = computed(() => {
  return orderStore.getOrdersByStatus(currentTab.value);
});

function switchTab(status) {
  currentTab.value = status;
}

function formatSpecs(specs) {
  if (!specs || Object.keys(specs).length === 0) return '默认规格';
  return Object.values(specs).join(' / ');
}

function calcTotalQty(items) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

function viewProduct(productId) {
  if (productId) router.push(`/goods/detail/${productId}`);
}

function goShopping() {
  router.push('/');
}

function handleCancel(orderId) {
  if (confirm('确定取消该订单吗？')) {
    orderStore.cancelOrder(orderId);
  }
}

function handlePay(order) {
  payingOrderId = order.orderId;
  payModalAmount.value = order.payAmount;
  payModalVisible.value = true;
}

function onPaySuccess(payResult) {
  if (payingOrderId) {
    orderStore.payOrder(payingOrderId, payResult.channel);
    alert('支付成功！已为您转入待发货状态。');
  }
}

function handleRemind(orderId) {
  alert('已成功提醒仓库尽快为您打包发货！');
}

function handleLogistics(orderId) {
  alert(`物流单号：SF${Date.now()}（顺丰速运 运输中）\n快件已到达【深圳前海中转场】正发往目的地。`);
}

function handleConfirmReceipt(orderId) {
  if (confirm('确认已收到商品且无误？')) {
    orderStore.confirmReceipt(orderId);
    alert('交易已完成！感谢您的支持。');
  }
}

function handleBuyAgain(order) {
  if (order.items && order.items[0]) {
    router.push(`/goods/detail/${order.items[0].productId}`);
  }
}
</script>

<style scoped>
.order-list-page {
  padding-bottom: 30px;
}

.tabs-nav {
  display: flex;
  background-color: #fff;
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 44px;
  z-index: 90;
}

.tab-nav-item {
  flex: 1;
  text-align: center;
  padding: 12px 0;
  font-size: 13px;
  color: var(--text-regular);
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
}

.tab-nav-item.active {
  color: var(--primary-color);
  font-weight: 600;
}

.tab-nav-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 25%;
  right: 25%;
  height: 2.5px;
  background: var(--primary-gradient);
  border-radius: 2px;
}

.count-badge {
  background-color: var(--danger-color);
  color: #fff;
  font-size: 9px;
  border-radius: 10px;
  padding: 0 4px;
  line-height: 1.2;
}

.empty-orders-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 80px;
}

.empty-icon {
  font-size: 54px;
}

.empty-title {
  font-size: 14px;
  color: var(--text-muted);
  margin-top: 10px;
}

.go-shop-btn {
  margin-top: 16px;
  padding: 6px 24px;
}

.orders-container {
  padding: 10px 0;
}

.order-card {
  margin: 10px 12px;
  padding: 12px;
}

.order-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-color);
  font-size: 12px;
}

.order-id {
  color: var(--text-muted);
}

.order-status-text {
  font-weight: 600;
}

.order-status-text.pending_payment {
  color: var(--danger-color);
}

.order-status-text.pending_dispatch {
  color: #ff976a;
}

.order-status-text.pending_receipt {
  color: var(--primary-color);
}

.order-status-text.completed {
  color: var(--success-color);
}

.order-status-text.cancelled {
  color: var(--text-muted);
}

.order-items {
  padding: 8px 0;
}

.order-item-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  cursor: pointer;
}

.order-item-row:last-child {
  margin-bottom: 0;
}

.item-img {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-sm);
  object-fit: cover;
  background-color: #f7f8fa;
}

.item-meta {
  flex: 1;
  padding-left: 10px;
}

.item-title {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-main);
  line-height: 1.3;
}

.item-specs {
  display: inline-block;
  font-size: 10px;
  color: var(--text-muted);
  background-color: #f7f8fa;
  padding: 1px 4px;
  border-radius: var(--radius-sm);
  margin-top: 2px;
}

.item-price-side {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-left: 8px;
}

.item-price-side .price {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-main);
}

.item-price-side .qty {
  font-size: 11px;
  color: var(--text-muted);
}

.order-summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-top: 1px dashed var(--border-color);
  font-size: 12px;
}

.time-text {
  color: var(--text-muted);
  font-size: 11px;
}

.summary-text {
  color: var(--text-regular);
}

.order-actions-bar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 10px;
}

.btn-primary-sm {
  background: var(--primary-gradient);
  color: #fff;
  border: none;
  border-radius: var(--radius-round);
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}
</style>
