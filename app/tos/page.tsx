"use client"

import { ErosLogo } from "@/components/eros-logo"
import { LangSwitcher } from "@/components/lang-switcher"
import { useLang } from "@/lib/use-lang"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Bot,
  ArrowLeft,
  FileText,
  Shield,
  AlertTriangle,
  Ban,
  Scale,
  Mail,
  ScrollText,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

const tosContent = [
  {
    icon: FileText,
    title: "1. Hizmet Tanimi",
    content: `Eros AFK ("Hizmet"), Minecraft oyunu icin gelistirilmis bulut tabanli bir AFK bot sistemidir. Bu hizmet, kullanicilarin oyun icerisinde spawner ve grinder sistemlerini korumalarini saglar. Hizmet, Railway sunucularinda barindirilan bot altyapisi, web tabanli kontrol paneli, Microsoft hesap entegrasyonu ve oyuncu algilama sistemlerini icerir.`,
  },
  {
    icon: Shield,
    title: "2. Kullanim Kosullari",
    content: `Hizmeti kullanarak asagidaki kosullari kabul etmis sayilirsiniz:

• Hesabiniz ve lisans anahtariniz yalnizca size aittir ve baskalariyla paylasilmamalidir.
• Hizmeti yalnizca kendi Minecraft hesaplariniz icin kullanabilirsiniz.
• Sunucularin kurallarini ihlal eden sekilde kullanim yasaktir.
• Hizmeti kotu amacli kullanimlar (DDoS, spam, harassment vb.) icin kullanamazsiniz.
• Bot kullanimi nedeniyle yasanabilecek hesap banlari tamamen kullanicinin sorumluluğundadir.`,
  },
  {
    icon: AlertTriangle,
    title: "3. Sorumluluk Reddi",
    content: `Eros AFK, asagidaki durumlardan sorumlu tutulamaz:

• Minecraft hesabinizin ban yemesi veya kisitlanmasi
• Sunucu tarafinda uygulanan cezalar veya kisitlamalar
• Microsoft hesap guvenlik sorunlari
• Ucuncu parti yazilimlarla uyumsuzluk
• Internet baglantisi veya sunucu kesintilerinden kaynaklanan sorunlar
• Oyun ici kayiplar (item, koordinat, vb.)

Hizmet "oldugu gibi" sunulmaktadir ve hicbir garanti verilmemektedir.`,
  },
  {
    icon: Ban,
    title: "4. Yasakli Davranislar",
    content: `Asagidaki davranislar kesinlikle yasaktir ve hesap askiya alinmasina neden olabilir:

• Lisans anahtarinin baskasina satilmasi veya devredilmesi
• Hizmetin tersine muhendislik yapilmaya calisilmasi
• API veya sistemin kotu niyetli kullanimi
• Diger kullanicilara zarar verecek eylemler
• Hizmet altyapisina saldiri girisimi
• Sahte hesap olusturma veya dolandiricilik`,
  },
  {
    icon: Scale,
    title: "5. Odeme ve Iade Politikasi",
    content: `• Tum odemeler on odemeli olarak alinir.
• Abonelik donem basinda otomatik olarak yenilenir.
• Iptal talepleri aktif donemin sonuna kadar gecerli olur.
• Iade talepleri satin alma tarihinden itibaren 7 gun icinde yapilabilir.
• Kullanim basladiktan sonra iade yapilmaz.
• Hizmet ihlali durumunda odeme iadesi yapilmaz.`,
  },
  {
    icon: Mail,
    title: "6. Iletisim ve Destek",
    content: `Sorulariniz, sikayet veya onerileriniz icin asagidaki kanallar uzerinden bize ulasabilirsiniz:

• Discord sunucusu uzerinden 7/24 destek
• E-posta: destek@erosafk.com
• Panel ici destek talep sistemi

Destek taleplerine genellikle 24 saat icinde yanit verilir.`,
  },
]

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background noise-overlay">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/60 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between px-4">
          <ErosLogo size="md" />
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild className="gap-2 text-muted-foreground hover:text-foreground">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Geri Don
              </Link>
            </Button>
            <Button size="sm" asChild className="cyber-button border-0 text-primary-foreground">
              <Link href="/dashboard">Panele Git</Link>
            </Button>
          </div>
        </div>
        <div style={{position:"absolute",right:"16px",top:"50%",transform:"translateY(-50%)"}}><LangSwitcher /></div>
</nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16">
        <div className="absolute inset-0 grid-pattern" />
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2">
          <div className="absolute inset-0 rounded-full bg-cyan-500/10 blur-[120px]" />
        </div>
        
        <div className="container relative px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10">
              <ScrollText className="h-8 w-8 text-cyan-400" />
            </div>
            <h1 className="mb-4 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Kullanim Sartlari ve <span className="gradient-text">Kosullar</span>
            </h1>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>Son guncelleme: 17 Mart 2026</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container px-4">
          <div className="mx-auto max-w-3xl space-y-6">
            {/* Introduction */}
            <div className="glass-card rounded-2xl p-6">
              <p className="leading-relaxed text-muted-foreground">
                Bu Kullanim Sartlari ("Sartlar"), Eros AFK hizmetlerini kullaniminizi 
                duzenler. Hizmetlerimizi kullanarak bu sartlari kabul etmis sayilirsiniz. 
                Lutfen tum sartlari dikkatlice okuyunuz.
              </p>
            </div>

            {/* ToS Sections */}
            {tosContent.map((section, index) => (
              <div
                key={index}
                className="glass-card glass-card-hover group relative overflow-hidden rounded-2xl p-6 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                
                <div className="relative">
                  <div className="mb-4 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10">
                      <section.icon className="h-6 w-6 text-cyan-400" />
                    </div>
                    <h2 className="text-lg font-semibold text-foreground">
                      {section.title}
                    </h2>
                  </div>
                  <div className="whitespace-pre-line pl-16 text-sm leading-relaxed text-muted-foreground">
                    {section.content}
                  </div>
                </div>
              </div>
            ))}

            {/* Agreement Notice */}
            <div className="gradient-border relative overflow-hidden rounded-2xl p-8 text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-emerald-500/5" />
              <div className="relative">
                <p className="mb-6 text-sm text-muted-foreground">
                  Bu hizmeti kullanarak yukaridaki tum sartlari okudugunuzu ve kabul ettiginizi beyan etmis olursunuz.
                </p>
                <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Button asChild className="cyber-button border-0 text-primary-foreground">
                    <Link href="/dashboard">
                      Panele Git
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="border-border/50 bg-card/50 hover:border-cyan-500/50 hover:bg-cyan-500/5">
                    <Link href="/">Ana Sayfaya Don</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 py-8">
        <div className="container px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <ErosLogo size="md" />
            <p className="text-xs text-muted-foreground">
              © 2026 Eros AFK Client — Tum haklari saklidir. v4.0
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
