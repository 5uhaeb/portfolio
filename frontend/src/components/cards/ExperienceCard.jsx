export default function ExperienceCard({ item }) {
  return (
    <article className="bg-white border border-border rounded-lg p-5 px-6 shadow-sm flex items-center justify-between gap-4 flex-wrap">
      <div className="flex-1 min-w-[240px]">
        <div className="text-[15px] font-bold text-text mb-0.5">
          {item.role || item.degree}
        </div>
        <div className="text-[13px] text-muted">
          {item.company || item.school}
        </div>
        <div className="inline-block font-mono text-[10px] px-2 py-0.5 rounded-full bg-accent-bg text-accent border border-[#c5bfef] mt-2">
          {item.startDate} {item.endDate ? `– ${item.endDate}` : ''}
        </div>
      </div>

      <div className="text-right">
        <div className="font-mono text-[15px] font-bold text-accent2">
          {item.score || item.cgpa || '8.04 / 10'}
        </div>
        <div className="text-[12px] text-muted mt-0.5">
          {item.scoreLabel || 'CGPA'}
        </div>
      </div>
    </article>
  );
}

