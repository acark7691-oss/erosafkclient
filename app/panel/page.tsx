"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Activity, Shield, Terminal as TerminalIcon, Server,
  MessageSquare, HelpCircle, Globe, Play, Square, RefreshCw, Zap,
  Send, Trash2, Plus, X, LogOut, AlertTriangle, Link2, Wifi, Users,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ErosLogo } from "@/components/eros-logo"
import { LangSwitcher } from "@/components/lang-switcher"
import { useLang } from "@/lib/lang-context"
import {
  startBot, stopBot, getBotStatus, getLogs, getChatMessages, sendChat,
  getSettings, saveSettings, togglePanic, setPanicDistance, setDetectionDistance,
  toggleReconnect, cancelReconnect, getProxyStatus, toggleProxy,
  getWhitelist, addToWhitelist, removeFromWhitelist, logout, checkToken,
  getInventory, dropItem, dropAllItems,
  type BotStatus, type Settings, type ProxyStatus, type InventorySlot,
} from "@/lib/api"

interface LogEntry { id: string; timestamp: string; message: string; type: "info"|"success"|"warning"|"error"|"microsoft" }
interface ChatMessage { id: string; username: string; message: string }

const faqItems = [
  { id:"q1", question:"Botum ban yer mi?", answer:"Eros AFK, insan hareketini taklit eden randomize gecikmeler kullanir. Ban riski minimize edilmistir ancak sorumluluk kullaniciya aittir." },
  { id:"q2", question:"Microsoft girisi nasil yapilir?", answer:"Botu baslattiktan sonra log ekraninda microsoft.com/link adresi ve kod belirecektir. O linke girip kodu girerek hesabinizi baglayin." },
  { id:"q3", question:"Teknik destek alabilir miyim?", answer:"Evet. Discord sunucumuz uzerinden 7/24 destek talebi olusturabilirsiniz." },
  { id:"q4", question:"Proxy neden onemli?", answer:"Proxy kullanmak IP adresinizi gizler ve olasi ban durumunda gercek IP'nizin etkilenmesini onler." },
  { id:"q5", question:"Bekleme modu ne ise yarar?", answer:"Bot baglantiktan sonra belirlenen sure bekleyip koruma moduna gecer. Sunucularin spawn korumasini atlamak icin kullanilir." },
]

const ITEM_EMOJI: Record<string, string> = {
  bone: "🦴", arrow: "🏹", tipped_arrow: "🏹", spectral_arrow: "🏹",
  pickaxe: "⛏️", sword: "⚔️", axe: "🪓", shovel: "🪛", hoe: "🌿",
  diamond: "💎", gold: "✨", iron: "🔩", coal: "⬛", emerald: "💚",
  bread: "🍞", apple: "🍎", food: "🍎", chest: "📦", spawner: "🌀",
  stone: "🪨", wood: "🪵", log: "🪵", planks: "🪵", dirt: "🟫",
  bow: "🏹", shield: "🛡️", helmet: "⛑️", chestplate: "🥻", leggings: "👖", boots: "👟",
}

function getEmoji(name: string): string {
  for (const [key, emoji] of Object.entries(ITEM_EMOJI)) {
    if (name.includes(key)) return emoji
  }
  return "📦"
}

