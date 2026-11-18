<template>
  <div class="address-page">
    <NavBar title="收货地址管理" :show-back="true" />

    <div v-if="addressStore.list.length === 0" class="empty-addr-view">
      <div class="empty-icon">📍</div>
      <p class="empty-text">您还没有添加任何收货地址</p>
    </div>

    <div v-else class="address-list">
      <div
        v-for="addr in addressStore.list"
        :key="addr.id"
        class="card address-card"
        @click="handleSelect(addr.id)"
      >
        <div class="card-content">
          <div class="info-top">
            <span class="user-name">{{ addr.name }}</span>
            <span class="user-phone">{{ addr.phone }}</span>
            <span v-if="addr.isDefault" class="tag-badge primary">默认</span>
            <span v-if="addr.tag" class="tag-badge default">{{ addr.tag }}</span>
          </div>
          <p class="address-detail-text">
            {{ addr.region }} {{ addr.detail }}
          </p>
        </div>

        <div class="card-actions" @click.stop>
          <button class="action-btn" @click="handleEdit(addr.id)">编辑</button>
          <button class="action-btn delete" @click="handleDelete(addr.id)">删除</button>
        </div>
      </div>
    </div>

    <!-- 底部固定新增按钮 -->
    <div class="bottom-bar">
      <button class="btn-primary add-addr-btn" @click="handleAdd">
        + 新增收货地址
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAddressStore } from '../../stores/address.js';
import NavBar from '../../components/NavBar.vue';

const router = useRouter();
const addressStore = useAddressStore();

function handleSelect(id) {
  addressStore.selectAddress(id);
  if (window.history.length > 1) {
    router.back();
  }
}

function handleAdd() {
  router.push('/address/edit');
}

function handleEdit(id) {
  router.push(`/address/edit?id=${id}`);
}

function handleDelete(id) {
  if (confirm('确定删除该地址吗？')) {
    addressStore.deleteAddress(id);
  }
}
</script>

<style scoped>
.address-page {
  padding-bottom: 70px;
}

.empty-addr-view {
  text-align: center;
  padding-top: 100px;
}

.empty-icon {
  font-size: 54px;
}

.empty-text {
  font-size: 14px;
  color: var(--text-muted);
  margin-top: 10px;
}

.address-list {
  padding: 6px 0;
}

.address-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px;
  cursor: pointer;
  transition: transform 0.15s;
}

.address-card:active {
  transform: scale(0.99);
}

.card-content {
  flex: 1;
  padding-right: 12px;
}

.info-top {
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

.tag-badge.default {
  background-color: #f2f3f5;
  color: var(--text-regular);
}

.address-detail-text {
  font-size: 13px;
  color: var(--text-main);
  line-height: 1.4;
}

.card-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-left: 1px solid var(--border-color);
  padding-left: 12px;
}

.action-btn {
  border: none;
  background: transparent;
  font-size: 12px;
  color: var(--text-regular);
  cursor: pointer;
}

.action-btn.delete {
  color: var(--danger-color);
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  padding: 10px 14px;
  background-color: #fff;
  border-top: 1px solid var(--border-color);
  z-index: 99;
}

.add-addr-btn {
  width: 100%;
  height: 42px;
  font-size: 15px;
}
</style>
