"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageSquare, Send } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatMessage {
  id: string
  username: string
  message: string
}

interface ChatBoxProps {
  messages: ChatMessage[]
  onSend: (message: string) => void
  disabled?: boolean
  className?: string
}

export function ChatBox({ messages, onSend, disabled, className }: ChatBoxProps) {
  const [input, setInput] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim())
      setInput("")
    }
  }

  return (
    <div className={cn("rounded-lg border border-border bg-card p-4", className)}>
      <h3 className="mb-4 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
        <MessageSquare className="h-4 w-4 text-primary" />
        Oyun Ici Chat
      </h3>

      <div
        ref={containerRef}
        className="mb-3 h-[200px] overflow-y-auto rounded border border-border/50 bg-background/50 p-3 terminal-font text-sm"
      >
        {messages.length === 0 ? (
          <p className="text-muted-foreground">Henuz mesaj yok...</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="mb-1">
              <span className="font-semibold text-primary">{msg.username}:</span>{" "}
              <span className="text-foreground">{msg.message}</span>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Mesaj yaz..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={disabled}
          className="h-9 bg-secondary/50"
        />
        <Button size="sm" onClick={handleSend} disabled={disabled || !input.trim()} className="h-9 px-3">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
