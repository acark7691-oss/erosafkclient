"use client"

import { useLang } from "@/lib/use-lang"
import { Globe } from "lucide-react"

export function LangSwitcher() {
  const { lang, setLang, mounted } = useLang()
  if (!mounted) return null

  return (
    <button
      onClick={() => setLang(lang === "tr" ? "en" : "tr")}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all duration-200 select-none"
      style={{
        background: "rgba(139,92,246,0.06)",
        borderColor: "rgba(139,92,246,0.2)",
        color: "#a78bfa",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.background = "rgba(139,92,246,0.12)"
        ;(e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(139,92,246,0.4)"
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.background = "rgba(139,92,246,0.06)"
        ;(e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(139,92,246,0.2)"
      }}
      aria-label="Switch language"
    >
      <Globe className="h-3.5 w-3.5" />
      <span className="text-xs font-semibold tracking-wider">
        <span style={{ opacity: lang === "tr" ? 1 : 0.45, transition: "opacity 0.2s" }}>TR</span>
        <span style={{ margin: "0 3px", opacity: 0.3 }}>/</span>
        <span style={{ opacity: lang === "en" ? 1 : 0.45, transition: "opacity 0.2s" }}>EN</span>
      </span>
    </button>
  )
}
