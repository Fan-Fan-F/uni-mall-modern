# uni-mall-modern

现代化多端电商商城前端模板（基于 Vue 3 + Vite 5 + Pinia 全新重构）  
Modern multi-platform e-commerce front-end template rewritten with Vue 3, Vite 5, and Pinia.

---

## 中文文档

### 简介
`uni-mall-modern` 是一个面向移动端与多端场景的高性能、现代化电商商城前端工程。基于经典移动电商的业务功能设计，采用现代前端工程化标准全新独立重写，摆脱对特定闭源 IDE 与第三方接口平台的强依赖，提供开箱即用的完整电商闭环体验。

### 功能与原思路的关系
原项目 [gooking/uni-app-mall](https://github.com/gooking/uni-app-mall) 是一个基于 Vue 2 + HBuilderX + api工厂中台构建的经典商城模板。本项目继承其核心业务设计思路（首页轮播营销、左右两级分类联动、商品多规格展示、购物车管理、订单流程与个人中心），但在架构与实现上进行了 100% 全新独立编写，并实现了 5 大实质性改进：

1. **构建工程与技术栈全面现代化（Vue 3 + Vite 5 + Pinia）**
   - 彻底摆脱对 HBuilderX 专有工具和已过时 Vue 2 的绑定，升级为 Vue 3 `<script setup>` 组合式 API 与 Vite 5 构建体系；
   - 提供标准化的 npm 命令（`dev`、`build`、`preview`、`test`），支持毫秒级 HMR 热更新与极速打包。
2. **解耦第三方中台依赖，构建内聚 Mock 与数据适配引擎**
   - 原项目强依赖第三方特定接口域名与商户密钥，断网或配置异常即白屏；
   - 本项目内置完整的轮播图、分类树、多规格商品库、优惠券 Mock 数据与本地持久化存储，无需任何外部网络服务即可体验完整商城流程，同时提供统一 API 适配器（`src/services/api.js`），支持一键对接真实企业后端。
3. **重写购物车核心业务与全局状态联动**
   - 基于 Pinia `cartStore` 统一管理状态，支持商品单选、反选、全选；
   - 集成库存边界受控步进器（1~Stock 严格拦截）；
   - 实时核算已选件数、商品原价、优惠立省金额与最终实付，并在底部 TabBar 实时同步徽标角标。
4. **重构订单全生命周期流转与结算收银台**
   - 补齐从购物车结算到订单确认页（`confirm.vue`）的完整数据流，支持收货地址自动载入与切换、配送方式选择、买家留言与优惠券智能抵扣；
   - 内置轻量级拟真收银台（`PayModal.vue`），支付完成后自动将订单流转为待发货状态；
   - 订单中心（`list.vue`）支持“全部 / 待付款 / 待发货 / 待收货 / 已完成”五大 Tab 状态查看与交互（确认收货、取消订单、再次购买）。
5. **全新多维 SKU 规格组合器与沉浸式商品详情**
   - 自研多维规格选择抽屉（`SkuPicker.vue`），支持颜色、尺码等多维度规格交叉匹配，动态联动对应 SKU 价格与库存；
   - 详情页提供多图轮播相册、图文说明、商品收藏状态联动与立即购买抽屉唤起。

### 快速开始

#### 环境要求
- Node.js >= 18.0.0
- npm >= 9.0.0

#### 安装与启动
```bash
# 1. 克隆或进入项目目录
cd uni-mall-modern

# 2. 安装项目依赖
npm install

# 3. 启动本地开发服务器（秒级热启动）
npm run dev

# 4. 执行业务逻辑自动化测试
npm test

# 5. 打包生产静态产物
npm run build

# 6. 本地预览生产构建产物
npm run preview
```

### 来源与致谢
本项目受 [gooking/uni-app-mall](https://github.com/gooking/uni-app-mall) 启发重写，代码全部新写，原项目由 gooking 以 MIT 许可证开源。

### 许可证
本项目沿用 MIT 许可证，全文详见根目录 [LICENSE](./LICENSE)。

---

## English Documentation

### Introduction
`uni-mall-modern` is a high-performance, modern multi-platform e-commerce front-end application built for mobile and responsive Web environments. It rebuilds the functional concepts of classical mobile shopping applications using modern engineering standards with Vue 3, Vite 5, and Pinia, providing an out-of-the-box shopping experience without vendor lock-in or external backend dependencies.

### Features & Key Improvements
Inspired by the core feature flows of [gooking/uni-app-mall](https://github.com/gooking/uni-app-mall) (home showcase, category navigation, multi-spec SKU matching, shopping cart, checkout, order center, and user dashboard), all code has been rewritten from scratch with 5 major upgrades:

1. **Modern Technology Stack (Vue 3 + Vite 5 + Pinia)**
   - Replaced legacy Vue 2 Options API and proprietary IDE dependencies with modern Vue 3 Composition API (`<script setup>`) and Vite 5 build toolchain.
   - Standard npm lifecycle scripts (`dev`, `build`, `preview`, `test`) with instant HMR and optimized production bundles.
2. **Decoupled Architecture with Built-in Mock Engine & API Adapter**
   - Eliminates hardcoded dependencies on third-party cloud backends that previously caused application crashes when offline.
   - Provides comprehensive mock datasets (banners, categories, multi-spec products, coupons) and local storage persistence, along with a clean API adapter layer (`src/services/api.js`) for seamless real backend integration.
3. **Comprehensive Shopping Cart Management**
   - Reactive Pinia store with full selection logic (select, deselect, select-all), quantity steppers with inventory constraints, automatic total and discount calculations, and real-time TabBar badge synchronization.
4. **End-to-End Order Lifecycle & Interactive Cashier**
   - Complete checkout workflow: shipping address selection, express/pickup delivery toggling, coupon deductions, buyer notes, and detailed price breakdowns.
   - Interactive payment modal (`PayModal.vue`) that transitions orders through lifecycle states (`Pending Payment`, `Pending Dispatch`, `Pending Receipt`, `Completed`, `Cancelled`).
5. **Multi-dimensional SKU Picker & Immersive Product Details**
   - Dynamic SKU variant matcher that updates price and inventory according to selected attributes (color, size, etc.).
   - Full photo gallery preview, rich description layout, wishlist toggling, and instant checkout drawer.

### Quick Start

#### Requirements
- Node.js >= 18.0.0
- npm >= 9.0.0

#### Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run automated logic verification tests
npm test

# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Attribution and Acknowledgements
This project is a rewrite inspired by [gooking/uni-app-mall](https://github.com/gooking/uni-app-mall). All code is newly implemented from scratch. The original project was open-sourced by gooking under the MIT License.

### License
This project is open-sourced under the MIT License. See the root [LICENSE](./LICENSE) for the full text.
