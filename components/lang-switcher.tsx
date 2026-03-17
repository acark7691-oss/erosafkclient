"use client"

import { useLang } from "@/lib/lang-context"

export function LangSwitcher() {
  const { lang, setLang } = useLang()

  return (
    <button
      onClick={() => setLang(lang === "tr" ? "en" : "tr")}
      title={lang === "tr" ? "Switch to English" : "Türkçeye geç"}
      className="flex flex-col items-center justify-center rounded-lg border transition-all duration-200 cursor-pointer select-none"
      style={{
        width: "38px",
        height: "38px",
        background: "rgba(139,92,246,0.06)",
        borderColor: "rgba(139,92,246,0.2)",
        gap: 0,
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
      <span style={{ fontSize: "10px", fontWeight: 800, lineHeight: 1, color: "#c4b5fd", letterSpacing: "0.5px" }}>
        {lang === "tr" ? "TR" : "EN"}
      </span>
      <div style={{ width: "14px", height: "1px", background: "rgba(139,92,246,0.3)", margin: "2px 0" }} />
      <span style={{ fontSize: "9px", fontWeight: 600, lineHeight: 1, color: "rgba(167,139,250,0.35)", letterSpacing: "0.5px" }}>
        {lang === "tr" ? "EN" : "TR"}
      </span>
    </button>
  )
}
