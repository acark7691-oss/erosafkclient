import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { LangProvider } from "@/lib/lang-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Eros AFK Client",
  description: "Minecraft AFK Bot Control Panel",
  
  // Google Site Doğrulama (Eros AFK)
  verification: {
    google: "cbSHSusT62qjzQfCQ2dRGDM0URlnTaaUamIWSK-j7Ew",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className="dark">
      <body className={inter.className}>
        <LangProvider>
          {children}
        </LangProvider>
      </body>
    </html>
  )
}