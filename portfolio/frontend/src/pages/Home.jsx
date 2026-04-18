import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useHomeData } from '../lib/useHomeData.js';
import { useAuth } from '../context/AuthContext.jsx';
import HomeEditor from '../components/editors/HomeEditor.jsx';

const SOCIAL_LABELS = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
  twitter: 'Twitter',
  website: 'Website',
};

export default function Home() {
  const { data, loading, save } = useHomeData();
  const { isAdmin } = useAuth();
  const [editing, setEditing] = useState(false);

  if (loading && !data) {
    return (
      <div className="page-in mx-auto max-w-7xl px-6 lg:px-10 py-20 font-mono text-ink/50">
        Loading…
      </div>
    );
  }
  if (!data) return null;

  const socialEntries = Object.entries(data.socials || {}).filter(([, v]) => v);

  return (
    <div className="page-in mx-auto max-w-7xl px-6 lg:px-10 py-16 lg:py-24">
      <div className="grid grid-cols-12 gap-8">
        {/* Left column — eyebrow + meta */}
        <aside className="col-span-12 lg:col-span-4 lg:pt-6 order-2 lg:order-1">
          <div className="eyebrow mb-4">§ 01 — Introduction</div>

          {data.avatarUrl && (
            <div className="mb-6 w-40 h-40 border border-ink/20 overflow-hidden rounded-full">
              <img src={data.avatarUrl} alt={data.name} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="space-y-2 text-sm text-ink/70">
            {data.location && (
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-ink/50 mr-2">Based</span>
                {data.location}
              </div>
            )}
            {data.email && (
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-ink/50 mr-2">Email</span>
                <a href={`mailto:${data.email}`} className="hover:text-ember border-b border-transparent hover:border-ember">
                  {data.email}
                </a>
              </div>
            )}
          </div>

          {socialEntries.length > 0 && (
            <div className="mt-6 space-y-1">
              <div className="eyebrow mb-2">Elsewhere</div>
              <ul className="space-y-1">
                {socialEntries.map(([k, v]) => (
                  <li key={k}>
                    <a
                      href={v.startsWith('http') ? v : `https://${v}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-baseline gap-2 text-ink hover:text-ember"
                    >
                      <span className="font-mono text-[11px] text-ink/50">→</span>
                      <span>{SOCIAL_LABELS[k] || k}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {isAdmin && (
            <button className="btn-ember mt-8" onClick={() => setEditing(true)}>
              Edit home
            </button>
          )}
        </aside>

        {/* Main column — hero */}
        <section className="col-span-12 lg:col-span-8 order-1 lg:order-2">
          <div className="eyebrow mb-4">Hello —</div>
          <h1 className="font-display tracking-tightest leading-[0.92] text-ink text-[3rem] md:text-[5rem] lg:text-[6.5rem]">
            I’m <span className="italic">{data.name || 'Your Name'}</span>.
          </h1>
          <p className="mt-5 font-display italic text-2xl md:text-3xl text-ink/75 tracking-tight">
            {data.role}
          </p>
          {data.tagline && (
            <p className="mt-8 max-w-2xl text-lg md:text-xl text-ink leading-relaxed">
              {data.tagline}
            </p>
          )}
          {data.bio && (
            <p className="mt-6 max-w-2xl text-ink/75 leading-relaxed">{data.bio}</p>
          )}

          <div className="mt-14 rule" />
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-6 font-mono text-xs text-ink/60">
            <Link to="/skills" className="hover:text-ember">
              <span className="block text-ink/40">02</span>Skills →
            </Link>
            <Link to="/projects" className="hover:text-ember">
              <span className="block text-ink/40">03</span>Projects →
            </Link>
            <Link to="/experience" className="hover:text-ember">
              <span className="block text-ink/40">04</span>Experience →
            </Link>
            <Link to="/certificates" className="hover:text-ember">
              <span className="block text-ink/40">05</span>Certificates →
            </Link>
          </div>
        </section>
      </div>

      <HomeEditor
        open={editing}
        onClose={() => setEditing(false)}
        initial={data}
        onSave={save}
      />
    </div>
  );
}
