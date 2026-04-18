import { useEffect, useState } from 'react';
import Modal from '../Modal.jsx';

const EMPTY = {
  name: '', role: '', tagline: '', bio: '', location: '', email: '', avatarUrl: '',
  socials: { github: '', linkedin: '', twitter: '', website: '' },
};

export default function HomeEditor({ open, onClose, initial, onSave }) {
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (open && initial) {
      setForm({
        ...EMPTY,
        ...initial,
        socials: { ...EMPTY.socials, ...(initial.socials || {}) },
      });
      setErr(null);
    }
  }, [open, initial]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setSocial = (k, v) =>
    setForm((f) => ({ ...f, socials: { ...f.socials, [k]: v } }));

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
    <Modal open={open} onClose={onClose} title="Edit home" wide>
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="label">Name</label>
          <input className="input" value={form.name} onChange={(e) => set('name', e.target.value)} />
        </div>
        <div>
          <label className="label">Role / headline</label>
          <input className="input" value={form.role} onChange={(e) => set('role', e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="label">Tagline</label>
          <input className="input" value={form.tagline} onChange={(e) => set('tagline', e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="label">Bio</label>
          <textarea
            className="textarea min-h-[120px]"
            value={form.bio}
            onChange={(e) => set('bio', e.target.value)}
          />
        </div>
        <div>
          <label className="label">Location</label>
          <input className="input" value={form.location} onChange={(e) => set('location', e.target.value)} />
        </div>
        <div>
          <label className="label">Email</label>
          <input className="input" value={form.email} onChange={(e) => set('email', e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="label">Avatar URL</label>
          <input className="input" value={form.avatarUrl} onChange={(e) => set('avatarUrl', e.target.value)} />
        </div>

        <div className="md:col-span-2 rule pt-5" />
        <div className="md:col-span-2 eyebrow -mt-2">Socials</div>
        {['github', 'linkedin', 'twitter', 'website'].map((k) => (
          <div key={k}>
            <label className="label">{k}</label>
            <input
              className="input"
              value={form.socials[k] || ''}
              onChange={(e) => setSocial(k, e.target.value)}
            />
          </div>
        ))}

        {err && (
          <p className="md:col-span-2 font-mono text-xs text-red-800 border border-red-700/30 px-3 py-2">
            {err}
          </p>
        )}
        <div className="md:col-span-2 flex justify-end gap-3 pt-3">
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
