import { experience } from '../data/content';
import { Band, DotList, SectionHead, Tags } from './ui';

export default function Experience() {
  return (
    <Band id="experience" labelledBy="experience-title" className="bg-blush py-[clamp(72px,10vw,120px)]">
      <SectionHead eyebrow="Experience" id="experience-title" title="Where I've " accent="been" />
      <ol className="m-0 grid list-none gap-[18px] p-0">
        {experience.map((e) => (
          <li
            key={e.title}
            className="grid gap-2.5 rounded-3xl border border-line bg-paper p-[clamp(22px,3vw,34px)] sm:grid-cols-[minmax(150px,200px)_minmax(0,1fr)] sm:gap-[clamp(16px,3vw,40px)]"
          >
            <div>
              <p className="m-0 text-[0.78rem] font-semibold tracking-[0.12em] text-ink-soft uppercase tabular-nums">{e.when}</p>
              {e.current && (
                <span className="mt-2.5 inline-block rounded-full bg-maroon px-2.5 py-[3px] text-[0.68rem] tracking-[0.14em] text-paper">NOW</span>
              )}
            </div>
            <div className="grid min-w-0 gap-3">
              <h3 className="m-0 font-display text-[clamp(1.4rem,2.6vw,1.9rem)] leading-[1.15] font-medium">{e.title}</h3>
              <p className="-mt-1.5 mb-0 font-medium text-maroon">{e.where}</p>
              {e.grade && (
                <p className="m-0 flex items-baseline gap-2 text-[0.78rem] font-semibold tracking-[0.14em] text-ink-soft uppercase">
                  <b className="font-display text-[2.2rem] font-medium tracking-normal text-maroon tabular-nums">{e.grade}</b> CGPA
                </p>
              )}
              {e.summary && <p className="m-0 max-w-[62ch] text-ink-soft">{e.summary}</p>}
              {e.points && <DotList items={e.points} />}
              {e.tags && <Tags items={e.tags} label="Stack" />}
            </div>
          </li>
        ))}
      </ol>
    </Band>
  );
}
