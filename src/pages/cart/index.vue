<template>
  <div class="cart-page">
    <NavBar title="购物车" :show-back="false">
      <template #right>
        <button
          v-if="cartStore.items.length > 0"
          class="nav-action-btn"
          @click="toggleEditMode"
        >
          {{ isEditMode ? '完成' : '管理' }}
        </button>
      </template>
    </NavBar>

    <!-- 促销优惠满减提示条 -->
    <div v-if="cartStore.items.length > 0" class="promo-tips-bar">
      <span class="badge-promo">满减</span>
      <span class="tips-text">全场满 199 元免运费，满 200 减 30</span>
    </div>

    <!-- 购物车为空状态 -->
    <div v-if="cartStore.items.length === 0" class="empty-cart-view">
      <div class="empty-icon">🛒</div>
      <p class="empty-title">购物车空空如也</p>
      <p class="empty-sub">快去挑选心仪的宝贝吧~</p>
      <button class="btn-primary go-shop-btn" @click="goShopping">去逛逛</button>
    </div>

    <!-- 购物车商品列表 -->
    <div v-else class="cart-items-container">
      <div
        v-for="item in cartStore.items"
        :key="item.id"
        class="cart-card"
      >
        <!-- 复选框 -->
        <div class="checkbox-col" @click="cartStore.toggleCheck(item.id)">
          <span class="custom-checkbox" :class="{ checked: item.checked }">
            <span v-if="item.checked" class="check-icon">✓</span>
          </span>
        </div>

        <!-- 商品缩略图 -->
        <img
          :src="item.cover"
          :alt="item.title"
          class="item-cover"
          @click="viewGoodsDetail(item.productId)"
        />

        <!-- 商品信息 -->
        <div class="item-details">
          <h4
            class="item-title ellipsis-2"
            @click="viewGoodsDetail(item.productId)"
          >
            {{ item.title }}
          </h4>

          <!-- 选中规格 -->
          <div class="specs-tag-wrap">
            <span class="specs-tag">
              {{ formatSpecs(item.selectedSpecs) }}
            </span>
          </div>

          <!-- 价格与数量控制器 -->
          <div class="item-bottom-row">
            <div class="price-wrap">
              <span class="price-tag">
                <span class="symbol">¥</span>
                <span class="amount">{{ formatPrice(item.price) }}</span>
              </span>
              <span v-if="item.originalPrice" class="origin-price">
                ¥{{ formatPrice(item.originalPrice) }}
              </span>
            </div>

            <Stepper
              :model-value="item.quantity"
              :min="1"
              :max="item.stock || 99"
              @change="(val) => cartStore.updateQuantity(item.id, val)"
            />
          </div>
        </div>

        <!-- 编辑模式下的删除按钮 -->
        <button
          v-if="isEditMode"
          class="delete-item-btn"
          title="删除"
          @click="handleDeleteItem(item.id)"
        >
          🗑️
        </button>
      </div>
    </div>

    <!-- 底部固定结算/操作栏 -->
    <div v-if="cartStore.items.length > 0" class="cart-settle-bar">
      <div class="all-check-col" @click="handleToggleAll">
        <span class="custom-checkbox" :class="{ checked: cartStore.isAllChecked }">
          <span v-if="cartStore.isAllChecked" class="check-icon">✓</span>
        </span>
        <span class="all-check-label">全选</span>
      </div>

      <div v-if="!isEditMode" class="amount-summary-col">
        <div class="total-row">
          <span class="label">合计:</span>
          <span class="price-tag total-price">
            <span class="symbol">¥</span>
            <span class="amount">{{ formatPrice(cartStore.checkedAmount) }}</span>
          </span>
        </div>
        <div v-if="cartStore.savedAmount > 0" class="saved-row">
          已立省 ¥{{ formatPrice(cartStore.savedAmount) }}
        </div>
      </div>

      <div class="action-btn-col">
        <button
          v-if="!isEditMode"
          class="btn-primary checkout-btn"
          :disabled="cartStore.checkedCount === 0"
          @click="goToCheckout"
        >
          结算({{ cartStore.checkedCount }})
        </button>
        <button
          v-else
          class="btn-delete-batch"
          :disabled="cartStore.checkedCount === 0"
          @click="handleBatchDelete"
        >
          删除选中
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../../stores/cart.js';
import { formatPrice } from '../../utils/format.js';
import NavBar from '../../components/NavBar.vue';
import Stepper from '../../components/Stepper.vue';

