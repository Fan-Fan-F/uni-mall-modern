import { defineStore } from 'pinia';
import { storage } from '../utils/storage.js';

export const useCartStore = defineStore('cart', {
  state: () => ({
    // 购物车商品条目
    items: storage.get('cart_items', [
      {
        id: 'init-1',
        productId: 1,
        title: '儿童加厚白鸭绒羽绒服 男童女童中长款保暖防寒服',
        cover: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
        price: 199.00,
        originalPrice: 359.00,
        quantity: 1,
        selectedSpecs: { '颜色': '极光蓝', '尺码': '120cm' },
        stock: 45,
        checked: true
      },
      {
        id: 'init-2',
        productId: 2,
        title: '儿童纯棉加绒连帽卫衣 软糯亲肤套头衫',
        cover: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
        price: 69.90,
        originalPrice: 129.00,
        quantity: 2,
        selectedSpecs: { '颜色': '奶杏色', '尺码': '110cm' },
        stock: 90,
        checked: true
      }
    ])
  }),

  getters: {
    // 购物车全部件数
    totalCount: (state) => {
      return state.items.reduce((sum, item) => sum + item.quantity, 0);
    },

    // 已勾选件数
    checkedCount: (state) => {
      return state.items.filter((i) => i.checked).reduce((sum, i) => sum + i.quantity, 0);
    },

    // 已勾选总原价
    checkedOriginalAmount: (state) => {
      return state.items
        .filter((i) => i.checked)
        .reduce((sum, i) => sum + (i.originalPrice || i.price) * i.quantity, 0);
    },

    // 已勾选现付总额
    checkedAmount: (state) => {
      return state.items
        .filter((i) => i.checked)
        .reduce((sum, i) => sum + i.price * i.quantity, 0);
    },

    // 节省金额
    savedAmount: (state) => {
      const orig = state.items
        .filter((i) => i.checked)
        .reduce((sum, i) => sum + (i.originalPrice || i.price) * i.quantity, 0);
      const curr = state.items
        .filter((i) => i.checked)
        .reduce((sum, i) => sum + i.price * i.quantity, 0);
      return Math.max(0, orig - curr);
    },

    // 是否全部选中
    isAllChecked: (state) => {
      return state.items.length > 0 && state.items.every((i) => i.checked);
    },

    // 获取当前待结算的商品
    checkoutItems: (state) => {
      return state.items.filter((i) => i.checked);
    }
  },

  actions: {
    saveToStorage() {
      storage.set('cart_items', this.items);
    },

    // 添加商品到购物车
    addToCart({ product, specs = {}, quantity = 1, price = null, stock = 99 }) {
      const specKey = Object.entries(specs)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k}:${v}`)
        .join('|');

      const existing = this.items.find((item) => {
        const itemSpecKey = Object.entries(item.selectedSpecs || {})
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([k, v]) => `${k}:${v}`)
          .join('|');
        return item.productId === product.id && itemSpecKey === specKey;
      });

      const actualPrice = price !== null ? price : product.price;

      if (existing) {
        existing.quantity = Math.min(existing.stock, existing.quantity + quantity);
      } else {
        this.items.unshift({
          id: `${product.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          productId: product.id,
          title: product.title,
          cover: product.cover,
          price: actualPrice,
          originalPrice: product.originalPrice,
          quantity: Math.min(stock, quantity),
          selectedSpecs: { ...specs },
          stock,
          checked: true
        });
      }
      this.saveToStorage();
    },

    // 更新商品数量
    updateQuantity(itemId, quantity) {
      const item = this.items.find((i) => i.id === itemId);
      if (item) {
        if (quantity <= 0) {
          this.removeItem(itemId);
        } else {
          item.quantity = Math.min(item.stock, quantity);
          this.saveToStorage();
        }
      }
    },

    // 切换单品选中态
    toggleCheck(itemId) {
      const item = this.items.find((i) => i.id === itemId);
      if (item) {
        item.checked = !item.checked;
        this.saveToStorage();
      }
    },

    // 全选 / 反选
    toggleAll(checked) {
      this.items.forEach((item) => {
        item.checked = checked;
      });
      this.saveToStorage();
    },

    // 移除单个商品
    removeItem(itemId) {
      this.items = this.items.filter((i) => i.id !== itemId);
      this.saveToStorage();
    },

    // 清理已结算的选中商品
    removeCheckedItems() {
      this.items = this.items.filter((i) => !i.checked);
      this.saveToStorage();
    },

    // 清空购物车
    clearCart() {
      this.items = [];
      this.saveToStorage();
    }
  }
});
