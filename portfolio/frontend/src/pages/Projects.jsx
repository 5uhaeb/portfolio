import { useState } from 'react';
import { useRealtimeList } from '../lib/useRealtimeList.js';
import { useAuth } from '../context/AuthContext.jsx';
import SortableList from '../components/SortableList.jsx';
import EditShell from '../components/EditShell.jsx';
import ProjectCard from '../components/cards/ProjectCard.jsx';
import ProjectEditor from '../components/editors/ProjectEditor.jsx';

export default function Projects() {
  const { items, loading, create, update, remove, reorder } = useRealtimeList('projects');
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
    if (confirm(`Delete project "${item.title}"?`)) await remove(item._id);
  }

  return (
    <div className="page-in">
      <div className="sec-head">
        <span className="sec-label">Projects</span>
        <div className="sec-line"></div>
        {isAdmin && (
          <button className="proj-btn proj-btn-primary" onClick={openNew}>
            + Add Project
          </button>
        )}
      </div>

      {loading ? (
        <div className="font-mono text-sm text-muted">Loading…</div>
      ) : items.length === 0 ? (
        <Empty isAdmin={isAdmin} onAdd={openNew} />
      ) : (
        <SortableList items={items} onReorder={reorder} disabled={!isAdmin}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item, idx) => (
              <EditShell
                key={item._id}
                id={item._id}
                isAdmin={isAdmin}
                onEdit={() => openEdit(item)}
                onDelete={() => onDelete(item)}
              >
                <ProjectCard item={item} indexLabel={String(idx + 1).padStart(2, '0')} />
              </EditShell>
            ))}
          </div>
        </SortableList>
      )}

      <ProjectEditor
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
      <div className="text-muted font-italic">No projects added yet.</div>
      {isAdmin && (
        <button className="proj-btn proj-btn-primary mt-6 mx-auto" onClick={onAdd}>
          + Add the first one
        </button>
      )}
    </div>
  );
}

