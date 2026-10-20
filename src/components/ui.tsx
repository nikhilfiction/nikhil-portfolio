import type { ReactNode } from 'react';

export function Band({ id, labelledBy, className = '', children }: { id: string; labelledBy: string; className?: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`px-safe ${className}`}>
      <div className="mx-auto grid max-w-[1120px] gap-[clamp(28px,4vw,48px)]">{children}</div>
    </section>
  );
}

export function SectionHead({ eyebrow, id, title, accent, lede, dark = false }: {
  eyebrow: string;
  id: string;
  title?: string;
  accent?: string;
  lede?: string;
  dark?: boolean;
}) {
  return (
    <header className="grid max-w-[44rem] gap-2.5">
      <p id={title ? undefined : id} className={`m-0 text-[0.72rem] font-semibold tracking-[0.22em] uppercase ${dark ? 'text-rose' : 'text-maroon'}`}>
        {eyebrow}
      </p>
      {title && (
        <h2 id={id} className="m-0 font-display text-[clamp(2.1rem,4.4vw,3.4rem)] leading-[1.04] font-medium tracking-[-0.01em] text-balance">
          {title}
          {accent && <em className={`font-normal ${dark ? 'text-rose' : 'text-maroon'}`}>{accent}</em>}
        </h2>
      )}
      {lede && <p className={`m-0 max-w-[58ch] text-[1.05rem] ${dark ? 'text-blush' : 'text-ink-soft'}`}>{lede}</p>}
    </header>
  );
}

export function Tags({ items, label }: { items: string[]; label: string }) {
  return (
    <ul aria-label={label} className="m-0 flex list-none flex-wrap gap-1.5 p-0">
      {items.map((t) => (
        <li key={t} className="rounded-full bg-blush px-2.5 py-1 text-[0.74rem] font-medium text-maroon">{t}</li>
      ))}
    </ul>
  );
}

export function DotList({ items, className = '' }: { items: string[]; className?: string }) {
  return (
    <ul className={`dot-list ${className}`}>
      {items.map((p) => <li key={p}>{p}</li>)}
    </ul>
  );
}

/** "Live demo" and optional "Code" buttons. Add a `code` URL in content.ts to show the second one. */
export function ProjectLinks({ live, note, code }: { live?: string; note?: string; code?: string }) {
  if (!live && !code) return null;
  return (
    <div className="mt-1 flex flex-wrap items-center gap-x-3.5 gap-y-2">
      {live && (
        <a
          href={live}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-2 rounded-full bg-maroon px-[18px] py-2.5 text-[0.9rem] font-semibold text-paper no-underline transition hover:-translate-y-px hover:bg-ink"
        >
          Live demo
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="h-4 w-4 flex-none">
            <path d="M7 17L17 7M9 7h8v8" />
          </svg>
        </a>
      )}
      {code && (
        <a
          href={code}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-2 rounded-full border border-rose px-[18px] py-2.5 text-[0.9rem] font-semibold text-maroon no-underline transition hover:border-maroon"
        >
          Code
        </a>
      )}
      {live && note && <small className="text-[0.8rem] text-ink-soft">{note}</small>}
    </div>
  );
}
