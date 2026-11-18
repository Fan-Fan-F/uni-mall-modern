<template>
  <div v-if="visible" class="sku-overlay" @click="handleClose">
    <div class="sku-drawer" @click.stop>
      <!-- 头部：商品缩略图、现价、库存、已选规格提示 -->
      <div class="drawer-header">
        <img :src="goods.cover" :alt="goods.title" class="goods-thumb" />
        <div class="header-info">
          <div class="price-wrap">
            <span class="price-tag">
              <span class="symbol">¥</span>
              <span class="amount">{{ formatPrice(currentPrice) }}</span>
            </span>
            <span v-if="goods.originalPrice" class="origin-price">
              ¥{{ formatPrice(goods.originalPrice) }}
            </span>
          </div>
          <div class="stock-info">库存: {{ currentStock }} 件</div>
          <div class="selected-text ellipsis">
            已选: {{ selectedSummary || '请选择规格' }}
          </div>
        </div>
        <button class="close-btn" @click="handleClose">×</button>
      </div>

      <!-- 规格属性列表 -->
      <div class="drawer-body">
        <div
          v-for="group in goods.specGroups || []"
          :key="group.name"
          class="spec-group"
        >
          <div class="group-title">{{ group.name }}</div>
          <div class="group-values">
            <button
              v-for="val in group.values"
              :key="val"
              class="spec-tag"
              :class="{ active: selectedSpecs[group.name] === val }"
              @click="selectSpec(group.name, val)"
            >
              {{ val }}
            </button>
          </div>
        </div>

        <!-- 购买数量 -->
        <div class="quantity-row">
          <span class="label">购买数量</span>
          <Stepper
            v-model="quantity"
            :min="1"
            :max="currentStock > 0 ? currentStock : 1"
          />
        </div>
      </div>

      <!-- 底部确定按钮 -->
      <div class="drawer-footer">
        <button
          v-if="actionType === 'both'"
          class="btn-half btn-cart"
          :disabled="currentStock <= 0"
          @click="handleConfirm('cart')"
        >
          加入购物车
        </button>
        <button
          v-if="actionType === 'both'"
          class="btn-half btn-buy"
          :disabled="currentStock <= 0"
          @click="handleConfirm('buy')"
        >
          立即购买
        </button>
        <button
          v-else
          class="btn-full"
          :disabled="currentStock <= 0"
          @click="handleConfirm(actionType)"
        >
          {{ currentStock <= 0 ? '暂时缺货' : '确定' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { formatPrice } from '../utils/format.js';
import Stepper from './Stepper.vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  goods: {
    type: Object,
    required: true
  },
  actionType: {
    type: String,
    default: 'both' // 'both' | 'cart' | 'buy'
  }
});

const emit = defineEmits(['update:visible', 'confirm', 'close']);

const selectedSpecs = ref({});
const quantity = ref(1);

// 初始化规格
watch(
  () => props.goods,
  (newGoods) => {
    if (newGoods && newGoods.specGroups) {
      const initial = {};
      newGoods.specGroups.forEach((group) => {
        initial[group.name] = group.values[0] || '';
      });
      selectedSpecs.value = initial;
    }
  },
  { immediate: true }
);

function selectSpec(groupName, value) {
  selectedSpecs.value[groupName] = value;
}

// 匹配对应的 SKU 组合
const matchedSku = computed(() => {
  if (!props.goods.skus || props.goods.skus.length === 0) return null;
  return props.goods.skus.find((sku) => {
    return Object.entries(selectedSpecs.value).every(
      ([key, val]) => sku.specs[key] === val
    );
  });
});

const currentPrice = computed(() => {
  if (matchedSku.value && matchedSku.value.price !== undefined) {
    return matchedSku.value.price;
  }
  return props.goods.price || 0;
});

const currentStock = computed(() => {
  if (matchedSku.value && matchedSku.value.stock !== undefined) {
    return matchedSku.value.stock;
  }
  return props.goods.stock || 0;
});

const selectedSummary = computed(() => {
  return Object.values(selectedSpecs.value).join('，');
});

function handleClose() {
  emit('update:visible', false);
  emit('close');
}

function handleConfirm(type) {
  // 检查是否选全规格
  if (props.goods.specGroups) {
    for (const group of props.goods.specGroups) {
      if (!selectedSpecs.value[group.name]) {
        alert(`请选择 ${group.name}`);
        return;
      }
    }
  }

  emit('confirm', {
    type,
    specs: { ...selectedSpecs.value },
    quantity: quantity.value,
    price: currentPrice.value,
    stock: currentStock.value,
    skuId: matchedSku.value ? matchedSku.value.id : null
  });
  emit('update:visible', false);
}
</script>

<style scoped>
.sku-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

.sku-drawer {
  width: 100%;
  max-width: 480px;
  background-color: #fff;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.25s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.drawer-header {
  display: flex;
  padding: 16px;
  position: relative;
  border-bottom: 1px solid var(--border-color);
}

.goods-thumb {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-md);
  object-fit: cover;
  background-color: #f5f5f5;
}

.header-info {
  flex: 1;
  padding-left: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.stock-info {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 2px;
}

.selected-text {
  font-size: 12px;
  color: var(--text-regular);
  margin-top: 4px;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  border: none;
  background: transparent;
  font-size: 24px;
  color: var(--text-muted);
  cursor: pointer;
}

.drawer-body {
  padding: 16px;
  overflow-y: auto;
  flex: 1;
}

.spec-group {
  margin-bottom: 16px;
}

.group-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 8px;
}

.group-values {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.spec-tag {
  background-color: #f7f8fa;
  border: 1px solid transparent;
  color: var(--text-main);
  border-radius: var(--radius-round);
  padding: 6px 14px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.spec-tag.active {
  background-color: #fff0eb;
  border-color: var(--primary-color);
  color: var(--primary-color);
  font-weight: 600;
}

.quantity-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px dashed var(--border-color);
}

.quantity-row .label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-main);
}

.drawer-footer {
  padding: 12px 16px;
  border-top: 1px solid var(--border-color);
  display: flex;
  gap: 10px;
}

.btn-full {
  flex: 1;
  background: var(--primary-gradient);
  color: #fff;
  border: none;
  height: 40px;
  border-radius: var(--radius-round);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}

.btn-full:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-half {
  flex: 1;
  height: 40px;
  border-radius: var(--radius-round);
  border: none;
  font-size: 14px;
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
