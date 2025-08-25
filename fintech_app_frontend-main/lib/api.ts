

export interface StockData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: string
}
export interface CryptoData {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_24h: number
  price_change_percentage_24h: number
  market_cap: number
  total_volume: number
  image: string
  sparkline_in_7d?: {
    price: number[]
  }
}

// Fetch trending cryptocurrencies (top 10)
export async function fetchCryptoData(): Promise<CryptoData[]> {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets" +
        "?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=true",
      {
        headers: {
          "Content-Type": "application/json",
          "x-cg-demo-api-key": "CG-CvvHRskmDJy9zaRchMf37fL8",
        },
      }
    )

    if (!res.ok) {
      throw new Error(`Failed to fetch crypto data: ${res.status}`)
    }

    const data = await res.json()
    return data
  } catch (error) {
    console.error("Error fetching crypto data:", error)
    return [] // return empty array if error
  }
}
// Fetch individual crypto chart data using proxy route
export async function fetchCryptoChart(coinId: string, days = 7): Promise<number[][]> {
  try {
    const response = await fetch(`/api/crypto?endpoint=chart&coinId=${coinId}&days=${days}`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.prices || []
  } catch (error) {
    console.error("Error fetching crypto chart:", error)
    return generateMockChartData(coinId)
  }
}

// Fetch detailed crypto data
export async function fetchCryptoDetails(coinId: string): Promise<any> {
  try {
    const response = await fetch(`/api/crypto?endpoint=details&coinId=${coinId}`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching crypto details:", error)
    return null
  }
}

// Fallback crypto data
function getFallbackCryptoData(): CryptoData[] {
  return [
    {
      id: "bitcoin",
      symbol: "btc",
      name: "Bitcoin",
      image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
      current_price: 43250,
      market_cap: 847000000000,
      total_volume: 28500000000,
      price_change_24h: -520,
      price_change_percentage_24h: -1.19,
      sparkline_in_7d: {
        price: [42800, 43100, 42900, 43200, 42700, 43000, 43250],
      },
    },
    {
      id: "ethereum",
      symbol: "eth",
      name: "Ethereum",
      image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
      current_price: 2580,
      market_cap: 310000000000,
      total_volume: 15800000000,
      price_change_24h: 95,
      price_change_percentage_24h: 3.82,
      sparkline_in_7d: {
        price: [2450, 2520, 2480, 2550, 2490, 2530, 2580],
      },
    },
    {
      id: "binancecoin",
      symbol: "bnb",
      name: "BNB",
      image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
      current_price: 315,
      market_cap: 47000000000,
      total_volume: 1200000000,
      price_change_24h: 8.5,
      price_change_percentage_24h: 2.77,
      sparkline_in_7d: {
        price: [305, 310, 308, 312, 307, 313, 315],
      },
    },
    {
      id: "solana",
      symbol: "sol",
      name: "Solana",
      image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
      current_price: 98.5,
      market_cap: 43000000000,
      total_volume: 2100000000,
      price_change_24h: -2.1,
      price_change_percentage_24h: -2.09,
      sparkline_in_7d: {
        price: [95, 97, 96, 99, 94, 97, 98.5],
      },
    },
    {
      id: "cardano",
      symbol: "ada",
      name: "Cardano",
      image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
      current_price: 0.52,
      market_cap: 18000000000,
      total_volume: 890000000,
      price_change_24h: 0.015,
      price_change_percentage_24h: 2.97,
      sparkline_in_7d: {
        price: [0.48, 0.5, 0.49, 0.51, 0.48, 0.5, 0.52],
      },
    },
    {
      id: "polkadot",
      symbol: "dot",
      name: "Polkadot",
      image: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png",
      current_price: 7.2,
      market_cap: 9000000000,
      total_volume: 180000000,
      price_change_24h: 0.15,
      price_change_percentage_24h: 2.13,
      sparkline_in_7d: {
        price: [6.8, 7.0, 6.9, 7.1, 6.95, 7.05, 7.2],
      },
    },
    {
      id: "dogecoin",
      symbol: "doge",
      name: "Dogecoin",
      image: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
      current_price: 0.082,
      market_cap: 11700000000,
      total_volume: 890000000,
      price_change_24h: -0.003,
      price_change_percentage_24h: -3.54,
      sparkline_in_7d: {
        price: [0.078, 0.081, 0.079, 0.083, 0.08, 0.081, 0.082],
      },
    },
    {
      id: "avalanche-2",
      symbol: "avax",
      name: "Avalanche",
      image: "https://assets.coingecko.com/coins/images/12559/large/avalanche.png",
      current_price: 35.8,
      market_cap: 13500000000,
      total_volume: 420000000,
      price_change_24h: 1.2,
      price_change_percentage_24h: 3.47,
      sparkline_in_7d: {
        price: [34.2, 35.1, 34.8, 35.5, 34.9, 35.3, 35.8],
      },
    },
  ]
}

// Generate mock chart data as fallback
function generateMockChartData(coinId: string): number[][] {
  const now = Date.now()
  const basePrice = getBasePriceForCoin(coinId)
  const data: number[][] = []

  for (let i = 6; i >= 0; i--) {
    const timestamp = now - i * 24 * 60 * 60 * 1000 // Daily intervals
    const variation = (Math.random() - 0.5) * 0.1 // ±5% variation
    const price = basePrice * (1 + variation)
    data.push([timestamp, price])
  }

  return data
}

function getBasePriceForCoin(coinId: string): number {
  const basePrices: Record<string, number> = {
    bitcoin: 43250,
    ethereum: 2580,
    binancecoin: 315,
    solana: 98.5,
    cardano: 0.52,
    polkadot: 7.2,
    dogecoin: 0.082,
    "avalanche-2": 35.8,
    chainlink: 15,
    polygon: 0.8,
  }
  return basePrices[coinId] || 1
}

// Fetch stock data (demo implementation)
export async function fetchStockData(): Promise<StockData[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const demoStocks: StockData[] = [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      price: 175.84 + (Math.random() - 0.5) * 10,
      change: (Math.random() - 0.5) * 5,
      changePercent: (Math.random() - 0.5) * 3,
      volume: "52.3M",
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corporation",
      price: 420.15 + (Math.random() - 0.5) * 20,
      change: (Math.random() - 0.5) * 8,
      changePercent: (Math.random() - 0.5) * 2,
      volume: "31.2M",
    },
    {
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      price: 142.8 + (Math.random() - 0.5) * 8,
      change: (Math.random() - 0.5) * 4,
      changePercent: (Math.random() - 0.5) * 2.5,
      volume: "25.7M",
    },
    {
      symbol: "TSLA",
      name: "Tesla Inc.",
      price: 195.4 + (Math.random() - 0.5) * 15,
      change: (Math.random() - 0.5) * 10,
      changePercent: (Math.random() - 0.5) * 4,
      volume: "45.8M",
    },
    {
      symbol: "NVDA",
      name: "NVIDIA Corporation",
      price: 875.3 + (Math.random() - 0.5) * 40,
      change: (Math.random() - 0.5) * 20,
      changePercent: (Math.random() - 0.5) * 3,
      volume: "38.9M",
    },
  ]

  return demoStocks
}

// Fetch financial news (demo implementation)
export async function fetchFinancialNews() {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    const demoNews = [
      {
        id: "1",
        title: "Bitcoin Maintains Strong Position Above $43,000",
        description:
          "Cryptocurrency markets show resilience as institutional adoption continues to grow across major financial sectors.",
        url: "#",
        source: "CryptoDaily",
        publishedAt: new Date().toISOString(),
        category: "crypto",
      },
      {
        id: "2",
        title: "Tech Giants Report Strong Q4 Earnings",
        description:
          "Major technology companies including Apple, Microsoft, and Google exceed analyst expectations with robust quarterly results.",
        url: "#",
        source: "TechNews",
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        category: "stocks",
      },
      {
        id: "3",
        title: "Federal Reserve Signals Cautious Approach to Rate Changes",
        description:
          "Central bank officials indicate measured approach to monetary policy amid ongoing economic uncertainty and inflation concerns.",
        url: "#",
        source: "Financial Times",
        publishedAt: new Date(Date.now() - 7200000).toISOString(),
        category: "economy",
      },
      {
        id: "4",
        title: "Ethereum Network Upgrades Show Promising Results",
        description:
          "Latest network improvements demonstrate increased efficiency and reduced transaction costs for users.",
        url: "#",
        source: "BlockchainNews",
        publishedAt: new Date(Date.now() - 10800000).toISOString(),
        category: "crypto",
      },
    ]

    return demoNews
  } catch (error) {
    console.error("Error fetching news:", error)
    return []
  }
}

export async function fetchWishlist() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const res = await fetch("https://fintech-app-backend.onrender.com/api/wishlist", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch wishlist");
  const data = await res.json();
  return data.items; // already converted to array in backend
}


export async function fetchSaved() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const res = await fetch("https://fintech-app-backend.onrender.com/api/saved", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch saved items");
  const data = await res.json();
  return data.items;
}

export async function addToWishlist(item: any) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const res = await fetch("https://fintech-app-backend.onrender.com/api/wishlist", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ item }),
  });
  if (!res.ok) throw new Error("Failed to add to wishlist");
  const data = await res.json();
  return data; // usually returns updated items array
}

export async function deleteFromWishlist(id: string) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const res = await fetch("https://fintech-app-backend.onrender.com/api/wishlist", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ item: { id } }),
  });
  if (!res.ok) throw new Error("Failed to remove from wishlist");
  const data = await res.json();
  return data.items; // return updated list if you need
}

export async function addToSaved(item: { id: string; symbol: string; name: string; type: string; notes?: string; targetPrice?: number }) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const res = await fetch("https://fintech-app-backend.onrender.com/api/saved", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ item }),
  });
  if (!res.ok) throw new Error("Failed to add to saved");
  const data = await res.json();
  return data; // returns updated items
}

