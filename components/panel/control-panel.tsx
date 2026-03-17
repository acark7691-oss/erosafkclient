"use client"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Play, Square, AlertTriangle, Shield, RefreshCw, Globe } from "lucide-react"
import { cn } from "@/lib/utils"

interface ControlPanelProps {
  isRunning: boolean
  isReady: boolean
  panicEnabled: boolean
  panicDistance: number
  detectionDistance: number
  autoReconnect: boolean
  proxyEnabled: boolean
  onStart: () => void
  onStop: () => void
  onTogglePanic: () => void
  onPanicDistanceChange: (value: number) => void
  onDetectionDistanceChange: (value: number) => void
  onToggleReconnect: () => void
  onToggleProxy: () => void
  className?: string
}

export function ControlPanel({
  isRunning,
  isReady,
  panicEnabled,
  panicDistance,
  detectionDistance,
  autoReconnect,
  proxyEnabled,
  onStart,
  onStop,
  onTogglePanic,
  onPanicDistanceChange,
  onDetectionDistanceChange,
  onToggleReconnect,
  onToggleProxy,
  className,
}: ControlPanelProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Bot Controls */}
      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
          <Shield className="h-4 w-4 text-primary" />
          Bot Kontrolleri
        </h3>
        <div className="flex gap-3">
          <Button
            onClick={onStart}
            disabled={isRunning}
            className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700"
          >
            <Play className="h-4 w-4" />
            Baslat
          </Button>
          <Button
            onClick={onStop}
            disabled={!isRunning}
            variant="destructive"
            className="flex-1 gap-2"
          >
            <Square className="h-4 w-4" />
            Durdur
          </Button>
        </div>
      </div>

      {/* Security Settings */}
      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          Guvenlik Ayarlari
        </h3>
        
        <div className="space-y-6">
          {/* Panic Exit */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="panic-toggle" className="text-sm font-medium">
                Panik Cikis
              </Label>
              <Switch
                id="panic-toggle"
                checked={panicEnabled}
                onCheckedChange={onTogglePanic}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Panik Mesafesi</span>
                <span className="font-mono text-amber-500">{panicDistance} blok</span>
              </div>
              <Slider
                value={[panicDistance]}
                onValueChange={([v]) => onPanicDistanceChange(v)}
                min={1}
                max={30}
                step={1}
                disabled={!panicEnabled}
                className="w-full"
              />
            </div>
          </div>

          {/* Detection Distance */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Algilama Mesafesi</span>
              <span className="font-mono text-blue-400">{detectionDistance} blok</span>
            </div>
            <Slider
              value={[detectionDistance]}
              onValueChange={([v]) => onDetectionDistanceChange(v)}
              min={10}
              max={120}
              step={1}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Connection Settings */}
      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
          <Globe className="h-4 w-4 text-blue-400" />
          Baglanti Ayarlari
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="reconnect-toggle" className="text-sm font-medium">
                Otomatik Reconnect
              </Label>
            </div>
            <Switch
              id="reconnect-toggle"
              checked={autoReconnect}
              onCheckedChange={onToggleReconnect}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="proxy-toggle" className="text-sm font-medium">
                Proxy Kullan
              </Label>
            </div>
            <Switch
              id="proxy-toggle"
              checked={proxyEnabled}
              onCheckedChange={onToggleProxy}
            />
          </div>
          
          {!proxyEnabled && (
            <div className="flex items-center gap-2 rounded border border-destructive/30 bg-destructive/10 p-2 text-xs text-destructive">
              <AlertTriangle className="h-3 w-3" />
              Proxy kapali — Direkt baglanti aktif (Riskli)
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
