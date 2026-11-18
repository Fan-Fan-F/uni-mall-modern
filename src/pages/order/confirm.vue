<template>
  <div class="confirm-order-page">
    <NavBar title="确认订单" :show-back="true" />

    <!-- 收货地址区域 -->
    <div class="card address-card" @click="goToAddressSelect">
      <div v-if="currentAddress" class="addr-content">
        <div class="addr-top">
          <span class="user-name">{{ currentAddress.name }}</span>
          <span class="user-phone">{{ currentAddress.phone }}</span>
          <span v-if="currentAddress.isDefault" class="tag-badge primary">默认</span>
          <span v-if="currentAddress.tag" class="tag-badge default">{{ currentAddress.tag }}</span>
        </div>
        <div class="addr-detail">
          <span class="map-icon">📍</span>
          <span class="addr-text">{{ currentAddress.region }} {{ currentAddress.detail }}</span>
        </div>
      </div>
      <div v-else class="empty-addr">
        <span class="plus-icon">+</span>
        <span class="text">请添加收货地址</span>
      </div>
      <span class="arrow-right">›</span>
    </div>

    <!-- 结算商品清单 -->
    <div class="card goods-list-card">
      <div class="card-header">
        <span class="shop-name">童装甄选自营店</span>
      </div>
      <div
        v-for="item in settleItems"
        :key="item.id"
        class="order-item-row"
      >
        <img :src="item.cover" :alt="item.title" class="item-thumb" />
        <div class="item-info">
          <h4 class="item-title ellipsis-2">{{ item.title }}</h4>
          <span class="item-specs">{{ formatSpecs(item.selectedSpecs) }}</span>
          <div class="item-price-row">
            <span class="price-tag">
              <span class="symbol">¥</span>
              <span class="amount">{{ formatPrice(item.price) }}</span>
            </span>
            <span class="item-qty">x{{ item.quantity }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 配送方式与服务 -->
    <div class="card service-card">
      <div class="cell-row">
        <span class="cell-label">配送方式</span>
        <div class="delivery-options">
          <button
            class="delivery-btn"
            :class="{ active: deliveryType === 'express' }"
            @click="deliveryType = 'express'"
          >
            普通快递 (免运费)
          </button>
          <button
            class="delivery-btn"
            :class="{ active: deliveryType === 'pickup' }"
            @click="deliveryType = 'pickup'"
          >
            门店自提
          </button>
        </div>
      </div>

      <!-- 优惠券选择 -->
      <div class="cell-row" @click="showCouponSelect = !showCouponSelect">
        <span class="cell-label">优惠券</span>
        <div class="cell-value-wrap">
          <span v-if="selectedCoupon" class="coupon-applied">
            -¥{{ selectedCoupon.amount }} ({{ selectedCoupon.name }})
          </span>
          <span v-else class="coupon-placeholder">请选择优惠券</span>
          <span class="arrow-down">›</span>
        </div>
      </div>

      <!-- 展开优惠券列表 -->
      <div v-if="showCouponSelect" class="coupons-dropdown">
        <div
          class="coupon-option-item"
          :class="{ active: selectedCoupon === null }"
          @click="selectCoupon(null)"
        >
          <span>不使用优惠券</span>
        </div>
        <div
          v-for="coupon in availableCoupons"
          :key="coupon.id"
          class="coupon-option-item"
          :class="{ active: selectedCoupon && selectedCoupon.id === coupon.id }"
          @click="selectCoupon(coupon)"
        >
          <span class="coupon-opt-name">{{ coupon.name }}（满 ¥{{ coupon.minSpend }} 减 ¥{{ coupon.amount }}）</span>
          <span class="coupon-opt-amount">-¥{{ coupon.amount }}</span>
        </div>
      </div>

      <!-- 买家留言 -->
      <div class="cell-row remark-row">
        <span class="cell-label">买家留言</span>
        <input
          v-model="buyerRemark"
          type="text"
          placeholder="选填，建议先与客服协商一致"
          class="remark-input"
        />
      </div>
    </div>

    <!-- 费用明细结算卡片 -->
    <div class="card bill-card">
      <div class="bill-row">
        <span class="bill-label">商品总额</span>
        <span class="bill-value">¥{{ formatPrice(goodsTotalAmount) }}</span>
      </div>
      <div class="bill-row">
        <span class="bill-label">运费</span>
        <span class="bill-value">{{ freight === 0 ? '包邮' : '¥' + formatPrice(freight) }}</span>
      </div>
      <div v-if="selectedCoupon" class="bill-row">
        <span class="bill-label">优惠券抵扣</span>
        <span class="bill-value discount">-¥{{ formatPrice(selectedCoupon.amount) }}</span>
      </div>
      <div class="bill-divider"></div>
      <div class="bill-row final-row">
        <span class="final-label">应付总额:</span>
        <span class="price-tag final-price">
          <span class="symbol">¥</span>
          <span class="amount">{{ formatPrice(finalPayAmount) }}</span>
        </span>
      </div>
    </div>

    <!-- 底部固定提交订单条 -->
    <div class="submit-bar">
      <div class="submit-left">
        <span class="label">实付款:</span>
        <span class="price-tag submit-price">
          <span class="symbol">¥</span>
          <span class="amount">{{ formatPrice(finalPayAmount) }}</span>
        </span>
      </div>
      <button class="btn-primary submit-btn" @click="handleSubmitOrder">
        提交订单
      </button>
    </div>

    <!-- 收银台支付弹窗 -->
    <PayModal
      v-model:visible="payModalVisible"
      :amount="finalPayAmount"
      @success="handlePaySuccess"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../../stores/cart.js';
import { useAddressStore } from '../../stores/address.js';
import { useOrderStore } from '../../stores/order.js';
import { api } from '../../services/api.js';
import { formatPrice } from '../../utils/format.js';
import NavBar from '../../components/NavBar.vue';
import PayModal from '../../components/PayModal.vue';

const router = useRouter();
const cartStore = useCartStore();
const addressStore = useAddressStore();
const orderStore = useOrderStore();

const deliveryType = ref('express');
const buyerRemark = ref('');
const showCouponSelect = ref(false);
const selectedCoupon = ref(null);
const coupons = ref([]);
const payModalVisible = ref(false);
let pendingOrderId = null;

onMounted(async () => {
  coupons.value = await api.getCoupons();
  // 自动选择满足门槛的最大面额优惠券
  if (availableCoupons.value.length > 0) {
    selectedCoupon.value = availableCoupons.value[0];
  }
});

const currentAddress = computed(() => addressStore.currentAddress);

const settleItems = computed(() => {
  return cartStore.checkoutItems.length > 0
    ? cartStore.checkoutItems
    : cartStore.items.slice(0, 1);
});

const goodsTotalAmount = computed(() => {
  return settleItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0);
});

