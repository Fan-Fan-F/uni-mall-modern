<template>
  <div class="goods-card" @click="handleClick">
    <div class="img-wrapper">
      <img :src="goods.cover" :alt="goods.title" class="goods-img" loading="lazy" />
      <span v-if="goods.isHot" class="badge-hot">热销</span>
      <span v-else-if="goods.isNew" class="badge-new">新品</span>
    </div>
    <div class="info-wrapper">
      <h3 class="goods-title ellipsis-2">{{ goods.title }}</h3>
      <p class="goods-brief ellipsis">{{ goods.brief }}</p>
      <div class="price-row">
        <div class="price-wrap">
          <span class="price-tag">
            <span class="symbol">¥</span>
            <span class="amount">{{ formatPrice(goods.price) }}</span>
          </span>
          <span v-if="goods.originalPrice" class="origin-price">
            ¥{{ formatPrice(goods.originalPrice) }}
          </span>
        </div>
        <button class="quick-add-btn" title="加入购物车" @click.stop="handleQuickAdd">
          +
        </button>
      </div>
      <div class="extra-row">
        <span class="sales">已售 {{ goods.sales }} 件</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { formatPrice } from '../utils/format.js';
import { useCartStore } from '../stores/cart.js';

const props = defineProps({
  goods: {
    type: Object,
    required: true
  }
});

const router = useRouter();
const cartStore = useCartStore();

function handleClick() {
  router.push(`/goods/detail/${props.goods.id}`);
}

function handleQuickAdd() {
  // 提取默认规格
  const defaultSpecs = {};
  if (props.goods.specGroups) {
    props.goods.specGroups.forEach((group) => {
      defaultSpecs[group.name] = group.values[0];
    });
  }
  cartStore.addToCart({
    product: props.goods,
    specs: defaultSpecs,
    quantity: 1,
    price: props.goods.price,
    stock: props.goods.stock || 99
  });
}
</script>

<style scoped>
.goods-card {
  background-color: #fff;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: transform 0.15s;
}

.goods-card:active {
  transform: scale(0.99);
}

.img-wrapper {
  position: relative;
  width: 100%;
  padding-top: 100%; /* 1:1 正方形 */
  background-color: #f2f3f5;
  overflow: hidden;
}

.goods-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.badge-hot {
  position: absolute;
  top: 6px;
  left: 6px;
  background: linear-gradient(135deg, #ff6034, #ee0a24);
  color: #fff;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-weight: 600;
}

.badge-new {
  position: absolute;
  top: 6px;
  left: 6px;
  background: linear-gradient(135deg, #07c160, #10b981);
  color: #fff;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-weight: 600;
}

.info-wrapper {
  padding: 8px 10px 10px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.goods-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-main);
  line-height: 1.4;
  height: 36px;
}

.goods-brief {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 3px;
}

.price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
}

.quick-add-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--primary-gradient);
  color: #fff;
  border: none;
  font-size: 18px;
  line-height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: opacity 0.2s;
}

.quick-add-btn:active {
  opacity: 0.8;
}

.extra-row {
  margin-top: 4px;
}

.sales {
  font-size: 11px;
  color: var(--text-muted);
}
</style>
