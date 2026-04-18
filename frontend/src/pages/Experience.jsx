import { useState } from 'react';
import { useRealtimeList } from '../lib/useRealtimeList.js';
import { useAuth } from '../context/AuthContext.jsx';
import SortableList from '../components/SortableList.jsx';
import EditShell from '../components/EditShell.jsx';
import ExperienceCard from '../components/cards/ExperienceCard.jsx';
import ExperienceEditor from '../components/editors/ExperienceEditor.jsx';

export default function Experience() {
  const { items, loading, create, update, remove, reorder } = useRealtimeList('experience');
  const { isAdmin } = useAuth();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const openNew = () => { setEditing(null); setEditorOpen(true); };
  const openEdit = (i) => { setEditing(i); setEditorOpen(true); };

  async function onSave(payload) {
    if (editing) await update(editing._id, payload);
    else await create(payload);
  }
  async function onDelete(item) {
    if (confirm(`Delete role?`)) await remove(item._id);
  }

  return (
    <div className="page-in">
      <div className="sec-head">
        <span className="sec-label">Education & Experience</span>
        <div className="sec-line"></div>
        {isAdmin && (
          <button className="proj-btn proj-btn-primary" onClick={openNew}>
            + Add Experience
          </button>
        )}
      </div>

      {loading ? (
        <div className="font-mono text-sm text-muted">Loading…</div>
      ) : items.length === 0 ? (
        <Empty isAdmin={isAdmin} onAdd={openNew} />
      ) : (
        <SortableList items={items} onReorder={reorder} disabled={!isAdmin}>
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <EditShell
                key={item._id}
                id={item._id}
                isAdmin={isAdmin}
                onEdit={() => openEdit(item)}
                onDelete={() => onDelete(item)}
              >
                <ExperienceCard item={item} />
              </EditShell>
            ))}
          </div>
        </SortableList>
      )}

      <ExperienceEditor
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        initial={editing}
        onSave={onSave}
      />
    </div>
  );
}

function Empty({ isAdmin, onAdd }) {
  return (
    <div className="py-20 text-center border-1.5 border-dashed border-border rounded-xl bg-card">
      <div className="text-muted font-italic">No experience added yet.</div>
      {isAdmin && <button className="proj-btn proj-btn-primary mt-6 mx-auto" onClick={onAdd}>+ Add the first one</button>}
    </div>
  );
}

