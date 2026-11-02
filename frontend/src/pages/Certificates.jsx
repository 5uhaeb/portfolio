import PageHeading from '../components/PageHeading.jsx';
import { useState } from 'react';
import { useRealtimeList } from '../lib/useRealtimeList.js';
import { useAuth } from '../context/AuthContext.jsx';
import EditShell from '../components/EditShell.jsx';
import CertificateCard from '../components/cards/CertificateCard.jsx';
import CertificateEditor from '../components/editors/CertificateEditor.jsx';

export default function Certificates() {
  const { items, loading, error, create, update, remove, reorder } = useRealtimeList('certificates');
  const { isAdmin } = useAuth();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const openNew = () => { setEditing(null); setEditorOpen(true); };
  const openEdit = (i) => { setEditing(i); setEditorOpen(true); };

  async function onSave(payload) {
    if (editing) return update(editing._id, payload);
    return create(payload);
  }
  async function onDelete(item) {
    if (confirm(`Delete?`)) await remove(item._id);
  }

  return (
    <div className="page-in section-page">
      <PageHeading number="04" eyebrow="CERTIFICATIONS & ACHIEVEMENTS" title="Learning with intention." description="Certifications, competitive milestones, and the work behind continuous learning."/>
      <div className="sec-head">
        <span className="sec-label">Certifications</span>
        <div className="sec-line"></div>
        {isAdmin && (
          <button className="proj-btn proj-btn-primary" onClick={openNew}>
            + Add Item
          </button>
        )}
      </div>

      {error && <p role="alert" className="text-red-800 mb-4">{error}</p>}
      {loading ? (
        <div className="font-mono text-sm text-muted">Loading…</div>
      ) : items.length === 0 ? (
        <Empty isAdmin={isAdmin} onAdd={openNew} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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

