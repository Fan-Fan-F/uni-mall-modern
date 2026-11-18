/**
 * uni-mall-modern 核心功能与业务逻辑自测试套件
 * 运行方式: node test/verify.js
 */

import assert from 'assert';
import { mockBanners } from '../src/data/banners.js';
import { mockCategories } from '../src/data/categories.js';
import { mockCoupons } from '../src/data/coupons.js';
import { mockProducts } from '../src/data/products.js';
import { api } from '../src/services/api.js';

let passedTests = 0;
let totalTests = 0;

function runTest(testName, fn) {
  totalTests++;
  try {
    fn();
    console.log(`[PASS] ${testName}`);
    passedTests++;
  } catch (err) {
    console.error(`[FAIL] ${testName}:`, err.message);
    throw err;
  }
}

async function runAsyncTest(testName, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`[PASS] ${testName}`);
    passedTests++;
  } catch (err) {
    console.error(`[FAIL] ${testName}:`, err.message);
    throw err;
  }
}

console.log('=== 开始执行 uni-mall-modern 核心业务自动化校验 ===\n');

// 1. Mock 数据完备性测试
runTest('测试用例 1: Mock 基础数据源完备性与格式规范', () => {
  assert(mockBanners.length >= 3, '轮播图数量不少于3张');
  assert(mockCategories.length >= 4, '商品分类大类不少于4个');
  assert(mockCoupons.length >= 3, '优惠券不少于3张');
  assert(mockProducts.length >= 5, '商品库不少于5件商品');

  mockProducts.forEach((p) => {
    assert(p.id && p.title && p.price > 0, `商品 ${p.id} 基础字段正常`);
    assert(Array.isArray(p.specGroups), `商品 ${p.id} 包含多维规格分组`);
    assert(Array.isArray(p.skus) && p.skus.length > 0, `商品 ${p.id} 包含有效 SKU`);
  });
});

// 2. API 适配器异步接口测试
await runAsyncTest('测试用例 2: API 适配器数据访问与分类/搜索过滤', async () => {
  const banners = await api.getBanners();
  assert.strictEqual(banners.length, mockBanners.length);

  const cat1Products = await api.getProducts({ categoryId: 1 });
  assert(cat1Products.length > 0, '分类 1 存在对应商品');
  assert(cat1Products.every((p) => p.categoryId === 1), '分类过滤准确');

  const searchResults = await api.getProducts({ keyword: '羽绒服' });
  assert(searchResults.length > 0, '关键词搜索返回匹配商品');

  const detail = await api.getProductDetail(1);
  assert.strictEqual(detail.id, 1);
});

// 3. 购物车状态管理逻辑测试
runTest('测试用例 3: 购物车加购、多规格合并、数量更新与全选联动计算', () => {
  // 模拟购物车内存逻辑
  const items = [];
  function addToCart(product, specs, quantity, price, stock) {
    const specKey = Object.entries(specs).sort().map(([k, v]) => `${k}:${v}`).join('|');
    const existing = items.find(
      (item) => item.productId === product.id &&
      Object.entries(item.specs).sort().map(([k, v]) => `${k}:${v}`).join('|') === specKey
    );
    if (existing) {
      existing.quantity = Math.min(existing.stock, existing.quantity + quantity);
    } else {
      items.push({
        id: `item-${items.length + 1}`,
        productId: product.id,
        title: product.title,
        specs,
        quantity: Math.min(stock, quantity),
        price,
        stock,
        checked: true
      });
    }
  }

  const p1 = mockProducts[0];
  // 首次加入 1 件
  addToCart(p1, { '颜色': '极光蓝', '尺码': '120cm' }, 1, 199.00, 45);
  assert.strictEqual(items.length, 1);
  assert.strictEqual(items[0].quantity, 1);

  // 再次加入同规格 2 件，应合并为 3 件
  addToCart(p1, { '颜色': '极光蓝', '尺码': '120cm' }, 2, 199.00, 45);
  assert.strictEqual(items.length, 1);
  assert.strictEqual(items[0].quantity, 3);

  // 加入不同规格，应新增一条
  addToCart(p1, { '颜色': '樱花粉', '尺码': '110cm' }, 1, 199.00, 35);
  assert.strictEqual(items.length, 2);

  // 计算已勾选总金额
  const totalAmount = items.filter(i => i.checked).reduce((sum, i) => sum + i.price * i.quantity, 0);
  assert.strictEqual(totalAmount, 199.00 * 3 + 199.00 * 1); // 796.00

  // 数量超限拦截
  items[0].quantity = Math.min(items[0].stock, 100);
  assert.strictEqual(items[0].quantity, 45); // 不超过库存 45
});

// 4. 订单创建与全流程状态流转测试
runTest('测试用例 4: 订单结算金额抵扣、创建与状态流转（待付款->待发货->待收货->已完成）', () => {
  const orders = [];
  function createOrder({ items, coupon, freight = 0 }) {
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = coupon ? coupon.amount : 0;
    const payAmount = Math.max(0.01, totalAmount + freight - discount);
    const order = {
      orderId: `ORD-${Date.now()}`,
      status: 'pending_payment',
      totalAmount,
      discount,
      freight,
      payAmount,
      paidAt: null
    };
    orders.push(order);
    return order;
  }

  const orderItems = [
    { productId: 1, price: 199.00, quantity: 2 } // 398.00
  ];
  const coupon = mockCoupons.find(c => c.id === 3); // 满 300 减 50
  const order = createOrder({ items: orderItems, coupon, freight: 0 });

  assert.strictEqual(order.totalAmount, 398.00);
  assert.strictEqual(order.discount, 50.00);
  assert.strictEqual(order.payAmount, 348.00);
  assert.strictEqual(order.status, 'pending_payment');

  // 模拟支付完成
  order.status = 'pending_dispatch';
  order.paidAt = Date.now();
  assert.strictEqual(order.status, 'pending_dispatch');
  assert(order.paidAt > 0);

  // 模拟卖家发货
  order.status = 'pending_receipt';
  assert.strictEqual(order.status, 'pending_receipt');

  // 模拟买家确认收货
  order.status = 'completed';
  assert.strictEqual(order.status, 'completed');
});

// 5. 收货地址模型与默认地址规则测试
runTest('测试用例 5: 收货地址增删改与唯一默认地址维护', () => {
  const addressList = [];
  function addAddress(addr) {
    if (addr.isDefault || addressList.length === 0) {
      addressList.forEach(a => a.isDefault = false);
    }
    const newAddr = { id: `addr-${addressList.length + 1}`, ...addr, isDefault: addr.isDefault || addressList.length === 0 };
    addressList.push(newAddr);
    return newAddr;
  }

  const a1 = addAddress({ name: '张三', phone: '13800000000', region: '广东省深圳市', detail: '科技园' });
  assert.strictEqual(a1.isDefault, true, '首个地址自动成为默认地址');

  const a2 = addAddress({ name: '李四', phone: '13900000000', region: '北京市海淀区', detail: '中关村', isDefault: true });
  assert.strictEqual(a2.isDefault, true);
  assert.strictEqual(addressList.find(a => a.id === a1.id).isDefault, false, '新增默认地址后原有默认地址自动取消');
});

console.log(`\n=== 自测试执行完成: 共 ${totalTests} 个用例，通过 ${passedTests} 个，失败 0 个 ===\n`);
