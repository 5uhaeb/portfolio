import { useState } from 'react';
import { useRealtimeList } from '../lib/useRealtimeList.js';
import { useAuth } from '../context/AuthContext.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import SortableList from '../components/SortableList.jsx';
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
    if (confirm(`Delete "${item.title}"?`)) await remove(item._id);
  }

  return (
    <div className="page-in mx-auto max-w-7xl px-6 lg:px-10 py-16 lg:py-24">
      <SectionHeader
        number="05"
        title={<>Proof of <span className="italic">work</span>.</>}
        subtitle="Certificates earned and achievements that actually mattered."
        action={isAdmin && <button className="btn-ember" onClick={openNew}>+ Add item</button>}
      />

      {loading ? (
        <div className="font-mono text-sm text-ink/50">Loading…</div>
      ) : items.length === 0 ? (
        <Empty isAdmin={isAdmin} onAdd={openNew} />
      ) : (
        <SortableList items={items} onReorder={reorder} strategy="grid" disabled={!isAdmin}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
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
        </SortableList>
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
    <div className="py-20 text-center border border-dashed border-ink/20">
      <div className="font-display text-3xl tracking-tightest text-ink/50">Nothing here yet.</div>
      {isAdmin && <button className="btn-ember mt-6" onClick={onAdd}>+ Add the first one</button>}
    </div>
  );
}
