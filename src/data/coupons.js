export const mockCoupons = [
  {
    id: 1,
    name: '新人专享立减券',
    amount: 10,
    minSpend: 50,
    startTime: '2026-01-01',
    endTime: '2026-12-31',
    status: 'available', // available, used, expired
    tag: '新人礼'
  },
  {
    id: 2,
    name: '冬日焕新满减券',
    amount: 25,
    minSpend: 150,
    startTime: '2026-10-01',
    endTime: '2026-12-31',
    status: 'available',
    tag: '限时大促'
  },
  {
    id: 3,
    name: '全场通用大额券',
    amount: 50,
    minSpend: 300,
    startTime: '2026-11-01',
    endTime: '2026-12-31',
    status: 'available',
    tag: '年度热卖'
  }
];
