"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { OverviewPage } from "@/components/overview-page"
import { PortfolioPage } from "@/components/portfolio-page"
import { MarketPage } from "@/components/market-page"
import { TransactionsPage } from "@/components/transactions-page"
import { WishlistPage } from "@/components/wishlist-page"
import { SavedPage } from "@/components/saved-page"
import { AlertsPage } from "@/components/alerts-page"
import { NewsPage } from "@/components/news-page"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  const [activeTab, setActiveTab] = useState("overview")

  const renderPage = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewPage />
      case "portfolio":
        return <PortfolioPage />
      case "market":
        return <MarketPage />
      case "transactions":
        return <TransactionsPage />
      case "wishlist":
        return <WishlistPage />
      case "saved":
        return <SavedPage />
      case "alerts":
        return <AlertsPage />
      case "news":
        return <NewsPage />
      default:
        return <OverviewPage />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="container mx-auto px-4 py-6">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="animate-in fade-in-50 duration-500">{renderPage()}</main>
      </div>
      <Toaster />
    </div>
  )
}
