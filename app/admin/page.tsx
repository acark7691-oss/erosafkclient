"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ErosLogo } from "@/components/eros-logo"
import { LangSwitcher } from "@/components/lang-switcher"
import { 
  Users, Key, Plus, Trash2, LogOut, RefreshCw, 
  Shield, AlertTriangle, Copy, Check, Lock
} from "lucide-react"
import { cn } from "@/lib/utils"

const API = process.env.NEXT_PUBLIC_API_URL || ""

function apiFetch(path: string, opts: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : ""
  return fetch(API + path, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      "x-admin-token": token,
      ...(opts.headers || {})
    }
  }).then(r => r.json())
}

export default function AdminPage() {
  const router = useRouter()
  const [authed, setAuthed] = useState(false)
  const [loginData, setLoginData] = useState({ username: "", password: "" })
  const [loginErr, setLoginErr] = useState("")
  const [tab, setTab] = useState<"users"|"keys">("users")
  const [users, setUsers] = useState<any[]>([])
  const [keys, setKeys] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{msg:string;ok:boolean}|null>(null)
  const [newKey, setNewKey] = useState<{days:string;note:string}>({days:"30", note:""})
  const [generatedKey, setGeneratedKey] = useState("")
  const [copied, setCopied] = useState(false)
  const [resetUser, setResetUser] = useState<{id:string;pass:string}|null>(null)

  const showToast = (msg: string, ok = true) => {
    setToast({msg, ok})
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    const t = localStorage.getItem("admin_token")
    if (t) setAuthed(true)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginErr("")
    try {
      const res = await fetch(API + "/api/admin/login", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(loginData)
      }).then(r => r.json())
      if (res.token) {
        localStorage.setItem("admin_token", res.token)
        setAuthed(true)
      } else {
        setLoginErr(res.error || "Hatalı bilgiler!")
      }
    } catch { setLoginErr("Bağlantı hatası!") }
  }

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [u, k] = await Promise.all([
        apiFetch("/api/admin/users"),
        apiFetch("/api/admin/keys")
      ])
      setUsers(Array.isArray(u) ? u : u.users || [])
      setKeys(Array.isArray(k) ? k : k.keys || [])
    } catch {}
    setLoading(false)
  }, [])

  useEffect(() => { if (authed) fetchData() }, [authed, fetchData])

  const handleGenerateKey = async () => {
    try {
      const res = await apiFetch("/api/admin/generate-key", {
        method: "POST",
        body: JSON.stringify({ days: parseInt(newKey.days) || 30, note: newKey.note })
      })
      if (res.key) {
        setGeneratedKey(res.key)
        showToast("Key oluşturuldu!")
        fetchData()
      } else showToast(res.error || "Hata!", false)
    } catch { showToast("Hata!", false) }
  }

  const handleDeactivate = async (userId: string) => {
    if (!confirm("Bu kullanıcıyı deaktive etmek istiyor musun?")) return
    try {
      const res = await apiFetch("/api/admin/deactivate", { method:"POST", body: JSON.stringify({userId}) })
      showToast(res.message || "Deaktive edildi!")
      fetchData()
    } catch { showToast("Hata!", false) }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Bu kullanıcıyı SİLMEK istiyor musun? Geri alınamaz!")) return
    try {
      const res = await apiFetch("/api/admin/delete-user", { method:"POST", body: JSON.stringify({userId}) })
      showToast(res.message || "Silindi!")
      fetchData()
    } catch { showToast("Hata!", false) }
  }

  const handleDeleteKey = async (key: string) => {
    if (!confirm("Bu key'i silmek istiyor musun?")) return
    try {
      const res = await apiFetch("/api/admin/delete-key", { method:"POST", body: JSON.stringify({key}) })
      showToast(res.message || "Key silindi!")
      fetchData()
    } catch { showToast("Hata!", false) }
  }

  const handleResetPassword = async () => {
    if (!resetUser) return
    try {
      const res = await apiFetch("/api/admin/reset-password", { method:"POST", body: JSON.stringify({userId: resetUser.id, newPassword: resetUser.pass}) })
      showToast(res.message || "Şifre sıfırlandı!")
      setResetUser(null)
    } catch { showToast("Hata!", false) }
  }

  const copyKey = (k: string) => {
    navigator.clipboard.writeText(k)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleLogout = () => {
    localStorage.removeItem("admin_token")
    setAuthed(false)
  }

  if (!authed) return (
    <div className="min-h-screen bg-background noise-overlay flex items-center justify-center">
      <div className="absolute inset-0 grid-pattern" />
      <div className="relative z-10 w-full max-w-sm px-4">
        <div className="mb-8 flex justify-center"><ErosLogo size="lg" /></div>
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="h-5 w-5 text-cyan-400" />
            <h1 className="text-lg font-bold text-foreground">Admin Paneli</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input placeholder="Kullanıcı adı" value={loginData.username}
              onChange={e => setLoginData(p => ({...p, username: e.target.value}))}
              className="border-border/50 bg-card/50" />
            <Input type="password" placeholder="Şifre" value={loginData.password}
              onChange={e => setLoginData(p => ({...p, password: e.target.value}))}
              className="border-border/50 bg-card/50" />
            {loginErr && <p className="text-xs text-destructive">{loginErr}</p>}
            <Button type="submit" className="cyber-button w-full border-0 text-primary-foreground">
              Giriş Yap
            </Button>
          </form>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background noise-overlay">
      {toast && (
        <div className={cn("fixed top-4 right-4 z-50 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg",
          toast.ok ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-destructive/30 bg-destructive/10 text-destructive")}>
          {toast.msg}
        </div>
      )}

      <header className="fixed top-0 z-40 w-full border-b border-border/50 bg-background/60 backdrop-blur-xl">
        <div className="flex h-14 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <ErosLogo size="sm" />
            <span className="text-xs text-muted-foreground">Admin Panel</span>
          </div>
          <div className="flex items-center gap-3">
            <LangSwitcher />
            <Button variant="ghost" size="sm" onClick={fetchData} disabled={loading}
              className="text-muted-foreground">
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-20 pb-8 max-w-6xl">
        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Toplam Kullanıcı", value: users.length, icon: Users, color: "text-cyan-400" },
            { label: "Aktif Kullanıcı", value: users.filter(u => u.is_active).length, icon: Shield, color: "text-emerald-400" },
            { label: "Toplam Key", value: keys.length, icon: Key, color: "text-violet-400" },
            { label: "Kullanılan Key", value: keys.filter(k => k.used_by).length, icon: Check, color: "text-amber-400" },
          ].map((s, i) => (
            <div key={i} className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                <s.icon className={cn("h-4 w-4", s.color)} />
                <span className="text-xs">{s.label}</span>
              </div>
              <div className={cn("text-2xl font-bold", s.color)}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Key Oluştur */}
        <div className="glass-card rounded-xl p-5 mb-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold mb-4">
            <Plus className="h-4 w-4 text-cyan-400" />Yeni Lisans Key Oluştur
          </h2>
          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Gün</label>
              <Input value={newKey.days} onChange={e => setNewKey(p => ({...p, days: e.target.value}))}
                className="border-border/50 bg-card/50 w-24" placeholder="30" />
            </div>
            <div className="flex-1 min-w-40">
              <label className="text-xs text-muted-foreground mb-1 block">Not (opsiyonel)</label>
              <Input value={newKey.note} onChange={e => setNewKey(p => ({...p, note: e.target.value}))}
                className="border-border/50 bg-card/50" placeholder="Discord: @kullanici" />
            </div>
            <Button onClick={handleGenerateKey} className="cyber-button border-0 text-primary-foreground shrink-0">
              <Plus className="h-4 w-4 mr-1" />Oluştur
            </Button>
          </div>
          {generatedKey && (
            <div className="mt-4 flex items-center gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
              <code className="flex-1 font-mono text-sm text-emerald-400">{generatedKey}</code>
              <Button variant="ghost" size="icon" onClick={() => copyKey(generatedKey)} className="shrink-0">
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button onClick={() => setTab("users")}
            className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              tab === "users" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "text-muted-foreground hover:text-foreground")}>
            <Users className="h-4 w-4" />Kullanıcılar ({users.length})
          </button>
          <button onClick={() => setTab("keys")}
            className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              tab === "keys" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "text-muted-foreground hover:text-foreground")}>
            <Key className="h-4 w-4" />Keyler ({keys.length})
          </button>
        </div>

        {/* Kullanıcılar */}
        {tab === "users" && (
          <div className="glass-card rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 text-left">
                  <th className="px-4 py-3 text-xs text-muted-foreground font-medium">Kullanıcı</th>
                  <th className="px-4 py-3 text-xs text-muted-foreground font-medium">E-posta</th>
                  <th className="px-4 py-3 text-xs text-muted-foreground font-medium">Durum</th>
                  <th className="px-4 py-3 text-xs text-muted-foreground font-medium">Kayıt</th>
                  <th className="px-4 py-3 text-xs text-muted-foreground font-medium">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u.id || i} className="border-b border-border/20 hover:bg-card/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{u.username}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{u.email || "-"}</td>
                    <td className="px-4 py-3">
                      <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full",
                        u.is_active ? "bg-emerald-500/10 text-emerald-400" : "bg-muted/50 text-muted-foreground")}>
                        {u.is_active ? "Aktif" : "Pasif"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString("tr-TR") : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => setResetUser({id: u.id, pass: ""})}
                          className="h-7 px-2 text-xs text-muted-foreground hover:text-amber-400">
                          <Lock className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeactivate(u.id)}
                          className="h-7 px-2 text-xs text-muted-foreground hover:text-amber-400">
                          <AlertTriangle className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(u.id)}
                          className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground text-sm">Kullanıcı yok</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Keyler */}
        {tab === "keys" && (
          <div className="glass-card rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 text-left">
                  <th className="px-4 py-3 text-xs text-muted-foreground font-medium">Key</th>
                  <th className="px-4 py-3 text-xs text-muted-foreground font-medium">Durum</th>
                  <th className="px-4 py-3 text-xs text-muted-foreground font-medium">Kullanan</th>
                  <th className="px-4 py-3 text-xs text-muted-foreground font-medium">Bitiş</th>
                  <th className="px-4 py-3 text-xs text-muted-foreground font-medium">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {keys.map((k, i) => (
                  <tr key={k.key || i} className="border-b border-border/20 hover:bg-card/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-foreground">{k.key}</td>
                    <td className="px-4 py-3">
                      <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full",
                        k.used_by ? "bg-amber-500/10 text-amber-400" : "bg-emerald-500/10 text-emerald-400")}>
                        {k.used_by ? "Kullanıldı" : "Kullanılmadı"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{k.used_by || "-"}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {k.expires_at ? new Date(k.expires_at).toLocaleDateString("tr-TR") : "Sınırsız"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => copyKey(k.key)}
                          className="h-7 px-2 text-xs text-muted-foreground hover:text-cyan-400">
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteKey(k.key)}
                          className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {keys.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground text-sm">Key yok</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Şifre Sıfırla Modal */}
        {resetUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="glass-card rounded-2xl p-6 w-full max-w-sm mx-4">
              <h3 className="text-sm font-semibold mb-4">Şifre Sıfırla</h3>
              <Input placeholder="Yeni şifre" type="password" value={resetUser.pass}
                onChange={e => setResetUser(p => p ? {...p, pass: e.target.value} : null)}
                className="border-border/50 bg-card/50 mb-4" />
              <div className="flex gap-2">
                <Button onClick={handleResetPassword} className="cyber-button flex-1 border-0 text-primary-foreground text-sm">
                  Sıfırla
                </Button>
                <Button variant="ghost" onClick={() => setResetUser(null)} className="flex-1 text-sm">
                  İptal
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
