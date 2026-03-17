"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Shield,
  Zap,
  Cloud,
  Eye,
  Users,
  Bot,
  Cpu,
  Lock,
  Globe,
  ArrowRight,
  HelpCircle,
  Activity,
  Terminal,
  Sparkles,
  Server,
  MessageCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

const faqItems = [
  {
    id: "q1",
    question: "Botum ban yer mi?",
    answer:
      "Eros AFK, insan hareketini taklit eden randomize gecikmeler ve dogal hareket simulasyonu kullanir. Ban riski minimize edilmistir ancak sorumluluk kullaniciya aittir.",
  },
  {
    id: "q2",
    question: "Bilgisayarimin acik kalmasi gerekiyor mu?",
    answer:
      "Hayir. Eros AFK bulut tabanli bir sistemdir. Botunuz Railway sunucularinda 7/24 calisir. Bilgisayarinizi kapatsaniz bile bot aktif kalmaya devam eder.",
  },
  {
    id: "q3",
    question: "Nasil kayit olunur?",
    answer:
      "Kayit olmak icin bir kullanici adi ve sifre belirlemeniz, ardindan bir lisans anahtari ile hesabinizi aktive etmeniz gerekmektedir.",
  },
  {
    id: "q4",
    question: "Microsoft girisi nasil yapilir?",
    answer:
      "Botu baslattiktan sonra log ekraninda microsoft.com/link adresi ve kod belirecektir. O linke girip kodu girerek hesabinizi baglayin.",
  },
  {
    id: "q5",
    question: "Teknik destek alabilir miyim?",
    answer:
      "Evet. Discord sunucumuz uzerinden 7/24 destek talebi olusturabilirsiniz.",
  },
]

const features = [
  {
    icon: Shield,
    title: "Panik Sistemi",
    description: "Tehlike algilandiginda aninda guvenli cikis. Ozellestirilebilir mesafe ve algilama ayarlari.",
    color: "from-cyan-500/20 to-cyan-500/5",
    iconColor: "text-cyan-400",
  },
  {
    icon: Cloud,
    title: "Bulut Tabanli",
    description: "7/24 aktif calisan Railway sunuculari. Bilgisayarinizi kapatin, bot calismaya devam etsin.",
    color: "from-emerald-500/20 to-emerald-500/5",
    iconColor: "text-emerald-400",
  },
  {
    icon: Eye,
    title: "Oyuncu Algilama",
    description: "60+ blok mesafeden yaklasan oyunculari tespit eden gelismis radar sistemi.",
    color: "from-blue-500/20 to-blue-500/5",
    iconColor: "text-blue-400",
  },
  {
    icon: Lock,
    title: "Microsoft Auth",
    description: "Guvenli Microsoft hesap baglantisi. Tek seferlik kod ile kolay giris.",
    color: "from-amber-500/20 to-amber-500/5",
    iconColor: "text-amber-400",
  },
  {
    icon: Globe,
    title: "Proxy Destegi",
    description: "IP koruma ve ban onleme icin entegre proxy sistemi.",
    color: "from-rose-500/20 to-rose-500/5",
    iconColor: "text-rose-400",
  },
  {
    icon: Users,
    title: "Beyaz Liste",
    description: "Guvendiginiz oyunculari listeye ekleyin, panik sistemi onlari yoksaysin.",
    color: "from-violet-500/20 to-violet-500/5",
    iconColor: "text-violet-400",
  },
]

