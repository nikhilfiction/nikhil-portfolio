import { useEffect, useState } from 'react';
import { profile } from '../data/content';

const links = [
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

export default function Nav() {
  const [solid, setSolid] = useState(false);
  // The name in the bar only appears once the big hero name has scrolled away
  const [showBrand, setShowBrand] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const heroName = document.getElementById('hero-name');
    if (!heroName || !('IntersectionObserver' in window)) { setShowBrand(true); return; }
    const io = new IntersectionObserver(([entry]) => setShowBrand(!entry.isIntersecting), {
      rootMargin: '-64px 0px 0px 0px',
    });
    io.observe(heroName);
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* Paints the phone's status-bar area so content never scrolls under it */}
      <div aria-hidden="true" className="fixed inset-x-0 top-0 z-[21] h-[env(safe-area-inset-top,0px)] bg-paper" />
      <nav
        aria-label="Main"
        className={`nav-pad fixed inset-x-0 top-0 z-20 flex items-center justify-between gap-4 border-b transition-[background-color,border-color,padding] duration-300 ${
          solid ? 'is-solid border-line bg-white/80 backdrop-blur-md' : 'border-transparent'
        }`}
      >
        <a
          href="#hero"
          aria-hidden={!showBrand}
          tabIndex={showBrand ? 0 : -1}
          className={`font-display text-[1.2rem] font-medium tracking-[0.01em] whitespace-nowrap text-ink no-underline transition duration-300 ${
            showBrand ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-1 opacity-0'
          }`}
        >
          {profile.firstName} <em className="font-normal text-maroon">{profile.lastName}</em>
        </a>
        <ul className="m-0 flex list-none gap-4 p-0 sm:gap-[clamp(16px,3vw,36px)]">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="text-[0.72rem] font-semibold tracking-[0.2em] text-ink-soft uppercase no-underline hover:text-maroon">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
