import { webUrl, profileImageUrl } from '../lib/webUrl.js';
import { Link } from 'react-router-dom';
import { useState, lazy, Suspense } from 'react';
import { useHomeData } from '../lib/useHomeData.js';
import { useRealtimeList } from '../lib/useRealtimeList.js';
import { useAuth } from '../context/AuthContext.jsx';
import Icon from '../components/Icon.jsx';
import ProjectCard from '../components/cards/ProjectCard.jsx';
import photoUrl from '../assets/photo-480.webp';
import photoSmallUrl from '../assets/photo-240.webp';
import { useLocalImage } from '../lib/localImages.js';
const HomeEditor = lazy(() => import('../components/editors/HomeEditor.jsx'));
export default function Home() {
  const { data, loading, error, save } = useHomeData();
  const { items: projects } = useRealtimeList('projects');
  const { items: education } = useRealtimeList('experience');
  const { isAdmin } = useAuth();
  const [editing, setEditing] = useState(false);
  const localAvatar = useLocalImage('profile');
  if (loading && !data) return <div className="home-loading" role="status"><div className="skeleton h-5 w-48 mb-8"/><div className="skeleton h-24 w-3/4 mb-6"/><div className="skeleton h-16 w-full"/><span className="sr-only">Loading profile</span></div>;
  if (!data) return <div className="section-page" role="alert"><h1>Taking a moment to connect.</h1><p>{error || 'Please refresh to load the portfolio.'}</p><button className="btn" onClick={() => window.location.reload()}>Try again</button></div>;
  const name = data.name || 'Suhaeb Nawab Shaik';
  const nameParts = name.trim().split(/\s+/);
  const surname = nameParts.length > 1 ? nameParts.pop() : '';
  const givenName = nameParts.join(' ');
  const avatar = profileImageUrl(data.avatarUrl) || localAvatar || photoUrl;
  const featured = projects.filter(p => p.description?.trim() || p.summary?.trim()).slice(0, 3);
  const university = education.find(e => e.kind === 'education' && /vit/i.test(e.company));
  const socials = [['GitHub', data.socials?.github], ['LinkedIn', data.socials?.linkedin], ['LeetCode', data.socials?.leetcode]].map(([label,url]) => [label,webUrl(url)]).filter(([,url]) => url);
  return <div className="page-in home-page">
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <div className="availability"><span/>Open to software engineering internships</div>
        <p className="hero-intro">Hello, I’m</p>
        <h1 id="hero-title">{givenName}{surname && <br/>}<span>{surname}<span className="name-dot">.</span></span></h1>
        <p className="hero-role">{data.tagline}</p>
        <p className="hero-summary">Java &amp; DSA at the core. Full-stack applications, real-time systems, and cloud deployments in practice.</p>
        <div className="hero-actions"><Link to="/projects" className="btn btn-ember">Explore my work <Icon name="external" size={18}/></Link><a href={webUrl(data.resumeUrl) || '/resume/Suhaeb_Shaik_SWE_Intern.pdf'} className="btn" download>Download resume <Icon name="download" size={17}/></a></div>
        <div className="hero-socials">{socials.map(([label,url]) => <a key={label} href={url} target="_blank" rel="noreferrer">{label}<Icon name="external" size={14}/></a>)}</div>
      </div>
      <div className="portrait-composition">
        <div className="portrait-heading"><span>THE PERSON BEHIND THE CODE</span><Icon name="code" size={18}/></div>
        <div className="portrait-frame"><img src={avatar} srcSet={avatar === photoUrl ? `${photoSmallUrl} 240w, ${photoUrl} 480w` : undefined} sizes="(max-width: 700px) 280px, 360px" width="360" height="420" fetchpriority="high" decoding="async" alt={name} className="hero-portrait" onError={event => { event.currentTarget.onerror = null; event.currentTarget.removeAttribute('srcset'); event.currentTarget.src = photoUrl; }}/><div className="portrait-caption"><span><span className="portrait-dot"/> Always learning. Always building.</span><Icon name="external" size={19}/></div></div>
        <div className="portrait-footnote"><Icon name="location" size={15}/><span>{data.location}</span></div>
      </div>
    </section>
    <div className="profile-facts"><div><span className="fact-value">VIT-AP<span> / 2027</span></span><span className="fact-label">B.Tech · Computer Science</span></div><div><span className="fact-value">{university?.score || '8.09 / 10'}</span><span className="fact-label">Current CGPA</span></div><div><span className="fact-value">GATE <span>2026</span></span><span className="fact-label">Qualified</span></div><a href={webUrl(data.socials?.leetcode) || 'https://leetcode.com/u/5uhaeb/'} target="_blank" rel="noreferrer"><span className="fact-value">Java &amp; DSA <Icon name="external" size={18}/></span><span className="fact-label">Practicing on LeetCode</span></a></div>
    <section className="home-section selected-work" aria-labelledby="selected-work-title"><div className="section-topline"><div><p className="section-kicker"><span>01</span>SELECTED WORK</p><h2 id="selected-work-title">Built to work in the real world<span>.</span></h2></div><Link to="/projects" className="text-link">All projects <Icon name="arrow" size={18}/></Link></div><p className="section-description">From authenticated task workflows to browser automation and live collaboration.</p><div className="home-projects">{featured.map((item,index) => <ProjectCard key={item._id} item={item} indexLabel={String(index+1).padStart(2,'0')} compact/>)}</div></section>
    <section className="home-section about-section" aria-labelledby="about-title"><div><p className="section-kicker"><span>02</span>HOW I THINK</p><h2 id="about-title">Good software starts<br/>with solid fundamentals<span>.</span></h2><p className="about-bio">{data.bio}</p><Link to="/skills" className="text-link">Explore my toolkit <Icon name="arrow" size={18}/></Link></div><div className="approach-list">{[['01','Problem-solving first','Data structures, algorithms, and consistent Java practice.'],['02','Across the stack','Interfaces, APIs, authentication, databases, and real-time communication.'],['03','Through to deployment','Docker, CI/CD, and cloud tooling to take a project beyond localhost.']].map(([n,title,text]) => <div className="approach" key={n}><span>{n}</span><div><h3>{title}</h3><p>{text}</p></div><Icon name="external" size={18}/></div>)}</div></section>
    <section className="contact-section" id="contact"><div><p className="section-kicker">HAVE SOMETHING IN MIND?</p><h2>Let’s build something<br/><span>worth putting out there.</span></h2><p>Open to internships, thoughtful teams, and interesting engineering problems.</p></div><a className="contact-email" href={`mailto:${data.email}`}><span>Start a conversation</span><strong>{data.email}</strong><Icon name="external" size={26}/></a></section>
    {isAdmin && <button className="btn admin-home-edit" onClick={() => setEditing(true)}>Edit home</button>}
    {editing && <Suspense fallback={null}><HomeEditor open={editing} onClose={() => setEditing(false)} initial={data} onSave={save}/></Suspense>}
  </div>;
}
