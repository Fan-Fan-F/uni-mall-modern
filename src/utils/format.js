/**
 * 格式化货币金额，保留 2 位小数
 */
export function formatPrice(val) {
  const num = parseFloat(val);
  if (isNaN(num)) return '0.00';
  return num.toFixed(2);
}

/**
 * 格式化日期为 YYYY-MM-DD HH:mm
 */
export function formatDate(timestamp) {
  if (!timestamp) return '';
  const d = new Date(timestamp);
  const pad = (n) => (n < 10 ? '0' + n : n);
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}
