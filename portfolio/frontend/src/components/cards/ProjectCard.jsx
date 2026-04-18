export default function ProjectCard({ item, indexLabel }) {
  return (
    <article className="proj-card bg-white border border-border rounded-xl p-6 shadow-sm flex flex-col gap-3 transition-all duration-200 hover:shadow-md h-full">
      <div className="flex items-start justify-between gap-2">
        <span className="font-mono text-[10px] text-muted">{indexLabel || '01'}</span>
        <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-accent2-bg text-accent2 border border-[#9fd8cc]">
          Completed
        </span>
      </div>

      <h3 className="text-[17px] font-bold text-text mt-1">{item.title}</h3>

      {item.description && (
        <p className="text-[14px] text-muted leading-relaxed flex-1">
          {item.description}
        </p>
      )}

      {!!(item.tech && item.tech.length) && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {item.tech.map((t) => (
            <span key={t} className="font-mono text-[10px] px-2 py-0.5 rounded bg-accent-bg text-accent border border-[#c5bfef]">
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2 mt-4">
        {item.repoUrl && (
          <a
            href={item.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="proj-btn proj-btn-primary flex-1 justify-center"
          >
            GitHub ↗
          </a>
        )}
        <button className="proj-btn flex-1 justify-center">Details</button>
      </div>
    </article>
  );
}

