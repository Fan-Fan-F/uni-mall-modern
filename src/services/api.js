import { mockBanners } from '../data/banners.js';
import { mockCategories } from '../data/categories.js';
import { mockCoupons } from '../data/coupons.js';
import { mockProducts } from '../data/products.js';

/**
 * 统一商城 API 适配器层
 * 支持 Promise 异步交互，解耦真实后端与离线 Mock 数据
 */
export const api = {
  // 获取轮播图
  async getBanners() {
    return Promise.resolve([...mockBanners]);
  },

  // 获取商品分类树
  async getCategories() {
    return Promise.resolve([...mockCategories]);
  },

  // 获取可用优惠券列表
  async getCoupons() {
    return Promise.resolve([...mockCoupons]);
  },

  // 获取商品列表（支持分类过滤、热销过滤、搜索关键字）
  async getProducts(params = {}) {
    let list = [...mockProducts];
    if (params.categoryId) {
      list = list.filter((p) => p.categoryId === Number(params.categoryId));
    }
    if (params.isHot) {
      list = list.filter((p) => p.isHot);
    }
    if (params.keyword) {
      const kw = params.keyword.trim().toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(kw) || p.brief.toLowerCase().includes(kw));
    }
    return Promise.resolve(list);
  },

  // 获取单品详情
  async getProductDetail(id) {
    const product = mockProducts.find((p) => p.id === Number(id));
    if (!product) {
      return Promise.reject(new Error('商品不存在或已下架'));
    }
    return Promise.resolve({ ...product });
  }
};
