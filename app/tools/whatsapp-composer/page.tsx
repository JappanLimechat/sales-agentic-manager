import WhatsAppComposer from "@/components/integrations/whatsapp-composer"

export default function Page() {
  return (
    <main className="mx-auto max-w-4xl p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-pretty">WhatsApp Template Composer</h1>
        <div className="text-sm text-muted-foreground">India-focused, with Hinglish option</div>
      </header>
      <WhatsAppComposer />
      <section className="text-sm text-muted-foreground">
        Tip: You can wire this composer into your Assistant panel’s Share/Compose action later.
      </section>
    </main>
  )
}
