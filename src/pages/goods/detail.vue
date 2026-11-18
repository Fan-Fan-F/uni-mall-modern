<template>
  <div v-if="product" class="goods-detail-page">
    <NavBar title="商品详情" :show-back="true" />

    <!-- 轮播图相册 -->
    <div class="gallery-wrapper">
      <img
        :src="product.images[currentImageIndex] || product.cover"
        :alt="product.title"
        class="gallery-image"
      />
      <div v-if="product.images && product.images.length > 1" class="image-indicator">
        {{ currentImageIndex + 1 }} / {{ product.images.length }}
      </div>
      <!-- 缩略图条 -->
      <div v-if="product.images && product.images.length > 1" class="thumb-bar">
        <span
          v-for="(img, idx) in product.images"
          :key="idx"
          class="thumb-item"
          :class="{ active: currentImageIndex === idx }"
          @click="currentImageIndex = idx"
        ></span>
      </div>
    </div>

    <!-- 基础价格与标题卡片 -->
    <div class="card price-info-card">
      <div class="price-row">
        <div class="price-wrap">
          <span class="price-tag">
            <span class="symbol">¥</span>
            <span class="amount">{{ formatPrice(product.price) }}</span>
          </span>
          <span v-if="product.originalPrice" class="origin-price">
            ¥{{ formatPrice(product.originalPrice) }}
          </span>
        </div>
        <span class="sales-text">已售 {{ product.sales }} 件</span>
      </div>
      <h1 class="goods-title">{{ product.title }}</h1>
      <p class="goods-brief">{{ product.brief }}</p>
    </div>

    <!-- 规格选择入口栏 -->
    <div class="card spec-cell-card" @click="openSkuDrawer('both')">
      <div class="cell-left">
        <span class="cell-label">选择规格</span>
        <span class="cell-value ellipsis">{{ selectedSpecsSummary }}</span>
      </div>
      <span class="cell-arrow">›</span>
    </div>

    <!-- 服务保障 -->
    <div class="card service-cell-card">
      <div class="service-item">
        <span class="check-icon">✓</span>
        <span>官方正品保证</span>
      </div>
      <div class="service-item">
        <span class="check-icon">✓</span>
        <span>7天无理由退换</span>
      </div>
      <div class="service-item">
        <span class="check-icon">✓</span>
        <span>极速发货</span>
      </div>
    </div>

    <!-- 图文详情 -->
    <div class="card detail-content-card">
      <h3 class="detail-title">商品图文介绍</h3>
      <div class="detail-body">
        <p
          v-for="(desc, idx) in product.details || []"
          :key="idx"
          class="detail-para"
        >
          • {{ desc }}
        </p>
        <div class="detail-img-box">
          <img
            v-for="(img, idx) in product.images"
            :key="idx"
            :src="img"
            :alt="'详情图' + idx"
            class="detail-long-img"
          />
        </div>
      </div>
    </div>

    <!-- 底部固定操作栏 -->
    <div class="detail-bottom-bar">
      <div class="bar-left-actions">
        <div class="action-btn" @click="goHome">
          <span class="icon">🏠</span>
          <span class="text">首页</span>
        </div>
        <div class="action-btn" @click="toggleFav">
          <span class="icon">{{ isFav ? '❤️' : '🤍' }}</span>
          <span class="text">{{ isFav ? '已收藏' : '收藏' }}</span>
        </div>
        <div class="action-btn" @click="goCart">
          <span class="icon">🛒</span>
          <span class="text">购物车</span>
          <span v-if="cartStore.totalCount > 0" class="badge">
            {{ cartStore.totalCount }}
          </span>
        </div>
      </div>

      <div class="bar-right-buttons">
        <button class="btn-half btn-cart" @click="openSkuDrawer('cart')">
          加入购物车
        </button>
        <button class="btn-half btn-buy" @click="openSkuDrawer('buy')">
          立即购买
        </button>
      </div>
    </div>

    <!-- 多规格 SKU 抽屉 -->
    <SkuPicker
      v-model:visible="skuDrawerVisible"
      :goods="product"
      :action-type="currentActionType"
      @confirm="onSkuConfirm"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api } from '../../services/api.js';
import { formatPrice } from '../../utils/format.js';
import { useCartStore } from '../../stores/cart.js';
import { useUserStore } from '../../stores/user.js';
import NavBar from '../../components/NavBar.vue';
import SkuPicker from '../../components/SkuPicker.vue';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const userStore = useUserStore();

