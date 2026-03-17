"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LogOut, User, Bot, Home, FileText, Cpu } from "lucide-react"
import { cn } from "@/lib/utils"

interface HeaderProps {
  username?: string
  isOnline?: boolean
  onLogout?: () => void
  className?: string
}

export function Header({ username = "Kullanici", isOnline = false, onLogout, className }: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-border/50 bg-background/60 backdrop-blur-xl",
        className
      )}
    >
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 opacity-20 blur-sm" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/30 bg-card">
                <Bot className="h-5 w-5 text-cyan-400" />
              </div>
              {isOnline && (
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-emerald-500 pulse-online" />
              )}
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-foreground">EROS</span>
              <span className="ml-1 text-lg font-light text-cyan-400">AFK</span>
            </div>
          </Link>
          
          {/* Navigation */}
          <nav className="hidden items-center gap-6 md:flex">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-cyan-400"
            >
              <Home className="h-4 w-4" />
              Ana Sayfa
            </Link>
            <Link 
              href="/tos" 
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-cyan-400"
            >
              <FileText className="h-4 w-4" />
              Kullanim Sartlari
            </Link>
          </nav>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-3 sm:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10">
              <User className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Hos geldin, </span>
              <span className="font-medium text-foreground">{username}</span>
            </div>
          </div>
          <Badge 
            variant="secondary" 
            className={cn(
              "border px-3 py-1",
              isOnline 
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" 
                : "border-border bg-secondary text-muted-foreground"
            )}
          >
            <span className={cn("mr-2 inline-block h-2 w-2 rounded-full", isOnline ? "bg-emerald-500 pulse-online" : "bg-muted-foreground")} />
            {isOnline ? "Online" : "Offline"}
          </Badge>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onLogout} 
            className="gap-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Cikis</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
