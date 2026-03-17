"use client"

import { cn } from "@/lib/utils"

interface PixelIconProps {
  type: "sword" | "pickaxe" | "shield" | "heart" | "spawner" | "emerald"
  className?: string
  size?: "sm" | "md" | "lg"
}

export function PixelIcon({ type, className, size = "md" }: PixelIconProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  }

  const icons = {
    sword: (
      <svg viewBox="0 0 16 16" className={cn(sizeClasses[size], className)}>
        <rect x="12" y="0" width="2" height="2" fill="#9ca3af" />
        <rect x="10" y="2" width="2" height="2" fill="#9ca3af" />
        <rect x="8" y="4" width="2" height="2" fill="#9ca3af" />
        <rect x="6" y="6" width="2" height="2" fill="#9ca3af" />
        <rect x="4" y="8" width="2" height="2" fill="#9ca3af" />
        <rect x="2" y="10" width="2" height="2" fill="#78350f" />
        <rect x="0" y="12" width="2" height="2" fill="#78350f" />
        <rect x="4" y="10" width="2" height="2" fill="#78350f" />
        <rect x="0" y="14" width="2" height="2" fill="#78350f" />
        <rect x="14" y="0" width="2" height="2" fill="#d1d5db" />
        <rect x="14" y="2" width="2" height="2" fill="#9ca3af" />
      </svg>
    ),
    pickaxe: (
      <svg viewBox="0 0 16 16" className={cn(sizeClasses[size], className)}>
        <rect x="0" y="0" width="2" height="2" fill="#78716c" />
        <rect x="2" y="0" width="2" height="2" fill="#78716c" />
        <rect x="4" y="0" width="2" height="2" fill="#78716c" />
        <rect x="0" y="2" width="2" height="2" fill="#78716c" />
        <rect x="4" y="2" width="2" height="2" fill="#78716c" />
        <rect x="4" y="4" width="2" height="2" fill="#78350f" />
        <rect x="6" y="6" width="2" height="2" fill="#78350f" />
        <rect x="8" y="8" width="2" height="2" fill="#78350f" />
        <rect x="10" y="10" width="2" height="2" fill="#78350f" />
        <rect x="12" y="12" width="2" height="2" fill="#78350f" />
        <rect x="14" y="14" width="2" height="2" fill="#78350f" />
      </svg>
    ),
    shield: (
      <svg viewBox="0 0 16 16" className={cn(sizeClasses[size], className)}>
        <rect x="2" y="0" width="12" height="2" fill="#9333ea" />
        <rect x="0" y="2" width="2" height="8" fill="#9333ea" />
        <rect x="14" y="2" width="2" height="8" fill="#9333ea" />
        <rect x="2" y="2" width="12" height="8" fill="#7c3aed" />
        <rect x="2" y="10" width="2" height="2" fill="#9333ea" />
        <rect x="12" y="10" width="2" height="2" fill="#9333ea" />
        <rect x="4" y="12" width="2" height="2" fill="#9333ea" />
        <rect x="10" y="12" width="2" height="2" fill="#9333ea" />
        <rect x="6" y="14" width="4" height="2" fill="#9333ea" />
        <rect x="6" y="4" width="4" height="4" fill="#c084fc" />
      </svg>
    ),
    heart: (
      <svg viewBox="0 0 16 16" className={cn(sizeClasses[size], className)}>
        <rect x="2" y="2" width="2" height="2" fill="#ef4444" />
        <rect x="4" y="2" width="2" height="2" fill="#ef4444" />
        <rect x="10" y="2" width="2" height="2" fill="#ef4444" />
        <rect x="12" y="2" width="2" height="2" fill="#ef4444" />
        <rect x="0" y="4" width="2" height="2" fill="#ef4444" />
        <rect x="2" y="4" width="2" height="2" fill="#fca5a5" />
        <rect x="4" y="4" width="2" height="2" fill="#ef4444" />
        <rect x="6" y="4" width="2" height="2" fill="#ef4444" />
        <rect x="8" y="4" width="2" height="2" fill="#ef4444" />
        <rect x="10" y="4" width="2" height="2" fill="#ef4444" />
        <rect x="12" y="4" width="2" height="2" fill="#ef4444" />
        <rect x="14" y="4" width="2" height="2" fill="#ef4444" />
        <rect x="0" y="6" width="16" height="2" fill="#ef4444" />
        <rect x="2" y="8" width="12" height="2" fill="#ef4444" />
        <rect x="4" y="10" width="8" height="2" fill="#ef4444" />
        <rect x="6" y="12" width="4" height="2" fill="#ef4444" />
      </svg>
    ),
    spawner: (
      <svg viewBox="0 0 16 16" className={cn(sizeClasses[size], className)}>
        <rect x="0" y="0" width="16" height="2" fill="#374151" />
        <rect x="0" y="14" width="16" height="2" fill="#374151" />
        <rect x="0" y="2" width="2" height="12" fill="#374151" />
        <rect x="14" y="2" width="2" height="12" fill="#374151" />
        <rect x="2" y="2" width="12" height="12" fill="#1f2937" />
        <rect x="4" y="4" width="2" height="2" fill="#374151" />
        <rect x="10" y="4" width="2" height="2" fill="#374151" />
        <rect x="4" y="10" width="2" height="2" fill="#374151" />
        <rect x="10" y="10" width="2" height="2" fill="#374151" />
        <rect x="6" y="6" width="4" height="4" fill="#f97316" />
        <rect x="7" y="7" width="2" height="2" fill="#fbbf24" />
      </svg>
    ),
    emerald: (
      <svg viewBox="0 0 16 16" className={cn(sizeClasses[size], className)}>
        <rect x="6" y="0" width="4" height="2" fill="#10b981" />
        <rect x="4" y="2" width="2" height="2" fill="#10b981" />
        <rect x="10" y="2" width="2" height="2" fill="#10b981" />
        <rect x="6" y="2" width="4" height="2" fill="#34d399" />
        <rect x="2" y="4" width="2" height="4" fill="#10b981" />
        <rect x="12" y="4" width="2" height="4" fill="#10b981" />
        <rect x="4" y="4" width="8" height="4" fill="#34d399" />
        <rect x="6" y="4" width="4" height="2" fill="#6ee7b7" />
        <rect x="2" y="8" width="2" height="4" fill="#10b981" />
        <rect x="12" y="8" width="2" height="4" fill="#10b981" />
        <rect x="4" y="8" width="8" height="4" fill="#34d399" />
        <rect x="4" y="12" width="2" height="2" fill="#10b981" />
        <rect x="10" y="12" width="2" height="2" fill="#10b981" />
        <rect x="6" y="12" width="4" height="2" fill="#34d399" />
        <rect x="6" y="14" width="4" height="2" fill="#10b981" />
      </svg>
    ),
  }

  return icons[type] || null
}
