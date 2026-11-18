export const mockProducts = [
  {
    id: 1,
    title: '儿童加厚白鸭绒羽绒服 男童女童中长款保暖防寒服',
    brief: '90% 高蓬松度白鸭绒，防风防水三防面料，-20℃ 极寒抗冻',
    categoryId: 1,
    categoryName: '儿童外套',
    price: 199.00,
    originalPrice: 359.00,
    sales: 1280,
    stock: 260,
    isHot: true,
    isNew: true,
    cover: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=600&q=80'
    ],
    specGroups: [
      {
        name: '颜色',
        values: ['极光蓝', '樱花粉', '曜石黑']
      },
      {
        name: '尺码',
        values: ['110cm', '120cm', '130cm', '140cm']
      }
    ],
    skus: [
      { id: '1-1', specs: { '颜色': '极光蓝', '尺码': '110cm' }, price: 199.00, stock: 50 },
      { id: '1-2', specs: { '颜色': '极光蓝', '尺码': '120cm' }, price: 199.00, stock: 45 },
      { id: '1-3', specs: { '颜色': '极光蓝', '尺码': '130cm' }, price: 209.00, stock: 30 },
      { id: '1-4', specs: { '颜色': '极光蓝', '尺码': '140cm' }, price: 209.00, stock: 25 },
      { id: '1-5', specs: { '颜色': '樱花粉', '尺码': '110cm' }, price: 199.00, stock: 35 },
      { id: '1-6', specs: { '颜色': '樱花粉', '尺码': '120cm' }, price: 199.00, stock: 40 },
      { id: '1-7', specs: { '颜色': '樱花粉', '尺码': '130cm' }, price: 209.00, stock: 20 },
      { id: '1-8', specs: { '颜色': '曜石黑', '尺码': '120cm' }, price: 199.00, stock: 15 }
    ],
    details: [
      '优质 90% 白鸭绒填充，轻盈保暖不压身。',
      '高密度微孔科技外层面料，防泼水、防风、透气耐撕裂。',
      '安全连帽设计，弹性收口下摆与防夹拉链挡风片。',
      '通过 A 类婴幼儿标准严格质检，亲肤无荧光剂。'
    ]
  },
  {
    id: 2,
    title: '儿童纯棉加绒连帽卫衣 软糯亲肤套头衫',
    brief: '精梳天然纯棉，内里细密摇粒绒，秋冬日常百搭',
    categoryId: 2,
    categoryName: '上装内搭',
    price: 69.90,
    originalPrice: 129.00,
    sales: 2450,
    stock: 450,
    isHot: true,
    isNew: false,
    cover: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=600&q=80'
    ],
    specGroups: [
      {
        name: '颜色',
        values: ['奶杏色', '复古绿', '经典黑']
      },
      {
        name: '尺码',
        values: ['100cm', '110cm', '120cm', '130cm']
      }
    ],
    skus: [
      { id: '2-1', specs: { '颜色': '奶杏色', '尺码': '100cm' }, price: 69.90, stock: 80 },
      { id: '2-2', specs: { '颜色': '奶杏色', '尺码': '110cm' }, price: 69.90, stock: 90 },
      { id: '2-3', specs: { '颜色': '复古绿', '尺码': '110cm' }, price: 69.90, stock: 70 },
      { id: '2-4', specs: { '颜色': '经典黑', '尺码': '120cm' }, price: 69.90, stock: 65 }
    ],
    details: [
      '40 支精梳棉织造，手感柔滑软糯。',
      '环保活性印染，耐水洗不掉色。',
      '微弹落肩版型，舒适活动不拘束。'
    ]
  },
  {
    id: 3,
    title: '儿童一体绒保暖运动裤 加厚防风卫裤',
    brief: '外层致密棉质，内层黄金一体绒，锁温蓄热防静电',
    categoryId: 3,
    categoryName: '裤装裙装',
    price: 59.00,
    originalPrice: 99.00,
    sales: 1890,
    stock: 310,
    isHot: false,
    isNew: true,
    cover: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80'
    ],
    specGroups: [
      {
        name: '颜色',
        values: ['麻灰色', '深海蓝']
      },
      {
        name: '尺码',
        values: ['110cm', '120cm', '130cm']
      }
    ],
    skus: [
      { id: '3-1', specs: { '颜色': '麻灰色', '尺码': '110cm' }, price: 59.00, stock: 80 },
      { id: '3-2', specs: { '颜色': '麻灰色', '尺码': '120cm' }, price: 59.00, stock: 90 },
      { id: '3-3', specs: { '颜色': '深海蓝', '尺码': '120cm' }, price: 59.00, stock: 60 }
    ],
    details: [
      '高弹腰围松紧带，不勒小肚腩。',
      '立体收口脚踝设计，防灌风锁温。'
    ]
  },
  {
    id: 4,
    title: '轻量防滑减震儿童运动鞋 旋钮扣透气跑鞋',
    brief: '便捷旋钮秒穿脱，EVA 缓震大底，抓地防滑耐磨',
    categoryId: 4,
    categoryName: '童鞋运动',
    price: 129.00,
    originalPrice: 219.00,
    sales: 960,
    stock: 180,
    isHot: true,
    isNew: true,
    cover: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80'
    ],
    specGroups: [
      {
        name: '颜色',
        values: ['白橙配色', '黑武士', '蓝灰炫彩']
      },
      {
        name: '尺码',
        values: ['28码(内长18cm)', '30码(内长19.3cm)', '32码(内长20.5cm)']
      }
    ],
    skus: [
      { id: '4-1', specs: { '颜色': '白橙配色', '尺码': '28码(内长18cm)' }, price: 129.00, stock: 30 },
      { id: '4-2', specs: { '颜色': '白橙配色', '尺码': '30码(内长19.3cm)' }, price: 129.00, stock: 40 },
      { id: '4-3', specs: { '颜色': '黑武士', '尺码': '30码(内长19.3cm)' }, price: 129.00, stock: 35 }
    ],
    details: [
      '快速旋钮鞋带系统，单手调节一拧即紧。',
      'U 型包边护踝，支撑足弓，预防足外翻。'
    ]
  },
  {
    id: 5,
    title: '婴儿A类全棉夹棉睡袋 恒温防踢分腿睡袋',
    brief: '分腿自由翻滚，双向拉链夜间换尿布不着凉',
    categoryId: 5,
    categoryName: '居家母婴',
    price: 89.00,
    originalPrice: 159.00,
    sales: 780,
    stock: 120,
    isHot: false,
    isNew: false,
    cover: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80'
    ],
    specGroups: [
      {
        name: '花色',
        values: ['小恐龙', '萌萌兔', '小星星']
      },
      {
        name: '厚度',
        values: ['2.5 TOG(秋冬款)', '1.0 TOG(四季款)']
      }
    ],
    skus: [
      { id: '5-1', specs: { '花色': '小恐龙', '厚度': '2.5 TOG(秋冬款)' }, price: 89.00, stock: 40 },
      { id: '5-2', specs: { '花色': '萌萌兔', '厚度': '2.5 TOG(秋冬款)' }, price: 89.00, stock: 35 }
    ],
    details: [
      'A 类婴幼儿直接接触皮肤标准，无重金属、无偶氮染料。',
      '大下摆宽松设计，适合宝宝自然青蛙腿睡姿。'
    ]
  }
];
