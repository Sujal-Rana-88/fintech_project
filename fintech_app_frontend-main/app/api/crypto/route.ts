import { NextResponse } from "next/server"

const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const endpoint = searchParams.get("endpoint") || "markets"
  const coinId = searchParams.get("coinId")
  const days = searchParams.get("days") || "7"

  try {
    let url = ""

    if (endpoint === "markets") {
      url = `${COINGECKO_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=24h`
    } else if (endpoint === "chart" && coinId) {
      url = `${COINGECKO_BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=daily`
    } else if (endpoint === "details" && coinId) {
      url = `${COINGECKO_BASE_URL}/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true`
    }

    if (!url) {
      return NextResponse.json({ error: "Invalid endpoint" }, { status: 400 })
    }

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "FinDash/1.0",
      },
      next: { revalidate: 60 }, // Cache for 1 minute
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("API Error:", error)

    // Return fallback data based on endpoint
    if (endpoint === "markets") {
      return NextResponse.json(getFallbackMarketData())
    } else if (endpoint === "chart") {
      return NextResponse.json(getFallbackChartData(coinId))
    }

    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}

function getFallbackMarketData() {
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
  ]
}

function getFallbackChartData(coinId: string | null) {
  const basePrice = getBasePriceForCoin(coinId || "bitcoin")
  const now = Date.now()
  const prices = []

  for (let i = 6; i >= 0; i--) {
    const timestamp = now - i * 24 * 60 * 60 * 1000
    const variation = (Math.random() - 0.5) * 0.1
    const price = basePrice * (1 + variation)
    prices.push([timestamp, price])
  }

  return { prices }
}

function getBasePriceForCoin(coinId: string): number {
  const basePrices: Record<string, number> = {
    bitcoin: 43250,
    ethereum: 2580,
    binancecoin: 315,
    solana: 98.5,
    cardano: 0.52,
    polkadot: 7.2,
    dogecoin: 0.08,
    "avalanche-2": 35,
    chainlink: 15,
    polygon: 0.8,
  }
  return basePrices[coinId] || 1
}
