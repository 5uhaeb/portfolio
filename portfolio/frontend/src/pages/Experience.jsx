import { useState } from 'react';
import { useRealtimeList } from '../lib/useRealtimeList.js';
import { useAuth } from '../context/AuthContext.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
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
    if (confirm(`Delete "${item.role} @ ${item.company}"?`)) await remove(item._id);
  }

  return (
    <div className="page-in mx-auto max-w-7xl px-6 lg:px-10 py-16 lg:py-24">
      <SectionHeader
        number="04"
        title={<>A short <span className="italic">history</span>.</>}
        subtitle="Companies, roles, and the dents left behind."
        action={isAdmin && <button className="btn-ember" onClick={openNew}>+ Add role</button>}
      />

      {loading ? (
        <div className="font-mono text-sm text-ink/50">Loading…</div>
      ) : items.length === 0 ? (
        <Empty isAdmin={isAdmin} onAdd={openNew} />
      ) : (
        <SortableList items={items} onReorder={reorder} disabled={!isAdmin}>
          <div className="border-t border-ink/15">
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
    <div className="py-20 text-center border border-dashed border-ink/20">
      <div className="font-display text-3xl tracking-tightest text-ink/50">No experience listed.</div>
      {isAdmin && <button className="btn-ember mt-6" onClick={onAdd}>+ Add your first role</button>}
    </div>
  );
}
