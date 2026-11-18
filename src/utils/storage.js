/**
 * 跨端/浏览器通用的持久化存储包装器
 */
export const storage = {
  get(key, defaultValue = null) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const item = window.localStorage.getItem(`uni_mall_${key}`);
        return item ? JSON.parse(item) : defaultValue;
      }
    } catch (e) {
      console.warn(`[storage] Read error for key "${key}":`, e);
    }
    return defaultValue;
  },

  set(key, value) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(`uni_mall_${key}`, JSON.stringify(value));
      }
    } catch (e) {
      console.warn(`[storage] Write error for key "${key}":`, e);
    }
  },

  remove(key) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(`uni_mall_${key}`);
      }
    } catch (e) {
      console.warn(`[storage] Remove error for key "${key}":`, e);
    }
  }
};