const freight = computed(() => {
  return deliveryType.value === 'pickup' || goodsTotalAmount.value >= 199 ? 0 : 10;
});

const availableCoupons = computed(() => {
  return coupons.value.filter((c) => goodsTotalAmount.value >= c.minSpend);
});

const finalPayAmount = computed(() => {
  const discount = selectedCoupon.value ? selectedCoupon.value.amount : 0;
  return Math.max(0.01, goodsTotalAmount.value + freight.value - discount);
});

function formatSpecs(specs) {
  if (!specs || Object.keys(specs).length === 0) return '默认规格';
  return Object.values(specs).join(' / ');
}

function selectCoupon(coupon) {
  selectedCoupon.value = coupon;
  showCouponSelect.value = false;
}

function goToAddressSelect() {
  router.push('/address');
}

function handleSubmitOrder() {
  if (!currentAddress.value) {
    alert('请先选择或添加收货地址！');
    router.push('/address');
    return;
  }

  // 1. 创建待付款订单
  const newOrder = orderStore.createOrder({
    items: settleItems.value,
    address: currentAddress.value,
    coupon: selectedCoupon.value,
    remark: buyerRemark.value,
    freight: freight.value
  });
  pendingOrderId = newOrder.orderId;

  // 2. 唤起模拟支付收银台
  payModalVisible.value = true;
}

