import { defineStore } from 'pinia';
import { storage } from '../utils/storage.js';

export const useAddressStore = defineStore('address', {
  state: () => ({
    list: storage.get('user_addresses', [
      {
        id: 'addr-1',
        name: '张小凡',
        phone: '13800138000',
        region: '广东省深圳市南山区',
        detail: '高新南道 99 号智慧广场 A 座 1601',
        isDefault: true,
        tag: '公司'
      },
      {
        id: 'addr-2',
        name: '陆雪琪',
        phone: '13912345678',
        region: '北京市海淀区',
        detail: '中关村南大街 1 号青云大厦 8 层',
        isDefault: false,
        tag: '家'
      }
    ]),
    selectedId: null // 当前结算选中的临时地址 ID
  }),

  getters: {
    // 默认地址
    defaultAddress: (state) => {
      return state.list.find((a) => a.isDefault) || state.list[0] || null;
    },

    // 当前在订单确认页使用的地址
    currentAddress: (state) => {
      if (state.selectedId) {
        const found = state.list.find((a) => a.id === state.selectedId);
        if (found) return found;
      }
      return state.list.find((a) => a.isDefault) || state.list[0] || null;
    }
  },

  actions: {
    saveToStorage() {
      storage.set('user_addresses', this.list);
    },

    selectAddress(id) {
      this.selectedId = id;
    },

    addAddress(addr) {
      const id = `addr-${Date.now()}`;
      if (addr.isDefault || this.list.length === 0) {
        this.list.forEach((item) => (item.isDefault = false));
      }
      this.list.unshift({
        id,
        ...addr,
        isDefault: addr.isDefault || this.list.length === 0
      });
      this.saveToStorage();
      return id;
    },

    updateAddress(id, addr) {
      const idx = this.list.findIndex((a) => a.id === id);
      if (idx !== -1) {
        if (addr.isDefault) {
          this.list.forEach((item) => (item.isDefault = false));
        }
        this.list[idx] = { ...this.list[idx], ...addr };
        this.saveToStorage();
      }
    },

    deleteAddress(id) {
      this.list = this.list.filter((a) => a.id !== id);
      if (this.list.length > 0 && !this.list.some((a) => a.isDefault)) {
        this.list[0].isDefault = true;
      }
      if (this.selectedId === id) {
        this.selectedId = null;
      }
      this.saveToStorage();
    },

    setDefault(id) {
      this.list.forEach((item) => {
        item.isDefault = item.id === id;
      });
      this.saveToStorage();
    }
  }
});