function PanelPageInner() {
  const router = useRouter()
  const { t } = useLang()

  const [username, setUsername] = useState("Eros")
  const [botStatus, setBotStatus] = useState<any>({ running: false, ready: false, panicEnabled: true, panicDistance: 7, detectionDistance: 60, autoReconnect: true, waiting: false, coordinates: null })
  const [settings, setSettings] = useState<Settings>({ host: "", port: 25565, version: "1.21.1", mc_username: "", panicEnabled: true, panicDistance: 7, detectionDistance: 60, autoReconnect: true, whitelist: [] })
  const [proxy, setProxy] = useState<ProxyStatus>({ enabled: true, host: "", port: 0 })
  const [logs, setLogs] = useState<LogEntry[]>([{ id:"1", timestamp: new Date().toLocaleTimeString("tr-TR"), message: "Panel baslatildi.", type:"info" }])
  const [chat, setChat] = useState<any[]>([])
  const [whitelist, setWhitelist] = useState<string[]>([])
  const [chatInput, setChatInput] = useState("")
  const [wlInput, setWlInput] = useState("")
  const [toast, setToast] = useState<{msg:string;ok:boolean}|null>(null)
  const [settingsSaved, setSettingsSaved] = useState(false)
  const [activeTab, setActiveTab] = useState("terminal")
  const [dropperRunning, setDropperRunning] = useState(false)
  const [lootLoading, setLootLoading] = useState(false)
  const [lootMsg, setLootMsg] = useState<{text:string;ok:boolean}|null>(null)
  const [inventory, setInventory] = useState<(InventorySlot | null)[]>(Array(36).fill(null))
  const [invLoading, setInvLoading] = useState(false)

  const logRef = useRef<HTMLDivElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)
  const logsPausedRef = useRef(false)

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  // Auth check
  useEffect(() => {
    checkToken().then(v => { if (!v) router.push("/login") })
  }, [router])

  // Polling
  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const [rawLogs, rawChat, status] = await Promise.all([
          logsPausedRef.current ? Promise.resolve(null) : getLogs(),
          getChatMessages(),
          getBotStatus()
        ])
        setBotStatus(status)
        if (status.username) setUsername(status.username)

        if (rawLogs) {
          setLogs(rawLogs.map((msg: string, i: number) => {
            let type: LogEntry["type"] = "info"
            if (msg.includes("✅") || msg.toLowerCase().includes("basarili") || msg.toLowerCase().includes("hazir")) type = "success"
            else if (msg.includes("⚠️") || msg.toLowerCase().includes("uyari")) type = "warning"
            else if (msg.includes("🚨") || msg.toLowerCase().includes("hata") || msg.includes("kicked")) type = "error"
            else if (msg.toLowerCase().includes("microsoft") || msg.includes("🔐")) type = "microsoft"
            return { id: `${i}`, timestamp: msg.substring(1, 9) || "", message: msg.substring(11) || msg, type }
          }))
        }

        setChat(prev => {
          const selfMsgs = prev.filter((m: any) => m.self)
          const serverMsgs = rawChat.map((m: any, i: number) => ({
            id: `s_${i}`,
            timestamp: new Date().toLocaleTimeString("tr-TR", {hour:"2-digit",minute:"2-digit"}),
            ...m
          }))
          const filtered = selfMsgs.filter((sm: any) =>
            !serverMsgs.some((s: any) => s.username === sm.username && s.message === sm.message)
          )
          return [...serverMsgs, ...filtered]
        })
      } catch {}
    }, 1000)
    return () => clearInterval(id)
  }, [])

  // Load initial settings
  useEffect(() => {
    getSettings().then(s => {
      setSettings(s)
      setWhitelist(s.whitelist || [])
    }).catch(() => {})
    getProxyStatus().then(setProxy).catch(() => {})
    checkToken().then(v => {
      if (v && typeof v === "object" && (v as any).username) setUsername((v as any).username)
    }).catch(() => {})
  }, [])

  // Auto-scroll
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight }, [logs])
  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight }, [chat])

  // Envanter tab açılınca yükle
  useEffect(() => {
    if (activeTab === "inventory") refreshInventory()
  }, [activeTab])

  const refreshInventory = async () => {
    setInvLoading(true)
    try {
      const data = await getInventory()
      setInventory(data.slots.slice(0, 36))
    } catch(e) { console.error("Inventory:", e) }
    finally { setInvLoading(false) }
  }

  const handleDropItem = async (slot: number, all: boolean) => {
    try {
      await dropItem(slot, all)
      await refreshInventory()
    } catch (err: any) { showToast(err.message, false) }
  }

  const handleDropAll = async () => {
    try {
      const res = await dropAllItems()
      showToast(res.total + " item droplandi!")
      await refreshInventory()
    } catch (err: any) { showToast(err.message, false) }
  }

  const handleSpawnerDrop = async () => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || ""
    const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : ""
    if (dropperRunning) {
      try { await fetch(apiBase + "/api/spawner-drop/stop", { method:"POST", headers:{"x-token": token} }) } catch {}
      setDropperRunning(false)
      setLootMsg({ text: "Dropper durduruldu.", ok: false })
      return
    }
    setLootLoading(true); setLootMsg(null)
    try {
      const res = await fetch(apiBase + "/api/spawner-drop", { method:"POST", headers:{"x-token": token, "Content-Type":"application/json"} })
      const data = await res.json()
      if (data.success) { setDropperRunning(true); setLootMsg({ text: data.message, ok: true }) }
      else setLootMsg({ text: data.error || "Hata!", ok: false })
    } catch (err: any) { setLootMsg({ text: err.message, ok: false }) }
    finally { setLootLoading(false) }
  }

  const handleStart = async () => {
    const res = await startBot()
    showToast(res || "Bot baslatildi!")
  }
  const handleStop = async () => {
    const res = await stopBot()
    showToast(res || "Bot durduruldu.")
  }
  const handleLogout = async () => { await logout(); router.push("/login") }

  const handleSaveSettings = async () => {
    try {
      await saveSettings(settings)
      setSettingsSaved(true)
      setTimeout(() => setSettingsSaved(false), 2000)
      showToast("Ayarlar kaydedildi!")
    } catch (err: any) { showToast(err.message, false) }
  }

  const handleAddWl = async () => {
    if (!wlInput.trim()) return
    const name = wlInput.trim()
    setWhitelist(w => [...w, name])
    setWlInput("")
    try { await addToWhitelist(name) } catch {}
  }

  const handleRemoveWl = async (name: string) => {
    setWhitelist(w => w.filter(p => p !== name))
    try { await removeFromWhitelist(name) } catch {}
  }

  const handleSendChat = async () => {
    if (!chatInput.trim()) return
    const msg = chatInput.trim()
    setChat(prev => [...prev, {
      id: Date.now().toString(), username, message: msg, self: true,
      timestamp: new Date().toLocaleTimeString("tr-TR", {hour:"2-digit",minute:"2-digit"})
    }])
    setChatInput("")
    try { await sendChat(msg) } catch {}
  }

  const tabs = [
    { value:"terminal", icon:<TerminalIcon className="h-4 w-4"/>, label:"Terminal" },
    { value:"security", icon:<Shield className="h-4 w-4"/>, label:"Güvenlik" },
    { value:"connection", icon:<Link2 className="h-4 w-4"/>, label:"Bağlantı" },
    { value:"chat", icon:<MessageSquare className="h-4 w-4"/>, label:"Chat & SSS" },
    { value:"integrations", icon:<Zap className="h-4 w-4"/>, label:"Entegrasyonlar" },
    { value:"inventory", icon:<Users className="h-4 w-4"/>, label:"Envanter" },
  ]

  const fmt = (n: number) => Math.abs(n) >= 1000 ? (n/1000).toFixed(1) + "k" : n.toString()

  return (
    <div className="min-h-screen bg-background noise-overlay">
      {/* Toast */}
      {toast && (
        <div className={cn("fixed top-20 right-4 z-50 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg transition-all", toast.ok ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-destructive/30 bg-destructive/10 text-destructive")}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header className="fixed top-0 z-40 w-full border-b border-border/50 bg-background/60 backdrop-blur-xl">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <ErosLogo size="sm" />
            <span className="text-xs text-muted-foreground hidden sm:inline">Client v4.0</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className={cn("h-2 w-2 rounded-full", botStatus.running && botStatus.ready ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground")} />
              <span className="hidden sm:inline text-sm text-muted-foreground">
                Hoş geldin, <span className="font-medium" style={{color:"#8b5cf6"}}>{username}</span>
              </span>
            </div>
            <LangSwitcher />
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
              <LogOut className="h-4 w-4" /><span className="ml-2 hidden sm:inline">Çıkış</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 pt-20 pb-8">
        {/* Stat kartları */}
        <div className="mb-4 grid gap-3 grid-cols-2 sm:grid-cols-4">
          {[
            { title: "Bot Durumu", value: botStatus.running ? (botStatus.ready ? "Aktif" : "Bağlanıyor") : botStatus.waiting ? "Bekleniyor" : "Kapalı", sub: botStatus.ready ? "Koruma aktif" : botStatus.waiting ? "Yeniden bağlanıyor..." : "Bekleniyor", icon: <Activity className="h-4 w-4" />, color: botStatus.ready ? "text-emerald-400" : botStatus.running ? "text-amber-400" : "text-muted-foreground" },
            { title: "Panik Mesafesi", value: `${settings.panicDistance} blok`, sub: settings.panicEnabled ? "Aktif" : "Kapalı", icon: <Shield className="h-4 w-4" />, color: "text-cyan-400" },
            { title: "Whitelist", value: `${whitelist.length} Oyuncu`, sub: "Güvenli liste", icon: <Users className="h-4 w-4" />, color: "text-cyan-400" },
            { title: "Proxy", value: proxy.enabled ? "Aktif" : "Kapalı", sub: proxy.enabled ? `${proxy.host}:${proxy.port}` : "Direkt bağlantı", icon: <Globe className="h-4 w-4" />, color: proxy.enabled ? "text-emerald-400" : "text-amber-400" },
          ].map((card, i) => (
            <div key={i} className="glass-card rounded-xl p-4">
              <div className="mb-2 flex items-center gap-2 text-muted-foreground">{card.icon}<span className="text-xs">{card.title}</span></div>
              <div className={cn("text-lg font-bold", card.color)}>{card.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{card.sub}</div>
            </div>
          ))}
        </div>

        {/* Koordinat kartı */}
        {botStatus.coordinates && (
          <div className="mb-4 rounded-xl border border-violet-500/20 bg-violet-500/5 px-5 py-3 flex items-center gap-4" style={{animation:"fadeIn 0.4s ease"}}>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{color:"#a78bfa"}}>
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>
              </svg>
              <span style={{color:"#c4b5fd"}} className="font-semibold">Koordinat</span>
            </div>
            <div className="flex items-center gap-3 font-mono text-sm">
              {(() => {
                return <>
                  <span><span className="text-red-400 font-bold">X</span> <span className="text-foreground font-semibold">{fmt(botStatus.coordinates.x)}</span></span>
                  <span className="text-muted-foreground">·</span>
                  <span><span className="text-emerald-400 font-bold">Y</span> <span className="text-foreground font-semibold">{botStatus.coordinates.y}</span></span>
                  <span className="text-muted-foreground">·</span>
                  <span><span className="text-blue-400 font-bold">Z</span> <span className="text-foreground font-semibold">{fmt(botStatus.coordinates.z)}</span></span>
                </>
              })()}
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse inline-block"/>
              <span className="text-xs text-emerald-400">Canlı</span>
            </div>
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
          {/* Sol panel */}
          <div className="space-y-4">
            {/* Bot kontrolleri */}
            <div className="glass-card rounded-xl p-4">
              <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Shield className="h-3.5 w-3.5 text-cyan-400" />BOT KONTROLLERİ
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={handleStart} disabled={botStatus.running} size="sm" className="cyber-button border-0 text-primary-foreground">
                  <Play className="mr-1.5 h-3.5 w-3.5" />Başlat
                </Button>
                <Button onClick={handleStop} disabled={!botStatus.running} size="sm" variant="destructive">
                  <Square className="mr-1.5 h-3.5 w-3.5" />Durdur
                </Button>
              </div>
              {settings.host && (
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <div className={cn("h-1.5 w-1.5 rounded-full", botStatus.running ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground")} />
                  {settings.host}
                </div>
              )}
            </div>

            {/* Güvenlik */}
            <div className="glass-card rounded-xl p-4">
              <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />GÜVENLİK
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Panik Çıkış</p>
                    <p className="text-xs text-muted-foreground">Oyuncu yaklaşınca çıkış yap</p>
                  </div>
                  <Switch checked={settings.panicEnabled} onCheckedChange={async v => { setSettings(s => ({...s, panicEnabled: v})); await togglePanic() }} />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Panik Mesafesi</span><span className="text-cyan-400 font-bold">{settings.panicDistance} blok</span></div>
                  <Slider min={3} max={20} step={1} value={[settings.panicDistance]} onValueChange={async ([v]) => { setSettings(s => ({...s, panicDistance: v})); await setPanicDistance(v) }} />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Algılama Mesafesi</span><span className="text-cyan-400 font-bold">{settings.detectionDistance} blok</span></div>
                  <Slider min={10} max={100} step={5} value={[settings.detectionDistance]} onValueChange={async ([v]) => { setSettings(s => ({...s, detectionDistance: v})); await setDetectionDistance(v) }} />
                </div>
              </div>
            </div>

            {/* Bağlantı */}
            <div className="glass-card rounded-xl p-4">
              <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Globe className="h-3.5 w-3.5 text-cyan-400" />BAĞLANTI
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm">Otomatik Reconnect</p>
                      <p className="text-xs text-muted-foreground">Bağlantı kopunca tekrar bağlan</p>
                    </div>
                  </div>
                  <Switch checked={settings.autoReconnect} onCheckedChange={async v => { setSettings(s => ({...s, autoReconnect: v})); await toggleReconnect() }} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wifi className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">Proxy</p>
                  </div>
                  <Switch checked={proxy.enabled} onCheckedChange={async v => { setProxy(p => ({...p, enabled: v})); await toggleProxy() }} />
                </div>
              </div>
            </div>
          </div>

          {/* Sağ panel - Tabs */}
          <div className="glass-card rounded-xl overflow-hidden">
            <Tabs defaultValue="terminal" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="w-full justify-start rounded-none border-b border-border/50 bg-card/50 p-0 h-auto flex-wrap">
                {tabs.map(tab => (
                  <TabsTrigger key={tab.value} value={tab.value}
                    className="gap-2 rounded-none border-b-2 border-transparent px-4 py-3 text-xs data-[state=active]:border-cyan-500 data-[state=active]:text-cyan-400 data-[state=active]:bg-transparent">
                    {tab.icon}{tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* TERMINAL */}
              <TabsContent value="terminal" className="mt-0 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="flex items-center gap-2 text-sm font-semibold">
                    <TerminalIcon className="h-4 w-4 text-cyan-400" />Konsol Çıktısı
                  </h3>
                  <Button variant="ghost" size="sm"
                    onClick={() => { setLogs([]); logsPausedRef.current = true; showToast("Terminal temizlendi ✓"); setTimeout(() => { logsPausedRef.current = false }, 3000) }}
                    className="text-xs text-muted-foreground">
                    <Trash2 className="mr-1 h-3 w-3" />Temizle
                  </Button>
                </div>
                <div ref={logRef} className="h-[420px] overflow-y-auto rounded-lg p-3 font-mono text-xs space-y-0.5" style={{background:"#04050b"}}>
                  {logs.length === 0 ? <p className="text-muted-foreground">Henüz log yok...</p> : logs.map(log => (
                    <div key={log.id} className={cn("leading-relaxed", log.type === "success" ? "text-emerald-400" : log.type === "error" ? "text-red-400" : log.type === "warning" ? "text-amber-400" : log.type === "microsoft" ? "text-blue-400" : "text-muted-foreground")}>
                      <span className="opacity-50">[{log.timestamp}]</span> {log.message}
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* GÜVENLİK TAB */}
              <TabsContent value="security" className="mt-0 p-4 space-y-4">
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold mb-4"><Shield className="h-4 w-4 text-cyan-400" />Algılama Ayarları</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2"><span>Algılama Mesafesi</span><span className="text-cyan-400 font-bold">{settings.detectionDistance} blok</span></div>
                      <Slider min={10} max={100} step={5} value={[settings.detectionDistance]} onValueChange={async ([v]) => { setSettings(s => ({...s, detectionDistance: v})); await setDetectionDistance(v) }} />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>10 blok</span><span>100 blok</span></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2"><span>Panik Mesafesi</span><span className="text-amber-400 font-bold">{settings.panicDistance} blok</span></div>
                      <Slider min={3} max={20} step={1} value={[settings.panicDistance]} onValueChange={async ([v]) => { setSettings(s => ({...s, panicDistance: v})); await setPanicDistance(v) }} />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>3 blok</span><span>20 blok</span></div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold mb-3"><Users className="h-4 w-4 text-cyan-400" />Beyaz Liste (Whitelist)</h3>
                  <p className="text-xs text-muted-foreground mb-3">Bu listedeki oyuncular algılandığında panik modu tetiklenmez.</p>
                  <div className="flex gap-2 mb-3">
                    <Input placeholder="Oyuncu adı..." value={wlInput} onChange={e => setWlInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAddWl()} className="border-border/50 bg-card/50" />
                    <Button onClick={handleAddWl} size="sm" className="cyber-button border-0 shrink-0"><Plus className="h-4 w-4" /></Button>
                  </div>
                  <div className="space-y-2">
                    {whitelist.length === 0 ? <p className="text-sm text-muted-foreground">Beyaz liste boş.</p> : whitelist.map(name => (
                      <div key={name} className="flex items-center justify-between rounded-lg border border-border/50 bg-card/50 px-3 py-2">
                        <span className="text-sm text-foreground">{name}</span>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveWl(name)} className="h-6 w-6 text-muted-foreground hover:text-destructive"><X className="h-3 w-3" /></Button>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* BAĞLANTI TAB */}
              <TabsContent value="connection" className="mt-0 p-4 space-y-4">
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold mb-4"><Server className="h-4 w-4 text-cyan-400" />Bağlantı Ayarları</h3>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div><Label className="text-xs text-muted-foreground mb-1 block">Sunucu IP</Label><Input value={settings.host} onChange={e => setSettings(s => ({...s, host: e.target.value}))} className="border-border/50 bg-card/50" /></div>
                    <div><Label className="text-xs text-muted-foreground mb-1 block">Port</Label><Input type="number" value={settings.port} onChange={e => setSettings(s => ({...s, port: parseInt(e.target.value)}))} className="border-border/50 bg-card/50" /></div>
                    <div><Label className="text-xs text-muted-foreground mb-1 block">Minecraft Versiyonu</Label><Input value={settings.version} onChange={e => setSettings(s => ({...s, version: e.target.value}))} className="border-border/50 bg-card/50" /></div>
                    <div><Label className="text-xs text-muted-foreground mb-1 block">Microsoft Email</Label><Input value={settings.mc_username} onChange={e => setSettings(s => ({...s, mc_username: e.target.value}))} className="border-border/50 bg-card/50" /></div>
                  </div>
                  <Button onClick={handleSaveSettings} className="cyber-button border-0 text-primary-foreground">
                    {settingsSaved ? "✓ Kaydedildi" : "Kaydet"}
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="glass-card rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <RefreshCw className="h-5 w-5 text-cyan-400" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Otomatik Reconnect</p>
                        <p className="text-xs text-muted-foreground">Bağlantı kopunca tekrar bağlan</p>
                      </div>
                      <Switch checked={settings.autoReconnect} onCheckedChange={async v => { setSettings(s => ({...s, autoReconnect: v})); await toggleReconnect() }} />
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <div className={cn("h-1.5 w-1.5 rounded-full", botStatus.waiting ? "bg-amber-400 animate-pulse" : botStatus.ready ? "bg-emerald-500" : "bg-muted-foreground")} />
                      <span className="text-muted-foreground">{botStatus.waiting ? "Yeniden bağlanıyor..." : botStatus.ready ? "Hazır" : "Bekleniyor"}</span>
                    </div>
                  </div>
                  <div className="glass-card rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Wifi className="h-5 w-5 text-cyan-400" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Proxy Durumu</p>
                        <p className="text-xs text-muted-foreground">{proxy.enabled ? `${proxy.host}:${proxy.port} — Aktif` : "Kapalı"}</p>
                      </div>
                    </div>
                    <span className={cn("text-xs font-semibold", proxy.enabled ? "text-emerald-400" : "text-amber-400")}>
                      {proxy.enabled ? "Güvenli" : "Riskli"}
                    </span>
                  </div>
                </div>
                {!proxy.enabled && (
                  <div className="flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-400">
                    <AlertTriangle className="h-4 w-4 shrink-0" />Proxy Kapalı! Direkt bağlantı IP banlanma riskini artırır.
                  </div>
                )}
              </TabsContent>

              {/* CHAT TAB */}
              <TabsContent value="chat" className="mt-0 p-4">
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="glass-card rounded-xl p-4 flex flex-col" style={{minHeight:"420px"}}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="flex items-center gap-2 text-sm font-semibold"><MessageSquare className="h-4 w-4 text-cyan-400" />Oyun Chati</h3>
                      <div className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse inline-block"/>
                        <span className="text-xs text-emerald-400">Canlı</span>
                      </div>
                    </div>
                    <div ref={chatRef} className="flex-1 rounded-lg border border-border/50 overflow-y-auto p-3 mb-3" style={{background:"#04050b", minHeight:"280px", maxHeight:"320px", fontFamily:"monospace"}}>
                      {chat.length === 0 ? <p className="text-xs text-muted-foreground">Henüz mesaj yok...</p> : (
                        <div className="space-y-1.5">
                          {chat.map((m: any, i) => {
                            const isSelf = m.self || m.username === username
                            const colors = ["#22d3ee","#34d399","#f59e0b","#a78bfa","#fb7185","#60a5fa","#f97316","#2dd4bf"]
                            const color = isSelf ? "#a78bfa" : colors[m.username.charCodeAt(0) % colors.length]
                            const isCmd = m.message?.startsWith("/")
                            return (
                              <div key={m.id || i} className={cn("text-xs leading-relaxed flex gap-1.5 items-baseline rounded px-1 py-0.5", isSelf ? "bg-violet-500/5 border-l-2 border-violet-500/40" : "")}>
                                <span className="text-muted-foreground shrink-0 opacity-50" style={{fontSize:"10px"}}>{m.timestamp}</span>
                                <span className="font-bold shrink-0" style={{color}}>{m.username}</span>
                                <span className="text-muted-foreground opacity-50">›</span>
                                <span className={cn("break-all", isCmd ? "text-amber-400" : isSelf ? "text-violet-200" : "text-foreground")}>{m.message}</span>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Input placeholder="Mesaj yaz..." value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSendChat()} className="border-border/50 bg-card/50 font-mono text-sm" />
                      <Button onClick={handleSendChat} size="icon" className="cyber-button shrink-0 border-0"><Send className="h-4 w-4" /></Button>
                    </div>
                  </div>
                  <div className="glass-card rounded-xl p-4">
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold"><HelpCircle className="h-4 w-4 text-cyan-400" />Sıkça Sorulan Sorular</h3>
                    <ScrollArea className="h-[360px]">
                      <Accordion type="single" collapsible className="w-full">
                        {faqItems.map(item => (
                          <AccordionItem key={item.id} value={item.id} className="border-border/50">
                            <AccordionTrigger className="text-left text-sm hover:text-cyan-400 hover:no-underline">{item.question}</AccordionTrigger>
                            <AccordionContent className="text-sm text-muted-foreground">{item.answer}</AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </ScrollArea>
                  </div>
                </div>
              </TabsContent>

              {/* ENTEGRASYONLAR TAB */}
              <TabsContent value="integrations" className="mt-0 p-4">
                <div className="space-y-4">
                  <div className="glass-card rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", dropperRunning ? "bg-amber-500/10" : "bg-violet-500/10")}>
                        <Zap className={cn("h-5 w-5", dropperRunning ? "text-amber-400 animate-pulse" : "text-violet-400")} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold">Spawner Dropper</h3>
                        <p className="text-xs text-muted-foreground">Slot 50/53 ile bone droplar. Arrow görünce durur.</p>
                      </div>
                      {dropperRunning && (
                        <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse inline-block"/>
                          <span className="text-xs text-amber-400 font-medium">Çalışıyor</span>
                        </div>
                      )}
                    </div>
                    <div className="rounded-lg border border-border/50 bg-card/30 p-4 mb-4 space-y-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Bot spawner&apos;ın 6 blok yakınında olmalı</div>
                      <div className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Sadece bone droplar, arrow görünce durur</div>
                      <div className="flex items-center gap-2"><span className="text-amber-400">⚠</span> Arrow tespit edilirse otomatik durur</div>
                    </div>
                    <Button onClick={handleSpawnerDrop} disabled={lootLoading || !botStatus.running}
                      className={cn("w-full border-0 text-sm font-semibold", dropperRunning ? "bg-destructive hover:bg-destructive/90 text-white" : "cyber-button text-primary-foreground")}>
                      {lootLoading ? "..." : dropperRunning ? "⏹ Durdur" : "▶ Spawner Dropper Başlat"}
                    </Button>
                    {lootMsg && <p className={cn("mt-3 text-xs", lootMsg.ok ? "text-emerald-400" : "text-destructive")}>{lootMsg.text}</p>}
                    {!botStatus.running && <p className="mt-3 text-xs text-amber-400">⚠ Bot çalışmıyor, önce botu başlatın.</p>}
                  </div>
                </div>
              </TabsContent>

              {/* ENVANTER TAB */}
              <TabsContent value="inventory" className="mt-0 p-4">
                <div className="glass-card rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="flex items-center gap-2 text-sm font-semibold">
                      <Users className="h-4 w-4 text-cyan-400" />Bot Envanteri
                    </h3>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={refreshInventory} disabled={invLoading} className="text-xs text-muted-foreground">
                        <RefreshCw className={cn("h-3 w-3 mr-1", invLoading && "animate-spin")} />Yenile
                      </Button>
                      <Button variant="ghost" size="sm" onClick={handleDropAll} className="text-xs text-destructive">
                        Tümünü Drop Et
                      </Button>
                    </div>
                  </div>

                  {!botStatus.running ? (
                    <p className="text-center text-sm text-muted-foreground py-8">Bot çalışmıyor</p>
                  ) : (
                    <div className="grid grid-cols-9 gap-1">
                      {inventory.map((item, i) => (
                        <div key={i}
                          className={cn("relative group aspect-square rounded-lg border flex flex-col items-center justify-center cursor-pointer transition-all duration-150",
                            item ? "border-border/50 bg-card/80 hover:border-cyan-500/50" : "border-border/20 bg-card/20")}
                          title={item ? `${item.displayName} x${item.count}` : "Boş"}
                          onClick={() => item && handleDropItem(item.slot, false)}
                          onContextMenu={e => { e.preventDefault(); item && handleDropItem(item.slot, true) }}
                        >
                          {item && (
                            <>
                              <button className="absolute top-0.5 left-0.5 z-10 w-4 h-4 rounded-full bg-destructive/80 hover:bg-destructive flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={e => { e.stopPropagation(); handleDropItem(item.slot, true) }}>
                                <X className="h-2.5 w-2.5 text-white" />
                              </button>
                              <span className="text-lg leading-none">{getEmoji(item.name)}</span>
                              <span className="absolute bottom-0.5 right-1 text-[9px] font-bold text-foreground leading-none">
                                {item.count > 1 ? item.count : ""}
                              </span>
                              <div className="absolute inset-0 rounded-lg bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span><span className="text-cyan-400">Sol tık</span> → 1 tane drop</span>
                      <span><span className="text-destructive">Sağ tık</span> → tüm stack drop</span>
                      <span><span className="text-destructive">🔴</span> → tüm stack drop</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                      <AlertTriangle className="h-3 w-3 shrink-0" />
                      Sağ tık ile tüm stack droplunur, geri alınamaz!
                    </div>
                  </div>
                </div>
              </TabsContent>

            </Tabs>
          </div>
        </div>
      </main>

      <footer className="border-t border-border/50 bg-card/30 py-4">
        <div className="container px-4 text-center">
          <p className="text-xs text-muted-foreground">2026 Eros AFK Client — v4.0</p>
        </div>
      </footer>
    </div>
  )
}

export default function PanelPage() {
  return (
    <Suspense>
      <PanelPageInner />
    </Suspense>
  )
}
