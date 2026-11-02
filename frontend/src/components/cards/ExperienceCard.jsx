import Icon from '../Icon.jsx';
export default function ExperienceCard({item}) {
 const dates=[item.startDate,item.endDate].filter(Boolean).filter((v,i,a)=>a.indexOf(v)===i).join(' – ');
 return <article className="education-card">
   <div className="education-symbol"><Icon name="book" size={23}/></div>
   <div className="education-body"><div className="education-dates">{dates}</div><h3>{item.company}</h3><p className="education-role">{item.role || item.degree}</p>{item.location && <p className="education-location">{item.location}</p>}{item.description && <p className="education-description">{item.description}</p>}{!!item.highlights?.length && <ul>{item.highlights.map(h=><li key={h}>{h}</li>)}</ul>}</div>
   {item.score && <div className="education-score"><strong>{item.score}</strong><span>{item.scoreLabel}</span></div>}
 </article>;
}
