import { useEffect, useState } from 'react';
import Modal from '../Modal.jsx';

const EMPTY = {
  title: '', issuer: '', issueDate: '', credentialId: '',
  credentialUrl: '', description: '', kind: 'certificate',
};

export default function CertificateEditor({ open, onClose, initial, onSave }) {
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (open) {
      setForm(initial ? { ...EMPTY, ...initial } : EMPTY);
      setErr(null);
    }
  }, [open, initial]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      await onSave(form);
      onClose();
    } catch (e) {
      setErr(e?.response?.data?.error || e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={initial ? 'Edit item' : 'New certificate / achievement'}>
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className="label">Kind</label>
          <div className="flex gap-2">
            {['certificate', 'achievement'].map((k) => (
              <button
                type="button"
                key={k}
                onClick={() => set('kind', k)}
                className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest border ${
                  form.kind === k ? 'bg-ink text-paper border-ink' : 'border-ink/25 text-ink/60'
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="label">Title</label>
          <input
            className="input"
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            autoFocus
            required
          />
        </div>
        <div>
          <label className="label">Issuer</label>
          <input className="input" value={form.issuer} onChange={(e) => set('issuer', e.target.value)} />
        </div>
        <div>
          <label className="label">Issue date</label>
          <input
            className="input"
            value={form.issueDate}
            onChange={(e) => set('issueDate', e.target.value)}
            placeholder="Mar 2024"
          />
        </div>
        <div>
          <label className="label">Credential ID</label>
          <input
            className="input"
            value={form.credentialId}
            onChange={(e) => set('credentialId', e.target.value)}
          />
        </div>
        <div>
          <label className="label">Credential URL</label>
          <input
            className="input"
            value={form.credentialUrl}
            onChange={(e) => set('credentialUrl', e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <label className="label">Description</label>
          <textarea
            className="textarea min-h-[90px]"
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
          />
        </div>

        {err && (
          <p className="md:col-span-2 font-mono text-xs text-red-800 border border-red-700/30 px-3 py-2">
            {err}
          </p>
        )}
        <div className="md:col-span-2 flex justify-end gap-3 pt-2">
          <button type="button" className="btn-ghost" onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button type="submit" className="btn-ember" disabled={busy}>
            {busy ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
