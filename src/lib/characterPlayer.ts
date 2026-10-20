/**
 * Plays the character's frame sequence on a <canvas>.
 *
 * Runs entirely outside React: it owns a requestAnimationFrame loop and only
 * calls back into React when the speech bubble text changes.
 *
 * Frame map (source video: 192 frames at 24 fps; only these ranges ship):
 *   0–34    typing
 *   35–60   turns to look left
 *   77–104  turns to look right
 *   118–184 notices you, headphones down, waves, points
 */

export type Target = 'idle' | 'left' | 'right' | 'greet';

const RANGES: Record<Target, [number, number]> = {
  idle: [0, 34],
  left: [35, 60],
  right: [77, 104],
  greet: [118, 184],
};
const BASE = { left: 35, right: 77, greet: 118 } as const;
const LEFT_PEAK = 57;
const RIGHT_PEAK = 101;
export const GREET_END = 177;
const POINT_LOOP: [number, number] = [172, 182];
const REACTION_HOLD = 2400; // ms the look-left / look-right reaction is held
const W = 840;
const H = 720;

type Step =
  | { type: 'play'; to: number; fps: number }
  | { type: 'fade'; to: number; ms: number; t?: number }
  | { type: 'hold'; ms: number; t?: number }
  | { type: 'loop'; a: number; b: number; fps: number; dir: 1 | -1; ms?: number; t?: number }
  | { type: 'call'; fn: () => void };

const segOf = (f: number): Target => (f <= 34 ? 'idle' : f <= 76 ? 'left' : f <= 117 ? 'right' : 'greet');
const ease = (t: number) => t * t * (3 - 2 * t);

export class CharacterPlayer {
  private ctx: CanvasRenderingContext2D;
  private imgs: HTMLImageElement[] = [];
  private ready: boolean[] = [];
  private rangeReady: Record<Target, boolean> = { idle: false, left: false, right: false, greet: false };
  private cur = 0;
  private steps: Step[] = [];
  private target: Target = 'idle';
  private pending: { name: Target; opts: GoOptions } | null = null;
  private raf = 0;
  private last = 0;
  private lastKey = '';
  private lastMsg = '';
  private destroyed = false;
  private reduceMotion = false;

  constructor(
    canvas: HTMLCanvasElement,
    private framesPath: string,
    private onMessage: (msg: string) => void,
    private onFirstFrame: () => void,
  ) {
    this.ctx = canvas.getContext('2d')!;
  }

  /* ---------- Public API ---------- */

  async start(reduceMotion: boolean) {
    this.reduceMotion = reduceMotion;
    if (reduceMotion) {
      // One still pose, no motion
      await this.load(GREET_END);
      if (this.destroyed) return;
      this.cur = GREET_END;
      this.target = 'greet';
      this.ctx.drawImage(this.imgs[GREET_END], 0, 0, W, H);
      this.onFirstFrame();
      this.onMessage('Check out the portfolio');
      return;
    }
    await this.load(0);
    if (this.destroyed) return;
    this.draw();
    this.onFirstFrame();
    this.raf = requestAnimationFrame(this.frame);
    await this.loadRange('idle');
    await this.loadRange('greet');
    this.loadRange('left');
    this.loadRange('right');
  }

  isReady(name: Target) {
    return this.rangeReady[name];
  }

  go(name: Target, opts: GoOptions = {}) {
    if (this.reduceMotion || this.destroyed) return;
    if (!this.rangeReady[name]) { this.pending = { name, opts }; return; }
    if (name === this.target && !opts.force) return;
    this.settleFade();
    const seg = segOf(Math.round(this.cur));
    this.target = name;
    if (name === 'idle' && seg === 'idle') { this.steps = [this.idleLoop()]; return; }
    const pre = this.unwind();
    let post: Step[];
    if (name === 'idle') post = this.toIdle();
    else if (name === 'left') post = this.reaction(BASE.left, LEFT_PEAK);
    else if (name === 'right') post = this.reaction(BASE.right, RIGHT_PEAK);
    else post = this.greeting(Boolean(opts.finite));
    this.steps = [...pre, ...post];
  }

  destroy() {
    this.destroyed = true;
    cancelAnimationFrame(this.raf);
  }

  /* ---------- Loading ---------- */

  private src(i: number) {
    return `${this.framesPath}${String(i).padStart(3, '0')}.webp`;
  }

  private load(i: number) {
    return new Promise<void>((resolve) => {
      if (this.ready[i]) { resolve(); return; }
      const im = new Image();
      im.decoding = 'async';
      im.onload = () => { this.ready[i] = true; resolve(); };
      im.onerror = () => resolve();
      im.src = this.src(i);
      this.imgs[i] = im;
    });
  }

  private async loadRange(name: Target) {
    const [a, b] = RANGES[name];
    const jobs: Promise<void>[] = [];
    for (let i = a; i <= b; i++) jobs.push(this.load(i));
    await Promise.all(jobs);
    if (this.destroyed) return;
    this.rangeReady[name] = true;
    if (this.pending?.name === name) {
      const { opts } = this.pending;
      this.pending = null;
      this.go(name, opts);
    }
  }

  private nearestReady(i: number): number | null {
    if (this.ready[i]) return i;
    for (let d = 1; d < 12; d++) {
      if (this.ready[i - d] && segOf(i - d) === segOf(i)) return i - d;
      if (this.ready[i + d] && segOf(i + d) === segOf(i)) return i + d;
    }
    return this.ready[0] ? 0 : null;
  }

