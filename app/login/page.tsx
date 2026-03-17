"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, User, Lock, Mail, ArrowRight, Sparkles, Shield, MessageCircle, Home } from "lucide-react"
import { login, register, checkToken } from "@/lib/api"
import { ErosLogo } from "@/components/eros-logo"
import { LangSwitcher } from "@/components/lang-switcher"
import { useLang } from "@/lib/use-lang"

export default function LoginPage() {
  const router = useRouter()
  const { t } = useLang()
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loginData, setLoginData] = useState({ username: "", password: "" })
  const [regData, setRegData] = useState({ username: "", email: "", password: "", confirm: "" })

  useEffect(() => {
    checkToken().then((v) => { if (v) router.push("/dashboard") })
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("")
    if (!loginData.username || !loginData.password) { setError(t("err_empty")); setLoading(false); return }
    try { await login(loginData.username, loginData.password); router.push("/dashboard") }
    catch (err: any) { setError(err.message || t("err_empty")) }
    finally { setLoading(false) }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError(""); setSuccess("")
    if (regData.password !== regData.confirm) { setError(t("err_mismatch")); setLoading(false); return }
    if (regData.password.length < 6) { setError(t("err_short")); setLoading(false); return }
    try {
      const res = await register(regData.username, regData.email, regData.password)
      setSuccess(res.message || "Kayıt başarılı!")
      setRegData({ username: "", email: "", password: "", confirm: "" })
    } catch (err: any) { setError(err.message || t("err_empty")) }
    finally { setLoading(false) }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background noise-overlay">
      <div className="absolute inset-0 grid-pattern" />
      <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2">
        <div className="absolute inset-0 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute inset-20 rounded-full bg-emerald-500/10 blur-[100px]" />
      </div>

      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 border-b border-border/50 bg-background/60 backdrop-blur-xl">
        <ErosLogo size="sm" />
        <div className="flex items-center gap-3">
          <LangSwitcher />
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-violet-500/20 bg-violet-500/5 text-sm text-violet-400 hover:bg-violet-500/10 hover:border-violet-500/40 transition-all duration-200 group"
          >
            <Home className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>{t("nav_back")}</span>
          </Link>
        </div>
      </div>

      <div className="container relative z-10 px-4 pt-16">
        <div className="mx-auto max-w-md">
          <div className="mb-8 text-center">
            <p className="text-sm text-muted-foreground">{t("login_title")}</p>
          </div>

          <div className="glass-card overflow-hidden rounded-2xl p-1">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 rounded-xl bg-card/50 p-1">
                <TabsTrigger value="login" className="rounded-lg data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-400">{t("login_tab")}</TabsTrigger>
                <TabsTrigger value="register" className="rounded-lg data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-400">{t("register_tab")}</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-6 p-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">{t("login_user")}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input placeholder={t("login_user_ph")} value={loginData.username}
                        onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                        className="border-border/50 bg-card/50 pl-10" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">{t("login_pass")}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input type={showPw ? "text" : "password"} placeholder={t("login_pass_ph")}
                        value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        className="border-border/50 bg-card/50 pl-10 pr-10" required />
                      <button type="button" onClick={() => setShowPw(!showPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button type="submit" className="cyber-button w-full border-0 text-primary-foreground" disabled={loading}>
                    {loading ? t("login_loading") : t("login_btn")}<ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="mt-6 p-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">{t("login_user")}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input placeholder={t("reg_user_ph")} value={regData.username}
                        onChange={(e) => setRegData({ ...regData, username: e.target.value })}
                        className="border-border/50 bg-card/50 pl-10" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">{t("reg_email")}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input type="email" placeholder={t("reg_email_ph")} value={regData.email}
                        onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                        className="border-border/50 bg-card/50 pl-10" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">{t("login_pass")}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input type={showPw ? "text" : "password"} placeholder={t("reg_pass_ph")}
                        value={regData.password} onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                        className="border-border/50 bg-card/50 pl-10 pr-10" required />
                      <button type="button" onClick={() => setShowPw(!showPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">{t("reg_confirm")}</Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input type={showPw ? "text" : "password"} placeholder={t("reg_confirm_ph")}
                        value={regData.confirm} onChange={(e) => setRegData({ ...regData, confirm: e.target.value })}
                        className="border-border/50 bg-card/50 pl-10" required />
                    </div>
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  {success && <p className="text-sm text-emerald-400">{success}</p>}
                  <Button type="submit" className="cyber-button w-full border-0 text-primary-foreground" disabled={loading}>
                    {loading ? t("reg_loading") : t("reg_btn")}<Sparkles className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {t("login_help")}{" "}
              <a href="https://discord.com/invite/9TdDP2ZM4Q" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-cyan-400 hover:underline">
                <MessageCircle className="h-3.5 w-3.5" />Discord
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
