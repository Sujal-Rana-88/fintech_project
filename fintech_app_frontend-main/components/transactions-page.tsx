"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownLeft } from "lucide-react"
import transactionsData from "@/data/transactions.json"

export function TransactionsPage() {
  return (
    <div className="space-y-6">
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Transaction History</h3>
        <div className="space-y-4">
          {transactionsData.transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 rounded-lg bg-white/5 dark:bg-black/5 hover:bg-white/10 dark:hover:bg-black/10 transition-all duration-200"
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`p-2 rounded-full ${
                    transaction.type === "buy"
                      ? "bg-green-500/20 text-green-600 dark:text-green-400"
                      : "bg-red-500/20 text-red-600 dark:text-red-400"
                  }`}
                >
                  {transaction.type === "buy" ? (
                    <ArrowDownLeft className="w-5 h-5" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {transaction.type === "buy" ? "Bought" : "Sold"} {transaction.symbol}
                    </p>
                    <Badge variant={transaction.type === "buy" ? "default" : "secondary"}>
                      {transaction.type.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {transaction.quantity} shares at ${transaction.price.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {new Date(transaction.date).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900 dark:text-white">${transaction.total.toLocaleString()}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Fee: ${transaction.fee}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Transaction Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 text-center">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Transactions</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{transactionsData.transactions.length}</p>
        </GlassCard>

        <GlassCard className="p-6 text-center">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Volume</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ${transactionsData.transactions.reduce((sum, t) => sum + t.total, 0).toLocaleString()}
          </p>
        </GlassCard>

        <GlassCard className="p-6 text-center">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Fees</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ${transactionsData.transactions.reduce((sum, t) => sum + t.fee, 0).toFixed(2)}
          </p>
        </GlassCard>
      </div>
    </div>
  )
}
