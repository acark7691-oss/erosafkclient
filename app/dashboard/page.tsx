"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Key, Shield, LogOut, Sparkles, AlertTriangle, CheckCircle, Timer, MessageCircle, Mail, RefreshCw, ArrowRight } from "lucide-react"
import { getDashboard, activateKey, resendVerify, logout, enterPanel, checkToken, type DashboardData } from "@/lib/api"
import { ErosLogo } from "@/components/eros-logo"
import { LangSwitcher } from "@/components/lang-switcher"
import { useLang } from "@/lib/lang-context"
import Link from "next/link"

export default function DashboardPage() {
  const router = useRouter()
  const { t } = useLang()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [keyInput, setKeyInput] = useState("")
  const [keyLoading, setKeyLoading] = useState(false)
  const [keyMsg, setKeyMsg] = useState<{ text: string; ok: boolean } | null>(null)
  const [resendMsg, setResendMsg] = useState("")
  const [timeLeft, setTimeLeft] = useState("")

  const fetchData = useCallback(async () => {
    try { const d = await getDashboard(); setData(d) }
    catch { router.push("/login") }
    finally { setLoading(false) }
  }, [router])

  useEffect(() => {
    checkToken().then((v) => { if (!v) router.push("/login"); else fetchData() })
  }, [router, fetchData])

  useEffect(() => {
    if (!data?.expiresAt || data.isUnlimited) return
    const tick = () => {
      const diff = new Date(data.expiresAt!).getTime() - Date.now()
      if (diff <= 0) { setTimeLeft(t("db_expired")); return }
      const d = Math.floor(diff / 86400000), h = Math.floor((diff % 86400000) / 3600000)
      const m = Math.floor((diff % 3600000) / 60000), s = Math.floor((diff % 60000) / 1000)
      setTimeLeft(d > 0 ? `${d}g ${h}s ${m}d` : h > 0 ? `${h}s ${m}d ${s}sn` : `${m}d ${s}sn`)
    }
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id)
  }, [data?.expiresAt, data?.isUnlimited, t])

  const handleActivate = async () => {
    if (!keyInput.trim()) return
    setKeyLoading(true); setKeyMsg(null)
    try { await activateKey(keyInput.trim()); setKeyMsg({ text: t("db_active") + "!", ok: true }); setTimeout(() => fetchData(), 1200) }
    catch (err: any) { setKeyMsg({ text: err.message || "Hata!", ok: false }) }
    finally { setKeyLoading(false) }
  }

  const handleResend = async () => {
    try { const res = await resendVerify(); setResendMsg(res.message) }
    catch (err: any) { setResendMsg(err.message) }
  }

  const handleLogout = async () => { await logout(); router.push("/login") }

  const handleGoPanel = async () => {
    try { const pt = await enterPanel(); router.push(`/panel?pt=${pt}`) }
    catch (err: any) { alert(err.message || "Panel erişilemiyor") }
  }

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-500/20 border-t-cyan-500" />
        <p className="text-sm text-muted-foreground">{t("loading")}</p>
      </div>
    </div>
  )

  const daysRemaining = data?.expiresAt ? Math.ceil((new Date(data.expiresAt).getTime() - Date.now()) / 86400000) : 0

  return (
    <div className="min-h-screen bg-background noise-overlay">
      <nav className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/60 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between px-4">
          <ErosLogo size="md" />
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {t("db_welcome")} <span className="font-medium" style={{ color: "#8b5cf6" }}>{data?.username}</span>
            </span>
            <LangSwitcher />
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
              <LogOut className="h-4 w-4" /><span className="ml-2 hidden sm:inline">{t("panel_logout")}</span>
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 pt-24 pb-16 max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            {t("db_welcome")} <span className="gradient-text">{data?.username}</span>
          </h1>
          <p className="text-muted-foreground">{t("db_sub")}</p>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${data?.email_verified ? "bg-emerald-500/10" : "bg-amber-500/10"}`}>
                <Mail className={`h-5 w-5 ${data?.email_verified ? "text-emerald-400" : "text-amber-400"}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{t("db_email_status")}</p>
                <p className={`font-semibold ${data?.email_verified ? "text-emerald-400" : "text-amber-400"}`}>
                  {data?.email_verified ? t("db_verified") : t("db_not_verified")}
                </p>
              </div>
            </div>
            {data?.email && <p className="text-xs text-muted-foreground mb-2">{data.email}</p>}
            {!data?.email_verified && (
              <div>
                <button onClick={handleResend} className="flex items-center gap-1 text-xs text-cyan-400 hover:underline">
                  <RefreshCw className="h-3 w-3" />{t("db_resend")}
                </button>
                {resendMsg && <p className="text-xs text-emerald-400 mt-1">{resendMsg}</p>}
              </div>
            )}
          </div>

          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${data?.is_active ? "bg-cyan-500/10" : "bg-red-500/10"}`}>
                {data?.is_active ? <CheckCircle className="h-5 w-5 text-cyan-400" /> : <AlertTriangle className="h-5 w-5 text-destructive" />}
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{t("db_license_status")}</p>
                <p className={`font-semibold ${data?.is_active ? "text-cyan-400" : "text-destructive"}`}>
                  {data?.is_active ? t("db_active") : t("db_passive")}
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {data?.hasKey ? data.isExpired ? `⚠️ ${t("db_expired")}` : data.isUnlimited ? t("db_unlimited") : `${daysRemaining} ${t("db_days_left")}` : t("db_no_key")}
            </p>
          </div>
        </div>

        {data?.is_active && !data.isExpired ? (
          <div className="glass-card mb-6 overflow-hidden rounded-2xl p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                  <h2 className="text-lg font-semibold text-foreground">{t("db_account_active")}</h2>
                </div>
                {data.isUnlimited ? (
                  <p className="text-sm text-emerald-400">{t("db_unlimited")}</p>
                ) : (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">{t("db_time_left")}</p>
                    <p className="text-2xl font-bold font-mono text-amber-400">{timeLeft}</p>
                    {data.expiresAt && <p className="text-xs text-muted-foreground mt-1">{new Date(data.expiresAt).toLocaleDateString("tr-TR")}</p>}
                  </div>
                )}
              </div>
              {daysRemaining <= 7 && !data.isUnlimited && (
                <div className="flex items-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/20 px-3 py-2">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  <span className="text-xs text-amber-400">{t("db_expiring_soon")}</span>
                </div>
              )}
            </div>
            {!data.isUnlimited && (
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-card/50">
                <div className={`h-full rounded-full transition-all ${daysRemaining <= 7 ? "bg-amber-500" : "bg-emerald-500"}`}
                  style={{ width: `${Math.min((daysRemaining / 30) * 100, 100)}%` }} />
              </div>
            )}
          </div>
        ) : (
          <div className="glass-card mb-6 overflow-hidden rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10">
                <Key className="h-6 w-6 text-cyan-400" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">{data?.isExpired ? t("db_expired_title") : t("db_activation")}</h2>
                <p className="text-sm text-muted-foreground">{data?.isExpired ? t("db_expired_desc") : t("db_activation_desc")}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Input placeholder="SPW-XXXXXXXXXXXXXXXX" value={keyInput}
                onChange={(e) => setKeyInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && handleActivate()}
                className="border-border/50 bg-card/50 font-mono uppercase" />
              <Button onClick={handleActivate} disabled={keyLoading} className="cyber-button shrink-0 border-0 text-primary-foreground">
                {keyLoading ? "..." : t("db_activate_btn")}
              </Button>
            </div>
            {keyMsg && <p className={`mt-2 text-sm ${keyMsg.ok ? "text-emerald-400" : "text-destructive"}`}>{keyMsg.text}</p>}
            <p className="mt-3 text-xs text-muted-foreground">
              {t("db_no_license")}{" "}
              <a href="https://discord.com/invite/9TdDP2ZM4Q" target="_blank" className="text-cyan-400 hover:underline">{t("db_get_from_discord")}</a>
            </p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Button size="lg" onClick={handleGoPanel} disabled={!data?.is_active || !!data?.isExpired}
            className={`cyber-button h-20 border-0 text-primary-foreground ${(!data?.is_active || data?.isExpired) ? "opacity-50 pointer-events-none" : ""}`}>
            <div className="flex flex-col items-center gap-1">
              <Shield className="h-6 w-6" />
              <span className="text-base font-semibold">{t("db_go_panel")}</span>
              {(!data?.is_active || data?.isExpired) && <span className="text-xs opacity-75">{t("db_license_required")}</span>}
            </div>
          </Button>
          <Button size="lg" variant="outline" asChild className="h-20 border-border/50 bg-card/50 hover:border-cyan-500/50 hover:bg-cyan-500/5">
            <a href="https://discord.com/invite/9TdDP2ZM4Q" target="_blank" className="flex flex-col items-center gap-1">
              <MessageCircle className="h-6 w-6 text-cyan-400" />
              <span className="text-base font-semibold text-foreground">{t("db_discord_btn")}</span>
              <span className="text-xs text-muted-foreground">{t("db_discord_sub")}</span>
            </a>
          </Button>
        </div>
      </main>

      <footer className="border-t border-border/50 bg-card/30 py-6">
        <div className="container px-4 text-center">
          <p className="text-xs text-muted-foreground">{t("panel_footer")}</p>
        </div>
      </footer>
    </div>
  )
}
