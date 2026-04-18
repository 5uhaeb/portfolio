export default function CertificateCard({ item }) {
  return (
    <article className="proj-card bg-white border border-border rounded-xl p-6 shadow-sm flex flex-col gap-2 h-full">
      <div className="w-9 h-9 border border-border rounded-lg bg-accent-bg flex items-center justify-center text-accent text-[18px] mb-1">
        {item.kind === 'achievement' ? '★' : '📜'}
      </div>

      <h3 className="text-[14px] font-bold text-text leading-tight">
        {item.title}
      </h3>

      {item.issuer && (
        <div className="text-[12px] text-muted">
          {item.issuer}
        </div>
      )}

      {item.issueDate && (
        <div className="font-mono text-[11px] text-accent2 mt-auto pt-2">
          {item.issueDate}
        </div>
      )}

      {item.credentialUrl && (
        <a
          href={item.credentialUrl}
          target="_blank"
          rel="noreferrer"
          className="proj-btn mt-2 justify-center"
        >
          Verify ↗
        </a>
      )}
    </article>
  );
}

