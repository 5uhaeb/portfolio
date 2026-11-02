import { webUrl } from '../../lib/webUrl.js';
import Icon from '../Icon.jsx';
export default function ProjectCard({ item, indexLabel, compact = false }) {
  const repoUrl = webUrl(item.repoUrl), liveUrl = webUrl(item.liveUrl), imageUrl = webUrl(item.imageUrl);
  const type = /taskflow/i.test(item.title) ? 'FULL-STACK APPLICATION' : /scrapy/i.test(item.title) ? 'AUTOMATION & DATA' : /watchparty/i.test(item.title) ? 'REAL-TIME COLLABORATION' : 'SOFTWARE PROJECT';
  return <article className={`proj-card project-card ${compact ? 'project-compact' : ''}`}>
    <div className="project-top"><span className="project-index">{indexLabel || '01'} /</span><span>{type}</span><Icon name="code" size={20}/></div>
    {imageUrl && <img className="project-image" src={imageUrl} alt={`${item.title} interface`} loading="lazy" decoding="async" onError={event => { event.currentTarget.style.display = 'none'; }}/ >}
    <h3>{item.title}</h3>
    {item.summary && <p className="project-summary">{item.summary}</p>}
    {item.description && <div className="project-description">{(compact ? item.description.split('\n').slice(0,1) : item.description.split('\n')).filter(Boolean).map((line,index) => <p key={index}>{line}</p>)}</div>}
    {!!item.tech?.length && <div className="project-stack">{(compact ? item.tech.slice(0,4) : item.tech).map(t => <span key={t}>{t}</span>)}</div>}
    <div className="project-links">{liveUrl && <a href={liveUrl} target="_blank" rel="noreferrer">Live project <Icon name="external" size={17}/></a>}{repoUrl && <a href={repoUrl} target="_blank" rel="noreferrer">Source code <Icon name="code" size={17}/></a>}</div>
  </article>;
}
