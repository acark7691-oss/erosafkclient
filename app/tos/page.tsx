"use client"

export const dynamic = "force-dynamic"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, Shield, AlertTriangle, Ban, Scale, Mail, ArrowLeft } from "lucide-react"
import { ErosLogo } from "@/components/eros-logo"
import { LangSwitcher } from "@/components/lang-switcher"
import { useLang } from "@/lib/lang-context"

export default function TermsOfServicePage() {
  const { t, lang } = useLang()

  const tosContent = [
    {
      icon: FileText,
      titleTR: "1. Hizmet Tanımı",
      titleEN: "1. Service Definition",
      contentTR: `Eros AFK ("Hizmet"), Minecraft oyunu için geliştirilmiş bulut tabanlı bir AFK bot sistemidir. Bu hizmet, kullanıcıların oyun içerisinde spawner ve grinder sistemlerini korumalarını sağlar.`,
      contentEN: `Eros AFK ("Service") is a cloud-based AFK bot system developed for Minecraft. This service allows users to protect their spawner and grinder systems within the game.`,
    },
    {
      icon: Shield,
      titleTR: "2. Kullanım Koşulları",
      titleEN: "2. Terms of Use",
      contentTR: `• Hesabınız ve lisans anahtarınız yalnızca size aittir.\n• Hizmeti yalnızca kendi Minecraft hesaplarınız için kullanabilirsiniz.\n• Sunucuların kurallarını ihlal eden şekilde kullanım yasaktır.\n• Bot kullanımı nedeniyle yaşanabilecek hesap banları kullanıcının sorumluluğundadır.`,
      contentEN: `• Your account and license key belong only to you.\n• You may only use the service for your own Minecraft accounts.\n• Use that violates server rules is prohibited.\n• Account bans resulting from bot usage are the user's responsibility.`,
    },
    {
      icon: AlertTriangle,
      titleTR: "3. Sorumluluk Reddi",
      titleEN: "3. Disclaimer",
      contentTR: `Eros AFK aşağıdaki durumlardan sorumlu tutulamaz:\n• Minecraft hesabınızın ban yemesi\n• Sunucu tarafında uygulanan cezalar\n• İnternet bağlantısı veya sunucu kesintileri\n• Oyun içi kayıplar (item, koordinat vb.)`,
      contentEN: `Eros AFK cannot be held responsible for:\n• Your Minecraft account getting banned\n• Penalties imposed by servers\n• Internet connection or server outages\n• In-game losses (items, coordinates, etc.)`,
    },
    {
      icon: Ban,
      titleTR: "4. Yasaklı Davranışlar",
      titleEN: "4. Prohibited Conduct",
      contentTR: `• Lisans anahtarının başkasına satılması veya devredilmesi\n• Hizmetin tersine mühendislik yapılmaya çalışılması\n• Diğer kullanıcılara zarar verecek eylemler\n• Hizmet altyapısına saldırı girişimi`,
      contentEN: `• Selling or transferring your license key to others\n• Attempting to reverse-engineer the service\n• Actions that harm other users\n• Attempting to attack service infrastructure`,
    },
    {
      icon: Scale,
      titleTR: "5. Ödeme ve İade Politikası",
      titleEN: "5. Payment & Refund Policy",
      contentTR: `• Tüm ödemeler ön ödemeli olarak alınır.\n• İptal talepleri aktif dönemin sonuna kadar geçerli olur.\n• Kullanım başladıktan sonra iade yapılmaz.\n• Hizmet ihlali durumunda ödeme iadesi yapılmaz.`,
      contentEN: `• All payments are prepaid.\n• Cancellation requests are valid until the end of the active period.\n• No refunds after usage has begun.\n• No refunds in case of service violations.`,
    },
    {
      icon: Mail,
      titleTR: "6. İletişim ve Destek",
      titleEN: "6. Contact & Support",
      contentTR: `Sorularınız için Discord sunucumuz üzerinden 7/24 destek talebi oluşturabilirsiniz.`,
      contentEN: `For questions, you can submit a 24/7 support request through our Discord server.`,
    },
  ]

  return (
    <div className="min-h-screen bg-background noise-overlay">
      <nav className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/60 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between px-4">
          <ErosLogo size="md" />
          <div className="flex items-center gap-3">
            <LangSwitcher />
            <Button variant="outline" size="sm" asChild className="border-border/50 hover:border-cyan-500/50">
              <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" />{lang === "tr" ? "Geri" : "Back"}</Link>
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto max-w-3xl px-4 pt-28 pb-16">
        <div className="mb-12 text-center">
          <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10">
            <FileText className="h-7 w-7 text-cyan-400" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            {lang === "tr" ? "Kullanım Koşulları" : "Terms of Service"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {lang === "tr" ? "Son Güncelleme: 11 Mart 2026" : "Last Updated: March 11, 2026"}
          </p>
        </div>

        <div className="mb-8 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5 text-sm text-muted-foreground leading-relaxed">
          {lang === "tr"
            ? "Bu sözleşme, Eros AFK platformunu kullanan her birey için geçerlidir. Sistemi kullanmaya başlayarak aşağıdaki maddeleri kabul etmiş sayılırsınız."
            : "This agreement applies to every individual using the Eros AFK platform. By starting to use the system, you are deemed to have accepted the following terms."}
        </div>

        <div className="space-y-4">
          {tosContent.map((item, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 hover:border-border/80 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex-shrink-0">
                  <item.icon className="h-5 w-5 text-cyan-400" />
                </div>
                <h2 className="text-base font-semibold text-foreground">
                  {lang === "tr" ? item.titleTR : item.titleEN}
                </h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line pl-13">
                {lang === "tr" ? item.contentTR : item.contentEN}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a href="https://discord.com/invite/9TdDP2ZM4Q" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:underline">
            {lang === "tr" ? "💬 Discord Sunucusu" : "💬 Discord Server"}
          </a>
        </div>
      </main>

      <footer className="border-t border-border/50 bg-card/30 py-6">
        <div className="container px-4 text-center">
          <p className="text-xs text-muted-foreground">
            {lang === "tr" ? "2026 Eros AFK Client — Tüm hakları saklıdır. v4.0" : "2026 Eros AFK Client — All rights reserved. v4.0"}
          </p>
        </div>
      </footer>
    </div>
  )
}
