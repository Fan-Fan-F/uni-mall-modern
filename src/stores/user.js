import { defineStore } from 'pinia';
import { storage } from '../utils/storage.js';

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: storage.get('user_info', {
      name: '小明同学',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      level: '黄金会员',
      balance: 520.00,
      points: 1280
    }),
    favorites: storage.get('user_favorites', [1, 2]),
    footprints: storage.get('user_footprints', [1, 2, 4])
  }),

  actions: {
    toggleFavorite(productId) {
      const idx = this.favorites.indexOf(productId);
      if (idx > -1) {
        this.favorites.splice(idx, 1);
      } else {
        this.favorites.push(productId);
      }
      storage.set('user_favorites', this.favorites);
    },

    isFavorite(productId) {
      return this.favorites.includes(productId);
    },

    addFootprint(productId) {
      this.footprints = this.footprints.filter((id) => id !== productId);
      this.footprints.unshift(productId);
      if (this.footprints.length > 20) {
        this.footprints.pop();
      }
      storage.set('user_footprints', this.footprints);
    }
  }
});