  /* ---------- Step queue ---------- */

  private idleLoop = (): Step => ({ type: 'loop', a: 0, b: 34, fps: 16, dir: 1 });
  private fadeTo = (to: number, ms: number): Step => ({ type: 'fade', to, ms });
  private toIdle = (): Step[] => [this.fadeTo(30, 160), this.idleLoop()];

  private reaction(base: number, peak: number): Step[] {
    return [
      this.fadeTo(base, 150),
      { type: 'play', to: peak, fps: 24 },
      { type: 'hold', ms: REACTION_HOLD },
      { type: 'call', fn: () => { this.target = 'idle'; } },
      { type: 'play', to: base, fps: 28 },
      ...this.toIdle(),
    ];
  }

  private greeting(finite: boolean): Step[] {
    const out: Step[] = [this.fadeTo(BASE.greet, 200), { type: 'play', to: GREET_END, fps: 24 }];
    if (!finite) {
      out.push({ type: 'loop', a: POINT_LOOP[0], b: POINT_LOOP[1], fps: 9, dir: 1 });
      return out;
    }
    out.push(
      { type: 'loop', a: POINT_LOOP[0], b: POINT_LOOP[1], fps: 9, dir: 1, ms: 3600 },
      { type: 'call', fn: () => { this.target = 'idle'; } },
      { type: 'play', to: BASE.greet, fps: 40 },
      ...this.toIdle(),
    );
    return out;
  }

  private settleFade() {
    const s = this.steps[0];
    if (s && s.type === 'fade' && (s.t ?? 0) / s.ms > 0.5) this.cur = s.to;
  }

  private unwind(): Step[] {
    const seg = segOf(Math.round(this.cur));
    if (seg === 'idle') return [];
    return [{ type: 'play', to: BASE[seg], fps: seg === 'greet' ? 50 : 40 }];
  }

  private update(dt: number) {
    for (let guard = 0; this.steps.length && guard < 12; guard++) {
      const s = this.steps[0];
      if (s.type === 'call') { this.steps.shift(); s.fn(); continue; }
      if (s.type === 'play') {
        const dir = Math.sign(s.to - this.cur);
        if (dir === 0) { this.steps.shift(); continue; }
        this.cur += dir * s.fps * dt;
        if ((dir > 0 && this.cur >= s.to) || (dir < 0 && this.cur <= s.to)) { this.cur = s.to; this.steps.shift(); }
        break;
      }
      if (s.type === 'fade') {
        if (Math.round(this.cur) === s.to) { this.steps.shift(); continue; }
        s.t = (s.t ?? 0) + dt * 1000;
        if (s.t >= s.ms) { this.cur = s.to; this.steps.shift(); }
        break;
      }
      if (s.type === 'hold') {
        s.t = (s.t ?? 0) + dt * 1000;
        if (s.t >= s.ms) this.steps.shift();
        break;
      }
      // loop
      if (this.cur < s.a || this.cur > s.b) this.cur = Math.min(s.b, Math.max(s.a, this.cur));
      this.cur += s.dir * s.fps * dt;
      if (this.cur >= s.b) { this.cur = s.b; s.dir = -1; } else if (this.cur <= s.a) { this.cur = s.a; s.dir = 1; }
      if (s.ms) { s.t = (s.t ?? 0) + dt * 1000; if (s.t >= s.ms) this.steps.shift(); }
      break;
    }
    if (!this.steps.length) this.steps.push(this.idleLoop());
  }

  /* ---------- Drawing and messages ---------- */

  private draw() {
    const head = this.steps[0];
    const a = this.nearestReady(Math.round(this.cur));
    if (a === null) return;
    let b: number | null = null;
    let t = 0;
    if (head && head.type === 'fade') { b = this.nearestReady(head.to); t = ease(Math.min(1, (head.t ?? 0) / head.ms)); }
    const key = `${a}|${b}|${t.toFixed(2)}`;
    if (key === this.lastKey) return;
    this.lastKey = key;
    this.ctx.globalAlpha = 1;
    this.ctx.drawImage(this.imgs[a], 0, 0, W, H);
    if (b !== null && t > 0) {
      this.ctx.globalAlpha = t;
      this.ctx.drawImage(this.imgs[b], 0, 0, W, H);
      this.ctx.globalAlpha = 1;
    }
  }

  private messageFor() {
    const f = Math.round(this.cur);
    const seg = segOf(f);
    if (seg === 'left' && this.target === 'left' && f >= 42) return 'Anyone here on the left?';
    if (seg === 'right' && this.target === 'right' && f >= 84) return 'Anyone here on the right?';
    if (seg === 'greet' && this.target === 'greet') {
      if (f < 150) return "Hey, it's you!";
      if (f < 172) return 'Hiiii!';
      return 'Check out the portfolio';
    }
    return '';
  }

  private frame = (now: number) => {
    if (this.destroyed) return;
    const dt = this.last ? Math.min(now - this.last, 50) / 1000 : 0;
    this.last = now;
    this.update(dt);
    this.draw();
    const msg = this.messageFor();
    if (msg !== this.lastMsg) { this.lastMsg = msg; this.onMessage(msg); }
    this.raf = requestAnimationFrame(this.frame);
  };
}

export interface GoOptions {
  /** Play the greeting once, then go back to typing (used on touch screens). */
  finite?: boolean;
  /** Restart even if this is already the current target. */
  force?: boolean;
}
