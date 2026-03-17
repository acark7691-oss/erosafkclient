"use client"

import { cn } from "@/lib/utils"

interface StatusCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  status?: "online" | "offline" | "warning" | "info"
  className?: string
}

export function StatusCard({ title, value, subtitle, icon, status, className }: StatusCardProps) {
  const statusColors = {
    online: "border-l-emerald-500",
    offline: "border-l-red-500",
    warning: "border-l-amber-500",
    info: "border-l-primary",
  }

  const statusGlow = {
    online: "shadow-emerald-500/20",
    offline: "shadow-red-500/20",
    warning: "shadow-amber-500/20",
    info: "shadow-primary/20",
  }

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border border-border bg-card p-4 transition-all duration-300",
        "border-l-4 hover:border-border/80",
        status ? statusColors[status] : "border-l-primary",
        status && `hover:shadow-lg ${statusGlow[status]}`,
        className
      )}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50 transition-opacity group-hover:opacity-100" />
      
      {/* Pixel corner decoration */}
      <div className="absolute right-0 top-0 h-2 w-2 bg-primary/20" />
      <div className="absolute right-2 top-0 h-1 w-1 bg-primary/10" />
      <div className="absolute right-0 top-2 h-1 w-1 bg-primary/10" />
      
      <div className="relative">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {icon && (
            <span className="text-primary transition-transform group-hover:scale-110">
              {icon}
            </span>
          )}
          {title}
        </div>
        <div className="mt-2 text-2xl font-bold text-foreground transition-colors group-hover:text-primary">
          {value}
        </div>
        {subtitle && (
          <div className="mt-1 text-xs text-muted-foreground">{subtitle}</div>
        )}
        
        {/* Status indicator dot */}
        {status === "online" && (
          <div className="absolute right-0 top-0 h-2 w-2 rounded-full bg-emerald-500 pulse-online" />
        )}
      </div>
    </div>
  )
}
