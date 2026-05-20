export interface ActivityItem {
  id: number;
  date: string;
  title: string;
  time: string;
  fiat: string;
  crypto: string;
}

export const defaultCrypto = '+4,815.00 USDT';

export const baseActivities: ActivityItem[] = [
  { id: 1, date: '2026年5月15日周五', title: '存储了 USDT', time: '23:04', fiat: '$4,812.88', crypto: '+4,815.00 USDT' },
  { id: 2, date: '2026年4月14日周二', title: '存储了 USDT', time: '19:08', fiat: '$4,823.25', crypto: '+4,815.00 USDT' },
  { id: 3, date: '2026年3月13日周五', title: '存储了 USDT', time: '20:34', fiat: '$4,801.64', crypto: '+4,815.00 USDT' },
  { id: 4, date: '2026年2月13日周五', title: '存储了 USDT', time: '20:29', fiat: '$4,820.92', crypto: '+4,815.00 USDT' },
  { id: 5, date: '2026年1月15日周四', title: '存储了 USDT', time: '19:47', fiat: '$4,842.31', crypto: '+4,815.00 USDT' },
  { id: 6, date: '2025年12月19日周五', title: '存储了 USDT', time: '02:39', fiat: '$4,802.33', crypto: '+4,815.00 USDT' },
  { id: 7, date: '2025年11月17日周一', title: '存储了 USDT', time: '17:55', fiat: '$4,824.14', crypto: '+4,815.00 USDT' },
  { id: 8, date: '2025年10月16日周四', title: '存储了 USDT', time: '15:18', fiat: '$4,811.97', crypto: '+4,815.00 USDT' },
  { id: 9, date: '2025年9月16日周二', title: '存储了 USDT', time: '17:08', fiat: '$4,813.94', crypto: '+4,815.00 USDT' },
  { id: 10, date: '2025年7月18日周五', title: '存储了 USDT', time: '18:38', fiat: '$4,816.11', crypto: '+4,815.00 USDT' },
  { id: 11, date: '2025年5月21日周三', title: '存储了 USDT', time: '22:12', fiat: '$4,815.48', crypto: '+4,815.00 USDT' },
  { id: 12, date: '2025年4月17日周四', title: '存储了 USDT', time: '19:22', fiat: '$4,812.99', crypto: '+4,815.00 USDT' },
  { id: 13, date: '2025年3月18日周二', title: '存储了 USDT', time: '16:16', fiat: '$4,814.71', crypto: '+4,815.00 USDT' },
  { id: 14, date: '2025年2月20日周四', title: '存储了 USDT', time: '19:39', fiat: '$4,814.81', crypto: '+4,815.00 USDT' },
  { id: 15, date: '2025年2月20日周四', title: '存储了 USDT', time: '18:41', fiat: '$20.00', crypto: '+10.00 USDT' },
];
