import { useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { CharacterPlayer, type Target } from '../lib/characterPlayer';
import { useMediaQuery } from '../lib/useMediaQuery';
import { profile } from '../data/content';

type Zone = 'none' | 'left' | 'center' | 'right';

const zoneFromX = (x: number, rect: DOMRect): Exclude<Zone, 'none'> => {
  const p = (x - rect.left) / rect.width;
  return p < 0.36 ? 'left' : p > 0.64 ? 'right' : 'center';
};
const targetFor = (z: Zone): Target => (z === 'center' ? 'greet' : z === 'left' ? 'left' : z === 'right' ? 'right' : 'idle');

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerRef = useRef<CharacterPlayer | null>(null);

  // A real mouse gets cursor zones at any window width; touch screens get taps.
  const hasMouse = useMediaQuery('(hover: hover) and (pointer: fine)');
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const [firstFrame, setFirstFrame] = useState(false);
  const [reply, setReply] = useState({ text: '', on: false, id: 0 });

  /* Start the player once; it lives outside React's render cycle */
  useEffect(() => {
    const canvas = canvasRef.current!;
    const player = new CharacterPlayer(
      canvas,
      `${import.meta.env.BASE_URL}frames/`,
      (msg) => setReply((r) => (msg ? { text: msg, on: true, id: r.id + 1 } : { ...r, on: false })),
      () => setFirstFrame(true),
    );
    playerRef.current = player;
    player.start(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    return () => player.destroy();
  }, []);

  /* Cursor zones */
  useEffect(() => {
    if (!hasMouse) return;
    playerRef.current?.go('idle');
    let zone: Zone = 'none';
    let timer = 0;
    const setZone = (z: Zone) => {
      if (z === zone) return;
      zone = z;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => playerRef.current?.go(targetFor(z)), z === 'center' ? 80 : 120);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch' || !heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const inside = e.clientY >= rect.top && e.clientY <= rect.bottom && e.clientX >= rect.left && e.clientX <= rect.right;
      setZone(inside ? zoneFromX(e.clientX, rect) : 'none');
    };
    const onOut = (e: globalThis.MouseEvent) => { if (!e.relatedTarget) setZone('none'); };
    const onBlur = () => setZone('none');
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('mouseout', onOut);
    window.addEventListener('blur', onBlur);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('mouseout', onOut);
      window.removeEventListener('blur', onBlur);
    };
  }, [hasMouse]);

  /* Touch screens: greet once when he scrolls into view */
  useEffect(() => {
    if (hasMouse || reduceMotion || !stageRef.current || !('IntersectionObserver' in window)) return;
    let timer = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting && e.intersectionRatio > 0.6)) {
          io.disconnect();
          const tryGreet = () => {
            const p = playerRef.current;
            if (p?.isReady('greet')) p.go('greet', { finite: true, force: true });
            else timer = window.setTimeout(tryGreet, 300);
          };
          timer = window.setTimeout(tryGreet, 1400);
        }
      },
      { threshold: [0.6] },
    );
    io.observe(stageRef.current);
    return () => { io.disconnect(); window.clearTimeout(timer); };
  }, [hasMouse, reduceMotion]);

  const onStageClick = (e: MouseEvent) => {
    if (hasMouse) { playerRef.current?.go('greet'); return; }
    e.stopPropagation();
    playerRef.current?.go('greet', { finite: true, force: true });
  };

  // Touch: tap the left or right side to make him look there
  const onHeroClick = (e: MouseEvent<HTMLElement>) => {
    if (hasMouse || (e.target as HTMLElement).closest('a')) return;
    const z = zoneFromX(e.clientX, e.currentTarget.getBoundingClientRect());
    if (z === 'center') playerRef.current?.go('greet', { finite: true, force: true });
    else playerRef.current?.go(z, { force: true });
  };

  const hint = reduceMotion ? 'Hi, glad you stopped by' : hasMouse ? 'Move cursor to call me!' : 'Tap left, right, or on me!';

  return (
    <section
      ref={heroRef}
      id="hero"
      aria-label="Introduction"
      onClick={onHeroClick}
      className="hero-glow px-safe relative isolate flex flex-col items-center gap-[22px] overflow-hidden pt-[88px] pb-[92px] desk:grid desk:min-h-[min(100svh,1000px)] desk:place-items-center desk:gap-0 desk:pt-[76px] desk:pb-16"
    >
      <div className="z-[2] grid max-w-[34rem] justify-items-center gap-[18px] text-center desk:absolute desk:left-[max(32px,4.5vw)] desk:top-1/2 desk:max-w-[calc(var(--side)+40px)] desk:-translate-y-[62%] desk:justify-items-start desk:text-left">
        <h1 id="hero-name" className="m-0 font-display text-[clamp(2.4rem,10vw,3.6rem)] leading-[0.98] font-medium tracking-[-0.015em] text-balance desk:text-[clamp(2.6rem,4.6vw,4.9rem)]">
          <span className="desk:block">{profile.firstName}</span>{' '}
          <em className="font-normal text-maroon">{profile.lastName}</em>
        </h1>
        <p className="m-0 text-[0.72rem] font-semibold tracking-[0.22em] text-balance text-ink-soft uppercase">
          {profile.role} <b className="font-semibold text-maroon">·</b> {profile.focus}
        </p>
        <p className="mt-1.5 mb-0 inline-flex items-center gap-2.5 rounded-full border border-line bg-white/70 py-[9px] pr-4 pl-3 text-[0.86rem] font-medium shadow-[0_6px_20px_-12px_var(--color-rose-deep)] backdrop-blur-sm desk:justify-self-start">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-[18px] w-[18px] flex-none animate-drift text-maroon">
            <path d="M5 3l14 7.5-6.2 1.6L10 18.5 5 3z" fill="currentColor" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          </svg>
          <span>{hint}</span>
        </p>
      </div>

      <div className="stage-wrap">
        <button
          ref={stageRef}
          type="button"
          onClick={onStageClick}
          aria-label={`Say hi to ${profile.firstName}`}
          className="block h-full w-full cursor-pointer rounded-3xl border-0 bg-transparent p-0 focus-visible:outline-offset-[-6px] desk:cursor-default"
        >
          <canvas
            ref={canvasRef}
            width={840}
            height={720}
            role="img"
            aria-label={`Illustrated ${profile.firstName} working on a laptop. He looks toward your cursor and waves when you come to the centre.`}
            className={`char-canvas ${firstFrame ? 'is-ready' : ''}`}
          />
        </button>
        <p key={reply.id} className={`reply ${reply.on ? 'is-on' : ''}`} aria-live="polite">
          {reply.text}
        </p>
      </div>

      <a
        href="#work"
        className="absolute bottom-[calc(18px+env(safe-area-inset-bottom,0px))] left-1/2 z-[2] inline-flex -translate-x-1/2 flex-col items-center gap-1.5 text-[0.68rem] font-semibold tracking-[0.24em] text-ink-soft uppercase no-underline hover:text-maroon"
      >
        See my work
        <i aria-hidden="true" className="block h-[26px] w-px origin-top animate-fall bg-gradient-to-b from-maroon to-transparent" />
      </a>
    </section>
  );
}
