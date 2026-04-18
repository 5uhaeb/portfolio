import { useState } from 'react';
import { useRealtimeList } from '../lib/useRealtimeList.js';
import { useAuth } from '../context/AuthContext.jsx';
import EditShell from '../components/EditShell.jsx';
import SkillEditor from '../components/editors/SkillEditor.jsx';

const CATEGORY_STYLES = {
  'programming languages': 'hi',
  'data & analytics': 'teal',
  'web & tools': 'amber',
  'concepts & theory': '',
  'soft skills': '',
};

export default function Skills() {
  const { items, loading, create, update, remove, reorder } = useRealtimeList('skills');
  const { isAdmin } = useAuth();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  function openNew() { setEditing(null); setEditorOpen(true); }
  function openEdit(item) { setEditing(item); setEditorOpen(true); }
  async function onSave(payload) {
    if (editing) await update(editing._id, payload);
    else await create(payload);
  }
  async function onDelete(item) {
    if (confirm(`Delete skill "${item.name}"?`)) await remove(item._id);
  }

  // Grouping logic
  const groups = items.reduce((acc, item) => {
    const cat = item.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <div className="page-in">
      <div className="sec-head">
        <span className="sec-label">Skills</span>
        <div className="sec-line"></div>
        {isAdmin && (
          <button className="proj-btn proj-btn-primary" onClick={openNew}>
            + Add Skill
          </button>
        )}
      </div>

      {loading ? (
        <div className="font-mono text-sm text-muted">Loading…</div>
      ) : items.length === 0 ? (
        <EmptyState isAdmin={isAdmin} onAdd={openNew} label="skills" />
      ) : (
        <div className="space-y-8">
          {Object.entries(groups).map(([cat, skills]) => (
            <div key={cat} className="skills-block">
              <div className="text-[12px] font-bold text-muted uppercase tracking-[0.08em] mb-3">
                {cat}
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((item) => (
                  <EditShell
                    key={item._id}
                    id={item._id}
                    isAdmin={isAdmin}
                    onEdit={() => openEdit(item)}
                    onDelete={() => onDelete(item)}
                    className="inline-block"
                  >
                    <div className={`skill-tag ${CATEGORY_STYLES[cat.toLowerCase()] || ''}`}>
                      {item.name}
                    </div>
                  </EditShell>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <SkillEditor
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        initial={editing}
        onSave={onSave}
      />
    </div>
  );
}

function EmptyState({ isAdmin, onAdd, label }) {
  return (
    <div className="py-20 text-center border-1.5 border-dashed border-border rounded-xl bg-card">
      <div className="text-muted font-italic">No {label} added yet.</div>
      {isAdmin && <button className="proj-btn proj-btn-primary mt-6 mx-auto" onClick={onAdd}>+ Add the first one</button>}
    </div>
  );
}

