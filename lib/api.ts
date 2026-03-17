/**
 * Eros AFK — API Client
 * Backend: Express (index.js) ile konuşur
 * NEXT_PUBLIC_API_URL env değişkeniyle backend URL'ini ayarla
 * Örnek: https://erosafkclient.up.railway.app
 */

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || ""

function getToken(): string {
  if (typeof window === "undefined") return ""
  return localStorage.getItem("token") || ""
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken()
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "x-token": token } : {}),
      ...(options.headers || {}),
    },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || "Bir hata olustu")
  return data as T
}

// ── AUTH ──────────────────────────────────────────────────────
export async function login(username: string, password: string) {
  const data = await apiFetch<{ token: string; username: string; isActive: boolean }>(
    "/api/login",
    { method: "POST", body: JSON.stringify({ username, password }) }
  )
  if (data.token) {
    localStorage.setItem("token", data.token)
    localStorage.setItem("eros_username", data.username)
  }
  return data
}

export async function register(username: string, email: string, password: string) {
  return apiFetch<{ success: boolean; message: string }>(
    "/api/register",
    { method: "POST", body: JSON.stringify({ username, email, password }) }
  )
}

export async function logout() {
  try {
    await apiFetch("/api/logout", { method: "POST" })
  } catch {}
  localStorage.removeItem("token")
  localStorage.removeItem("eros_username")
}

export async function checkToken(): Promise<boolean> {
  try {
    const data = await apiFetch<{ valid: boolean }>("/api/check-token")
    return data.valid
  } catch {
    return false
  }
}

// ── DASHBOARD ─────────────────────────────────────────────────
export interface DashboardData {
  username: string
  email: string | null
  email_verified: boolean
  is_active: boolean
  hasKey: boolean
  isExpired: boolean
  isUnlimited: boolean
  expiresAt: string | null
}

export async function getDashboard(): Promise<DashboardData> {
  return apiFetch<DashboardData>("/api/dashboard-data")
}

export async function activateKey(key: string) {
  return apiFetch<{ success: boolean; expires_at: string | null }>(
    "/api/activate-with-token",
    { method: "POST", body: JSON.stringify({ key }) }
  )
}

export async function resendVerify() {
  return apiFetch<{ message: string }>("/api/resend-verify", { method: "POST" })
}

export async function enterPanel(): Promise<string> {
  const data = await apiFetch<{ panelToken: string }>("/api/panel-enter", { method: "POST" })
  return data.panelToken
}

// ── PANEL — BOT ───────────────────────────────────────────────
export async function startBot() {
  return fetch(`${API_BASE}/api/start`, {
    method: "POST",
    headers: { "x-token": getToken() },
  }).then(r => r.text())
}

export async function stopBot() {
  return fetch(`${API_BASE}/api/stop`, {
    method: "POST",
    headers: { "x-token": getToken() },
  }).then(r => r.text())
}

export interface BotStatus {
  running: boolean
  ready: boolean
  autoReconnect: boolean
  waiting: boolean
  panicEnabled: boolean
  panicDistance: number
  detectionDistance: number
}

export async function getBotStatus(): Promise<BotStatus> {
  return apiFetch<BotStatus>("/api/status")
}

export async function getLogs(): Promise<string[]> {
  return apiFetch<string[]>("/api/logs")
}

export async function getChatMessages(): Promise<{ username: string; message: string }[]> {
  return apiFetch<{ username: string; message: string }[]>("/api/chat/messages")
}

export async function sendChat(message: string) {
  return apiFetch("/api/chat/send", {
    method: "POST",
    body: JSON.stringify({ message }),
  })
}

// ── PANEL — SETTINGS ──────────────────────────────────────────
export interface Settings {
  host: string
  port: number
  version: string
  mc_username: string
  panicEnabled: boolean
  panicDistance: number
  detectionDistance: number
  autoReconnect: boolean
  whitelist: string[]
}

export async function getSettings(): Promise<Settings> {
  return apiFetch<Settings>("/api/settings/get")
}

export async function saveSettings(s: Partial<Settings>) {
  return apiFetch("/api/settings/save", {
    method: "POST",
    body: JSON.stringify(s),
  })
}

export async function togglePanic(): Promise<{ enabled: boolean }> {
  return apiFetch("/api/panic/toggle", { method: "POST" })
}

export async function setPanicDistance(distance: number) {
  return apiFetch("/api/panic/distance", {
    method: "POST",
    body: JSON.stringify({ distance }),
  })
}

export async function setDetectionDistance(distance: number) {
  return apiFetch("/api/detection/distance", {
    method: "POST",
    body: JSON.stringify({ distance }),
  })
}

export async function toggleReconnect(): Promise<{ enabled: boolean }> {
  return apiFetch("/api/reconnect/toggle", { method: "POST" })
}

export async function cancelReconnect() {
  return apiFetch("/api/reconnect/cancel", { method: "POST" })
}

// ── PANEL — PROXY ─────────────────────────────────────────────
export interface ProxyStatus {
  enabled: boolean
  host: string
  port: number
}

export async function getProxyStatus(): Promise<ProxyStatus> {
  return apiFetch<ProxyStatus>("/api/proxy/status")
}

export async function toggleProxy(): Promise<ProxyStatus> {
  return apiFetch<ProxyStatus>("/api/proxy/toggle", { method: "POST" })
}

// ── PANEL — WHITELIST ─────────────────────────────────────────
export async function getWhitelist(): Promise<string[]> {
  return apiFetch<string[]>("/api/whitelist/list")
}

export async function addToWhitelist(name: string) {
  return apiFetch("/api/whitelist/add", {
    method: "POST",
    body: JSON.stringify({ name }),
  })
}

export async function removeFromWhitelist(name: string) {
  return apiFetch("/api/whitelist/remove", {
    method: "POST",
    body: JSON.stringify({ name }),
  })
}
