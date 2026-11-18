<template>
  <div class="index-page">
    <!-- 顶部搜索条 -->
    <header class="home-header">
      <div class="search-bar" @click="handleSearchClick">
        <span class="search-icon">🔍</span>
        <input
          v-model="searchKeyword"
          type="text"
          placeholder="搜索童装爆款 / 羽绒服 / 卫衣"
          class="search-input"
          @keyup.enter="handleSearch"
        />
        <button v-if="searchKeyword" class="clear-btn" @click.stop="searchKeyword = ''">×</button>
      </div>
    </header>

    <!-- 焦点轮播 Banner -->
    <section class="banner-section">
      <div class="banner-swiper">
        <div
          v-for="(banner, idx) in banners"
          :key="banner.id"
          class="banner-slide"
          :class="{ active: currentBannerIndex === idx }"
          @click="handleBannerClick(banner)"
        >
          <img :src="banner.image" :alt="banner.title" class="banner-img" />
          <div class="banner-overlay">
            <span class="banner-title">{{ banner.title }}</span>
          </div>
        </div>
      </div>
      <!-- 轮播指示点 -->
      <div class="indicator-dots">
        <span
          v-for="(_, idx) in banners"
          :key="idx"
          class="dot"
          :class="{ active: currentBannerIndex === idx }"
          @click="currentBannerIndex = idx"
        ></span>
      </div>
    </section>

    <!-- 金刚区快捷导航 -->
    <section class="nav-grid-section card">
      <div
        v-for="cat in categories"
        :key="cat.id"
        class="nav-grid-item"
        @click="goToCategory(cat.id)"
      >
        <span class="nav-icon">{{ cat.icon }}</span>
        <span class="nav-text">{{ cat.name }}</span>
      </div>
    </section>

    <!-- 领券横幅 -->
    <section class="coupon-banner-card card" @click="showCouponsAlert">
      <div class="coupon-left">
        <span class="coupon-badge">福利特惠</span>
        <span class="coupon-title">新人专享领 ¥85 组合礼券包</span>
      </div>
      <div class="coupon-right">
        <span class="get-coupon-btn">立即领取 ›</span>
      </div>
    </section>

    <!-- 爆款推荐专区 -->
    <section class="hot-section">
      <div class="section-title-bar">
        <div class="title-left">
          <span class="flame-icon">🔥</span>
          <span class="title-text">热销爆款专区</span>
        </div>
        <span class="subtitle-text">品质甄选 闭眼入</span>
      </div>
      <div class="hot-goods-grid">
        <GoodsCard
          v-for="item in hotProducts"
          :key="item.id"
          :goods="item"
        />
      </div>
    </section>

    <!-- 全部推荐商品流 -->
    <section class="all-goods-section">
      <div class="section-title-bar">
        <div class="title-left">
          <span class="star-icon">✨</span>
          <span class="title-text">为你精选</span>
        </div>
      </div>
      <div class="all-goods-grid">
        <GoodsCard
          v-for="item in filteredProducts"
          :key="item.id"
          :goods="item"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '../../services/api.js';
import GoodsCard from '../../components/GoodsCard.vue';

const router = useRouter();

const banners = ref([]);
const categories = ref([]);
const products = ref([]);
const searchKeyword = ref('');
const currentBannerIndex = ref(0);

let bannerTimer = null;

onMounted(async () => {
  banners.value = await api.getBanners();
  categories.value = await api.getCategories();
  products.value = await api.getProducts();

  // 轮播自动播放
  if (banners.value.length > 1) {
    bannerTimer = setInterval(() => {
      currentBannerIndex.value = (currentBannerIndex.value + 1) % banners.value.length;
    }, 4000);
  }
});

onUnmounted(() => {
  if (bannerTimer) clearInterval(bannerTimer);
});

const hotProducts = computed(() => {
  return products.value.filter((p) => p.isHot);
});

const filteredProducts = computed(() => {
  if (!searchKeyword.value.trim()) {
    return products.value;
  }
  const kw = searchKeyword.value.trim().toLowerCase();
  return products.value.filter(
    (p) => p.title.toLowerCase().includes(kw) || p.brief.toLowerCase().includes(kw)
  );
});

function handleSearchClick() {
  // 保持在当前页搜索输入
}

function handleSearch() {
  // 触发过滤
}

function handleBannerClick(banner) {
  if (banner.link) {
    router.push(banner.link);
  }
}

function goToCategory(catId) {
  router.push({ path: '/category', query: { id: catId } });
}

function showCouponsAlert() {
  alert('恭喜！新人优惠礼券已自动发放到您的个人账户！');
}
</script>

<style scoped>
.index-page {
  padding-bottom: 20px;
}

.home-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: #fff;
  padding: 8px 12px;
  border-bottom: 1px solid var(--border-color);
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: #f2f3f5;
  border-radius: var(--radius-round);
  padding: 6px 12px;
}

.search-icon {
  font-size: 14px;
  margin-right: 6px;
  color: var(--text-muted);
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 13px;
  color: var(--text-main);
}

.clear-btn {
  border: none;
  background: transparent;
  font-size: 16px;
  color: var(--text-muted);
  cursor: pointer;
}

.banner-section {
  position: relative;
  margin: 10px 12px;
  border-radius: var(--radius-md);
  overflow: hidden;
  height: 160px;
  background: #eee;
}

.banner-swiper {
  position: relative;
  width: 100%;
  height: 100%;
}

.banner-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
  cursor: pointer;
}

.banner-slide.active {
  opacity: 1;
}

.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  padding: 20px 12px 8px;
}

.banner-title {
  color: #fff;
  font-size: 13px;
  font-weight: 600;
}

.indicator-dots {
  position: absolute;
  bottom: 8px;
  right: 12px;
  display: flex;
  gap: 4px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
}

.dot.active {
  background: #fff;
  width: 14px;
  border-radius: 3px;
}

.nav-grid-section {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  padding: 14px 6px;
  margin-top: 10px;
}

.nav-grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.nav-icon {
  font-size: 26px;
  line-height: 1;
  margin-bottom: 4px;
}

.nav-text {
  font-size: 11px;
  color: var(--text-main);
  text-align: center;
}

.coupon-banner-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #fff5f2 0%, #ffe9e3 100%);
  border: 1px solid #ffdecb;
  cursor: pointer;
}

.coupon-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.coupon-badge {
  background-color: var(--primary-color);
  color: #fff;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-weight: 600;
}

.coupon-title {
  font-size: 12px;
  color: #c43200;
  font-weight: 600;
}

.get-coupon-btn {
  font-size: 12px;
  color: var(--primary-color);
  font-weight: 600;
}

.section-title-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px 6px;
}

.title-left {
  display: flex;
  align-items: center;
  gap: 4px;
}

.title-text {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-main);
}

.subtitle-text {
  font-size: 11px;
  color: var(--text-muted);
}

.hot-goods-grid,
.all-goods-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  padding: 4px 12px;
}
</style>
