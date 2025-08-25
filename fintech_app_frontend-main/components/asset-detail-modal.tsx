"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { X, Heart, Bookmark, Bell, TrendingUp, TrendingDown } from "lucide-react"
import { addToSaved, addToWishlist, fetchCryptoChart, type CryptoData } from "@/lib/api"
import {   addAlert, isInWishlist } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"
import type { SavedItem } from "@/lib/storage"

interface AssetDetailModalProps {
  asset: CryptoData | null
  isOpen: boolean
  onClose: () => void
}

export function AssetDetailModal({ asset, isOpen, onClose }: AssetDetailModalProps) {
  const [chartData, setChartData] = useState<Array<{ time: string; price: number; timestamp: number }>>([])
  const [loading, setLoading] = useState(false)
  const [alertPrice, setAlertPrice] = useState("")
  const [alertCondition, setAlertCondition] = useState<"above" | "below">("above")
  const [notes, setNotes] = useState("")
  const { toast } = useToast()
  const [savedItems, setSavedItems] = useState<SavedItem[]>([])

  useEffect(() => {
    if (asset && isOpen) {
      loadChartData()
    }
  }, [asset, isOpen])

  const loadChartData = async () => {
    if (!asset) return
    setLoading(true)
    try {
      // Try to fetch chart data
      const prices = await fetchCryptoChart(asset.id, 7)

      if (prices && prices.length > 0) {
        const formattedData = prices.map(([timestamp, price]) => ({
          time: new Date(timestamp).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          price: Number(price.toFixed(2)),
          timestamp: timestamp,
        }))
        setChartData(formattedData)
      } else {
        // Use sparkline data from the asset if available
        if (asset.sparkline_in_7d?.price) {
          const sparklineData = asset.sparkline_in_7d.price
          const now = Date.now()
          const formattedData = sparklineData.map((price: number, index: number) => ({
            time: new Date(now - (sparklineData.length - index) * 3600000).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
            price: Number(price.toFixed(2)),
            timestamp: now - (sparklineData.length - index) * 3600000,
          }))
          setChartData(formattedData)
        } else {
          // Generate sample data based on current price
          const sampleData = generateSampleChartData(asset.current_price)
          setChartData(sampleData)
        }
      }
    } catch (error) {
      console.error("Error loading chart data:", error)
      // Generate sample data as fallback
      const sampleData = generateSampleChartData(asset.current_price)
      setChartData(sampleData)

      toast({
        title: "Chart Data Unavailable",
        description: "Showing sample data. Real-time chart data temporarily unavailable.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Add this helper function inside the component
  const generateSampleChartData = (currentPrice: number) => {
    const data = []
    const now = Date.now()

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now - i * 24 * 60 * 60 * 1000)
      const variation = (Math.random() - 0.5) * 0.1 // ±5% variation
      const price = currentPrice * (1 + variation)

      data.push({
        time: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        price: Number(price.toFixed(2)),
        timestamp: date.getTime(),
      })
    }

    return data
  }

  const handleAddToWishlist = async () => {
    if (!asset) return;
    try {
      await addToWishlist({
        id: asset.id,
        symbol: asset.symbol.toUpperCase(),
        name: asset.name,
        type: "crypto",
      });
      toast({
        title: "Added to Wishlist",
        description: `${asset.name} has been added to your wishlist.`,
      });
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
      toast({
        title: "Error",
        description: "Could not add to wishlist. Please try again.",
      });
    }
  };
  const handleAddToSaved = async () => {
    if (!asset) return
    try {
      const updatedItems = await addToSaved({
        id: asset.id,
        symbol: asset.symbol.toUpperCase(),
        name: asset.name,
        type: "crypto",
        notes: notes || undefined,
        targetPrice: alertPrice ? Number.parseFloat(alertPrice) : undefined,
      })
      setSavedItems(updatedItems) // update saved items in state
      toast({
        title: "Saved Successfully",
        description: `${asset.name} has been saved with your notes or target price.`,
      })
      setNotes("")
      setAlertPrice("")
    } catch (error) {
      console.error("Error saving item:", error)
      toast({
        title: "Error",
        description: "Could not save the item. Please try again.",
      })
    }
  }
  

  const handleCreateAlert = () => {
    if (!asset || !alertPrice) return
    addAlert({
      symbol: asset.symbol.toUpperCase(),
      name: asset.name,
      type: "crypto",
      condition: alertCondition,
      targetPrice: Number.parseFloat(alertPrice),
      currentPrice: asset.current_price,
      isActive: true,
    })
    toast({
      title: "Alert Created",
      description: `You'll be notified when ${asset.name} goes ${alertCondition} $${alertPrice}.`,
    })
    setAlertPrice("")
  }

  if (!isOpen || !asset) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <GlassCard className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <img src={asset.image || "/placeholder.svg"} alt={asset.name} className="w-12 h-12 rounded-full" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{asset.name}</h2>
                <p className="text-gray-600 dark:text-gray-400">{asset.symbol.toUpperCase()}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Price Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <GlassCard className="p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Price</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${asset.current_price.toLocaleString()}
              </p>
            </GlassCard>
            <GlassCard className="p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">24h Change</p>
              <div
                className={`flex items-center space-x-1 ${
                  asset.price_change_24h >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                }`}
              >
                {asset.price_change_24h >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="text-xl font-bold">{asset.price_change_percentage_24h.toFixed(2)}%</span>
              </div>
            </GlassCard>
            <GlassCard className="p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Market Cap</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">${(asset.market_cap / 1e9).toFixed(2)}B</p>
            </GlassCard>
          </div>

          {/* Chart */}
          <GlassCard className="p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">7-Day Price Chart</h3>
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis dataKey="time" axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, "Price"]} />
                    <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </GlassCard>

          {/* Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <GlassCard className="p-4">
              <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">Quick Actions</h4>
              <div className="space-y-3">
                <Button
                  onClick={handleAddToWishlist}
                  className="w-full flex items-center space-x-2"
                  variant={isInWishlist(asset.id) ? "secondary" : "default"}
                >
                  <Heart className="w-4 h-4" />
                  <span>{isInWishlist(asset.id) ? "In Wishlist" : "Add to Wishlist"}</span>
                </Button>
                <Button
                  onClick={handleAddToSaved}
                  className="w-full flex items-center space-x-2 bg-transparent"
                  variant="outline"
                >
                  <Bookmark className="w-4 h-4" />
                  <span>Save with Notes</span>
                </Button>
              </div>
            </GlassCard>

            {/* Create Alert */}
            <GlassCard className="p-4">
              <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">Price Alert</h4>
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <select
                    value={alertCondition}
                    onChange={(e) => setAlertCondition(e.target.value as "above" | "below")}
                    className="px-3 py-2 bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-lg"
                  >
                    <option value="above">Above</option>
                    <option value="below">Below</option>
                  </select>
                  <Input
                    type="number"
                    placeholder="Price"
                    value={alertPrice}
                    onChange={(e) => setAlertPrice(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <Button onClick={handleCreateAlert} className="w-full flex items-center space-x-2">
                  <Bell className="w-4 h-4" />
                  <span>Create Alert</span>
                </Button>
              </div>
            </GlassCard>
          </div>

          {/* Notes */}
          <GlassCard className="p-4 mt-6">
            <Label htmlFor="notes" className="text-gray-900 dark:text-white">
              Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Add your notes about this asset..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-2 bg-white/10 dark:bg-black/10 border-white/20 dark:border-white/10"
            />
          </GlassCard>
        </div>
      </GlassCard>
    </div>
  )
}
