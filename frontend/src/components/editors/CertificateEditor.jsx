import { useEffect, useState } from 'react';
import Modal from '../Modal.jsx';
import { getLocalImage, imageFileToDataUrl, setLocalImage } from '../../lib/localImages.js';

const EMPTY = {
  title: '', issuer: '', issueDate: '', credentialId: '',
  credentialUrl: '', description: '', kind: 'certificate',
};

export default function CertificateEditor({ open, onClose, initial, onSave }) {
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (open) {
      setForm(initial ? { ...EMPTY, ...initial } : EMPTY);
      setPreview(initial?._id ? getLocalImage(`credential:${initial._id}`) : '');
      setErr(null);
    }
  }, [open, initial]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const saved = await onSave(form);
      const id = initial?._id || saved?._id;
      if (id) setLocalImage(`credential:${id}`, preview);
      onClose();
    } catch (e) {
      setErr(e?.response?.data?.error || e.message);
    } finally {
      setBusy(false);
    }
  }

  async function selectImage(event) {
    try {
      setErr(null);
      setPreview(await imageFileToDataUrl(event.target.files?.[0]));
    } catch (error) { setErr(error.message); }
  }

  return (
    <Modal open={open} onClose={onClose} title={initial ? 'Edit item' : 'New certificate / achievement'}>
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2 grid md:grid-cols-[220px_1fr] gap-4 items-center">
          <div className="image-holder">
            {preview ? <img src={preview} alt="Credential preview" /> : <span className="text-muted text-sm">Snapshot preview</span>}
          </div>
          <div>
            <label className="label">Browser-local snapshot</label>
            <input className="input" type="file" accept="image/*" onChange={selectImage} />
            <p className="text-xs text-muted mt-2">Compressed and stored only in this browser, never in MongoDB.</p>
            {preview && <button type="button" className="btn btn-sm mt-3" onClick={() => setPreview('')}>Remove snapshot</button>}
          </div>
        </div>
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