const product = ref(null);
const currentImageIndex = ref(0);
const skuDrawerVisible = ref(false);
const currentActionType = ref('both');

onMounted(async () => {
  const id = route.params.id;
  try {
    product.value = await api.getProductDetail(id);
    if (product.value) {
      userStore.addFootprint(product.value.id);
    }
  } catch (e) {
    alert('商品不存在');
    router.replace('/');
  }
});

const isFav = computed(() => {
  return product.value ? userStore.isFavorite(product.value.id) : false;
});

const selectedSpecsSummary = computed(() => {
  if (!product.value || !product.value.specGroups) return '请选择规格与数量';
  return product.value.specGroups.map((g) => g.name).join(' / ');
});

function openSkuDrawer(type = 'both') {
  currentActionType.value = type;
  skuDrawerVisible.value = true;
}

function onSkuConfirm(data) {
  if (data.type === 'cart') {
    cartStore.addToCart({
      product: product.value,
      specs: data.specs,
      quantity: data.quantity,
      price: data.price,
      stock: data.stock
    });
    alert('已成功加入购物车！');
  } else if (data.type === 'buy') {
    // 立即购买，加入临时结算或者进入购物车结算
    cartStore.addToCart({
      product: product.value,
      specs: data.specs,
      quantity: data.quantity,
      price: data.price,
      stock: data.stock
    });
    router.push('/order/confirm');
  }
}

function toggleFav() {
  if (product.value) {
    userStore.toggleFavorite(product.value.id);
  }
}

function goHome() {
  router.push('/');
}

function goCart() {
  router.push('/cart');
}
</script>

<style scoped>
.goods-detail-page {
  padding-bottom: 70px;
}

.gallery-wrapper {
  position: relative;
  width: 100%;
  padding-top: 100%;
  background-color: #f7f8fa;
}

.gallery-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-indicator {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
}

.thumb-bar {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
}

.thumb-item {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  cursor: pointer;
}

.thumb-item.active {
  background: var(--primary-color);
  width: 14px;
  border-radius: 3px;
}

.price-info-card {
  padding: 14px;
}

.price-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.price-tag .amount {
  font-size: 24px;
}

.sales-text {
  font-size: 12px;
  color: var(--text-muted);
}

.goods-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-main);
  line-height: 1.4;
  margin-top: 8px;
}

.goods-brief {
  font-size: 12px;
  color: var(--text-regular);
  margin-top: 6px;
}

.spec-cell-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  cursor: pointer;
}

.cell-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.cell-label {
  font-size: 13px;
  color: var(--text-muted);
}

.cell-value {
  font-size: 13px;
  color: var(--text-main);
  font-weight: 500;
}

.cell-arrow {
  font-size: 18px;
  color: var(--text-muted);
}

.service-cell-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background-color: #fafbfc;
}

.service-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--text-regular);
}

.service-item .check-icon {
  color: var(--success-color);
  font-size: 12px;
  font-weight: bold;
}

.detail-content-card {
  padding: 14px;
}

.detail-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-color);
}

.detail-para {
  font-size: 13px;
  color: var(--text-regular);
  margin-bottom: 6px;
  line-height: 1.6;
}

.detail-img-box {
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-long-img {
  width: 100%;
  border-radius: var(--radius-sm);
  object-fit: cover;
}

.detail-bottom-bar {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  height: 54px;
  background-color: #fff;
  border-top: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  padding: 0 10px;
  z-index: 99;
}

.bar-left-actions {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 0 8px;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  cursor: pointer;
}

.action-btn .icon {
  font-size: 18px;
  line-height: 1;
}

.action-btn .text {
  font-size: 10px;
  color: var(--text-regular);
  margin-top: 2px;
}

.action-btn .badge {
  position: absolute;
  top: -4px;
  right: -6px;
  background-color: var(--danger-color);
  color: #fff;
  font-size: 9px;
  border-radius: 8px;
  padding: 0 4px;
}

.bar-right-buttons {
  flex: 1;
  display: flex;
  gap: 8px;
  margin-left: 8px;
}

.btn-half {
  flex: 1;
  height: 38px;
  border-radius: var(--radius-round);
  border: none;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.btn-cart {
  background: linear-gradient(135deg, #ffd01e, #ff8917);
  color: #fff;
}

.btn-buy {
  background: var(--primary-gradient);
  color: #fff;
}
</style>
