import { webUrl } from '../lib/webUrl.js';
import { Link } from 'react-router-dom';
import { useState, lazy, Suspense } from 'react';
import { useHomeData } from '../lib/useHomeData.js';
import { useAuth } from '../context/AuthContext.jsx';
const HomeEditor = lazy(() => import('../components/editors/HomeEditor.jsx'));
import photoUrl from '../assets/photo-480.webp';
import photoSmallUrl from '../assets/photo-240.webp';
import { useLocalImage } from '../lib/localImages.js';

export default function Home() {
  const { data, loading, error, save } = useHomeData();
  const { isAdmin } = useAuth();
  const [editing, setEditing] = useState(false);
  const localAvatar = useLocalImage('profile');

  if (loading && !data) {
    return (
      <div className="py-8" role="status" aria-label="Loading profile">
        <div className="skeleton h-5 w-48 mb-8" /><div className="skeleton h-24 w-3/4 mb-6" /><div className="skeleton h-16 w-full" /><span className="sr-only">Loading profile…</span>
      </div>
    );
  }
  if (!data) return <p role="alert">{error || "No profile available."}</p>;

  const name = data.name || 'Suhaeb Shaik';
  const role = data.role || 'CS Undergrad · VIT-AP University';
  const avatar = localAvatar || data.avatarUrl || photoUrl;
  const socialLinks = [
    ['gh', 'GitHub', data.socials?.github],
    ['in', 'LinkedIn', data.socials?.linkedin],
    ['x', 'X / Twitter', data.socials?.twitter],
    ['web', 'Website', data.socials?.website],
  ].map(([icon, label, url]) => [icon, label, webUrl(url)]).filter(([, , url]) => url);

  return (
    <div className="page-in hero">
      <div className="flex flex-col-reverse md:flex-row gap-10 items-start md:items-center mb-10">
        <div className="flex-1">
          <div className="hero-tag font-mono text-[11px] text-accent2 tracking-[0.14em] uppercase mb-5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent2 animate-blink" />
            {role}
          </div>

          <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05] mb-5">
            Hello, I'm<br /><span className="text-accent">{name}.</span>
          </h1>
          {data.tagline && <p className="text-base text-text max-w-[500px]">{data.tagline}</p>}
          <div className="hero-actions"><Link to="/projects" className="proj-btn proj-btn-primary">Explore my work <span aria-hidden="true">↗</span></Link><Link to="/certificates" className="proj-btn">View credentials</Link></div>
        </div>
        <div className="shrink-0">
          <img 
            src={avatar}
            srcSet={avatar === photoUrl ? `${photoSmallUrl} 240w, ${photoUrl} 480w` : undefined}
            sizes="(max-width: 767px) 160px, 240px"
            width="240" height="280" fetchpriority="high" decoding="async"
            onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.removeAttribute('srcset'); event.currentTarget.src = photoUrl; }}
            alt={name}
            className="hero-portrait"
          />
        </div>
      </div>

      <div className="sec-head"><span className="sec-label">A little about me</span><div className="sec-line" /></div>
      <p className="hero-bio text-base text-muted max-w-[650px] mb-8 leading-[1.8]">
        {data.bio || "Enthusiastic CS undergraduate with a strong foundation in programming, databases, and data analysis. I turn raw data into meaningful insights and build tools that matter."}
      </p>

      <div className="contact-grid grid grid-cols-1 md:grid-cols-2 gap-[10px] max-w-[520px]">
        {data.email && (
          <div className="contact-item border border-border rounded-lg p-3 px-4 flex items-center gap-3">
            <span className="font-mono text-[11px] text-accent2 min-w-[20px]">@</span>
            <span className="text-[13px]">{data.email}</span>
          </div>
        )}
        {data.phone && (
          <div className="contact-item border border-border rounded-lg p-3 px-4 flex items-center gap-3">
            <span className="font-mono text-[11px] text-accent2 min-w-[20px]">tel</span>
            <span className="text-[13px]">{data.phone}</span>
          </div>
        )}
        {socialLinks.map(([icon, label, url]) => (
          <a
            key={label}
            href={url}
            target="_blank"
            rel="noreferrer"
            className="contact-item border border-border rounded-lg p-3 px-4 flex items-center gap-3 hover:border-accent transition-colors"
          >
            <span className="font-mono text-[11px] text-accent2 min-w-[20px]">{icon}</span>
            <span className="text-[13px]">{label}</span>
          </a>
        ))}
        {data.location && (
          <div className="contact-item border border-border rounded-lg p-3 px-4 flex items-center gap-3">
            <svg className="w-4 h-4 text-accent2 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2"/></svg>
            <span className="text-[13px]">{data.location}</span>
          </div>
        )}
      </div>

      {isAdmin && (
        <button
          className="mt-12 proj-btn proj-btn-primary px-6 py-2"
          onClick={() => setEditing(true)}
        >
          Edit home
        </button>
      )}

      {editing && <Suspense fallback={null}><HomeEditor
        open={editing}
        onClose={() => setEditing(false)}
        initial={data}
        onSave={save}
      /></Suspense>}
    </div>
  );
}

