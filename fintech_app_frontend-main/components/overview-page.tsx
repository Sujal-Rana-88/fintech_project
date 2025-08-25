"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { ResponsiveContainer, XAxis, YAxis, Tooltip, AreaChart, Area } from "recharts"
import { TrendingUp, DollarSign, Activity, RefreshCw, Eye, EyeOff } from "lucide-react"
import { fetchCryptoData, fetchFinancialNews, type CryptoData } from "@/lib/api"
import { getWishlist } from "@/lib/storage"
import portfolioData from "@/data/portfolio.json"

export function OverviewPage() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([])
  const [news, setNews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showBalance, setShowBalance] = useState(true)
  const [marketData, setMarketData] = useState<any[]>([])

  useEffect(() => {
    loadOverviewData()
  }, [])

  const loadOverviewData = async () => {
    setLoading(true)
    try {
      const [crypto, newsData] = await Promise.all([fetchCryptoData(), fetchFinancialNews()])

      setCryptoData(crypto.slice(0, 5)) // Top 5 cryptos
      setNews(newsData.slice(0, 3)) // Latest 3 news

      // Generate market trend data from crypto prices
      const trendData = crypto.slice(0, 5).map((coin, index) => ({
        name: coin.symbol.toUpperCase(),
        value: coin.current_price,
        change: coin.price_change_percentage_24h,
        volume: coin.total_volume,
      }))
      setMarketData(trendData)
    } catch (error) {
      console.error("Error loading overview data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Real-time portfolio data based on current crypto prices
  const calculateRealTimePortfolio = () => {
    const btcPrice = cryptoData.find((c) => c.id === "bitcoin")?.current_price || 42500
    const ethPrice = cryptoData.find((c) => c.id === "ethereum")?.current_price || 2350

    const realTimeValue = 2.5 * btcPrice + 15 * ethPrice + 8790 + 4885 // BTC + ETH + AAPL + TSLA
    const realTimePnL = realTimeValue - (2.5 * 35000 + 15 * 2200 + 50 * 150.25 + 25 * 220) // vs avg prices

    return {
      totalValue: realTimeValue,
      totalPnL: realTimePnL,
      totalPnLPercent: (realTimePnL / (realTimeValue - realTimePnL)) * 100,
    }
  }

  const realTimePortfolio = cryptoData.length > 0 ? calculateRealTimePortfolio() : portfolioData

  const pieData = cryptoData.slice(0, 4).map((crypto) => ({
    name: crypto.name,
    value: crypto.market_cap / 1e9, // Convert to billions
    color: `hsl(${Math.random() * 360}, 70%, 50%)`,
  }))

  const performanceData = marketData.map((item, index) => ({
    time: `${index + 1}h`,
    value: item.value,
    volume: item.volume / 1e9,
  }))

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Portfolio Overview</h1>
        <Button onClick={loadOverviewData} className="flex items-center space-x-2">
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-6" hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Portfolio</p>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {showBalance ? `$${realTimePortfolio.totalValue.toLocaleString()}` : "••••••"}
                </p>
                <Button variant="ghost" size="sm" onClick={() => setShowBalance(!showBalance)}>
                  {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-full">
              <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6" hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total P&L</p>
              <p
                className={`text-2xl font-bold ${realTimePortfolio.totalPnL >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
              >
                {showBalance
                  ? `${realTimePortfolio.totalPnL >= 0 ? "+" : ""}$${Math.abs(realTimePortfolio.totalPnL).toLocaleString()}`
                  : "••••••"}
              </p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6" hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">P&L Percentage</p>
              <p
                className={`text-2xl font-bold ${realTimePortfolio.totalPnLPercent >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
              >
                {showBalance
                  ? `${realTimePortfolio.totalPnLPercent >= 0 ? "+" : ""}${realTimePortfolio.totalPnLPercent.toFixed(2)}%`
                  : "••••"}
              </p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-full">
              <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6" hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Watchlist</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{getWishlist().length}</p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-full">
              <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Cryptocurrencies */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Top Cryptocurrencies</h3>
          <div className="space-y-4">
            {cryptoData.map((crypto) => (
              <div
                key={crypto.id}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 dark:bg-black/5"
              >
                <div className="flex items-center space-x-3">
                  <img src={crypto.image || "/placeholder.svg"} alt={crypto.name} className="w-8 h-8 rounded-full" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{crypto.symbol.toUpperCase()}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{crypto.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900 dark:text-white">${crypto.current_price.toLocaleString()}</p>
                  <p
                    className={`text-sm ${crypto.price_change_percentage_24h >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                  >
                    {crypto.price_change_percentage_24h >= 0 ? "+" : ""}
                    {crypto.price_change_percentage_24h.toFixed(2)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Market Trend Chart */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Market Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, "Price"]} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Recent News */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Latest Market News</h3>
        <div className="space-y-4">
          {news.map((article) => (
            <div key={article.id} className="border-b border-white/10 dark:border-black/10 pb-4 last:border-b-0">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">{article.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{article.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                <span>{article.source}</span>
                <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
