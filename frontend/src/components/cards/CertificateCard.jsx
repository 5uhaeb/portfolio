import { webUrl } from '../../lib/webUrl.js';
import { useLocalImage } from '../../lib/localImages.js';
import { useState } from 'react';
import Icon from '../Icon.jsx';
function CertificateImage({ src, title }) {
 const [failed,setFailed] = useState(false);
 if (failed) return <span className="text-sm text-muted p-4">Preview unavailable</span>;
 return <a href={src} target="_blank" rel="noreferrer" className="w-full h-full" aria-label={`Open ${title} image`}><img src={src} alt={`${title} certificate`} width="600" height="450" loading="lazy" decoding="async" onError={() => setFailed(true)}/></a>;
}
export default function CertificateCard({item}) {
 const preview=useLocalImage(`credential:${item._id}`), credentialUrl=webUrl(item.credentialUrl), image=webUrl(item.imageUrl)||preview;
 const issuer=item.issuer || 'Achievement';
 const monogram=/aws/i.test(issuer)?'aws':/hackerrank/i.test(issuer)?'H':/nptel/i.test(issuer)?'N':/ibm/i.test(issuer)?'IBM':/oracle/i.test(issuer)?'O':/gate|graduate aptitude/i.test(issuer)?'G':'S';
 return <article className={`credential-card ${item.kind === 'achievement' ? 'credential-achievement' : ''}`}>
   <div className="credential-top"><div className="credential-mark">{monogram}</div><span>{item.kind === 'achievement' ? 'ACHIEVEMENT' : 'CERTIFICATION'}</span><Icon name="check" size={17}/></div>
   {image && <div className="image-holder credential-image"><CertificateImage key={image} src={image} title={item.title}/></div>}
   <h3>{item.title}</h3><p className="credential-issuer">{issuer}</p>
   {item.description && <p className="credential-description">{item.description}</p>}
   {(item.issueDate || credentialUrl) && <div className="credential-bottom"><span>{item.issueDate}</span>{credentialUrl ? <a href={credentialUrl} target="_blank" rel="noreferrer">View credential <Icon name="external" size={16}/></a> : null}</div>}
 </article>;
}
