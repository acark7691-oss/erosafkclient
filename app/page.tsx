"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Shield, Zap, Cloud, Eye, Users, Globe, Lock, ArrowRight, HelpCircle, Activity, Terminal, Sparkles, Server, MessageCircle, Cpu } from "lucide-react"
import { cn } from "@/lib/utils"
import { ErosLogo } from "@/components/eros-logo"
import { LangSwitcher } from "@/components/lang-switcher"
import { useLang } from "@/lib/use-lang"

export const dynamic = "force-dynamic"

export default function LandingPage() {
  const { t } = useLang()

  const features = [
    { icon: Shield, color: "from-cyan-500/20 to-cyan-500/5", iconColor: "text-cyan-400", titleKey: "feat1_title" as const, descKey: "feat1_desc" as const },
    { icon: Cloud, color: "from-emerald-500/20 to-emerald-500/5", iconColor: "text-emerald-400", titleKey: "feat2_title" as const, descKey: "feat2_desc" as const },
    { icon: Eye, color: "from-blue-500/20 to-blue-500/5", iconColor: "text-blue-400", titleKey: "feat3_title" as const, descKey: "feat3_desc" as const },
    { icon: Lock, color: "from-amber-500/20 to-amber-500/5", iconColor: "text-amber-400", titleKey: "feat4_title" as const, descKey: "feat4_desc" as const },
    { icon: Globe, color: "from-rose-500/20 to-rose-500/5", iconColor: "text-rose-400", titleKey: "feat5_title" as const, descKey: "feat5_desc" as const },
    { icon: Users, color: "from-violet-500/20 to-violet-500/5", iconColor: "text-violet-400", titleKey: "feat6_title" as const, descKey: "feat6_desc" as const },
  ]

  const faqs = [
    { id: "q1", qKey: "faq1_q" as const, aKey: "faq1_a" as const },
    { id: "q2", qKey: "faq2_q" as const, aKey: "faq2_a" as const },
    { id: "q3", qKey: "faq3_q" as const, aKey: "faq3_a" as const },
    { id: "q4", qKey: "faq4_q" as const, aKey: "faq4_a" as const },
    { id: "q5", qKey: "faq5_q" as const, aKey: "faq5_a" as const },
  ]

  const steps = [
    { icon: Users, color: "cyan", num: "01", titleKey: "step1_title" as const, descKey: "step1_desc" as const },
    { icon: Cpu, color: "emerald", num: "02", titleKey: "step2_title" as const, descKey: "step2_desc" as const },
    { icon: Zap, color: "amber", num: "03", titleKey: "step3_title" as const, descKey: "step3_desc" as const },
  ]

  return (
    <div className="min-h-screen bg-background noise-overlay">
      <nav className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/60 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between px-4">
          <ErosLogo size="md" />
          <div className="hidden items-center gap-8 md:flex">
            <Link href="#features" className="text-sm text-muted-foreground transition-colors hover:text-cyan-400">{t("nav_features")}</Link>
            <Link href="#faq" className="text-sm text-muted-foreground transition-colors hover:text-cyan-400">{t("nav_faq")}</Link>
            <Link href="/tos" className="text-sm text-muted-foreground transition-colors hover:text-cyan-400">{t("nav_tos")}</Link>
            <a href="https://discord.com/invite/9TdDP2ZM4Q" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-cyan-400">
              <MessageCircle className="h-4 w-4" />{t("nav_discord")}
            </a>
          </div>
          <div className="flex items-center gap-3">
            <LangSwitcher />
            <Button variant="ghost" size="sm" asChild className="hidden text-muted-foreground hover:text-foreground sm:inline-flex">
              <Link href="/login">{t("nav_login")}</Link>
            </Button>
            <Button size="sm" asChild className="cyber-button border-0 text-primary-foreground">
              <Link href="/login">{t("nav_start")}<ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden pt-32 pb-24">
        <div className="absolute inset-0 grid-pattern" />
        <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2">
          <div className="absolute inset-0 rounded-full bg-cyan-500/10 blur-[120px]" />
          <div className="absolute inset-20 rounded-full bg-emerald-500/10 blur-[100px]" />
        </div>
        <div className="container relative px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-5 py-2 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-sm text-muted-foreground">{t("hero_badge")}</span>
              <Sparkles className="h-4 w-4 text-cyan-400" />
            </div>
            <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {t("hero_title1")}{" "}
              <span className="gradient-text text-glow-cyan">{t("hero_title2")}</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">{t("hero_desc")}</p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild className="cyber-button h-12 gap-2 border-0 px-8 text-primary-foreground">
                <Link href="/login"><Terminal className="h-5 w-5" />{t("hero_cta")}</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-12 border-border/50 bg-card/50 px-8 backdrop-blur-sm hover:border-cyan-500/50 hover:bg-cyan-500/5">
                <a href="https://discord.com/invite/9TdDP2ZM4Q" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-5 w-5" />{t("hero_discord")}
                </a>
              </Button>
            </div>
          </div>
          <div className="mx-auto mt-20 grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { value: "99.9%", labelKey: "stat_uptime" as const, icon: Activity },
              { value: "7/24", labelKey: "stat_active" as const, icon: Server },
              { value: "<50ms", labelKey: "stat_response" as const, icon: Zap },
              { value: "10+", labelKey: "stat_proxy" as const, icon: Globe },
            ].map((s, i) => (
              <div key={i} className="glass-card glass-card-hover group relative overflow-hidden rounded-2xl p-6 text-center transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative">
                  <s.icon className="mx-auto mb-3 h-5 w-5 text-cyan-400" />
                  <div className="text-2xl font-bold text-foreground">{s.value}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{t(s.labelKey)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="relative border-t border-border/50 py-24">
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="container relative px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5 text-xs text-cyan-400">
              <Cpu className="h-3.5 w-3.5" />{t("feat_sub_pill")}
            </div>
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
              {t("feat_title2")} <span className="gradient-text">{t("feat_title3")}</span>
            </h2>
            <p className="text-muted-foreground">{t("feat_desc")}</p>
          </div>
          <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <div key={i} className="glass-card glass-card-hover group relative overflow-hidden rounded-2xl p-6 transition-all duration-300">
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity group-hover:opacity-100", f.color)} />
                <div className="relative">
                  <div className={cn("mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-border/50 bg-card/80", f.iconColor)}>
                    <f.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">{t(f.titleKey)}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{t(f.descKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-t border-border/50 py-24">
        <div className="container px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
              {t("how_title")} <span className="gradient-text">{t("how_title2")}</span>
            </h2>
            <p className="text-muted-foreground">{t("how_desc")}</p>
          </div>
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
            {steps.map((item, index) => (
              <div key={index} className="relative text-center">
                {index < 2 && (
                  <div className="absolute left-[calc(50%+60px)] top-16 hidden h-px w-[calc(100%-120px)] bg-gradient-to-r from-border via-cyan-500/30 to-border md:block" />
                )}
                <div className="glass-card mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-3xl">
                  <div className="relative">
                    <item.icon className={cn("h-12 w-12", item.color === "cyan" ? "text-cyan-400" : item.color === "emerald" ? "text-emerald-400" : "text-amber-400")} />
                    <span className={cn("absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-primary-foreground", item.color === "cyan" ? "bg-cyan-500" : item.color === "emerald" ? "bg-emerald-500" : "bg-amber-500")}>
                      {item.num}
                    </span>
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{t(item.titleKey)}</h3>
                <p className="text-sm text-muted-foreground">{t(item.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="relative border-t border-border/50 py-24">
        <div className="container px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10">
              <HelpCircle className="h-7 w-7 text-cyan-400" />
            </div>
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
              {t("faq_title")} <span className="gradient-text">{t("faq_title2")}</span>
            </h2>
            <p className="text-muted-foreground">{t("faq_desc")}</p>
          </div>
          <div className="mx-auto max-w-2xl">
            <Accordion type="single" collapsible className="w-full space-y-3">
              {faqs.map((item, index) => (
                <AccordionItem key={item.id} value={item.id} className="glass-card overflow-hidden rounded-xl border-0 data-[state=open]:ring-1 data-[state=open]:ring-cyan-500/30">
                  <AccordionTrigger className="px-6 py-5 text-left text-sm font-medium hover:text-cyan-400 hover:no-underline [&[data-state=open]]:text-cyan-400">
                    <span className="flex items-center gap-4">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-xs font-bold text-cyan-400">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {t(item.qKey)}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-5 pl-[72px] text-sm leading-relaxed text-muted-foreground">
                    {t(item.aKey)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <section className="relative border-t border-border/50 py-24">
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2">
          <div className="absolute inset-0 rounded-full bg-cyan-500/10 blur-[100px]" />
        </div>
        <div className="container relative px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
              {t("cta_title")} <span className="gradient-text">{t("cta_title2")}</span>
            </h2>
            <p className="mb-10 text-muted-foreground">{t("cta_desc")}</p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild className="cyber-button h-12 gap-2 border-0 px-8 text-primary-foreground">
                <Link href="/login"><Terminal className="h-5 w-5" />{t("cta_btn")}</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-12 border-border/50 bg-card/50 px-8 backdrop-blur-sm hover:border-cyan-500/50 hover:bg-cyan-500/5">
                <a href="https://discord.com/invite/9TdDP2ZM4Q" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-5 w-5" />{t("cta_discord")}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/50 bg-card/30 py-12">
        <div className="container px-4">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <ErosLogo size="sm" />
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/tos" className="hover:text-cyan-400">{t("nav_tos")}</Link>
              <a href="https://discord.com/invite/9TdDP2ZM4Q" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-cyan-400">
                <MessageCircle className="h-4 w-4" />{t("nav_discord")}
              </a>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">{t("footer_copy")}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
