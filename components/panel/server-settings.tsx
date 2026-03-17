"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Server, Save, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface ServerSettingsProps {
  host: string
  port: number
  version: string
  mcUsername: string
  onSave: (settings: { host: string; port: number; version: string; mc_username: string }) => void
  className?: string
}

export function ServerSettings({
  host: initialHost,
  port: initialPort,
  version: initialVersion,
  mcUsername: initialUsername,
  onSave,
  className,
}: ServerSettingsProps) {
  const [host, setHost] = useState(initialHost)
  const [port, setPort] = useState(initialPort)
  const [version, setVersion] = useState(initialVersion)
  const [mcUsername, setMcUsername] = useState(initialUsername)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    onSave({ host, port, version, mc_username: mcUsername })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className={cn("rounded-lg border border-border bg-card p-4", className)}>
      <h3 className="mb-4 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
        <Server className="h-4 w-4 text-primary" />
        Sunucu Baglantisi
      </h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="host" className="text-xs text-muted-foreground">
            Sunucu IP
          </Label>
          <Input
            id="host"
            placeholder="play.example.com"
            value={host}
            onChange={(e) => setHost(e.target.value)}
            className="h-9 bg-secondary/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="port" className="text-xs text-muted-foreground">
            Port
          </Label>
          <Input
            id="port"
            type="number"
            placeholder="25565"
            value={port}
            onChange={(e) => setPort(parseInt(e.target.value) || 25565)}
            className="h-9 bg-secondary/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="version" className="text-xs text-muted-foreground">
            Minecraft Versiyonu
          </Label>
          <Input
            id="version"
            placeholder="1.21.1"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            className="h-9 bg-secondary/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="username" className="text-xs text-muted-foreground">
            Microsoft Email
          </Label>
          <Input
            id="username"
            placeholder="email@hotmail.com"
            value={mcUsername}
            onChange={(e) => setMcUsername(e.target.value)}
            className="h-9 bg-secondary/50"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <Button onClick={handleSave} size="sm" className="gap-2">
          {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saved ? "Kaydedildi" : "Kaydet"}
        </Button>
        {saved && (
          <span className="text-xs text-emerald-500">Ayarlar basariyla kaydedildi!</span>
        )}
      </div>
    </div>
  )
}
