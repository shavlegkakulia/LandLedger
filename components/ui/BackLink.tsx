import Link from "next/link";

interface BackLinkProps {
  href: string;
  title: string;
  subtitle?: string;
}

export function BackLink({ href, title, subtitle }: BackLinkProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <Link href={href} className="text-text-faint hover:text-text-muted transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </Link>
      <div>
        <h1 className="text-xl font-bold text-text">{title}</h1>
        {subtitle && <p className="text-text-muted text-sm">{subtitle}</p>}
      </div>
    </div>
  );
}
