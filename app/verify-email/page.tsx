"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ErosLogo } from "@/components/eros-logo"
import Link from "next/link"

function VerifyEmailInner() {
  const router = useRouter()
  const params = useSearchParams()
  const token = params.get("token")
  const [status, setStatus] = useState<"loading"|"success"|"error">("loading")
  const [msg, setMsg] = useState("")

  useEffect(() => {
    if (!token) { setStatus("error"); setMsg("Token bulunamadı."); return }
    
    const apiBase = process.env.NEXT_PUBLIC_API_URL || ""
    fetch(`${apiBase}/verify-email?token=${token}`)
      .then(r => r.json())
      .then(data => {
        if (data.success || data.message?.includes("doğruland")) {
          setStatus("success")
          setMsg(data.message || "E-posta adresiniz başarıyla doğrulandı!")
          setTimeout(() => router.push("/dashboard"), 3000)
        } else {
          setStatus("error")
          setMsg(data.error || data.message || "Doğrulama başarısız.")
        }
      })
      .catch(() => { setStatus("error"); setMsg("Sunucuya bağlanılamadı.") })
  }, [token, router])

  return (
    <div className="min-h-screen bg-background noise-overlay flex items-center justify-center">
      <div className="absolute inset-0 grid-pattern" />
      <div className="relative z-10 text-center max-w-md mx-auto px-4">
        <div className="mb-8 flex justify-center">
          <ErosLogo size="lg" />
        </div>
        <div className="glass-card rounded-2xl p-8">
          {status === "loading" && (
            <>
              <Loader2 className="h-12 w-12 text-cyan-400 animate-spin mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-foreground mb-2">Doğrulanıyor...</h2>
              <p className="text-sm text-muted-foreground">E-posta adresiniz doğrulanıyor, lütfen bekleyin.</p>
            </>
          )}
          {status === "success" && (
            <>
              <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-foreground mb-2">Doğrulama Başarılı!</h2>
              <p className="text-sm text-muted-foreground mb-6">{msg}</p>
              <p className="text-xs text-muted-foreground mb-4">3 saniye içinde yönlendiriliyorsunuz...</p>
              <Button asChild className="cyber-button border-0 text-primary-foreground">
                <Link href="/dashboard">Dashboard&apos;a Git</Link>
              </Button>
            </>
          )}
          {status === "error" && (
            <>
              <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-foreground mb-2">Doğrulama Başarısız</h2>
              <p className="text-sm text-muted-foreground mb-6">{msg}</p>
              <Button asChild className="cyber-button border-0 text-primary-foreground">
                <Link href="/dashboard">Dashboard&apos;a Git</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailInner />
    </Suspense>
  )
}
