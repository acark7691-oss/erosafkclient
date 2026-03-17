"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface WhitelistCardProps {
  players: string[]
  onAdd: (name: string) => void
  onRemove: (name: string) => void
  className?: string
}

export function WhitelistCard({ players, onAdd, onRemove, className }: WhitelistCardProps) {
  const [newPlayer, setNewPlayer] = useState("")

  const handleAdd = () => {
    if (newPlayer.trim()) {
      onAdd(newPlayer.trim())
      setNewPlayer("")
    }
  }

  return (
    <div className={cn("rounded-lg border border-border bg-card p-4", className)}>
      <div className="mb-4 flex items-center gap-2">
        <Users className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Beyaz Liste (Whitelist)
        </h3>
        <Badge variant="secondary" className="ml-auto">
          {players.length} Oyuncu
        </Badge>
      </div>

      <div className="mb-3 flex gap-2">
        <Input
          placeholder="Oyuncu adi..."
          value={newPlayer}
          onChange={(e) => setNewPlayer(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="h-9 bg-secondary/50"
        />
        <Button size="sm" onClick={handleAdd} className="h-9 px-3">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="max-h-[200px] space-y-1.5 overflow-y-auto">
        {players.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            Beyaz liste bos
          </p>
        ) : (
          players.map((player) => (
            <div
              key={player}
              className="flex items-center justify-between rounded border border-border/50 bg-secondary/30 px-3 py-2"
            >
              <span className="text-sm font-medium">{player}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(player)}
                className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
