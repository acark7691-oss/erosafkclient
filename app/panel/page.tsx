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
import { TooltipProvider } from "@/components/ui/tooltip"
import {
  Activity, MapPin, Users, Shield, Terminal as TerminalIcon, Server,
  MessageSquare, HelpCircle, Globe, Bot, Play, Square, RefreshCw, Zap,
  Eye, Send, Trash2, Plus, X, LogOut, AlertTriangle, Info, Link2, Wifi,
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
  type BotStatus, type Settings, type ProxyStatus,
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

function PanelPageInner() {
  const router = useRouter()
  const { t } = useLang()
  const [username, setUsername] = useState("Eros")
  const [botStatus, setBotStatus] = useState<any>({ running: false, ready: false, panicEnabled: true, panicDistance: 7, detectionDistance: 60, autoReconnect: true, waiting: false, coordinates: null })
  const [settings, setSettings] = useState<Settings>({ host: "", port: 25565, version: "1.21.1", mc_username: "", panicEnabled: true, panicDistance: 7, detectionDistance: 60, autoReconnect: true, whitelist: [] })
  const [proxy, setProxy] = useState<ProxyStatus>({ enabled: true, host: "", port: 0 })
  const [logs, setLogs] = useState<LogEntry[]>([{ id:"1", timestamp: new Date().toLocaleTimeString("tr-TR"), message: "Panel baslatildi.", type:"info" }])
  const [chat, setChat] = useState<ChatMessage[]>([])
  const [whitelist, setWhitelist] = useState<string[]>([])
  const [chatInput, setChatInput] = useState("")
  const [wlInput, setWlInput] = useState("")
  const [toast, setToast] = useState<{msg:string;ok:boolean}|null>(null)
  const logsPausedRef = useRef(false)
  const logClearTimeRef = useRef<number>(0)
  const [settingsSaved, setSettingsSaved] = useState(false)
  const [dropperRunning, setDropperRunning] = useState(false)
  const [lootLoading, setLootLoading] = useState(false)
  const [lootMsg, setLootMsg] = useState<{text:string;ok:boolean}|null>(null)
  const logRef = useRef<HTMLDivElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)

  const showToast = (msg: string, ok = true) => {
    setToast({msg, ok})
    setTimeout(() => setToast(null), 2500)
  }

  const addLog = useCallback((message: string, type: LogEntry["type"] = "info") => {
    setLogs(prev => [...prev.slice(-99), { id: Date.now().toString(), timestamp: new Date().toLocaleTimeString("tr-TR"), message, type }])
  }, [])

  // Auth check
  useEffect(() => {
    checkToken().then(async v => {
      if (!v) { router.push("/login"); return }
      const u = localStorage.getItem("eros_username")
      if (u) setUsername(u)
      // Lisans kontrolü
      try {
        const { getDashboard } = await import("@/lib/api")
        const data = await getDashboard()
        if (!data.is_active || data.isExpired) {
          router.push("/dashboard")
          return
        }
      } catch {
        router.push("/login")
      }
    })
  }, [router])

  // Load initial data
  useEffect(() => {
    getSettings().then(s => {
      setSettings(s)
      setWhitelist(s.whitelist || [])
    }).catch(() => {})
    getProxyStatus().then(setProxy).catch(() => {})
    getBotStatus().then(s => setBotStatus(s)).catch(() => {})
  }, [])

  // Poll: logs, chat, status every 1s
  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const [rawLogs, rawChat, status] = await Promise.all([logsPausedRef.current ? Promise.resolve(null) : getLogs(), getChatMessages(), getBotStatus()])
        if (rawLogs) {
          const clearTime = logClearTimeRef.current
          const filtered = clearTime > 0
            ? rawLogs.filter(msg => {
                const ts = msg.substring(1, 9)
                if (!ts || ts.length < 8) return false
                const [h, m, s] = ts.split(":").map(Number)
                const clearDate = new Date(clearTime)
                const logDate = new Date(clearTime)
                logDate.setHours(h, m, s, 0)
                return logDate > clearDate
              })
            : rawLogs
          if (filtered.length > 0 || clearTime === 0) {
            setLogs(filtered.map((msg, i) => {
              let type: LogEntry["type"] = "info"
              if (msg.includes("✅") || msg.toLowerCase().includes("basarili") || msg.toLowerCase().includes("hazir")) type = "success"
              else if (msg.includes("⚠️") || msg.toLowerCase().includes("uyari")) type = "warning"
              else if (msg.includes("🚨") || msg.toLowerCase().includes("hata") || msg.includes("kicked")) type = "error"
              else if (msg.toLowerCase().includes("microsoft") || msg.includes("🔐")) type = "microsoft"
              return { id: `${i}`, timestamp: msg.substring(1, 9) || "", message: msg.substring(11) || msg, type }
            }))
          }
        }
        setChat(prev => {
          const selfMsgs = prev.filter((m: any) => m.self)
          const serverMsgs = rawChat.map((m, i) => ({ id: `server_${i}`, timestamp: new Date().toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"}), ...m }))
          // Self mesajları server'dan gelmişse kaldır
          const filtered = selfMsgs.filter((sm: any) => 
            !serverMsgs.some(s => s.username === sm.username && s.message === sm.message)
          )
          return [...serverMsgs, ...filtered].sort(() => 0)
        })
        setBotStatus(status)
      } catch {}
    }, 1000)
    return () => clearInterval(id)
  }, [])

  // Auto-scroll logs
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [logs])

  // Auto-scroll chat
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [chat])

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
      await saveSettings({ host: settings.host, port: settings.port, version: settings.version, mc_username: settings.mc_username })
      showToast("Ayarlar kaydedildi!")
      setSettingsSaved(true)
      setTimeout(() => setSettingsSaved(false), 2000)
    } catch (err: any) { showToast(err.message, false) }
  }

  const handleTogglePanic = async () => {
    const r = await togglePanic()
    setSettings(s => ({ ...s, panicEnabled: r.enabled }))
    setBotStatus(b => ({ ...b, panicEnabled: r.enabled }))
  }
  const handleToggleReconnect = async () => {
    const r = await toggleReconnect()
    setSettings(s => ({ ...s, autoReconnect: r.enabled }))
  }
  const handleToggleProxy = async () => {
    const r = await toggleProxy()
    setProxy(r)
  }

  const handleSpawnerDrop = async () => {
    if (dropperRunning) {
      try { await fetch(\`\${process.env.NEXT_PUBLIC_API_URL || ""}/api/spawner-drop/stop\`, { method:"POST", headers:{"x-token": localStorage.getItem("token")||"" } }) } catch {}
      setDropperRunning(false)
      setLootMsg({ text: "Dropper durduruldu.", ok: false })
      return
    }
    setLootLoading(true); setLootMsg(null)
    try {
      const res = await fetch(\`\${process.env.NEXT_PUBLIC_API_URL || ""}/api/spawner-drop\`, { method:"POST", headers:{"x-token": localStorage.getItem("token")||"", "Content-Type":"application/json" } })
      const data = await res.json()
      if (data.success) { setDropperRunning(true); setLootMsg({ text: data.message, ok: true }) }
      else setLootMsg({ text: data.error || "Hata!", ok: false })
    } catch (err: any) { setLootMsg({ text: err.message, ok: false }) }
    finally { setLootLoading(false) }
  }

  const handleSendChat = async () => {
    if (!chatInput.trim()) return
    const msg = chatInput.trim()
    // Kendi mesajını hemen göster
    setChat(prev => [...prev, { id: Date.now().toString(), username: username, message: msg, self: true, timestamp: new Date().toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"}) } as any])
    setChatInput("")
    try { await sendChat(msg) } catch {}
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

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background noise-overlay">
        {/* Topbar */}
        <header className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/90 backdrop-blur-xl">
          <div className="flex h-14 items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <ErosLogo size="sm" />
              <span className="ml-1 text-xs text-muted-foreground">Client v4.0</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className={cn("h-2 w-2 rounded-full", botStatus.running && botStatus.ready ? "bg-emerald-500 pulse-online" : "bg-muted-foreground")} />
                <span className="text-sm text-muted-foreground">
                  {t("panel_welcome")} <span className="text-foreground font-medium">{username}</span>
                </span>
              </div>
              <LangSwitcher />
              <Button variant="ghost" size="sm" onClick={handleLogout}
                className="text-muted-foreground hover:text-destructive">
                <LogOut className="h-4 w-4" /><span className="ml-2 hidden sm:inline">{t("panel_logout")}</span>
              </Button>
            </div>
          </div>
        </header>

        <main className="container px-4 pt-20 pb-8">
          {/* Status Cards */}
          <div className="mb-6 grid gap-3 grid-cols-2 sm:grid-cols-4">
            {[
              { title: t("panel_bot_status"), value: botStatus.running ? (botStatus.ready ? t("panel_active") : "Baglanıyor") : botStatus.waiting ? t("panel_waiting") : "Kapali", sub: botStatus.ready ? t("panel_protection") : botStatus.waiting ? t("panel_reconnecting") : t("panel_waiting"), icon: <Activity className="h-4 w-4" />, color: botStatus.ready ? "text-emerald-400" : botStatus.running ? "text-amber-400" : "text-muted-foreground" },
              { title: t("panel_panic_dist"), value: `${settings.panicDistance} blok`, sub: settings.panicEnabled ? t("panel_active") : "Kapali", icon: <Shield className="h-4 w-4" />, color: "text-cyan-400" },
              { title: t("panel_whitelist"), value: `${whitelist.length} Oyuncu`, sub: "Guvenli liste", icon: <Users className="h-4 w-4" />, color: "text-cyan-400" },
              { title: t("panel_proxy"), value: proxy.enabled ? t("panel_active") : "Kapali", sub: proxy.enabled ? `${proxy.host}:${proxy.port}` : "Direkt baglanti", icon: <Globe className="h-4 w-4" />, color: proxy.enabled ? "text-emerald-400" : "text-amber-400" },
            ].map((card, i) => (
              <div key={i} className="glass-card rounded-xl p-4">
                <div className="mb-2 flex items-center gap-2 text-muted-foreground">{card.icon}<span className="text-xs">{card.title}</span></div>
                <div className={cn("text-lg font-bold", card.color)}>{card.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{card.sub}</div>
              </div>
            ))}
          </div>

          {/* Koordinat Kartı */}
          {botStatus.coordinates && (
            <div className="mb-4 rounded-xl border border-violet-500/20 bg-violet-500/5 px-5 py-3 flex items-center gap-4"
              style={{animation: "fadeIn 0.4s ease"}}>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{color:"#a78bfa"}}>
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>
                </svg>
                <span style={{color:"#c4b5fd"}} className="font-semibold">Koordinat</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-sm">
                {(() => {
                  const fmt = (n: number) => Math.abs(n) >= 1000 ? (n/1000).toFixed(1) + "k" : n.toString()
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

          {/* Bot Controls + Tabs */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left — Controls */}
            <div className="space-y-4 lg:col-span-1">
              {/* Start/Stop */}
              <div className="glass-card rounded-xl p-4">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  <Shield className="h-4 w-4 text-cyan-400" />Bot Kontrolleri
                </h3>
                <div className="flex gap-3">
                  <Button onClick={handleStart} disabled={botStatus.running}
                    className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700 border-0">
                    <Play className="h-4 w-4" />Basalt
                  </Button>
                  <Button onClick={handleStop} disabled={!botStatus.running}
                    variant="destructive" className="flex-1 gap-2">
                    <Square className="h-4 w-4" />Durdur
                  </Button>
                </div>
                {settings.host && (
                  <div className="mt-3 flex items-center gap-2 rounded-lg border border-border/50 bg-card/30 px-3 py-2">
                    <div className={cn("h-2 w-2 rounded-full", botStatus.running ? "bg-emerald-500" : botStatus.waiting ? "bg-amber-500 animate-pulse" : "bg-muted-foreground")} />
                    <div>
                      <span className="text-sm text-foreground truncate block">{settings.host}</span>
                      {botStatus.waiting && <span className="text-xs text-amber-400">Yeniden bağlanıyor...</span>}
                    </div>
                  </div>
                )}
              </div>

              {/* Security toggles */}
              <div className="glass-card rounded-xl p-4">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />Guvenlik
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Panik Cikis</Label>
                    <Switch checked={settings.panicEnabled} onCheckedChange={handleTogglePanic} />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-2">
                      <span>Panik Mesafesi</span>
                      <span className="font-mono text-amber-400">{settings.panicDistance} blok</span>
                    </div>
                    <Slider value={[settings.panicDistance]} min={1} max={30} step={1}
                      disabled={!settings.panicEnabled}
                      onValueChange={([v]) => setSettings(s => ({ ...s, panicDistance: v }))}
                      onValueCommit={([v]) => setPanicDistance(v)}
                      className="[&_[role=slider]]:bg-amber-500" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-2">
                      <span>Algilama Mesafesi</span>
                      <span className="font-mono text-cyan-400">{settings.detectionDistance} blok</span>
                    </div>
                    <Slider value={[settings.detectionDistance]} min={10} max={120} step={5}
                      onValueChange={([v]) => setSettings(s => ({ ...s, detectionDistance: v }))}
                      onValueCommit={([v]) => setDetectionDistance(v)}
                      className="[&_[role=slider]]:bg-cyan-500" />
                  </div>
                </div>
              </div>

              {/* Connection toggles */}
              <div className="glass-card rounded-xl p-4">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  <Globe className="h-4 w-4 text-blue-400" />Baglanti
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 text-muted-foreground" />
                      <Label className="text-sm font-medium">{t("panel_auto_reconnect")}</Label>
                    </div>
                    <Switch checked={settings.autoReconnect} onCheckedChange={handleToggleReconnect} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wifi className="h-4 w-4 text-muted-foreground" />
                      <Label className="text-sm font-medium">Proxy</Label>
                    </div>
                    <Switch checked={proxy.enabled} onCheckedChange={handleToggleProxy} />
                  </div>
                  {!proxy.enabled && (
                    <div className="flex items-center gap-2 rounded border border-destructive/30 bg-destructive/10 p-2 text-xs text-destructive">
                      <AlertTriangle className="h-3 w-3" />Proxy kapali — Direkt baglanti aktif (Riskli)
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right — Tabs */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="terminal" className="w-full">
                <TabsList className="glass-card mb-4 h-auto w-full flex-wrap justify-start gap-1 rounded-xl p-1">
                  {[
                    { value:"terminal", icon:<TerminalIcon className="h-4 w-4"/>, label:"Terminal" },
                    { value:"security", icon:<Shield className="h-4 w-4"/>, label:"Guvenlik" },
                    { value:"connection", icon:<Link2 className="h-4 w-4"/>, label:"Baglanti" },
                    { value:"chat", icon:<MessageSquare className="h-4 w-4"/>, label:"Chat & SSS" },
                    { value:"integrations", icon:<Zap className="h-4 w-4"/>, label:"Entegrasyonlar" },
                  ].map(t => (
                    <TabsTrigger key={t.value} value={t.value}
                      className="rounded-lg data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-400">
                      {t.icon}<span className="ml-2">{t.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* TERMINAL */}
                <TabsContent value="terminal" className="mt-0">
                  <div className="glass-card rounded-xl p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <TerminalIcon className="h-4 w-4 text-cyan-400" />Konsol Ciktisi
                      </h3>
                      <Button variant="ghost" size="sm" onClick={() => { logClearTimeRef.current = Date.now(); setLogs([{ id:"clear", timestamp: new Date().toLocaleTimeString("tr-TR"), message: "─── Terminal temizlendi ───", type:"info" }]); logsPausedRef.current = true; setTimeout(() => { logsPausedRef.current = false }, 3000) }}
                        className="text-muted-foreground hover:text-foreground">
                        <Trash2 className="mr-2 h-3 w-3" />Temizle
                      </Button>
                    </div>
                    <div ref={logRef} className="h-[400px] overflow-y-auto rounded-lg border border-border/50 bg-background/50 p-3">
                      <div className="space-y-1 font-mono text-xs">
                        {logs.map(log => (
                          <div key={log.id} className="flex gap-2">
                            <span className="shrink-0 text-muted-foreground">[{log.timestamp}]</span>
                            <span
                              className={cn(
                                log.type === "success" && "text-emerald-400",
                                log.type === "warning" && "text-amber-400",
                                log.type === "error" && "text-red-400",
                                log.type === "microsoft" && "text-cyan-400",
                                log.type === "info" && "text-muted-foreground",
                              )}
                              dangerouslySetInnerHTML={{ __html: log.message }}
                            />
                          </div>
                        ))}
                        {!logs.length && <p className="text-muted-foreground">Henuz log yok...</p>}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* CHAT & SSS */}
                <TabsContent value="chat" className="mt-0">
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="glass-card rounded-xl p-4">
                      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                        <MessageSquare className="h-4 w-4 text-cyan-400" />Oyun Chati
                      </h3>
                      <ScrollArea className="h-[250px] rounded-lg border border-border/50 bg-background/50 p-3">
                        <div className="space-y-2">
                          {chat.map(m => (
                            <div key={m.id} className="text-sm">
                              <span className="font-medium text-cyan-400">{m.username}: </span>
                              <span className="text-foreground">{m.message}</span>
                            </div>
                          ))}
                          {!chat.length && <p className="text-sm text-muted-foreground">Henuz mesaj yok...</p>}
                        </div>
                      </ScrollArea>
                      <div className="mt-3 flex gap-2">
                        <Input placeholder={t("panel_msg_ph")} value={chatInput}
                          onChange={e => setChatInput(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && handleSendChat()}
                          className="border-border/50 bg-card/50" />
                        <Button onClick={handleSendChat} size="icon" className="cyber-button shrink-0 border-0">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="glass-card rounded-xl p-4">
                      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                        <HelpCircle className="h-4 w-4 text-cyan-400" />Sikca Sorulan Sorular
                      </h3>
                      <ScrollArea className="h-[320px]">
                        <Accordion type="single" collapsible className="w-full">
                          {faqItems.map(item => (
                            <AccordionItem key={item.id} value={item.id} className="border-border/50">
                              <AccordionTrigger className="text-left text-sm text-foreground hover:text-cyan-400 hover:no-underline">
                                {item.question}
                              </AccordionTrigger>
                              <AccordionContent className="text-sm text-muted-foreground">
                                {item.answer}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </ScrollArea>
                    </div>
                  </div>
                </TabsContent>

                {/* CONNECTION */}
                <TabsContent value="connection" className="mt-0">
                  <div className="glass-card rounded-xl p-4">
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
                      <Server className="h-4 w-4 text-cyan-400" />Baglanti Ayarlari
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">{t("panel_server_ip")}</Label>
                        <Input placeholder="play.sunucu.com" value={settings.host}
                          onChange={e => setSettings(s => ({ ...s, host: e.target.value }))}
                          className="border-border/50 bg-card/50" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Port</Label>
                        <Input type="number" placeholder="25565" value={settings.port}
                          onChange={e => setSettings(s => ({ ...s, port: parseInt(e.target.value) || 25565 }))}
                          className="border-border/50 bg-card/50" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">{t("panel_version")}</Label>
                        <Input placeholder="1.21.1" value={settings.version}
                          onChange={e => setSettings(s => ({ ...s, version: e.target.value }))}
                          className="border-border/50 bg-card/50" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">{t("panel_ms_email")}</Label>
                        <Input type="email" placeholder="ornek@hotmail.com" value={settings.mc_username}
                          onChange={e => setSettings(s => ({ ...s, mc_username: e.target.value }))}
                          className="border-border/50 bg-card/50" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                      <Button onClick={handleSaveSettings} className="cyber-button border-0 text-primary-foreground">
                        Kaydet
                      </Button>
                      {settingsSaved && <span className="text-sm text-emerald-400">✓ Kaydedildi</span>}
                    </div>

                    <div className="mt-4 h-px bg-border/50" />

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-lg border border-border/50 bg-card/30 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">
                            <RefreshCw className={cn("h-5 w-5 text-cyan-400", botStatus.waiting && "animate-spin")} />
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Otomatik Reconnect</Label>
                            <p className="text-xs text-muted-foreground">Baglanti kopunca tekrar baglan</p>
                            {botStatus.waiting && (
                              <div className="mt-1.5 flex items-center gap-1.5">
                                <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                                <span className="text-xs font-medium text-amber-400">Yeniden bağlanıyor...</span>
                              </div>
                            )}
                            {botStatus.running && botStatus.ready && (
                              <div className="mt-1.5 flex items-center gap-1.5">
                                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                <span className="text-xs font-medium text-emerald-400">Hazır</span>
                              </div>
                            )}
                            {!botStatus.running && !botStatus.waiting && (
                              <div className="mt-1.5 flex items-center gap-1.5">
                                <span className="inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                                <span className="text-xs text-muted-foreground">Bekleniyor</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <Switch checked={settings.autoReconnect} onCheckedChange={handleToggleReconnect} />
                      </div>
                      <div className="rounded-lg border border-border/50 bg-card/30 p-4 flex items-center gap-3">
                        <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", proxy.enabled ? "bg-emerald-500/10" : "bg-amber-500/10")}>
                          <Wifi className={cn("h-5 w-5", proxy.enabled ? "text-emerald-400" : "text-amber-400")} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Proxy Durumu</p>
                          <p className="text-xs text-muted-foreground">
                            {proxy.enabled ? `${proxy.host}:${proxy.port} — Aktif` : "Proxy kapali"}
                          </p>
                        </div>
                        <div className={cn("rounded-full px-3 py-1 text-xs font-medium", proxy.enabled ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400")}>
                          {proxy.enabled ? "Guvenli" : t("panel_risky")}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* SECURITY */}
                <TabsContent value="security" className="mt-0">
                  <div className="space-y-4">
                    <div className="glass-card rounded-xl p-4">
                      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
                        <Eye className="h-4 w-4 text-cyan-400" />Algilama Ayarlari
                      </h3>
                      <div className="space-y-6">
                        <div>
                          <div className="mb-3 flex items-center justify-between">
                            <Label className="text-sm text-muted-foreground">Algilama Mesafesi</Label>
                            <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-sm font-medium text-cyan-400">{settings.detectionDistance} blok</span>
                          </div>
                          <Slider value={[settings.detectionDistance]} min={10} max={100} step={5}
                            onValueChange={([v]) => setSettings(s => ({ ...s, detectionDistance: v }))}
                            onValueCommit={([v]) => setDetectionDistance(v)}
                            className="[&_[role=slider]]:bg-cyan-500" />
                          <div className="mt-1 flex justify-between text-xs text-muted-foreground"><span>10 blok</span><span>100 blok</span></div>
                        </div>
                        <div>
                          <div className="mb-3 flex items-center justify-between">
                            <Label className="text-sm text-muted-foreground">Panik Mesafesi</Label>
                            <span className="rounded-full bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-400">{settings.panicDistance} blok</span>
                          </div>
                          <Slider value={[settings.panicDistance]} min={3} max={20} step={1}
                            disabled={!settings.panicEnabled}
                            onValueChange={([v]) => setSettings(s => ({ ...s, panicDistance: v }))}
                            onValueCommit={([v]) => setPanicDistance(v)}
                            className="[&_[role=slider]]:bg-amber-500" />
                          <div className="mt-1 flex justify-between text-xs text-muted-foreground"><span>3 blok</span><span>20 blok</span></div>
                        </div>
                      </div>
                    </div>

                    <div className="glass-card rounded-xl p-4">
                      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
                        <Users className="h-4 w-4 text-cyan-400" />Beyaz Liste (Whitelist)
                      </h3>
                      <p className="mb-4 text-xs text-muted-foreground">Bu listedeki oyuncular algindiginda panik modu tetiklenmez.</p>
                      <div className="mb-4 flex gap-2">
                        <Input placeholder="Oyuncu adi..." value={wlInput}
                          onChange={e => setWlInput(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && handleAddWl()}
                          className="border-border/50 bg-card/50" />
                        <Button onClick={handleAddWl} size="icon" className="cyber-button shrink-0 border-0">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <ScrollArea className="h-[150px]">
                        <div className="space-y-2">
                          {whitelist.map(name => (
                            <div key={name} className="flex items-center justify-between rounded-lg border border-border/50 bg-card/30 px-3 py-2">
                              <span className="text-sm text-foreground">{name}</span>
                              <Button variant="ghost" size="icon" onClick={() => handleRemoveWl(name)}
                                className="h-6 w-6 text-muted-foreground hover:text-destructive">
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                          {!whitelist.length && <p className="text-center text-sm text-muted-foreground">Beyaz liste bos.</p>}
                        </div>
                      </ScrollArea>
                    </div>

                    {!proxy.enabled && (
                      <div className="flex items-center gap-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
                        <AlertTriangle className="h-5 w-5 shrink-0 text-amber-400" />
                        <div>
                          <p className="text-sm font-medium text-amber-400">Proxy Kapali!</p>
                          <p className="text-xs text-muted-foreground">Direkt baglanti IP banlanma riskini arttirir.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* ENTEGRASYONLAR */}
                <TabsContent value="integrations" className="mt-0">
                  <div className="space-y-4">
                    <div className="glass-card rounded-xl p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", dropperRunning ? "bg-amber-500/10" : "bg-violet-500/10")}>
                          <Zap className={cn("h-5 w-5", dropperRunning ? "text-amber-400 animate-pulse" : "text-violet-400")} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-foreground">Spawner Dropper</h3>
                          <p className="text-xs text-muted-foreground">Bot önündeki spawner&apos;ı açar, sadece bone droplar. Arrow görünce durur.</p>
                        </div>
                        {dropperRunning && (
                          <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse inline-block" />
                            <span className="text-xs text-amber-400 font-medium">Çalışıyor</span>
                          </div>
                        )}
                      </div>
                      <div className="rounded-lg border border-border/50 bg-card/30 p-4 mb-4 space-y-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Bot spawner&apos;ın 6 blok yakınında olmalı</div>
                        <div className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Sadece bone alır, arrow ve diğerlerini bırakır</div>
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
              </Tabs>
            </div>
          </div>
        </main>

        <footer className="border-t border-border/50 bg-card/30 py-4">
          <div className="container px-4 text-center">
            <p className="text-xs text-muted-foreground">2026 Eros AFK Client — v4.0</p>
          </div>
        </footer>

        {/* Toast */}
        {toast && (
          <div className={cn(
            "fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg backdrop-blur-sm",
            toast.ok
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              : "border-destructive/30 bg-destructive/10 text-destructive"
          )}>
            {toast.msg}
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}

export default function PanelPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-500/20 border-t-cyan-500" />
          <p className="text-sm text-muted-foreground">Yukleniyor...</p>
        </div>
      </div>
    }>
      <PanelPageInner />
    </Suspense>
  )
}
