export default function ExperienceCard({ item }) {
  return (
    <article className="experience-card p-5 px-6 flex items-start justify-between gap-5 flex-wrap">
      <div className="flex-1 min-w-[240px]">
        <div className="text-[15px] font-bold text-text mb-0.5">
          {item.role || item.degree}
        </div>
        <div className="text-[13px] text-muted">
          {item.company}{item.location ? ` · ${item.location}` : ''}
        </div>
        <div className="inline-block font-mono text-[10px] px-2 py-0.5 rounded-full bg-accent-bg text-accent border border-[#c5bfef] mt-2">
          {item.startDate} {item.endDate ? `– ${item.endDate}` : ''}
        </div>
        {item.description && <p className="text-[13px] text-muted leading-relaxed mt-3">{item.description}</p>}
        {!!item.highlights?.length && (
          <ul className="text-[13px] text-muted leading-relaxed mt-2 list-disc pl-5">
            {item.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
          </ul>
        )}
      </div>

      {item.score && <div className="text-right">
        <div className="font-mono text-[15px] font-bold text-accent2">
          {item.score}
        </div>
        <div className="text-[12px] text-muted mt-0.5">
          {item.scoreLabel}
        </div>
      </div>}
    </article>
  );
}

