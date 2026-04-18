export default function SectionHeader({ number, title, subtitle, action }) {
  return (
    <div className="mb-10 lg:mb-14">
      <div className="eyebrow mb-3">§ {number}</div>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl tracking-tightest leading-[0.95]">
          {title}
        </h1>
        {action && <div>{action}</div>}
      </div>
      {subtitle && (
        <p className="mt-5 max-w-2xl text-ink/70 leading-relaxed">{subtitle}</p>
      )}
      <div className="rule mt-8" />
    </div>
  );
}
