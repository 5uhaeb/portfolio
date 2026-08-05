import { useState } from 'react';
import { useHomeData } from '../lib/useHomeData.js';
import { useAuth } from '../context/AuthContext.jsx';
import HomeEditor from '../components/editors/HomeEditor.jsx';
import photoUrl from '../assets/photo.jpg';

export default function Home() {
  const { data, loading, save } = useHomeData();
  const { isAdmin } = useAuth();
  const [editing, setEditing] = useState(false);

  if (loading && !data) {
    return (
      <div className="page-in py-20 font-mono text-muted">
        Loading…
      </div>
    );
  }
  if (!data) return null;

  const name = data.name || 'Suhaeb Shaik';
  const role = data.role || 'CS Undergrad · VIT-AP University';
  const avatar = data.avatarUrl || photoUrl;
  const socialLinks = [
    ['gh', 'GitHub', data.socials?.github],
    ['in', 'LinkedIn', data.socials?.linkedin],
    ['x', 'X / Twitter', data.socials?.twitter],
    ['web', 'Website', data.socials?.website],
  ].filter(([, , url]) => url);

  return (
    <div className="page-in hero">
      <div className="flex flex-col md:flex-row gap-10 items-start md:items-center mb-8">
        <div className="flex-1">
          <div className="hero-tag font-mono text-[11px] text-accent2 tracking-[0.14em] uppercase mb-5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent2 animate-blink" />
            {role}
          </div>

          <h1 className="text-[clamp(2.6rem,6vw,4.2rem)] leading-[1.05] mb-5">
            Hello, I'm<br /><span className="text-accent italic">{name}</span>
          </h1>
          {data.tagline && <p className="text-base text-text max-w-[500px]">{data.tagline}</p>}
        </div>
        <div className="shrink-0">
          <img 
            src={avatar}
            alt={name}
            className="w-40 h-40 md:w-48 md:h-48 object-cover rounded-full border-4 border-surface shadow-md"
          />
        </div>
      </div>

      <p className="hero-bio text-[15px] text-muted max-w-[460px] mb-8 leading-[1.75]">
        {data.bio || "Enthusiastic CS undergraduate with a strong foundation in programming, databases, and data analysis. I turn raw data into meaningful insights and build tools that matter."}
      </p>

      <div className="flex flex-wrap gap-2 mb-10">
        {["C", "Java", "JavaScript"].map(s => <span key={s} className="chip chip-hi">{s}</span>)}
        {["HTML", "CSS", "AWS"].map(s => <span key={s} className="chip chip-teal">{s}</span>)}
        {["Docker", "Kubernetes", "DSA"].map(s => <span key={s} className="chip">{s}</span>)}
      </div>

      <div className="contact-grid grid grid-cols-1 md:grid-cols-2 gap-[10px] max-w-[520px]">
        {data.email && (
          <div className="contact-item bg-white border border-border rounded-lg p-3 px-4 flex items-center gap-3 shadow-sm">
            <span className="font-mono text-[11px] text-accent2 min-w-[20px]">@</span>
            <span className="text-[13px]">{data.email}</span>
          </div>
        )}
        {data.phone && (
          <div className="contact-item bg-white border border-border rounded-lg p-3 px-4 flex items-center gap-3 shadow-sm">
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
            className="contact-item bg-white border border-border rounded-lg p-3 px-4 flex items-center gap-3 shadow-sm hover:border-accent transition-colors"
          >
            <span className="font-mono text-[11px] text-accent2 min-w-[20px]">{icon}</span>
            <span className="text-[13px]">{label}</span>
          </a>
        ))}
        {data.location && (
          <div className="contact-item bg-white border border-border rounded-lg p-3 px-4 flex items-center gap-3 shadow-sm">
            <span className="font-mono text-[11px] text-accent2 min-w-[20px]">📍</span>
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

      <HomeEditor
        open={editing}
        onClose={() => setEditing(false)}
        initial={data}
        onSave={save}
      />
    </div>
  );
}

