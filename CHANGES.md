# 改进记录 CHANGES — uni-mall-modern

本项目为 B 路线重写项目，基于 [gooking/uni-app-mall](https://github.com/gooking/uni-app-mall) 的思路与功能设计，全新独立实现并完成 5 项实质性重大升级。

---

## 实质改进清单（5 项）

### 1. 构建工程与技术栈全面现代化升级（Vue 3 + Vite 5 + Pinia）
- **改动文件**：`package.json`, `vite.config.js`, `index.html`, `src/main.js`, `src/App.vue`
- **原有痛点**：原项目为 Vue 2.x + 旧版 HBuilderX 专有工程结构，`package.json` 中仅有 `eslint` 脚本，无独立的前端 dev/build 编译命令，脱离特定 IDE 无法在纯命令行中跑起，且技术栈落后。
- **改进做法**：全新搭建 Vue 3 (`<script setup>` + Composition API) + Vite 5 高性能前端工程；编写标准化的 npm 构建流水线（`npm run dev`, `npm run build`, `npm run preview`）；提供现代移动端响应式 Viewport 视口适配与多端规范布局。

### 2. 解耦第三方中台依赖，构建内聚的 Mock 与数据适配引擎
- **改动文件**：`src/data/banners.js`, `src/data/categories.js`, `src/data/coupons.js`, `src/data/products.js`, `src/services/api.js`, `src/utils/storage.js`
- **原有痛点**：原项目强绑定“api工厂”第三方中台，要求开发者申请域名、子域名与商户 ID，在无网络或第三方服务波动时应用全线白屏报错，缺乏开箱即用的工程自闭环。
- **改进做法**：自研内聚完整的 Mock 数据引擎与 API 适配层，涵盖轮播图、两级分类、多规格商品、优惠券等全套业务数据；引入本地持久化能力，启动即可体验完整商城数据；同时在 `src/services/api.js` 中保留标准 RESTful 接口契约，随时可无缝切换对接真实企业后端。

### 3. 重写购物车核心业务与全局状态联动（补齐购物车核心功能）
- **改动文件**：`src/stores/cart.js`, `src/pages/cart/index.vue`, `src/components/Stepper.vue`, `src/components/TabBar.vue`
- **原有痛点**：原项目的购物车逻辑混杂于视图层，缺少严格的库存边界拦截与跨页面状态同步，加购后 TabBar 徽标不能动态响应。
- **改进做法**：通过 Pinia 构建独立响应式 `cartStore`，完整实现购物车单选、反选、全选状态联动计算，集成步进器（限制 1 至库存上限），支持多规格 SKU 展现、单项删除与批量清空；实时核算已选件数、商品总额及满减优惠金额；底部 TabBar 全局实时徽标数字同步。

### 4. 重构订单全生命周期流转与结算收银台（补齐订单核心页）
- **改动文件**：`src/stores/order.js`, `src/pages/order/confirm.vue`, `src/pages/order/list.vue`, `src/components/PayModal.vue`, `src/stores/address.js`, `src/pages/address/index.vue`, `src/pages/address/edit.vue`
- **原有痛点**：原项目订单与支付逻辑残缺，高度依赖微信商户号实名认证与第三方配置，无法在非微信小程序/离线环境中走通结算全流程。
- **改进做法**：全新实现订单确认页（`confirm.vue`）与订单中心页（`list.vue`）。支持配送方式选择、买家留言、优惠券抵用与金额实时拆解（商品原价、运费、优惠抵扣、实付金额）；内置轻量级拟真收银台组件（`PayModal.vue`），支付完成后自动清空购物车已结算商品并创建新订单，支持在订单中心按“全部/待付款/待发货/待收货/已完成”Tab 过滤与模拟操作流转。
- **范围说明**：优惠券未做独立中心页，以数据（`src/data/coupons.js`）+ 结算自动匹配最优券 + 首页/我的页展示实现；收货地址管理（`src/pages/address/` + `src/stores/address.js`）归属本项。

### 5. 全新多维 SKU 规格组合器与沉浸式商品详情
- **改动文件**：`src/components/SkuPicker.vue`, `src/pages/goods/detail.vue`, `src/pages/category/category.vue`
- **原有痛点**：原商品详情页在多规格搭配时容易样式错乱、状态不同步，缺少直观的规格弹窗交互。
- **改进做法**：独立研发多维 SKU 属性规格选择器（`SkuPicker.vue`），支持多属性规格（如颜色、尺码、版本）交叉选择、动态计算各规格下的现价、划线价与库存；提供沉浸式商品相册预览、商品详情富文本、一键收藏切换以及无缝加购/立即结算流转。

---

## 自测记录

- **自测环境**：Linux x86_64, Node.js v24.22.1, npm 10.9.4
- **外部依赖与服务说明**：本项目采用解耦数据适配层与内聚 Mock 数据引擎，已闭环自测，不依赖外部数据库与第三方云端 API，所有状态可离线在浏览器及内存/持久化存储中流转。

### 1. 依赖安装自测
- **命令**：`npm install`
- **执行结果**：
  ```bash
  added 34 packages in 32s
  7 packages are looking for funding
    run `npm fund` for details
  ```
- **结论**：安装成功，退出码 0，依赖树解析无报错。

### 2. 核心业务与状态流转自动化测试
- **命令**：`npm test`（即 `node test/verify.js`）
- **测试用例与输出**：
  ```text
  === 开始执行 uni-mall-modern 核心业务自动化校验 ===

  [PASS] 测试用例 1: Mock 基础数据源完备性与格式规范
  [PASS] 测试用例 2: API 适配器数据访问与分类/搜索过滤
  [PASS] 测试用例 3: 购物车加购、多规格合并、数量更新与全选联动计算
  [PASS] 测试用例 4: 订单结算金额抵扣、创建与状态流转（待付款->待发货->待收货->已完成）
  [PASS] 测试用例 5: 收货地址增删改与唯一默认地址维护

  === 自测试执行完成: 共 5 个用例，通过 5 个，失败 0 个 ===
  ```
- **结论**：5 个业务测试用例全部 100% 通过（实际跑出数字：5 个用例通过 5 个）。

### 3. 生产打包构建自测
- **命令**：`npm run build`
- **执行结果**：
  ```bash
  vite v5.4.21 building for production...
  ✓ 72 modules transformed.
  dist/index.html                       0.62 kB │ gzip:  0.43 kB
  dist/assets/index-DgflEXGj.js       115.53 kB │ gzip: 45.39 kB
  ✓ built in 2.91s
  ```
- **结论**：编译顺利完成，无任何错误或警告，产物成功生成在 `dist/` 目录。

### 4. 预览服务启动与 HTTP 可用性测试
- **命令**：`node -e 'const { spawn } = require("child_process"); const s = spawn("./node_modules/.bin/vite", ["preview", "--port", "4173"]); ...'`
- **执行结果**：
  ```text
  SERVER_STATUS: 200
  HTML_HAS_APP: true
  ```
- **结论**：HTTP 服务启动成功，响应码 200，HTML 正常挂载。

