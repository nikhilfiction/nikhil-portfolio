import { about, skills } from '../data/content';
import { Band, SectionHead } from './ui';

export default function About() {
  return (
    <Band id="about" labelledBy="about-title" className="bg-paper py-[clamp(72px,10vw,128px)]">
      <SectionHead eyebrow="About" id="about-title" />

      <div className="grid items-start gap-[clamp(32px,6vw,88px)] md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <div>
          <p className="m-0 font-display text-[clamp(1.75rem,3.3vw,2.7rem)] leading-[1.2] font-normal text-balance">
            {about.statementStart}
            <em className="text-maroon">{about.statementEm}</em>
            {about.statementEnd}
          </p>
          <div className="mt-6 grid max-w-[58ch] gap-3.5 text-ink-soft">
            {about.bio.map((p) => <p key={p} className="m-0">{p}</p>)}
          </div>
        </div>

        <dl className="m-0 grid border-t border-line">
          {about.facts.map((f) => (
            <div key={f.label} className="grid gap-1 border-b border-line py-4 sm:grid-cols-[112px_minmax(0,1fr)] sm:gap-4">
              <dt className="pt-[3px] text-[0.72rem] font-semibold tracking-[0.16em] text-ink-soft uppercase">{f.label}</dt>
              <dd className="m-0">
                {f.highlight ? (
                  <span className="inline-flex items-center gap-2 font-semibold text-maroon before:h-2 before:w-2 before:rounded-full before:bg-maroon before:shadow-[0_0_0_4px_var(--color-blush)] before:content-['']">
                    {f.value}
                  </span>
                ) : (
                  f.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div aria-label="Skills" className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-x-8 gap-y-7">
        {skills.map((s) => (
          <div key={s.group} className="grid content-start gap-3">
            <h3 className="m-0 font-display text-[1.3rem] font-medium">{s.group}</h3>
            <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
              {s.items.map((i) => (
                <li key={i} className="rounded-full border border-line bg-paper px-[13px] py-1.5 text-[0.88rem]">{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="m-0 rounded-[18px] bg-blush px-[22px] py-[18px]">
        <b className="font-semibold text-maroon">Learning now:</b> {about.learning}
      </p>
    </Band>
  );
}
