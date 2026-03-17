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
  const [username, setUsername] = useState("Eros")
  const [botStatus, setBotStatus] = useState<any>({ running: false, ready: false, panicEnabled: true, panicDistance: 7, detectionDistance: 60, autoReconnect: true, waiting: false })
  const [settings, setSettings] = useState<Settings>({ host: "", port: 25565, version: "1.21.1", mc_username: "", panicEnabled: true, panicDistance: 7, detectionDistance: 60, autoReconnect: true, whitelist: [] })
  const [proxy, setProxy] = useState<ProxyStatus>({ enabled: true, host: "", port: 0 })
  const [logs, setLogs] = useState<LogEntry[]>([{ id:"1", timestamp: new Date().toLocaleTimeString("tr-TR"), message: "Panel baslatildi.", type:"info" }])
  const [chat, setChat] = useState<ChatMessage[]>([])
  const [whitelist, setWhitelist] = useState<string[]>([])
  const [chatInput, setChatInput] = useState("")
  const [wlInput, setWlInput] = useState("")
  const [toast, setToast] = useState<{msg:string;ok:boolean}|null>(null)
  const [settingsSaved, setSettingsSaved] = useState(false)
  const logRef = useRef<HTMLDivElement>(null)

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
        const [rawLogs, rawChat, status] = await Promise.all([getLogs(), getChatMessages(), getBotStatus()])
        setLogs(rawLogs.map((msg, i) => {
          let type: LogEntry["type"] = "info"
          if (msg.includes("✅") || msg.toLowerCase().includes("basarili") || msg.toLowerCase().includes("hazir")) type = "success"
          else if (msg.includes("⚠️") || msg.toLowerCase().includes("uyari")) type = "warning"
          else if (msg.includes("🚨") || msg.toLowerCase().includes("hata") || msg.includes("kicked")) type = "error"
          else if (msg.toLowerCase().includes("microsoft") || msg.includes("🔐")) type = "microsoft"
          return { id: `${i}`, timestamp: msg.substring(1, 9) || "", message: msg.substring(11) || msg, type }
        }))
        setChat(rawChat.map((m, i) => ({ id: `${i}`, ...m })))
        setBotStatus(status)
      } catch {}
    }, 1000)
    return () => clearInterval(id)
  }, [])

  // Auto-scroll logs
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [logs])

  const handleStart = async () => {
    const t = await startBot()
    showToast(t || "Bot baslatildi!")
  }
  const handleStop = async () => {
    const t = await stopBot()
    showToast(t || "Bot durduruldu.")
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

  const handleSendChat = async () => {
    if (!chatInput.trim()) return
    await sendChat(chatInput)
    setChatInput("")
  }

  const handleAddWl = async () => {
    if (!wlInput.trim()) return
    await addToWhitelist(wlInput)
    setWhitelist(w => [...w, wlInput])
    setWlInput("")
  }
  const handleRemoveWl = async (name: string) => {
    await removeFromWhitelist(name)
    setWhitelist(w => w.filter(p => p !== name))
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
                  Hos geldin, <span className="text-foreground font-medium">{username}</span>
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}
                className="text-muted-foreground hover:text-destructive">
                <LogOut className="h-4 w-4" /><span className="ml-2 hidden sm:inline">Cikis</span>
              </Button>
            </div>
          </div>
        </header>

        <main className="container px-4 pt-20 pb-8">
          {/* Status Cards */}
          <div className="mb-6 grid gap-3 grid-cols-2 sm:grid-cols-4">
            {[
              { title: "Bot Durumu", value: botStatus.running ? (botStatus.ready ? "Aktif" : "Baglanıyor") : botStatus.waiting ? "Bekleniyor" : "Kapali", sub: botStatus.ready ? "Koruma aktif" : botStatus.waiting ? "Yeniden bağlanıyor..." : "Bekleniyor", icon: <Activity className="h-4 w-4" />, color: botStatus.ready ? "text-emerald-400" : botStatus.running ? "text-amber-400" : "text-muted-foreground" },
              { title: "Panik Mesafesi", value: `${settings.panicDistance} blok`, sub: settings.panicEnabled ? "Aktif" : "Kapali", icon: <Shield className="h-4 w-4" />, color: "text-cyan-400" },
              { title: "Whitelist", value: `${whitelist.length} Oyuncu`, sub: "Guvenli liste", icon: <Users className="h-4 w-4" />, color: "text-cyan-400" },
              { title: "Proxy", value: proxy.enabled ? "Aktif" : "Kapali", sub: proxy.enabled ? `${proxy.host}:${proxy.port}` : "Direkt baglanti", icon: <Globe className="h-4 w-4" />, color: proxy.enabled ? "text-emerald-400" : "text-amber-400" },
            ].map((card, i) => (
              <div key={i} className="glass-card rounded-xl p-4">
                <div className="mb-2 flex items-center gap-2 text-muted-foreground">{card.icon}<span className="text-xs">{card.title}</span></div>
                <div className={cn("text-lg font-bold", card.color)}>{card.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{card.sub}</div>
              </div>
            ))}
          </div>

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
                      <Label className="text-sm font-medium">Otomatik Reconnect</Label>
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
                    { value:"chat", icon:<MessageSquare className="h-4 w-4"/>, label:"Chat & SSS" },
                    { value:"connection", icon:<Link2 className="h-4 w-4"/>, label:"Baglanti" },
                    { value:"security", icon:<Shield className="h-4 w-4"/>, label:"Guvenlik" },
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
                      <Button variant="ghost" size="sm" onClick={() => setLogs([])}
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
                        <Input placeholder="Mesaj yaz..." value={chatInput}
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
                        <Label className="text-xs text-muted-foreground">Sunucu IP</Label>
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
                        <Label className="text-xs text-muted-foreground">Minecraft Versiyonu</Label>
                        <Input placeholder="1.21.1" value={settings.version}
                          onChange={e => setSettings(s => ({ ...s, version: e.target.value }))}
                          className="border-border/50 bg-card/50" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Microsoft Email</Label>
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
                          {proxy.enabled ? "Guvenli" : "Riskli"}
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
