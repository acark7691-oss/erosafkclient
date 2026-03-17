"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { translations, type Lang, type TranslationKey } from "./i18n"

const LANG_KEY = "eros_lang"

interface LangContextType {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: TranslationKey) => string
}

const LangContext = createContext<LangContextType>({
  lang: "tr",
  setLang: () => {},
  t: (key) => translations.tr[key] ?? key,
})

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("tr")

  useEffect(() => {
    const saved = (localStorage.getItem(LANG_KEY) as Lang) || "tr"
    setLangState(saved)
  }, [])

  const setLang = useCallback((l: Lang) => {
    localStorage.setItem(LANG_KEY, l)
    setLangState(l)
  }, [])

  const t = useCallback((key: TranslationKey): string => {
    return translations[lang][key] ?? translations["tr"][key] ?? key
  }, [lang])

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
