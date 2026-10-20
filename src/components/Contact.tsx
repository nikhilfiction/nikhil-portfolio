import { useEffect, useRef, useState } from 'react';
import { profile } from '../data/content';
import { Band, SectionHead } from './ui';

const btn =
  'inline-flex items-center gap-2 rounded-full border px-5 py-[11px] text-[0.9rem] font-semibold no-underline transition cursor-pointer focus-visible:outline-paper';

export default function Contact() {
  const emailRef = useRef<HTMLAnchorElement>(null);
  const [label, setLabel] = useState('Copy email');
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setLabel('Copied');
    } catch {
      // Clipboard blocked: select the address so it can be copied by hand
      const range = document.createRange();
      range.selectNodeContents(emailRef.current!);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
      setLabel('Selected, press Ctrl+C');
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setLabel('Copy email'), 2400);
  };

  return (
    <Band id="contact" labelledBy="contact-title" className="bg-maroon pt-[clamp(80px,11vw,140px)] pb-10 text-paper">
      <SectionHead
        dark
        eyebrow="Contact"
        id="contact-title"
        title="Hiring a backend developer?"
        lede="I can start right away. Email is the quickest way to reach me."
      />

      <a
        ref={emailRef}
        href={`mailto:${profile.email}`}
        className="justify-self-start border-b border-rose-deep font-display text-[clamp(1.45rem,4.4vw,3rem)] leading-[1.1] [overflow-wrap:anywhere] text-paper no-underline hover:border-paper"
      >
        {profile.email}
      </a>

      <div className="flex flex-wrap items-center gap-x-[18px] gap-y-3.5">
        <button type="button" onClick={copy} className={`${btn} border-paper bg-paper text-maroon hover:bg-blush`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className="h-[18px] w-[18px] flex-none">
            <rect x="9" y="9" width="11" height="11" rx="2" />
            <path d="M5 15V6a2 2 0 0 1 2-2h9" />
          </svg>
          <span aria-live="polite">{label}</span>
        </button>
        <a href={profile.github} target="_blank" rel="noopener" className={`${btn} border-rose bg-transparent text-paper hover:bg-paper hover:text-maroon`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className="h-[18px] w-[18px] flex-none">
            <path d="M8 7l-5 5 5 5M16 7l5 5-5 5" />
          </svg>
          {profile.githubLabel}
        </a>
      </div>

      <footer className="mt-[clamp(48px,7vw,88px)] flex flex-wrap justify-between gap-x-6 gap-y-2 border-t border-rose-deep pt-[22px] text-[0.82rem] text-rose">
        <p className="m-0">© {new Date().getFullYear()} {profile.firstName} {profile.lastName}</p>
        <p className="m-0">The illustrated me up top is 156 frames from an 8-second clip.</p>
      </footer>
    </Band>
  );
}
