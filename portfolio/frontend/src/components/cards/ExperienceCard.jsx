export default function ExperienceCard({ item }) {
  return (
    <article className="grid grid-cols-12 gap-4 md:gap-8 py-8 md:py-10 border-b border-ink/15 relative">
      {/* Timeline marker */}
      <div className="col-span-12 md:col-span-3 lg:col-span-2 relative">
        <div className="font-mono text-xs text-ink/75 tracking-wider">
          {item.startDate || '—'} <span className="text-ink/40">→</span>{' '}
          <span className={item.endDate?.toLowerCase() === 'present' ? 'text-ember' : ''}>
            {item.endDate || '—'}
          </span>
        </div>
        {item.location && (
          <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-ink/50">
            {item.location}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="col-span-12 md:col-span-9 lg:col-span-10 md:border-l border-ink/15 md:pl-8 relative">
        {/* Dot on the rule */}
        <div className="hidden md:block absolute -left-[5px] top-1 w-[9px] h-[9px] bg-ember rounded-full" />

        <h3 className="font-display text-3xl md:text-4xl tracking-tightest leading-[1.05]">
          {item.role}
        </h3>
        <div className="mt-1 text-ink/75">
          <span className="font-medium">{item.company}</span>
        </div>

        {item.description && (
          <p className="mt-4 text-ink/70 leading-relaxed max-w-prose">{item.description}</p>
        )}

        {!!(item.highlights && item.highlights.length) && (
          <ul className="mt-4 space-y-2 max-w-prose">
            {item.highlights.map((h, i) => (
              <li key={i} className="flex gap-3 text-ink/80 leading-relaxed">
                <span className="font-mono text-ember mt-1.5 shrink-0">—</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
