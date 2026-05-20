export interface ActivityItem {
  id: number;
  date: string;
  title: string;
  time: string;
  fiat: string;
  crypto: string;
}

export interface ActivityDetail {
  chainTransactionId: string;
  depositAddress: string;
  referenceId: string;
  transactionNo: string;
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

export const activityDetails: Record<number, ActivityDetail> = {
  1: {
    chainTransactionId: 'a03e33b736...60b6b0954',
    depositAddress: 'TQUvR8ZXNJ2Saj4tnpahnEsrimiTpkbGVo',
    referenceId: 'FTMf5Jm-VnoK...GZKAnHqlhQV',
    transactionNo: 'TXHK24E-QINSC-UIH3W5',
  },
  2: {
    chainTransactionId: 'c19a75f842...b4d12e307',
    depositAddress: 'TQtceVkuCo6XZR2RHqgxUMcRU3nik9SJq5',
    referenceId: 'NDPk8Qa-Lm42...RFYzT6WbE3',
    transactionNo: 'TXM72CA-VHJ9P-LQK5R4',
  },
  3: {
    chainTransactionId: '7f0bc2a419...9de583a21',
    depositAddress: 'TxbHEMLhcNjKfyTE4rWMELqRed5UgNqGCy',
    referenceId: 'QRT93Zn-Hs8C...MKD5JxPqT2',
    transactionNo: 'TXP58LN-ACD7M-ZR2VQ9',
  },
  4: {
    chainTransactionId: 'de44308f6a...2c7b9841f',
    depositAddress: 'TP3zAcLJeoec2FaP7EHsSSYoczzUkpq85v',
    referenceId: 'BHV62Lp-Ra4N...XCT9FhUeM8',
    transactionNo: 'TXC93HY-KSM2D-WA7NQ6',
  },
  5: {
    chainTransactionId: '91b6ee42d8...af35c0279',
    depositAddress: 'TiwfivRhRX8ebAYYk7z11Lem5aAt6KWp2e',
    referenceId: 'JWM84At-Kp3R...LQX6VcSnY5',
    transactionNo: 'TXR36FD-UNQ8L-CM5KV2',
  },
  6: {
    chainTransactionId: '62a5c7d109...804fe19bc',
    depositAddress: 'Tk5g6CHj27Yt9bhaDnqQ764ScPMAnGEPne',
    referenceId: 'YCA47Mu-Zd9E...PHR2TnVqL6',
    transactionNo: 'TXL85QP-FZG4A-RK9SC3',
  },
  7: {
    chainTransactionId: 'b8e14d9730...56c2a0f7e',
    depositAddress: 'TKjLh6CHScD2pa7cwTgzoQUWnt9cZmeeMy',
    referenceId: 'KPE59Ns-Wx6B...GTA8LmQcR4',
    transactionNo: 'TXA49GE-JQW3N-PV8LD5',
  },
  8: {
    chainTransactionId: '0d6f83b254...e12a74c9b',
    depositAddress: 'TEwinjY4wGbmcgqi5zxEf3o4RpZqPGM7Mg',
    referenceId: 'MZL72Vr-Qc5D...WNU9HpAkT3',
    transactionNo: 'TXV64KS-BHD9P-YT2QA7',
  },
  9: {
    chainTransactionId: '5ca29f60bd...3e8a9c714',
    depositAddress: 'T2pwb8spP2HjS2sagmahM6s8bgpSeagVgZ',
    referenceId: 'RND38Yk-Fm2P...VCE6TzLqH9',
    transactionNo: 'TXN27WU-MQA5C-XH8RS4',
  },
  10: {
    chainTransactionId: 'e730bc5d91...74f0d62aa',
    depositAddress: 'TM8UPqnanSHUvddB3oH23xNYNTn4ZK64KR',
    referenceId: 'SFP61Gb-Lt7K...DQM4YxRzC8',
    transactionNo: 'TXG71RC-YEK6T-UM3NP5',
  },
  11: {
    chainTransactionId: '3f21a9dc88...c0476e5b2',
    depositAddress: 'TsRpvWRfb5mopV7Fe94R1fMK1gf9pbhttc',
    referenceId: 'UXH52Pd-Nr8V...KLB7GcTaQ6',
    transactionNo: 'TXD82PL-RNV4H-CQ6JW9',
  },
  12: {
    chainTransactionId: '8ad5e012bf...2b96c8e43',
    depositAddress: 'Ttw7vDnNNAYhECfbys3npLaxuXkV7fkNnh',
    referenceId: 'CWK76Rs-Ye3M...NPA5VqLxD2',
    transactionNo: 'TXK46ZA-PHL8M-DS7QU2',
  },
  13: {
    chainTransactionId: 'f4c6b87109...6ad3e20b5',
    depositAddress: 'TNP8sdftSb5aKNwQEp2mVY5caMAU98Hj7q',
    referenceId: 'LNY29Qe-Bv6S...HFD8PmWrC7',
    transactionNo: 'TXT95MH-CBE2K-AW4NZ6',
  },
  14: {
    chainTransactionId: '2470feab63...9c18d55f0',
    depositAddress: 'TkTuycoCzKvUJg4JkWgRtRTfY8CV9noi5F',
    referenceId: 'PZD64Qh-Jw5T...RKE3VsNmF8',
    transactionNo: 'TXB53NR-QWP7C-HL8YD4',
  },
  15: {
    chainTransactionId: '9bc5d47821...d630eaa4f',
    depositAddress: 'TQXvei1MESrEeTgszwQeHZXSHXCjpGZyui',
    referenceId: 'VQM18Le-Sy9P...CBR4NwKxA3',
    transactionNo: 'TXE10US-JDL4N-QP2MC8',
  },
};
