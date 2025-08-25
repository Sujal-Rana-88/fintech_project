"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { GlassCard } from "@/components/ui/glass-card"
import { ThemeToggle } from "@/components/theme-toggle"
import { BarChart3, TrendingUp, Wallet, History, Menu, X, Heart, Bookmark, Bell, Newspaper } from "lucide-react"
import { useRouter } from "next/navigation";

interface NavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const navItems = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "portfolio", label: "Portfolio", icon: Wallet },
  { id: "market", label: "Market", icon: TrendingUp },
  { id: "transactions", label: "Transactions", icon: History },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "saved", label: "Saved", icon: Bookmark },
  { id: "alerts", label: "Alerts", icon: Bell },
  { id: "news", label: "News", icon: Newspaper },
]

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<{ firstname: string; lastname: string } | null>(null);
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    function updateToken() {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      setToken(token);
    }
    updateToken();
    window.addEventListener("storage", updateToken);
    return () => window.removeEventListener("storage", updateToken);
  }, []);
  useEffect(() => {
    function updateUser() {
      const firstname = typeof window !== "undefined" ? localStorage.getItem("firstname") : null;
      const lastname = typeof window !== "undefined" ? localStorage.getItem("lastname") : null;
      if (firstname && lastname) setUser({ firstname, lastname });
      else setUser(null);
    }
    updateUser();
    window.addEventListener("storage", updateUser);
    return () => window.removeEventListener("storage", updateUser);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.replace("/signin");
  };

  return (
    <>
      {/* Desktop Navigation */}
      <GlassCard className="hidden lg:flex items-center justify-between p-4 mb-6">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              FinDash Pro
            </span>
          </div>

          <nav className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm",
                    activeTab === item.id
                      ? "bg-white/20 dark:bg-black/20 text-blue-600 dark:text-blue-400"
                      : "hover:bg-white/10 dark:hover:bg-black/10 text-gray-600 dark:text-gray-300",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        <ThemeToggle />
        {token && (
          <div className="flex items-center gap-3 ml-8">
            <img
              src="https://api.dicebear.com/7.x/identicon/svg?seed=nftuser"
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-blue-400 shadow"
            /><div className="flex items-center gap-2 bg-white/10 dark:bg-black/20 px-3 py-1 rounded-full shadow">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate max-w-[120px]">
              {user?.firstname} {user?.lastname}
            </span>
          </div>
          
            <button
              onClick={handleLogout}
              className="ml-2 px-4 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        )}
      </GlassCard>

      {/* Mobile Navigation */}
      <GlassCard className="lg:hidden flex items-center justify-between p-4 mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            FinDash Pro
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-white/10 dark:hover:bg-black/10"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {token && (
          <div className="flex items-center gap-3 ml-2">
            <img
              src="https://api.dicebear.com/7.x/identicon/svg?seed=nftuser"
              alt="Profile"
              className="w-8 h-8 rounded-full border-2 border-blue-400 shadow"
            /><div className="flex items-center gap-2 bg-white/10 dark:bg-black/20 px-3 py-1 rounded-full shadow">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate max-w-[120px]">
              {user?.firstname} {user?.lastname}
            </span>
          </div>
          
            <button
              onClick={handleLogout}
              className="ml-1 px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition text-sm"
            >
              Logout
            </button>
          </div>
        )}
      </GlassCard>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <GlassCard className="lg:hidden mb-6 p-4">
          <nav className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id)
                    setIsMobileMenuOpen(false)
                  }}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left",
                    activeTab === item.id
                      ? "bg-white/20 dark:bg-black/20 text-blue-600 dark:text-blue-400"
                      : "hover:bg-white/10 dark:hover:bg-black/10 text-gray-600 dark:text-gray-300",
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              )
            })}
          </nav>
          
        </GlassCard>
      )}
    </>
  )
}
