# Eros AFK — Deploy Rehberi

## Mimari
```
Railway Servis 1: Backend (index.js)   → erosafkclient.up.railway.app
Railway Servis 2: Frontend (Next.js)   → eros-frontend.up.railway.app
```

## 1. Backend (index.js) — Mevcut Servis
Sadece şu değişkenleri ekle:
```
FRONTEND_URL=https://eros-frontend.up.railway.app   # Next.js servisinin URL'si
```
(Diğer env var'lar zaten mevcut: DATABASE_URL, BREVO_API_KEY vs.)

## 2. Frontend (Next.js) — Yeni Servis
Railway'de **New Service → GitHub Repo** veya **Deploy from local**

### Env Variables:
```
NEXT_PUBLIC_API_URL=https://erosafkclient.up.railway.app
```

### Build Command:
```
pnpm install && pnpm build
```

### Start Command:
```
pnpm start
```

## Özet
- Backend URL'ini `NEXT_PUBLIC_API_URL` olarak frontend'e ver
- Frontend URL'ini `FRONTEND_URL` olarak backend'e ver (CORS için)
- Her şey çalışır!
