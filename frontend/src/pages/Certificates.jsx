import { useState } from 'react';
import { useRealtimeList } from '../lib/useRealtimeList.js';
import { useAuth } from '../context/AuthContext.jsx';
import EditShell from '../components/EditShell.jsx';
import CertificateCard from '../components/cards/CertificateCard.jsx';
import CertificateEditor from '../components/editors/CertificateEditor.jsx';

export default function Certificates() {
  const { items, loading, create, update, remove, reorder } = useRealtimeList('certificates');
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
    if (confirm(`Delete?`)) await remove(item._id);
  }

  return (
    <div className="page-in">
      <div className="sec-head">
        <span className="sec-label">Certificates</span>
        <div className="sec-line"></div>
        {isAdmin && (
          <button className="proj-btn proj-btn-primary" onClick={openNew}>
            + Add Item
          </button>
        )}
      </div>

      {loading ? (
        <div className="font-mono text-sm text-muted">Loading…</div>
      ) : items.length === 0 ? (
        <Empty isAdmin={isAdmin} onAdd={openNew} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <EditShell
              key={item._id}
              id={item._id}
              isAdmin={isAdmin}
              onEdit={() => openEdit(item)}
              onDelete={() => onDelete(item)}
            >
              <CertificateCard item={item} />
            </EditShell>
          ))}
        </div>
      )}

      <CertificateEditor
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
      <div className="text-muted font-italic">No certificates added yet.</div>
      {isAdmin && <button className="proj-btn proj-btn-primary mt-6 mx-auto" onClick={onAdd}>+ Add the first one</button>}
    </div>
  );
}

