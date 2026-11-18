<template>
  <div class="category-page">
    <NavBar title="商品分类" :show-back="false" />

    <div class="category-body">
      <!-- 左侧一级菜单 -->
      <aside class="sidebar">
        <div
          v-for="cat in categories"
          :key="cat.id"
          class="sidebar-item"
          :class="{ active: currentCategoryId === cat.id }"
          @click="selectCategory(cat.id)"
        >
          <span class="cat-name">{{ cat.name }}</span>
        </div>
      </aside>

      <!-- 右侧二级内容区 -->
      <main class="content-panel">
        <div v-if="currentCategory" class="subcat-container">
          <div class="subcat-header">
            <span class="header-title">{{ currentCategory.name }}推荐</span>
          </div>

          <!-- 二级子分类圆标 -->
          <div class="subcat-grid">
            <div
              v-for="sub in currentCategory.children || []"
              :key="sub.id"
              class="subcat-item"
              @click="filterBySubcat(sub.name)"
            >
              <img :src="sub.image" :alt="sub.name" class="subcat-img" />
              <span class="subcat-name">{{ sub.name }}</span>
            </div>
          </div>

          <!-- 该分类下商品列表 -->
          <div class="category-goods-section">
            <div class="goods-list-header">
              <span class="list-title">分类商品</span>
            </div>
            <div v-if="categoryProducts.length > 0" class="goods-grid">
              <GoodsCard
                v-for="goods in categoryProducts"
                :key="goods.id"
                :goods="goods"
              />
            </div>
            <div v-else class="empty-tip">
              <span>该分类暂无更多商品</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { api } from '../../services/api.js';
import NavBar from '../../components/NavBar.vue';
import GoodsCard from '../../components/GoodsCard.vue';

const route = useRoute();

const categories = ref([]);
const currentCategoryId = ref(1);
const allProducts = ref([]);

onMounted(async () => {
  categories.value = await api.getCategories();
  allProducts.value = await api.getProducts();

  if (route.query.id) {
    currentCategoryId.value = Number(route.query.id);
  } else if (categories.value.length > 0) {
    currentCategoryId.value = categories.value[0].id;
  }
});

watch(
  () => route.query.id,
  (newId) => {
    if (newId) currentCategoryId.value = Number(newId);
  }
);

const currentCategory = computed(() => {
  return categories.value.find((c) => c.id === currentCategoryId.value) || categories.value[0];
});

const categoryProducts = computed(() => {
  return allProducts.value.filter((p) => p.categoryId === currentCategoryId.value);
});

function selectCategory(id) {
  currentCategoryId.value = id;
}

function filterBySubcat(subName) {
  // 点击子类可做细分筛选
}
</script>

<style scoped>
.category-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.category-body {
  flex: 1;
  display: flex;
  overflow: hidden;
  padding-bottom: 52px; /* tabbar 高度 */
}

.sidebar {
  width: 90px;
  background-color: #f7f8fa;
  overflow-y: auto;
  border-right: 1px solid var(--border-color);
}

.sidebar-item {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: var(--text-regular);
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
  padding: 0 6px;
  text-align: center;
}

.sidebar-item.active {
  background-color: #fff;
  color: var(--primary-color);
  font-weight: 600;
}

.sidebar-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 15px;
  bottom: 15px;
  width: 3px;
  background: var(--primary-gradient);
  border-radius: 0 2px 2px 0;
}

.content-panel {
  flex: 1;
  background-color: #fff;
  overflow-y: auto;
  padding: 12px;
}

.subcat-header {
  margin-bottom: 12px;
}

.header-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-main);
}

.subcat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.subcat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.subcat-img {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-md);
  object-fit: cover;
  background: #f2f3f5;
}

.subcat-name {
  font-size: 11px;
  color: var(--text-main);
  margin-top: 4px;
  text-align: center;
}

.category-goods-section {
  border-top: 1px solid var(--border-color);
  padding-top: 14px;
}

.goods-list-header {
  margin-bottom: 10px;
}

.list-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
}

.goods-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.empty-tip {
  padding: 30px 0;
  text-align: center;
  color: var(--text-muted);
  font-size: 13px;
}
</style>
