import { useState } from 'react';
import { useRealtimeList } from '../lib/useRealtimeList.js';
import { useAuth } from '../context/AuthContext.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import SortableList from '../components/SortableList.jsx';
import EditShell from '../components/EditShell.jsx';
import SkillCard from '../components/cards/SkillCard.jsx';
import SkillEditor from '../components/editors/SkillEditor.jsx';

export default function Skills() {
  const { items, loading, create, update, remove, reorder } = useRealtimeList('skills');
  const { isAdmin } = useAuth();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  function openNew() {
    setEditing(null);
    setEditorOpen(true);
  }
  function openEdit(item) {
    setEditing(item);
    setEditorOpen(true);
  }
  async function onSave(payload) {
    if (editing) await update(editing._id, payload);
    else await create(payload);
  }
  async function onDelete(item) {
    if (confirm(`Delete skill "${item.name}"?`)) await remove(item._id);
  }

  return (
    <div className="page-in mx-auto max-w-7xl px-6 lg:px-10 py-16 lg:py-24">
      <SectionHeader
        number="02"
        title={<>My <span className="italic">skills</span>.</>}
        subtitle="Languages, frameworks and tools I reach for — ordered by how much I lean on them."
        action={
          isAdmin && (
            <button className="btn-ember" onClick={openNew}>
              + Add skill
            </button>
          )
        }
      />

      {loading ? (
        <div className="font-mono text-sm text-ink/50">Loading…</div>
      ) : items.length === 0 ? (
        <EmptyState isAdmin={isAdmin} onAdd={openNew} label="skills" />
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
                <SkillCard item={item} />
              </EditShell>
            ))}
          </div>
        </SortableList>
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
    <div className="py-20 text-center border border-dashed border-ink/20">
      <div className="font-display text-3xl tracking-tightest text-ink/50">
        No {label} yet.
      </div>
      {isAdmin && (
        <button className="btn-ember mt-6" onClick={onAdd}>
          + Add the first one
        </button>
      )}
    </div>
  );
}
