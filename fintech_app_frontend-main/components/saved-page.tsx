"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bookmark, Trash2, Edit, Target } from "lucide-react"
import { getSavedItems, removeFromSaved, type SavedItem } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"
import { fetchSaved } from "@/lib/api";

export function SavedPage() {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([])
  const { toast } = useToast()
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedData()
  }, [])

  const loadSavedData = async () => {
    setLoading(true)
    try {
      const saved = await fetchSaved()
      setSavedItems(saved)
    } catch (error) {
      console.error("Error loading saved items:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFromSaved = async (id: string, name: string) => {
    // Call backend to remove item (implement if needed), then reload
    await loadSavedData()
    toast({
      title: "Removed from Saved",
      description: `${name} has been removed from your saved items.`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Saved Items</h1>
        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
          <Bookmark className="w-5 h-5 text-blue-500" />
          <span>{savedItems.length} items</span>
        </div>
      </div>

      {loading ? (
        <GlassCard className="p-12 text-center">
          <p>Loading saved items...</p>
        </GlassCard>
      ) : savedItems.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No saved items</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Save assets with notes and target prices from the Market page
          </p>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {savedItems.map((item) => (
            <GlassCard key={item.id} className="p-6" hover>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{item.symbol.charAt(0)}</span>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{item.symbol}</h3>
                      <Badge variant={item.type === "crypto" ? "default" : "secondary"}>{item.type}</Badge>
                      {item.targetPrice && (
                        <Badge variant="outline" className="flex items-center space-x-1">
                          <Target className="w-3 h-3" />
                          <span>${item.targetPrice}</span>
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{item.name}</p>

                    {item.notes && (
                      <div className="bg-white/5 dark:bg-black/5 rounded-lg p-3 mb-3">
                        <p className="text-sm text-gray-700 dark:text-gray-300">{item.notes}</p>
                      </div>
                    )}

                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Saved {new Date(item.addedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="ghost">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveFromSaved(item.id, item.name)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  )
}
