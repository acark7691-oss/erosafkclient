"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LogEntry {
  id: string
  timestamp: string
  message: string
  type: "info" | "success" | "warning" | "error" | "microsoft"
}

interface TerminalProps {
  logs: LogEntry[]
  onClear?: () => void
  className?: string
}

export function Terminal({ logs, onClear, className }: TerminalProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [autoScroll, setAutoScroll] = useState(true)

  useEffect(() => {
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [logs, autoScroll])

  const getLogColor = (type: LogEntry["type"]) => {
    switch (type) {
      case "success":
        return "text-emerald-400 border-l-emerald-400"
      case "warning":
        return "text-amber-400 border-l-amber-400"
      case "error":
        return "text-red-400 border-l-red-400"
      case "microsoft":
        return "text-primary border-l-primary"
      default:
        return "text-muted-foreground border-l-muted"
    }
  }

  return (
    <div className={cn("flex flex-col rounded-lg border border-border bg-card", className)}>
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/80" />
            <div className="h-3 w-3 rounded-full bg-amber-500/80" />
            <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Canli Terminal
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <Trash2 className="mr-1 h-3 w-3" />
          Temizle
        </Button>
      </div>
      <div
        ref={containerRef}
        className="h-[300px] overflow-y-auto p-4 terminal-font text-sm"
        onScroll={(e) => {
          const target = e.target as HTMLDivElement
          const isAtBottom = target.scrollHeight - target.scrollTop === target.clientHeight
          setAutoScroll(isAtBottom)
        }}
      >
        {logs.length === 0 ? (
          <div className="text-muted-foreground">Terminal hazir — botu baslatin.</div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className={cn(
                "mb-1 border-l-2 py-0.5 pl-3",
                getLogColor(log.type)
              )}
            >
              <span className="text-muted-foreground">[{log.timestamp}]</span>{" "}
              <span dangerouslySetInnerHTML={{ __html: log.message }} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
