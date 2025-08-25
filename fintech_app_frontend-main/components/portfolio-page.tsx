"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { TrendingUp, TrendingDown } from "lucide-react"
import portfolioData from "@/data/portfolio.json"

export function PortfolioPage() {
  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Value</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              ${portfolioData.totalValue.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total P&L</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              +${portfolioData.totalPnL.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">P&L %</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">+{portfolioData.totalPnLPercent}%</p>
          </div>
        </div>
      </GlassCard>

      {/* Assets Table */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Your Assets</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 dark:border-black/10">
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Asset</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Quantity</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Avg Price</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Current Price</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Value</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">P&L</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">24h Change</th>
              </tr>
            </thead>
            <tbody>
              {portfolioData.assets.map((asset) => (
                <tr
                  key={asset.id}
                  className="border-b border-white/5 dark:border-black/5 hover:bg-white/5 dark:hover:bg-black/5"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{asset.symbol.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{asset.symbol}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{asset.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right text-gray-900 dark:text-white">{asset.quantity}</td>
                  <td className="py-4 px-4 text-right text-gray-900 dark:text-white">
                    ${asset.avgPrice.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-right text-gray-900 dark:text-white">
                    ${asset.currentPrice.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-right font-medium text-gray-900 dark:text-white">
                    ${asset.value.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div
                      className={`flex items-center justify-end space-x-1 ${
                        asset.pnl >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {asset.pnl >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      <span className="font-medium">
                        {asset.pnl >= 0 ? "+" : ""}${asset.pnl.toLocaleString()} ({asset.pnlPercent >= 0 ? "+" : ""}
                        {asset.pnlPercent}%)
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span
                      className={`font-medium ${
                        asset.change24h >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {asset.change24h >= 0 ? "+" : ""}
                      {asset.change24h}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  )
}
