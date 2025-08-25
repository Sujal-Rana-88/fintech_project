"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AssetDetailModal } from "@/components/asset-detail-modal"
import { LineChart, Line, ResponsiveContainer } from "recharts"
import { Search, TrendingUp, TrendingDown, Heart, RefreshCw, Wifi, WifiOff } from "lucide-react"
import { fetchCryptoData, fetchStockData, type CryptoData, type StockData } from "@/lib/api"
import { addToWishlist, isInWishlist } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"

export function MarketPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([])
  const [stockData, setStockData] = useState<StockData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAsset, setSelectedAsset] = useState<CryptoData | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [activeTab, setActiveTab] = useState<"crypto" | "stocks">("crypto")
  const [isOnline, setIsOnline] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadMarketData()

    // Check online status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const loadMarketData = async () => {
    setLoading(true)
    try {
      const [crypto, stocks] = await Promise.all([fetchCryptoData(), fetchStockData()])
      setCryptoData(crypto)
      setStockData(stocks)

      if (crypto.length > 0) {
        toast({
          title: "Market Data Loaded",
          description: `Loaded ${crypto.length} cryptocurrencies and ${stocks.length} stocks`,
        })
      }
    } catch (error) {
      console.error("Error loading market data:", error)
      toast({
        title: "Connection Issue",
        description: "Using cached data. Some information may not be current.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAssetClick = (asset: CryptoData) => {
    setSelectedAsset(asset)
    setShowModal(true)
  }

  const handleAddToWishlist = (asset: CryptoData | StockData, type: "crypto" | "stock") => {
    const item = {
      id: "symbol" in asset ? asset.symbol : asset.id,
      symbol: asset.symbol.toUpperCase(),
      name: asset.name,
      type,
    }
    addToWishlist(item)
    toast({
      title: "Added to Wishlist",
      description: `${asset.name} has been added to your wishlist.`,
    })
  }

  const filteredCrypto = cryptoData.filter(
    (asset) =>
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredStocks = stockData.filter(
    (asset) =>
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading market data...</p>
      </div>
    )
  }

  // Mini Chart Component
  const MiniChart = ({ sparklineData, changePercent }: { sparklineData?: number[]; changePercent: number }) => {
    if (!sparklineData || sparklineData.length === 0) {
      return (
        <div className="h-16 flex items-center justify-center text-gray-400">
          <span className="text-xs">Chart unavailable</span>
        </div>
      )
    }

    const chartData = sparklineData.map((price, index) => ({ price, index }))
    const color = changePercent >= 0 ? "#10b981" : "#ef4444"

    return (
      <div className="h-16">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <Line type="monotone" dataKey="price" stroke={color} strokeWidth={1.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Live Market Data</h1>
          <div className="flex items-center space-x-1">
            {isOnline ? <Wifi className="w-5 h-5 text-green-500" /> : <WifiOff className="w-5 h-5 text-red-500" />}
            <span
              className={`text-sm ${isOnline ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
            >
              {isOnline ? "Live" : "Offline"}
            </span>
          </div>
        </div>
        <Button onClick={loadMarketData} className="flex items-center space-x-2" disabled={loading}>
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Data</span>
        </Button>
      </div>

      {/* Search and Tabs */}
      <GlassCard className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-transparent border-white/20 dark:border-white/10 focus:border-blue-500"
            />
          </div>
          <div className="flex space-x-2">
            <Button variant={activeTab === "crypto" ? "default" : "outline"} onClick={() => setActiveTab("crypto")}>
              Cryptocurrency ({filteredCrypto.length})
            </Button>
            <Button variant={activeTab === "stocks" ? "default" : "outline"} onClick={() => setActiveTab("stocks")}>
              Stocks ({filteredStocks.length})
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Market Data */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          {activeTab === "crypto" ? "Cryptocurrency Market" : "Stock Market"}
        </h3>

        {activeTab === "crypto" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCrypto.length > 0 ? (
              filteredCrypto.map((crypto) => (
                <GlassCard key={crypto.id} className="p-4 cursor-pointer" hover>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={crypto.image || "/placeholder.svg?height=32&width=32"}
                        alt={crypto.name}
                        className="w-8 h-8 rounded-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg?height=32&width=32"
                        }}
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{crypto.symbol.toUpperCase()}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{crypto.name}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAddToWishlist(crypto, "crypto")
                      }}
                    >
                      <Heart className={`w-4 h-4 ${isInWishlist(crypto.id) ? "fill-red-500 text-red-500" : ""}`} />
                    </Button>
                  </div>

                  <div className="space-y-2" onClick={() => handleAssetClick(crypto)}>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        ${crypto.current_price.toLocaleString()}
                      </span>
                      <div
                        className={`flex items-center space-x-1 ${
                          crypto.price_change_percentage_24h >= 0
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {crypto.price_change_percentage_24h >= 0 ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        <span className="font-medium">{crypto.price_change_percentage_24h.toFixed(2)}%</span>
                      </div>
                    </div>

                    <MiniChart
                      sparklineData={crypto.sparkline_in_7d?.price}
                      changePercent={crypto.price_change_percentage_24h}
                    />

                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Vol: ${(crypto.total_volume / 1e9).toFixed(2)}B • MCap: ${(crypto.market_cap / 1e9).toFixed(2)}B
                    </div>
                  </div>
                </GlassCard>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">No cryptocurrencies found matching your search.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStocks.length > 0 ? (
              filteredStocks.map((stock) => (
                <GlassCard key={stock.symbol} className="p-4" hover>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xs">{stock.symbol.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{stock.symbol}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{stock.name}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => handleAddToWishlist(stock, "stock")}>
                      <Heart className={`w-4 h-4 ${isInWishlist(stock.symbol) ? "fill-red-500 text-red-500" : ""}`} />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">${stock.price.toFixed(2)}</span>
                      <div
                        className={`flex items-center space-x-1 ${
                          stock.changePercent >= 0
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {stock.changePercent >= 0 ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        <span className="font-medium">{stock.changePercent.toFixed(2)}%</span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-600 dark:text-gray-400">Volume: {stock.volume}</div>
                  </div>
                </GlassCard>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">No stocks found matching your search.</p>
              </div>
            )}
          </div>
        )}
      </GlassCard>

      <AssetDetailModal asset={selectedAsset} isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  )
}
