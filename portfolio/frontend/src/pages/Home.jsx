import { useState } from 'react';
import { useHomeData } from '../lib/useHomeData.js';
import { useAuth } from '../context/AuthContext.jsx';
import HomeEditor from '../components/editors/HomeEditor.jsx';

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

  return (
    <div className="page-in hero">
      <div className="hero-tag font-mono text-[11px] text-accent2 tracking-[0.14em] uppercase mb-5 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-accent2 animate-blink" />
        CS Undergrad · VIT-AP University
      </div>

      <h1 className="text-clamp(2.6rem,6vw,4.2rem) leading-[1.05] mb-5">
        Hello, I'm<br /><span className="text-accent italic">Suhaeb Shaik</span>
      </h1>

      <p className="hero-bio text-[15px] text-muted max-w-[460px] mb-8 leading-[1.75]">
        {data.bio || "Enthusiastic CS undergraduate with a strong foundation in programming, databases, and data analysis. I turn raw data into meaningful insights and build tools that matter."}
      </p>

      <div className="flex flex-wrap gap-2 mb-10">
        {["Python", "SQL", "Java"].map(s => <span key={s} className="chip chip-hi">{s}</span>)}
        {["Pandas", "Matplotlib"].map(s => <span key={s} className="chip chip-teal">{s}</span>)}
        {["DSA", "DBMS", "React"].map(s => <span key={s} className="chip">{s}</span>)}
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
        <div className="contact-item bg-white border border-border rounded-lg p-3 px-4 flex items-center gap-3 shadow-sm">
          <span className="font-mono text-[11px] text-accent2 min-w-[20px]">gh</span>
          <span className="text-[13px]">github.com/5uhaeb</span>
        </div>
        <div className="contact-item bg-white border border-border rounded-lg p-3 px-4 flex items-center gap-3 shadow-sm">
          <span className="font-mono text-[11px] text-accent2 min-w-[20px]">in</span>
          <span className="text-[13px]">linkedin@suhaeb</span>
        </div>
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

