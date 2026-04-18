export default function CertificateCard({ item }) {
  const isAchievement = item.kind === 'achievement';
  return (
    <article className="relative bg-paper border border-ink/15 p-6 flex flex-col h-full hover:border-ink transition-colors">
      {/* Seal in the corner */}
      <div className="absolute -top-3 -right-3 h-12 w-12 rounded-full bg-paper border border-ink/25 flex items-center justify-center">
        <div
          className={`h-8 w-8 rounded-full flex items-center justify-center font-mono text-[10px] tracking-widest ${
            isAchievement ? 'bg-ember text-paper' : 'bg-ink text-paper'
          }`}
        >
          {isAchievement ? '★' : '✓'}
        </div>
      </div>

      <div className="eyebrow mb-2">
        {isAchievement ? 'Achievement' : 'Certificate'}
        {item.issueDate ? ` · ${item.issueDate}` : ''}
      </div>

      <h3 className="font-display text-2xl leading-tight tracking-tightest mb-2">
        {item.title}
      </h3>

      {item.issuer && (
        <div className="text-ink/70">
          <span className="font-mono text-[11px] uppercase tracking-widest text-ink/50 mr-2">by</span>
          {item.issuer}
        </div>
      )}

      {item.description && (
        <p className="mt-3 text-sm text-ink/70 leading-relaxed">{item.description}</p>
      )}

      <div className="mt-auto pt-5 flex items-center justify-between border-t border-ink/10">
        {item.credentialId ? (
          <span className="font-mono text-[10px] text-ink/50">
            ID <span className="text-ink/80">{item.credentialId}</span>
          </span>
        ) : (
          <span />
        )}
        {item.credentialUrl && (
          <a
            href={item.credentialUrl}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-[11px] uppercase tracking-widest text-ember hover:text-ink"
          >
            Verify ↗
          </a>
        )}
      </div>
    </article>
  );
}
