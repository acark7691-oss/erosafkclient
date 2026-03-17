"use client"

import { useState, useEffect, useCallback } from "react"
import { translations, type Lang, type TranslationKey } from "./i18n"

const LANG_KEY = "eros_lang"

export function useLang() {
  const [lang, setLangState] = useState<Lang>("tr")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = (localStorage.getItem(LANG_KEY) as Lang) || "tr"
    setLangState(saved)
    setMounted(true)
  }, [])

  const setLang = useCallback((l: Lang) => {
    localStorage.setItem(LANG_KEY, l)
    setLangState(l)
  }, [])

  const t = useCallback((key: TranslationKey): string => {
    return translations[lang][key] ?? translations["tr"][key] ?? key
  }, [lang])

  return { lang, setLang, t, mounted }
}
