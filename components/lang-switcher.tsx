"use client"

import { useLang } from "@/lib/lang-context"
import { Globe } from "lucide-react"

export function LangSwitcher() {
  const { lang, setLang } = useLang()

  const toggle = () => {
    const next = lang === "tr" ? "en" : "tr"
    setLang(next)
    // Kısa gecikme sonra reload — state yazıldıktan sonra
    setTimeout(() => window.location.reload(), 50)
  }

  return (
    <button
      onClick={toggle}
      title={lang === "tr" ? "Switch to English" : "Türkçeye geç"}
      className="flex flex-col items-center justify-center gap-0 rounded-lg border transition-all duration-200 cursor-pointer select-none"
      style={{
        width: "38px",
        height: "38px",
        background: "rgba(139,92,246,0.06)",
        borderColor: "rgba(139,92,246,0.2)",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLButtonElement
        el.style.background = "rgba(139,92,246,0.14)"
        el.style.borderColor = "rgba(139,92,246,0.45)"
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLButtonElement
        el.style.background = "rgba(139,92,246,0.06)"
        el.style.borderColor = "rgba(139,92,246,0.2)"
      }}
    >
      {/* Aktif dil - parlak */}
      <span style={{
        fontSize: "10px",
        fontWeight: 800,
        lineHeight: 1,
        color: "#c4b5fd",
        letterSpacing: "0.5px",
        marginBottom: "1px",
      }}>
        {lang === "tr" ? "TR" : "EN"}
      </span>
      {/* Küçük ayırıcı */}
      <div style={{ width: "14px", height: "1px", background: "rgba(139,92,246,0.25)", margin: "1px 0" }} />
      {/* Pasif dil - soluk */}
      <span style={{
        fontSize: "9px",
        fontWeight: 600,
        lineHeight: 1,
        color: "rgba(167,139,250,0.4)",
        letterSpacing: "0.5px",
        marginTop: "1px",
      }}>
        {lang === "tr" ? "EN" : "TR"}
      </span>
    </button>
  )
}
