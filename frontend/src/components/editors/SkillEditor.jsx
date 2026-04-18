import { useEffect, useState } from 'react';
import Modal from '../Modal.jsx';

const EMPTY = { name: '', category: 'General', level: 70, years: 0 };

export default function SkillEditor({ open, onClose, initial, onSave }) {
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
      await onSave({
        ...form,
        level: Number(form.level) || 0,
        years: Number(form.years) || 0,
      });
      onClose();
    } catch (e) {
      setErr(e?.response?.data?.error || e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={initial ? 'Edit skill' : 'New skill'}>
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className="label">Name</label>
          <input
            className="input"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            autoFocus
            required
          />
        </div>
        <div>
          <label className="label">Category</label>
          <input
            className="input"
            value={form.category}
            onChange={(e) => set('category', e.target.value)}
            placeholder="Frontend / Backend / Tools…"
          />
        </div>
        <div>
          <label className="label">Years</label>
          <input
            type="number"
            min="0"
            step="0.5"
            className="input"
            value={form.years}
            onChange={(e) => set('years', e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <label className="label">Proficiency — {form.level}%</label>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={form.level}
            onChange={(e) => set('level', e.target.value)}
            className="w-full accent-ember"
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
