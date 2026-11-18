<template>
  <header class="navbar-container">
    <div class="navbar-left" @click="handleBack">
      <span v-if="showBack" class="back-icon">‹</span>
      <slot name="left"></slot>
    </div>
    <div class="navbar-title ellipsis">
      <slot>{{ title }}</slot>
    </div>
    <div class="navbar-right">
      <slot name="right"></slot>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router';

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  showBack: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['back']);
const router = useRouter();

function handleBack() {
  emit('back');
  if (props.showBack) {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  }
}
</script>

<style scoped>
.navbar-container {
  height: 44px;
  background-color: #fff;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-left,
.navbar-right {
  min-width: 40px;
  display: flex;
  align-items: center;
}

.back-icon {
  font-size: 26px;
  line-height: 1;
  color: var(--text-main);
  cursor: pointer;
  padding-right: 6px;
}

.navbar-title {
  flex: 1;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-main);
}
</style>
