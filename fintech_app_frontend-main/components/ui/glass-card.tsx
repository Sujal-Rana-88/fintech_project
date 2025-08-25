"use client"

import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export function GlassCard({ children, className, hover = false }: GlassCardProps) {
  return (
    <div
      className={cn(
        "backdrop-blur-md bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-xl shadow-lg",
        hover &&
          "hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]",
        className,
      )}
    >
      {children}
    </div>
  )
}
