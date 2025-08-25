// Local storage utilities for wishlist and saved items
export interface WishlistItem {
  id: string
  symbol: string
  name: string
  type: "crypto" | "stock"
  addedAt: string
}

export interface SavedItem extends WishlistItem {
  notes?: string
  targetPrice?: number
}

export interface Alert {
  id: string
  symbol: string
  name: string
  type: "crypto" | "stock"
  condition: "above" | "below"
  targetPrice: number
  currentPrice: number
  isActive: boolean
  createdAt: string
}

// Wishlist functions
export function getWishlist(): WishlistItem[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem("fintech-wishlist")
  return stored ? JSON.parse(stored) : []
}



export function removeFromWishlist(id: string): void {
  if (typeof window === "undefined") return
  const wishlist = getWishlist()
  const updated = wishlist.filter((item) => item.id !== id)
  localStorage.setItem("fintech-wishlist", JSON.stringify(updated))
}

export function isInWishlist(id: string): boolean {
  return getWishlist().some((item) => item.id === id)
}

// Saved items functions
export function getSavedItems(): SavedItem[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem("fintech-saved")
  return stored ? JSON.parse(stored) : []
}

export function addToSaved(item: Omit<SavedItem, "addedAt">): void {
  if (typeof window === "undefined") return
  const saved = getSavedItems()
  const newItem: SavedItem = {
    ...item,
    addedAt: new Date().toISOString(),
  }
  const updated = [...saved.filter((s) => s.id !== item.id), newItem]
  localStorage.setItem("fintech-saved", JSON.stringify(updated))
}

export function removeFromSaved(id: string): void {
  if (typeof window === "undefined") return
  const saved = getSavedItems()
  const updated = saved.filter((item) => item.id !== id)
  localStorage.setItem("fintech-saved", JSON.stringify(updated))
}

// Alerts functions
export function getAlerts(): Alert[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem("fintech-alerts")
  return stored ? JSON.parse(stored) : []
}

export function addAlert(alert: Omit<Alert, "id" | "createdAt">): void {
  if (typeof window === "undefined") return
  const alerts = getAlerts()
  const newAlert: Alert = {
    ...alert,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }
  const updated = [...alerts, newAlert]
  localStorage.setItem("fintech-alerts", JSON.stringify(updated))
}

export function removeAlert(id: string): void {
  if (typeof window === "undefined") return
  const alerts = getAlerts()
  const updated = alerts.filter((alert) => alert.id !== id)
  localStorage.setItem("fintech-alerts", JSON.stringify(updated))
}

export function toggleAlert(id: string): void {
  if (typeof window === "undefined") return
  const alerts = getAlerts()
  const updated = alerts.map((alert) => (alert.id === id ? { ...alert, isActive: !alert.isActive } : alert))
  localStorage.setItem("fintech-alerts", JSON.stringify(updated))
}
