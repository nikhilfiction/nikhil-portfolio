import { featuredProject as f, projects, profile } from '../data/content';
import { Band, DotList, ProjectLinks, SectionHead, Tags } from './ui';

function QuakeDiagram() {
  return (
    <svg
      className="quake h-auto w-full max-w-[360px] justify-self-center overflow-visible md:max-w-[460px]"
      viewBox="0 0 400 260"
      role="img"
      aria-label="Diagram: a change in auth.ts ripples out to session.ts, login.ts, the orders API and middleware, while date utils and config stay untouched."
    >
      <circle className="ring" cx="200" cy="130" r="150" />
      <circle className="ring" cx="200" cy="130" r="150" />
      <circle className="ring" cx="200" cy="130" r="150" />
      <line className="edge hit" x1="200" y1="130" x2="112" y2="72" />
      <line className="edge hit" x1="200" y1="130" x2="292" y2="64" />
      <line className="edge hit" x1="200" y1="130" x2="310" y2="186" />
      <line className="edge hit" x1="112" y1="72" x2="52" y2="128" />
      <line className="edge" x1="200" y1="130" x2="128" y2="206" />
      <line className="edge" x1="292" y1="64" x2="352" y2="118" />
      <circle className="node hit" cx="112" cy="72" r="9" />
      <circle className="node hit" cx="292" cy="64" r="9" />
      <circle className="node hit" cx="310" cy="186" r="9" />
      <circle className="node hit" cx="52" cy="128" r="9" />
      <circle className="node" cx="128" cy="206" r="8" />
      <circle className="node" cx="352" cy="118" r="8" />
      <circle className="core" cx="200" cy="130" r="13" />
      <text x="200" y="162" textAnchor="middle">auth.ts (changed)</text>
      <text x="112" y="52" textAnchor="middle">session.ts</text>
      <text x="292" y="44" textAnchor="middle">login.ts</text>
      <text x="310" y="214" textAnchor="middle">orders API</text>
      <text x="52" y="156" textAnchor="middle">middleware</text>
      <text x="128" y="234" textAnchor="middle">date utils</text>
      <text x="352" y="146" textAnchor="middle">config</text>
    </svg>
  );
}

export default function Work() {
  return (
    <Band id="work" labelledBy="work-title" className="bg-paper py-[clamp(72px,10vw,128px)]">
      <SectionHead
        eyebrow="Selected work"
        id="work-title"
        title="Things I've "
        accent="built"
        lede="Mostly backends: auth, data models and the APIs in between, with enough frontend to show them off."
      />

      <article
        aria-labelledby="featured-title"
        className="grid items-center gap-[clamp(24px,4vw,56px)] rounded-[28px] border border-line bg-[radial-gradient(ellipse_70%_90%_at_85%_50%,var(--color-paper)_0%,var(--color-blush)_75%)] p-[clamp(24px,4vw,52px)] md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]"
      >
        <div className="grid min-w-0 gap-4">
          <p className="m-0 text-[0.72rem] font-semibold tracking-[0.2em] text-maroon uppercase">Featured project</p>
          <h3 id="featured-title" className="m-0 font-display text-[clamp(2.3rem,5vw,3.6rem)] leading-none font-medium">{f.name}</h3>
          <p className="m-0 max-w-[52ch] text-ink-soft">{f.summary}</p>
          <DotList items={f.points} />
          <Tags items={f.tags} label="Topics" />
          <ProjectLinks live={f.live} note={f.liveNote} code={f.code} />
        </div>
        <QuakeDiagram />
      </article>

      <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-5 p-0">
        {projects.map((p) => (
          <li
            key={p.name}
            className="grid min-w-0 grid-rows-[auto_auto_1fr_auto_auto] gap-3.5 rounded-[22px] border border-line bg-paper px-[26px] pt-7 pb-[26px] transition hover:-translate-y-[3px] hover:border-rose hover:shadow-[0_18px_40px_-26px_var(--color-rose-deep)]"
          >
            <h3 className="m-0 font-display text-[1.6rem] leading-[1.12] font-medium">{p.name}</h3>
            <p className="m-0 text-ink-soft">{p.summary}</p>
            <DotList items={p.points} className="text-[0.93rem]" />
            <Tags items={p.tags} label="Stack" />
            <ProjectLinks live={p.live} note={p.liveNote} code={p.code} />
          </li>
        ))}
      </ul>

      <a href={profile.github} target="_blank" rel="noopener" className="justify-self-start text-[0.95rem] font-semibold text-maroon underline-offset-4">
        More on GitHub →
      </a>
    </Band>
  );
}
