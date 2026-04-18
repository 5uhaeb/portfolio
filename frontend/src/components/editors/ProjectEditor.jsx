import { useEffect, useState } from 'react';
import Modal from '../Modal.jsx';

const EMPTY = {
  title: '', summary: '', description: '', imageUrl: '',
  tech: '', liveUrl: '', repoUrl: '', year: '',
};

export default function ProjectEditor({ open, onClose, initial, onSave }) {
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (open) {
      setForm(
        initial
          ? {
              ...EMPTY,
              ...initial,
              // Tech is an array in storage, comma string in the form
              tech: Array.isArray(initial.tech) ? initial.tech.join(', ') : initial.tech || '',
            }
          : EMPTY
      );
      setErr(null);
    }
  }, [open, initial]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      await onSave({
        ...form,
        tech: form.tech
          ? form.tech.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
      });
      onClose();
    } catch (e) {
      setErr(e?.response?.data?.error || e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={initial ? 'Edit project' : 'New project'} wide>
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
          <label className="label">Year</label>
          <input className="input" value={form.year} onChange={(e) => set('year', e.target.value)} placeholder="2024" />
        </div>
        <div>
          <label className="label">Image URL</label>
          <input className="input" value={form.imageUrl} onChange={(e) => set('imageUrl', e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="label">Summary (one line)</label>
          <input className="input" value={form.summary} onChange={(e) => set('summary', e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="label">Description</label>
          <textarea
            className="textarea min-h-[120px]"
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <label className="label">Tech stack — comma separated</label>
          <input
            className="input"
            value={form.tech}
            onChange={(e) => set('tech', e.target.value)}
            placeholder="React, Node.js, MongoDB"
          />
        </div>
        <div>
          <label className="label">Live URL</label>
          <input className="input" value={form.liveUrl} onChange={(e) => set('liveUrl', e.target.value)} />
        </div>
        <div>
          <label className="label">Repo URL</label>
          <input className="input" value={form.repoUrl} onChange={(e) => set('repoUrl', e.target.value)} />
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
