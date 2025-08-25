"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, ExternalLink, Clock } from "lucide-react"
import { fetchFinancialNews } from "@/lib/api"

interface NewsArticle {
  id: string
  title: string
  description: string
  url: string
  source: string
  publishedAt: string
  category: string
}

export function NewsPage() {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    loadNews()
  }, [])

  const loadNews = async () => {
    setLoading(true)
    try {
      const articles = await fetchFinancialNews()
      setNews(articles)
    } catch (error) {
      console.error("Error loading news:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredNews = filter === "all" ? news : news.filter((article) => article.category === filter)

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "crypto":
        return "bg-orange-500/20 text-orange-600 dark:text-orange-400"
      case "stocks":
        return "bg-blue-500/20 text-blue-600 dark:text-blue-400"
      case "economy":
        return "bg-green-500/20 text-green-600 dark:text-green-400"
      default:
        return "bg-gray-500/20 text-gray-600 dark:text-gray-400"
    }
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Financial News</h1>
        <Button onClick={loadNews} className="flex items-center space-x-2">
          <RefreshCw className="w-4 h-4" />
          <span>Refresh News</span>
        </Button>
      </div>

      {/* Filters */}
      <GlassCard className="p-4">
        <div className="flex flex-wrap gap-2">
          {["all", "crypto", "stocks", "economy"].map((category) => (
            <Button
              key={category}
              variant={filter === category ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(category)}
              className="capitalize"
            >
              {category}
            </Button>
          ))}
        </div>
      </GlassCard>

      {/* News Articles */}
      <div className="space-y-4">
        {filteredNews.map((article) => (
          <GlassCard key={article.id} className="p-6" hover>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge className={getCategoryColor(article.category)}>{article.category}</Badge>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{article.source}</span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{article.title}</h3>

                <p className="text-gray-600 dark:text-gray-400 mb-3">{article.description}</p>

                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(article.publishedAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-transparent">
                <ExternalLink className="w-4 h-4" />
                <span>Read More</span>
              </Button>
            </div>
          </GlassCard>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <GlassCard className="p-12 text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No news found</h3>
          <p className="text-gray-600 dark:text-gray-400">Try changing the filter or refresh to load new articles</p>
        </GlassCard>
      )}
    </div>
  )
}