const stats = [
  { value: "99.9%", label: "Uptime", icon: Activity },
  { value: "7/24", label: "Aktif", icon: Server },
  { value: "<50ms", label: "Tepki", icon: Zap },
  { value: "10+", label: "Proxy Sunucu", icon: Globe },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background noise-overlay">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/60 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 opacity-20 blur-sm" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/30 bg-card">
                <Bot className="h-5 w-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-foreground">EROS</span>
              <span className="ml-1 text-lg font-light" style={{color:"#a855f7"}}>AFK</span>
            </div>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <Link href="#features" className="text-sm text-muted-foreground transition-colors hover:text-cyan-400">
              Ozellikler
            </Link>
            <Link href="#faq" className="text-sm text-muted-foreground transition-colors hover:text-cyan-400">
              SSS
            </Link>
            <Link href="/tos" className="text-sm text-muted-foreground transition-colors hover:text-cyan-400">
              Kullanim Sartlari
            </Link>
            <a 
              href="https://discord.gg/erosafk" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-cyan-400"
            >
              <MessageCircle className="h-4 w-4" />
              Discord
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild className="hidden text-muted-foreground hover:text-foreground sm:inline-flex">
              <Link href="/login">Giris Yap</Link>
            </Button>
            <Button size="sm" asChild className="cyber-button border-0 text-primary-foreground">
              <Link href="/login">
                Basla
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-24">
        {/* Background effects */}
        <div className="absolute inset-0 grid-pattern" />
        <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2">
          <div className="absolute inset-0 rounded-full bg-cyan-500/10 blur-[120px]" />
          <div className="absolute inset-20 rounded-full bg-emerald-500/10 blur-[100px]" />
        </div>
        
        <div className="container relative px-4">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-5 py-2 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-sm text-muted-foreground">v4.0 Yayinda</span>
              <Sparkles className="h-4 w-4 text-cyan-400" />
            </div>
            
            {/* Heading */}
            <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Minecraft Hesabiniz Icin{" "}
              <span className="gradient-text text-glow-cyan">7/24 Koruma</span>
            </h1>
            
            {/* Description */}
            <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              Spawner ve grinder sistemlerinizi koruyun. Gelismis panik sistemi, oyuncu algilama 
              ve otomatik cikis ozellikleriyle AFK botunuz guvende.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild className="cyber-button h-12 gap-2 border-0 px-8 text-primary-foreground">
                <Link href="/login">
                  <Terminal className="h-5 w-5" />
                  Hemen Basla
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-12 border-border/50 bg-card/50 px-8 backdrop-blur-sm hover:border-cyan-500/50 hover:bg-cyan-500/5">
                <a href="https://discord.gg/erosafk" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Discord
                </a>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-20 grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="glass-card glass-card-hover group relative overflow-hidden rounded-2xl p-6 text-center transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative">
                  <stat.icon className="mx-auto mb-3 h-5 w-5 text-cyan-400" />
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative border-t border-border/50 py-24">
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="container relative px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5 text-xs text-cyan-400">
              <Cpu className="h-3.5 w-3.5" />
              Guclu Ozellikler
            </div>
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
              Profesyonel <span className="gradient-text">Koruma Sistemi</span>
            </h2>
            <p className="text-muted-foreground">
              Eros AFK, Minecraft AFK botlari icin en gelismis ozellikleri sunar.
            </p>
          </div>
          
          <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-card glass-card-hover group relative overflow-hidden rounded-2xl p-6 transition-all duration-300"
              >
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity group-hover:opacity-100", feature.color)} />
                
                <div className="relative">
                  <div className={cn("mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-border/50 bg-card/80", feature.iconColor)}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative border-t border-border/50 py-24">
        <div className="container px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
              Nasil <span className="gradient-text">Calisir?</span>
            </h2>
            <p className="text-muted-foreground">
              3 basit adimda Eros AFK botunuzu calistirin.
            </p>
          </div>
          
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Kayit Olun",
                description: "Kullanici adi ve sifre belirleyin, lisans anahtarinizi girin.",
                icon: Users,
                color: "cyan",
              },
              {
                step: "02",
                title: "Baglanti Kurun",
                description: "Microsoft hesabinizi baglayin ve sunucu bilgilerinizi girin.",
                icon: Cpu,
                color: "emerald",
              },
              {
                step: "03",
                title: "Baslatin",
                description: "Bot'u baslatin ve spawnerlarinizi 7/24 koruma altina alin.",
                icon: Zap,
                color: "amber",
              },
            ].map((item, index) => (
              <div key={index} className="relative text-center">
                {index < 2 && (
                  <div className="absolute left-[calc(50%+60px)] top-16 hidden h-px w-[calc(100%-120px)] bg-gradient-to-r from-border via-cyan-500/30 to-border md:block" />
                )}
                
                <div className="glass-card mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-3xl">
                  <div className="relative">
                    <item.icon className={cn("h-12 w-12", item.color === "cyan" ? "text-cyan-400" : item.color === "emerald" ? "text-emerald-400" : "text-amber-400")} />
                    <span className={cn("absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-primary-foreground", item.color === "cyan" ? "bg-cyan-500" : item.color === "emerald" ? "bg-emerald-500" : "bg-amber-500")}>
                      {item.step}
                    </span>
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative border-t border-border/50 py-24">
        <div className="container px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10">
              <HelpCircle className="h-7 w-7 text-cyan-400" />
            </div>
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
              Sikca Sorulan <span className="gradient-text">Sorular</span>
            </h2>
            <p className="text-muted-foreground">
              En cok merak edilen sorular ve cevaplari.
            </p>
          </div>
          
          <div className="mx-auto max-w-2xl">
            <Accordion type="single" collapsible className="w-full space-y-3">
              {faqItems.map((item, index) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="glass-card overflow-hidden rounded-xl border-0 data-[state=open]:ring-1 data-[state=open]:ring-cyan-500/30"
                >
                  <AccordionTrigger className="px-6 py-5 text-left text-sm font-medium hover:text-cyan-400 hover:no-underline [&[data-state=open]]:text-cyan-400">
                    <span className="flex items-center gap-4">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-xs font-bold text-cyan-400">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      {item.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-5 pl-[72px] text-sm leading-relaxed text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative border-t border-border/50 py-24">
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2">
          <div className="absolute inset-0 rounded-full bg-cyan-500/10 blur-[100px]" />
        </div>
        <div className="container relative px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
              Hemen <span className="gradient-text">Baslayin</span>
            </h2>
            <p className="mb-10 text-muted-foreground">
              Spawnerlarinizi koruma altina alin. Discord sunucumuza katilarak destek alabilirsiniz.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild className="cyber-button h-12 gap-2 border-0 px-8 text-primary-foreground">
                <Link href="/login">
                  <Terminal className="h-5 w-5" />
                  Giris Yap
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-12 border-border/50 bg-card/50 px-8 backdrop-blur-sm hover:border-cyan-500/50 hover:bg-cyan-500/5">
                <a href="https://discord.gg/erosafk" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Discord Sunucusu
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 py-12">
        <div className="container px-4">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 opacity-20 blur-sm" />
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/30 bg-card">
                  <Bot className="h-5 w-5 text-cyan-400" />
                </div>
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-foreground">EROS</span>
                <span className="ml-1 text-lg font-light" style={{color:"#a855f7"}}>AFK</span>
              </div>
            </Link>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/tos" className="hover:text-cyan-400">Kullanim Sartlari</Link>
              <a href="https://discord.gg/erosafk" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-cyan-400">
                <MessageCircle className="h-4 w-4" />
                Discord
              </a>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">
              2026 Eros AFK Client - Tum haklari saklidir. v4.0
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
