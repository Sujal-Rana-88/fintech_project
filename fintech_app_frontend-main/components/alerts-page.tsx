"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Bell, BellOff, Trash2, TrendingUp, TrendingDown } from "lucide-react"
import { getAlerts, removeAlert, toggleAlert, type Alert } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"

export function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const { toast } = useToast()

  useEffect(() => {
    loadAlerts()
  }, [])

  const loadAlerts = () => {
    const alertsList = getAlerts()
    setAlerts(alertsList)
  }

  const handleToggleAlert = (id: string) => {
    toggleAlert(id)
    setAlerts((prev) => prev.map((alert) => (alert.id === id ? { ...alert, isActive: !alert.isActive } : alert)))
  }

  const handleRemoveAlert = (id: string, name: string) => {
    removeAlert(id)
    setAlerts((prev) => prev.filter((alert) => alert.id !== id))
    toast({
      title: "Alert Removed",
      description: `Alert for ${name} has been removed.`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Price Alerts</h1>
        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
          <Bell className="w-5 h-5 text-blue-500" />
          <span>{alerts.filter((a) => a.isActive).length} active</span>
        </div>
      </div>

      {alerts.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No alerts set</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Create price alerts from the Market page to get notified when assets reach your target prices
          </p>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <GlassCard key={alert.id} className="p-6" hover>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{alert.symbol.charAt(0)}</span>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{alert.symbol}</h3>
                      <Badge variant={alert.type === "crypto" ? "default" : "secondary"}>{alert.type}</Badge>
                      <Badge variant={alert.isActive ? "default" : "secondary"}>
                        {alert.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{alert.name}</p>

                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        {alert.condition === "above" ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                        <span className="text-gray-700 dark:text-gray-300">
                          Alert when {alert.condition} ${alert.targetPrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-gray-500 dark:text-gray-500">
                        Current: ${alert.currentPrice.toLocaleString()}
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                      Created {new Date(alert.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch checked={alert.isActive} onCheckedChange={() => handleToggleAlert(alert.id)} />
                    {alert.isActive ? (
                      <Bell className="w-4 h-4 text-blue-500" />
                    ) : (
                      <BellOff className="w-4 h-4 text-gray-400" />
                    )}
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveAlert(alert.id, alert.name)}
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
