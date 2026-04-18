export default function SkillCard({ item }) {
  const pct = Math.max(0, Math.min(100, Number(item.level) || 0));
  return (
    <div className="bg-paper py-5 px-5 lg:px-6 flex items-center gap-6 border-b border-ink/15">
      <div className="shrink-0 w-14">
        <div className="font-mono text-[10px] uppercase tracking-widest text-ink/55">
          {item.category || 'General'}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-display text-2xl md:text-3xl tracking-tightest truncate">
            {item.name}
          </h3>
          <div className="font-mono text-[11px] text-ink/60 whitespace-nowrap">
            {item.years ? `${item.years} yr${item.years === 1 ? '' : 's'}` : '—'}
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1 h-[2px] bg-ink/10 relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-ember"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="font-mono text-[11px] text-ink/60 w-10 text-right">{pct}%</div>
        </div>
      </div>
    </div>
  );
}