const router = useRouter();
const cartStore = useCartStore();

const isEditMode = ref(false);

function toggleEditMode() {
  isEditMode.value = !isEditMode.value;
}

function formatSpecs(specs) {
  if (!specs || Object.keys(specs).length === 0) return '默认规格';
  return Object.values(specs).join(' / ');
}

function handleToggleAll() {
  cartStore.toggleAll(!cartStore.isAllChecked);
}

function handleDeleteItem(id) {
  if (confirm('确定从购物车移除该商品吗？')) {
    cartStore.removeItem(id);
  }
}

function handleBatchDelete() {
  if (confirm(`确定删除选中的 ${cartStore.checkedCount} 件商品吗？`)) {
    cartStore.removeCheckedItems();
    if (cartStore.items.length === 0) {
      isEditMode.value = false;
    }
  }
}

function viewGoodsDetail(productId) {
  router.push(`/goods/detail/${productId}`);
}

function goShopping() {
  router.push('/');
}

function goToCheckout() {
  if (cartStore.checkedCount === 0) return;
  router.push('/order/confirm');
}
</script>

<style scoped>
.cart-page {
  padding-bottom: 110px; /* 留出底部 settle-bar 和 tabbar 空间 */
  min-height: 100vh;
}

.nav-action-btn {
  border: none;
  background: transparent;
  color: var(--text-regular);
  font-size: 14px;
  cursor: pointer;
}

.promo-tips-bar {
  background-color: #fff9f0;
  border-bottom: 1px solid #ffe8cc;
  padding: 6px 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.badge-promo {
  background-color: #ff976a;
  color: #fff;
  font-size: 10px;
  padding: 1px 4px;
  border-radius: var(--radius-sm);
  font-weight: 600;
}

.tips-text {
  font-size: 11px;
  color: #ed6a0c;
}

.empty-cart-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 80px;
}

.empty-icon {
  font-size: 64px;
  line-height: 1;
}

.empty-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-main);
  margin-top: 14px;
}

.empty-sub {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 4px;
}

.go-shop-btn {
  margin-top: 20px;
  padding: 8px 32px;
}

.cart-items-container {
  padding: 10px 12px;
}

.cart-card {
  background: #fff;
  border-radius: var(--radius-md);
  padding: 12px;
  margin-bottom: 10px;
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  position: relative;
}

.checkbox-col {
  padding-right: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.custom-checkbox {
  width: 20px;
  height: 20px;
  border: 1.5px solid #c8c9cc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.custom-checkbox.checked {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.check-icon {
  color: #fff;
  font-size: 12px;
  font-weight: bold;
}

.item-cover {
  width: 82px;
  height: 82px;
  border-radius: var(--radius-sm);
  object-fit: cover;
  background-color: #f7f8fa;
  cursor: pointer;
}

.item-details {
  flex: 1;
  padding-left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 82px;
}

.item-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-main);
  line-height: 1.3;
  cursor: pointer;
}

.specs-tag-wrap {
  margin: 4px 0;
}

.specs-tag {
  display: inline-block;
  background-color: #f7f8fa;
  color: var(--text-muted);
  font-size: 11px;
  padding: 2px 6px;
  border-radius: var(--radius-sm);
}

.item-bottom-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.delete-item-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 16px;
}

.cart-settle-bar {
  position: fixed;
  bottom: 52px; /* 居于 TabBar 上方 */
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  height: 50px;
  background-color: #fff;
  border-top: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  z-index: 98;
}

.all-check-col {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.all-check-label {
  font-size: 13px;
  color: var(--text-regular);
}

.amount-summary-col {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-right: 10px;
}

.total-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.total-row .label {
  font-size: 13px;
  color: var(--text-main);
  font-weight: 500;
}

.total-price .amount {
  font-size: 18px;
}

.saved-row {
  font-size: 10px;
  color: var(--danger-color);
}

.checkout-btn {
  height: 38px;
  padding: 0 20px;
  font-size: 14px;
}

.btn-delete-batch {
  height: 38px;
  padding: 0 16px;
  background-color: #fff;
  color: var(--danger-color);
  border: 1px solid var(--danger-color);
  border-radius: var(--radius-round);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.btn-delete-batch:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
