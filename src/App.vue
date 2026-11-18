<template>
  <div class="app-container">
    <main class="page-content" :class="{ 'no-tabbar': !showTabBar }">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <TabBar v-if="showTabBar" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import TabBar from './components/TabBar.vue';

const route = useRoute();

const showTabBar = computed(() => {
  return route.meta && route.meta.showTabBar;
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
