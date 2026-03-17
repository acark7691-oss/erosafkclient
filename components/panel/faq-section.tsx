"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { HelpCircle } from "lucide-react"
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

interface FAQSectionProps {
  className?: string
}

export function FAQSection({ className }: FAQSectionProps) {
  return (
    <div className={cn("rounded-lg border border-border bg-card p-6", className)}>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <HelpCircle className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Sikca Sorulan Sorular
          </h2>
          <p className="text-xs text-muted-foreground">SSS / FAQ</p>
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {faqItems.map((item, index) => (
          <AccordionItem
            key={item.id}
            value={item.id}
            className="border-border/50"
          >
            <AccordionTrigger className="py-4 text-left text-sm font-medium hover:text-primary hover:no-underline">
              <span className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded bg-primary/10 text-xs font-bold text-primary">
                  {index + 1}
                </span>
                {item.question}
              </span>
            </AccordionTrigger>
            <AccordionContent className="pb-4 pl-9 text-sm leading-relaxed text-muted-foreground">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
