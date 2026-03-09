import Link from "next/link";

export function LegalLayout({ title, lastUpdated, children }: {
  title: string;
  lastUpdated?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b border-border">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-primary">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-9.894A11.958 11.958 0 0112 3c3.866 0 7.32 1.834 9.547 4.703L16 12H8l1 8z" />
            </svg>
            <span className="text-lg font-bold tracking-tight">LandLedger</span>
          </Link>
          <Link href="/contact" className="text-sm text-text-muted hover:text-primary transition-colors">
            კონტაქტი
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text mb-2">{title}</h1>
          {lastUpdated && (
            <p className="text-sm text-text-faint">ბოლო განახლება: {lastUpdated}</p>
          )}
        </div>
        <div className="prose-legal">
          {children}
        </div>
      </main>

      <footer className="border-t border-border py-8 mt-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-text-faint justify-center">
            <Link href="/terms" className="hover:text-primary transition-colors">გამოყენების პირობები</Link>
            <span>·</span>
            <Link href="/privacy" className="hover:text-primary transition-colors">კონფიდენციალურობა</Link>
            <span>·</span>
            <Link href="/cookies" className="hover:text-primary transition-colors">Cookie პოლიტიკა</Link>
            <span>·</span>
            <Link href="/acceptable-use" className="hover:text-primary transition-colors">გამოყენების წესები</Link>
            <span>·</span>
            <Link href="/disclaimer" className="hover:text-primary transition-colors">Disclaimer</Link>
            <span>·</span>
            <Link href="/contact" className="hover:text-primary transition-colors">კონტაქტი</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-text mb-4 pb-2 border-b border-border">{title}</h2>
      <div className="space-y-3 text-text-muted text-sm leading-relaxed">{children}</div>
    </section>
  );
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5 mt-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
