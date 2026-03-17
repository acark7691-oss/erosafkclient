"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

interface ErosLogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
  href?: string
  className?: string
}

export function ErosLogo({ size = "md", showText = true, href = "/", className }: ErosLogoProps) {
  const dims = { sm: 32, md: 38, lg: 48 }
  const fontSize = { sm: 17, md: 21, lg: 27 }
  const textSize = { sm: "text-base", md: "text-lg", lg: "text-2xl" }
  const d = dims[size]
  const f = fontSize[size]

  const logo = (
    <div className={cn("flex items-center gap-2.5 group cursor-pointer", className)}>
      <div
        style={{
          width: d, height: d,
          background: "rgba(139,92,246,0.08)",
          border: "1px solid rgba(139,92,246,0.25)",
          borderRadius: Math.round(d * 0.28),
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.3s ease",
          boxShadow: "0 0 0 0 rgba(139,92,246,0)",
        }}
        className="group-hover:!border-violet-500/50 group-hover:!shadow-[0_0_16px_rgba(139,92,246,0.3)]"
      >
        <svg width={d - 8} height={d - 8} viewBox="0 0 30 30" fill="none">
          {/* E harf - beyaz */}
          <text
            x="1" y="23"
            fontFamily="Georgia,serif"
            fontSize={f}
            fontWeight="700"
            fill="white"
            letterSpacing="-4"
            style={{ userSelect: "none" }}
          >E</text>
          {/* S harf - mor, üste binmiş */}
          <text
            x="11" y="23"
            fontFamily="Georgia,serif"
            fontSize={f}
            fontWeight="700"
            fill="#8b5cf6"
            letterSpacing="-4"
            style={{ userSelect: "none" }}
          >S</text>
        </svg>
      </div>
      {showText && (
        <div className="flex items-baseline gap-0.5">
          <span className={cn("font-bold tracking-tight text-foreground transition-colors group-hover:text-white", textSize[size])}>
            EROS
          </span>
          <span className={cn("font-light transition-colors", textSize[size])} style={{ color: "#8b5cf6" }}>
            AFK
          </span>
        </div>
      )}
    </div>
  )

  return <Link href={href}>{logo}</Link>
}
