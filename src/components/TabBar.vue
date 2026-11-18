<template>
  <nav class="tabbar-container">
    <router-link
      v-for="item in tabs"
      :key="item.path"
      :to="item.path"
      class="tab-item"
      :class="{ active: currentPath === item.path }"
    >
      <div class="icon-wrapper">
        <span class="icon">{{ item.icon }}</span>
        <span v-if="item.badge && cartBadge > 0" class="badge">
          {{ cartBadge > 99 ? '99+' : cartBadge }}
        </span>
      </div>
      <span class="label">{{ item.label }}</span>
    </router-link>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useCartStore } from '../stores/cart.js';

const route = useRoute();
const cartStore = useCartStore();

const currentPath = computed(() => route.path);
const cartBadge = computed(() => cartStore.totalCount);

const tabs = [
  { label: '首页', path: '/', icon: '🏠' },
  { label: '分类', path: '/category', icon: '📑' },
  { label: '购物车', path: '/cart', icon: '🛒', badge: true },
  { label: '我的', path: '/my', icon: '👤' }
];
</script>

<style scoped>
.tabbar-container {
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
  justify-content: space-around;
  z-index: 99;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: var(--text-muted);
  font-size: 11px;
  flex: 1;
  height: 100%;
  transition: color 0.2s;
}

.tab-item.active {
  color: var(--primary-color);
  font-weight: 600;
}

.icon-wrapper {
  position: relative;
  font-size: 20px;
  line-height: 1.2;
}

.badge {
  position: absolute;
  top: -4px;
  right: -10px;
  background-color: var(--danger-color);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  border-radius: 10px;
  padding: 1px 5px;
  line-height: 1;
  min-width: 14px;
  text-align: center;
}

.label {
  margin-top: 2px;
}
</style>
