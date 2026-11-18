import { defineStore } from 'pinia';
import { storage } from '../utils/storage.js';

export const ORDER_STATUS = {
  ALL: 'all',
  PENDING_PAYMENT: 'pending_payment', // 待付款
  PENDING_DISPATCH: 'pending_dispatch', // 待发货
  PENDING_RECEIPT: 'pending_receipt',   // 待收货
  COMPLETED: 'completed',               // 已完成
  CANCELLED: 'cancelled'                // 已取消
};

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: storage.get('mall_orders', [
      {
        orderId: 'ORD20261118001',
        createdAt: Date.now() - 3600 * 1000 * 24,
        status: ORDER_STATUS.PENDING_RECEIPT,
        statusText: '卖家已发货',
        address: {
          name: '张小凡',
          phone: '138****8888',
          region: '广东省深圳市南山区',
          detail: '科技园南区 88 号高新大厦 12F'
        },
        items: [
          {
            productId: 1,
            title: '儿童加厚白鸭绒羽绒服 男童女童中长款保暖防寒服',
            cover: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
            price: 199.00,
            quantity: 1,
            specs: { '颜色': '极光蓝', '尺码': '120cm' }
          }
        ],
        totalAmount: 199.00,
        freight: 0.00,
        discountAmount: 10.00,
        payAmount: 189.00,
        payChannel: '微信支付',
        paidAt: Date.now() - 3600 * 1000 * 23
      }
    ])
  }),

  getters: {
    // 按状态过滤订单
    getOrdersByStatus: (state) => (status) => {
      if (!status || status === ORDER_STATUS.ALL) {
        return state.orders;
      }
      return state.orders.filter((o) => o.status === status);
    },

    // 统计各状态角标数量
    statusCounts: (state) => {
      const counts = {
        pending_payment: 0,
        pending_dispatch: 0,
        pending_receipt: 0,
        completed: 0
      };
      state.orders.forEach((o) => {
        if (counts[o.status] !== undefined) {
          counts[o.status]++;
        }
      });
      return counts;
    }
  },

  actions: {
    saveToStorage() {
      storage.set('mall_orders', this.orders);
    },

    // 创建订单
    createOrder({ items, address, coupon = null, remark = '', freight = 0.00 }) {
      const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const discountAmount = coupon ? coupon.amount : 0;
      const payAmount = Math.max(0.01, totalAmount + freight - discountAmount);
      const orderId = `ORD${Date.now()}${Math.floor(Math.random() * 900 + 100)}`;

      const newOrder = {
        orderId,
        createdAt: Date.now(),
        status: ORDER_STATUS.PENDING_PAYMENT,
        statusText: '等待买家付款',
        address: { ...address },
        items: [...items],
        totalAmount,
        freight,
        discountAmount,
        payAmount,
        couponName: coupon ? coupon.name : '无',
        remark,
        payChannel: '',
        paidAt: null
      };

      this.orders.unshift(newOrder);
      this.saveToStorage();
      return newOrder;
    },

    // 模拟支付订单
    payOrder(orderId, payChannel = '微信支付') {
      const order = this.orders.find((o) => o.orderId === orderId);
      if (order && order.status === ORDER_STATUS.PENDING_PAYMENT) {
        order.status = ORDER_STATUS.PENDING_DISPATCH;
        order.statusText = '买家已付款，等待发货';
        order.payChannel = payChannel;
        order.paidAt = Date.now();
        this.saveToStorage();
        return true;
      }
      return false;
    },

    // 确认收货
    confirmReceipt(orderId) {
      const order = this.orders.find((o) => o.orderId === orderId);
      if (order && order.status === ORDER_STATUS.PENDING_RECEIPT) {
        order.status = ORDER_STATUS.COMPLETED;
        order.statusText = '交易成功';
        this.saveToStorage();
        return true;
      }
      return false;
    },

    // 取消订单
    cancelOrder(orderId) {
      const order = this.orders.find((o) => o.orderId === orderId);
      if (order && order.status === ORDER_STATUS.PENDING_PAYMENT) {
        order.status = ORDER_STATUS.CANCELLED;
        order.statusText = '已取消';
        this.saveToStorage();
        return true;
      }
      return false;
    }
  }
});
