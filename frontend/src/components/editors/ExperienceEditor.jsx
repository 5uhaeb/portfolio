import { useEffect, useState } from 'react';
import Modal from '../Modal.jsx';

const EMPTY = {
  company: '', role: '', location: '',
  startDate: '', endDate: '',
  description: '', highlights: '',
};

export default function ExperienceEditor({ open, onClose, initial, onSave }) {
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
              highlights: Array.isArray(initial.highlights)
                ? initial.highlights.join('\n')
                : initial.highlights || '',
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
        highlights: form.highlights
          ? form.highlights.split('\n').map((s) => s.trim()).filter(Boolean)
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
    <Modal open={open} onClose={onClose} title={initial ? 'Edit experience' : 'New experience'} wide>
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="label">Role</label>
          <input
            className="input"
            value={form.role}
            onChange={(e) => set('role', e.target.value)}
            autoFocus
            required
          />
        </div>
        <div>
          <label className="label">Company</label>
          <input
            className="input"
            value={form.company}
            onChange={(e) => set('company', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label">Location</label>
          <input className="input" value={form.location} onChange={(e) => set('location', e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Start</label>
            <input
              className="input"
              value={form.startDate}
              onChange={(e) => set('startDate', e.target.value)}
              placeholder="Jan 2023"
            />
          </div>
          <div>
            <label className="label">End</label>
            <input
              className="input"
              value={form.endDate}
              onChange={(e) => set('endDate', e.target.value)}
              placeholder="Present"
            />
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="label">Description</label>
          <textarea
            className="textarea min-h-[100px]"
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <label className="label">Highlights — one per line</label>
          <textarea
            className="textarea min-h-[140px] font-mono text-sm"
            value={form.highlights}
            onChange={(e) => set('highlights', e.target.value)}
            placeholder={'Shipped X\nLed Y\nGrew Z by 40%'}
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