function handlePaySuccess(payResult) {
  if (pendingOrderId) {
    orderStore.payOrder(pendingOrderId, payResult.channel);
  }
  // 清理购物车中已购买商品
  cartStore.removeCheckedItems();
  alert('🎉 订单支付成功！卖家正在飞速拣货发货中。');
  router.replace('/order/list?status=pending_dispatch');
}
</script>

<style scoped>
.confirm-order-page {
  padding-bottom: 70px;
}

.address-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px;
  cursor: pointer;
  background: #fff;
}

.addr-top {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.user-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-main);
}

.user-phone {
  font-size: 13px;
  color: var(--text-regular);
}

.addr-detail {
  display: flex;
  align-items: flex-start;
  gap: 4px;
}

.map-icon {
  font-size: 14px;
}

.addr-text {
  font-size: 13px;
  color: var(--text-main);
  line-height: 1.4;
}

.empty-addr {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--primary-color);
  font-weight: 600;
  font-size: 14px;
}

.plus-icon {
  font-size: 18px;
}

.arrow-right {
  font-size: 20px;
  color: var(--text-muted);
}

.goods-list-card {
  padding: 12px;
}

.card-header {
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-color);
  font-size: 13px;
  font-weight: 600;
  color: var(--text-main);
}

.order-item-row {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px dashed var(--border-color);
}

.order-item-row:last-child {
  border-bottom: none;
}

.item-thumb {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-sm);
  object-fit: cover;
  background-color: #f7f8fa;
}

.item-info {
  flex: 1;
  padding-left: 10px;
}

.item-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-main);
  line-height: 1.3;
}

.item-specs {
  display: inline-block;
  font-size: 11px;
  color: var(--text-muted);
  background: #f7f8fa;
  padding: 1px 4px;
  border-radius: var(--radius-sm);
  margin-top: 3px;
}

.item-price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 6px;
}

.item-qty {
  font-size: 12px;
  color: var(--text-muted);
}

.service-card {
  padding: 10px 14px;
}

.cell-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid var(--border-color);
}

.cell-row:last-child {
  border-bottom: none;
}

.cell-label {
  font-size: 13px;
  color: var(--text-main);
  font-weight: 500;
}

.delivery-options {
  display: flex;
  gap: 8px;
}

.delivery-btn {
  border: 1px solid var(--border-color);
  background: #fff;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: var(--radius-round);
  cursor: pointer;
}

.delivery-btn.active {
  border-color: var(--primary-color);
  color: var(--primary-color);
  background-color: #fff9f5;
  font-weight: 600;
}

.cell-value-wrap {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.coupon-applied {
  font-size: 13px;
  color: var(--danger-color);
  font-weight: 600;
}

.coupon-placeholder {
  font-size: 13px;
  color: var(--text-muted);
}

.arrow-down {
  font-size: 18px;
  color: var(--text-muted);
}

.coupons-dropdown {
  background-color: #fafbfc;
  border-radius: var(--radius-sm);
  padding: 8px;
  margin-top: 8px;
}

.coupon-option-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  font-size: 12px;
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.coupon-option-item.active {
  background-color: #fff0eb;
  color: var(--primary-color);
  font-weight: 600;
}

.remark-row {
  display: flex;
  align-items: center;
}

.remark-input {
  flex: 1;
  border: none;
  background: transparent;
  text-align: right;
  outline: none;
  font-size: 13px;
  color: var(--text-main);
}

.bill-card {
  padding: 14px;
}

.bill-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 13px;
}

.bill-label {
  color: var(--text-regular);
}

.bill-value {
  color: var(--text-main);
  font-weight: 500;
}

.bill-value.discount {
  color: var(--danger-color);
}

.bill-divider {
  height: 1px;
  background-color: var(--border-color);
  margin: 10px 0;
}

.final-row {
  margin-bottom: 0;
  display: flex;
  align-items: baseline;
}

.final-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
}

.final-price .amount {
  font-size: 22px;
}

.submit-bar {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  height: 52px;
  background-color: #fff;
  border-top: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  z-index: 99;
}

.submit-left {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.submit-left .label {
  font-size: 13px;
  color: var(--text-regular);
}

.submit-price .amount {
  font-size: 20px;
}

.submit-btn {
  height: 38px;
  padding: 0 24px;
  font-size: 15px;
}
</style>
