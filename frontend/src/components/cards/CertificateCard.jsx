import { webUrl } from '../../lib/webUrl.js';
import { useLocalImage } from '../../lib/localImages.js';

export default function CertificateCard({ item }) {
  const preview = useLocalImage(`credential:${item._id}`);
  const credentialUrl = webUrl(item.credentialUrl);
  return (
    <article className="proj-card p-6 flex flex-col gap-2 h-full">
      <div className="image-holder mb-3">
        {preview ? <img src={preview} alt={`${item.title} preview`} /> : (
          <div className="text-center p-4 text-muted">
            <svg className="w-8 h-8 mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 4h16v16H4z"/><path d="m4 16 4-4 3 3 3-3 6 6"/><circle cx="9" cy="9" r="1"/>
            </svg>
            <span className="text-xs">Browser-local snapshot</span>
          </div>
        )}
      </div>
      <span className="label-tag">{item.kind}</span>
      <h3 className="text-[16px] text-text leading-tight">{item.title}</h3>
      {item.issuer && <div className="text-[12px] text-muted">{item.issuer}</div>}
      {item.description && <p className="text-[12px] text-muted leading-relaxed">{item.description}</p>}
      {item.issueDate && <div className="font-mono text-[11px] text-muted mt-auto pt-2">{item.issueDate}</div>}
      {credentialUrl && (
        <a href={credentialUrl} target="_blank" rel="noreferrer" className="proj-btn btn-sm mt-2 justify-center">
          Verify
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 3h7v7"/><path d="m10 14 11-11"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></svg>
        </a>
      )}
    </article>
  );
}
