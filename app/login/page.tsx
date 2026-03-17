"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bot, Eye, EyeOff, User, Lock, Mail, ArrowRight, Sparkles, Shield, MessageCircle } from "lucide-react"
import { login, register, checkToken } from "@/lib/api"

export default function LoginPage() {
  const router = useRouter()
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
    try { await login(loginData.username, loginData.password); router.push("/dashboard") }
    catch (err: any) { setError(err.message || "Giris basarisiz!") }
    finally { setLoading(false) }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError(""); setSuccess("")
    if (regData.password !== regData.confirm) { setError("Sifreler eslesmiyor!"); setLoading(false); return }
    if (regData.password.length < 6) { setError("Sifre en az 6 karakter!"); setLoading(false); return }
    try {
      const res = await register(regData.username, regData.email, regData.password)
      setSuccess(res.message || "Kayit basarili! E-postanizi kontrol edin.")
      setRegData({ username: "", email: "", password: "", confirm: "" })
    } catch (err: any) { setError(err.message || "Kayit basarisiz!") }
    finally { setLoading(false) }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background noise-overlay">
      <div className="absolute inset-0 grid-pattern" />
      <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2">
        <div className="absolute inset-0 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute inset-20 rounded-full bg-emerald-500/10 blur-[100px]" />
      </div>
      <div className="container relative z-10 px-4">
        <div className="mx-auto max-w-md">
          <div className="mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="relative flex h-14 w-14 items-center justify-center">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 opacity-20 blur-sm" />
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/30 bg-card">
                  <Bot className="h-7 w-7 text-cyan-400" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-bold tracking-tight text-foreground">EROS</span>
                <span className="ml-1 text-2xl font-light text-cyan-400">AFK</span>
              </div>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">Minecraft AFK Bot Kontrol Paneli</p>
          </div>

          <div className="glass-card overflow-hidden rounded-2xl p-1">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 rounded-xl bg-card/50 p-1">
                <TabsTrigger value="login" className="rounded-lg data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-400">Giris Yap</TabsTrigger>
                <TabsTrigger value="register" className="rounded-lg data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-400">Kayit Ol</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-6 p-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Kullanici Adi</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input placeholder="Kullanici adinizi girin" value={loginData.username}
                        onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                        className="border-border/50 bg-card/50 pl-10" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Sifre</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input type={showPw ? "text" : "password"} placeholder="Sifrenizi girin"
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
                    {loading ? "Giris yapiliyor..." : "Giris Yap"}<ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="mt-6 p-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Kullanici Adi</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input placeholder="Kullanici adi secin" value={regData.username}
                        onChange={(e) => setRegData({ ...regData, username: e.target.value })}
                        className="border-border/50 bg-card/50 pl-10" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">E-posta</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input type="email" placeholder="email@example.com" value={regData.email}
                        onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                        className="border-border/50 bg-card/50 pl-10" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Sifre</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input type={showPw ? "text" : "password"} placeholder="Sifre belirleyin (min 6)"
                        value={regData.password} onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                        className="border-border/50 bg-card/50 pl-10 pr-10" required />
                      <button type="button" onClick={() => setShowPw(!showPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Sifre Tekrar</Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input type={showPw ? "text" : "password"} placeholder="Sifreyi tekrar girin"
                        value={regData.confirm} onChange={(e) => setRegData({ ...regData, confirm: e.target.value })}
                        className="border-border/50 bg-card/50 pl-10" required />
                    </div>
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  {success && <p className="text-sm text-emerald-400">{success}</p>}
                  <Button type="submit" className="cyber-button w-full border-0 text-primary-foreground" disabled={loading}>
                    {loading ? "Kayit yapiliyor..." : "Kayit Ol"}<Sparkles className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Yardim mi lazim?{" "}
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
