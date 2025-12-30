export const COINS = [
  {
    id: 'usdt',
    name: 'USDT',
    symbol: 'USDT',
    balance: 8050.00,
    price: 0.99,
    change: 0.2,
    icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a635305444745124199c0966f30cc3fdcc6516a/128/color/usdt.png',
  },
  {
    id: 'btc',
    name: 'BTC',
    symbol: 'BTC',
    balance: 0.046,
    price: 50002.04,
    change: -0.42,
    icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a635305444745124199c0966f30cc3fdcc6516a/128/color/btc.png',
  },
  {
    id: 'eth',
    name: 'ETH',
    symbol: 'ETH',
    balance: 0.87,
    price: 1850.22,
    change: 1.25,
    icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a635305444745124199c0966f30cc3fdcc6516a/128/color/eth.png',
  },
  {
    id: 'bnb',
    name: 'BNB',
    symbol: 'BNB',
    balance: 15.25,
    price: 350.45,
    change: -0.87,
    icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a635305444745124199c0966f30cc3fdcc6516a/128/color/bnb.png',
  },
  {
    id: 'sol',
    name: 'SOL',
    symbol: 'SOL',
    balance: 24.75,
    price: 85.67,
    change: 2.15,
    icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a635305444745124199c0966f30cc3fdcc6516a/128/color/sol.png',
  },
];

export const TRANSACTIONS = [
  {
    id: '1',
    type: 'send' as const,
    title: '发送',
    subtitle: '至 4GGhz...w4Cj',
    tokens: [{ symbol: 'USDT', amount: '100', isPositive: false }],
  },
  {
    id: '2',
    type: 'receive' as const,
    title: '收款',
    subtitle: '来自 4GGhz...w4Cj',
    tokens: [{ symbol: 'USDT', amount: '100', isPositive: true }],
  },
  {
      id: '3',
      type: 'contract' as const,
      title: '合约交互',
      subtitle: 'Byreal',
      tokens: [
          { symbol: 'USDT', amount: '100', isPositive: true },
          { symbol: 'WET', amount: '60.8', isPositive: true },
      ],
  },
];
