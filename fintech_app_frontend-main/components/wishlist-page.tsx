"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Heart, Trash2, TrendingUp, TrendingDown } from "lucide-react"
import { getWishlist, removeFromWishlist, type WishlistItem } from "@/lib/storage"
import { fetchCryptoData, type CryptoData, fetchWishlist, deleteFromWishlist } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadWishlistData()
  }, [])

  const loadWishlistData = async () => {
    setLoading(true)
    try {
      const wishlist = await fetchWishlist()
      setWishlistItems(wishlist)

      // Fetch current prices for crypto items
      const crypto = await fetchCryptoData()
      setCryptoData(crypto)
    } catch (error) {
      console.error("Error loading wishlist:", error)
    } finally {
      setLoading(false)
    }
  }


  const handleRemoveFromWishlist = async (id: string, name: string) => {
    try {
      await deleteFromWishlist(id)          // call your backend remove API
      setWishlistItems((prev) => prev.filter((item) => item.id !== id)) // remove locally
      toast({
        title: "Removed from Wishlist",
        description: `${name} has been removed from your wishlist.`,
      })
    } catch (error) {
      console.error("Failed to remove from wishlist:", error)
      toast({
        title: "Error",
        description: "Could not remove from wishlist. Please try again.",
      })
    }
  }

  const getAssetPrice = (item: WishlistItem) => {
    if (item.type === "crypto") {
      const crypto = cryptoData.find((c) => c.id === item.id)
      return crypto
        ? {
            price: crypto.current_price,
            change: crypto.price_change_percentage_24h,
            image: crypto.image,
          }
        : null
    }
    return null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Wishlist</h1>
        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
          <Heart className="w-5 h-5 text-red-500" />
          <span>{wishlistItems.length} items</span>
        </div>
      </div>

      {wishlistItems.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Your wishlist is empty</h3>
          <p className="text-gray-600 dark:text-gray-400">Start adding assets to your wishlist from the Market page</p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => {
            const priceData = getAssetPrice(item)
            return (
              <GlassCard key={item.id} className="p-6" hover>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {priceData?.image ? (
                      <img
                        src={priceData.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{item.symbol.charAt(0)}</span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{item.symbol}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.name}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveFromWishlist(item.id, item.name)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {priceData && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        ${priceData.price.toLocaleString()}
                      </span>
                      <div
                        className={`flex items-center space-x-1 ${
                          priceData.change >= 0
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {priceData.change >= 0 ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        <span className="font-medium">{priceData.change.toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-white/10 dark:border-black/10">
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Added {new Date(item.addedAt).toLocaleDateString()}
                  </p>
                </div>
              </GlassCard>
            )
          })}
        </div>
      )}
    </div>
  )
}
