<template>
  <div v-if="visible" class="pay-overlay" @click="handleCancel">
    <div class="pay-modal" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">收银台支付</h3>
        <button class="close-btn" @click="handleCancel">×</button>
      </div>

      <div class="amount-card">
        <span class="currency">¥</span>
        <span class="pay-amount">{{ formatPrice(amount) }}</span>
      </div>

      <div class="channels-list">
        <div
          v-for="ch in channels"
          :key="ch.id"
          class="channel-item"
          :class="{ active: selectedChannel === ch.id }"
          @click="selectedChannel = ch.id"
        >
          <div class="channel-left">
            <span class="channel-icon">{{ ch.icon }}</span>
            <span class="channel-name">{{ ch.name }}</span>
          </div>
          <span class="radio-circle">
            <span v-if="selectedChannel === ch.id" class="radio-inner"></span>
          </span>
        </div>
      </div>

      <div class="modal-footer">
        <button
          class="btn-pay"
          :disabled="paying"
          @click="handlePay"
        >
          <span v-if="paying">正在安全支付...</span>
          <span v-else>立即支付 ¥{{ formatPrice(amount) }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { formatPrice } from '../utils/format.js';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  amount: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['update:visible', 'success', 'cancel']);

const selectedChannel = ref('wechat');
const paying = ref(false);

const channels = [
  { id: 'wechat', name: '微信支付', icon: '🟢' },
  { id: 'alipay', name: '支付宝支付', icon: '🔵' },
  { id: 'balance', name: '商城账户余额支付', icon: '🪙' }
];

function handleCancel() {
  if (paying.value) return;
  emit('update:visible', false);
  emit('cancel');
}

function handlePay() {
  paying.value = true;
  const channelObj = channels.find((c) => c.id === selectedChannel.value);
  // 模拟安全支付请求延迟
  setTimeout(() => {
    paying.value = false;
    emit('update:visible', false);
    emit('success', {
      channel: channelObj ? channelObj.name : '微信支付'
    });
  }, 1000);
}
</script>

<style scoped>
.pay-overlay {
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

.pay-modal {
  width: 100%;
  max-width: 480px;
  background-color: #fff;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  padding: 16px;
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

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.modal-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-main);
}

.close-btn {
  border: none;
  background: transparent;
  font-size: 22px;
  color: var(--text-muted);
  cursor: pointer;
}

.amount-card {
  text-align: center;
  padding: 16px 0;
  background: #fafafa;
  border-radius: var(--radius-md);
  margin-bottom: 20px;
}

.currency {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-main);
  margin-right: 2px;
}

.pay-amount {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-main);
  font-family: 'DIN Alternate', PingFangSC-Medium, sans-serif;
}

.channels-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.channel-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s;
}

.channel-item.active {
  border-color: var(--primary-color);
  background-color: #fffaf7;
}

.channel-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.channel-icon {
  font-size: 20px;
}

.channel-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-main);
}

.radio-circle {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
}

.channel-item.active .radio-circle {
  border-color: var(--primary-color);
}

.radio-inner {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: var(--primary-color);
}

.modal-footer {
  padding-bottom: 8px;
}

.btn-pay {
  width: 100%;
  height: 44px;
  background: var(--primary-gradient);
  color: #fff;
  border: none;
  border-radius: var(--radius-round);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.btn-pay:disabled {
  opacity: 0.6;
}
</style>
