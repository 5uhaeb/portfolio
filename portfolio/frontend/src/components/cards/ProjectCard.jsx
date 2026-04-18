export default function ProjectCard({ item, indexLabel }) {
  return (
    <article className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 py-10 border-b border-ink/15">
      {/* Image — large, sits on the left on desktop */}
      <div className="md:col-span-5">
        <div className="aspect-[4/3] bg-ink/5 border border-ink/10 overflow-hidden">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-display text-5xl text-ink/20">—</span>
            </div>
          )}
        </div>
      </div>

      {/* Copy — right column */}
      <div className="md:col-span-7 flex flex-col">
        <div className="flex items-baseline justify-between gap-4">
          <span className="font-mono text-[11px] uppercase tracking-widest text-ember">
            {indexLabel || '·'}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-widest text-ink/50">
            {item.year || ''}
          </span>
        </div>

        <h3 className="mt-2 font-display text-4xl md:text-5xl tracking-tightest leading-[1] text-ink">
          {item.title}
        </h3>

        {item.summary && (
          <p className="mt-4 text-ink/80 font-body text-lg leading-relaxed max-w-prose">
            {item.summary}
          </p>
        )}

        {item.description && (
          <p className="mt-3 text-ink/65 leading-relaxed max-w-prose">
            {item.description}
          </p>
        )}

        {!!(item.tech && item.tech.length) && (
          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
            {item.tech.map((t) => (
              <span
                key={t}
                className="font-mono text-[11px] uppercase tracking-widest text-ink/70"
              >
                / {t}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-6 flex flex-wrap gap-5">
          {item.liveUrl && (
            <a
              href={item.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 text-ink border-b border-ember pb-0.5 hover:text-ember"
            >
              <span className="font-body">Live site</span>
              <span className="font-mono text-xs transition-transform group-hover:translate-x-0.5">↗</span>
            </a>
          )}
          {item.repoUrl && (
            <a
              href={item.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 text-ink/70 hover:text-ink"
            >
              <span className="font-body">Source</span>
              <span className="font-mono text-xs transition-transform group-hover:translate-x-0.5">→</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
