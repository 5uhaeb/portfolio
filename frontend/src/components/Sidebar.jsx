import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useEffect, useState, lazy, Suspense } from 'react';
const LoginModal = lazy(() => import('./LoginModal.jsx'));

const LINKS = [['/', 'Overview'], ['/projects', 'Projects'], ['/skills', 'Skills'], ['/education', 'Education'], ['/experience', 'Experience'], ['/certificates', 'Certificates']];

export default function Sidebar() {
  const { isAdmin, logout } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch { /* Theme still works without storage. */ }
  }, [dark]);
  const navigation = (mobile = false) => LINKS.map(([to, label], index) => (
    <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) =>
      `flex items-center gap-4 rounded-lg px-3 py-2.5 text-sm whitespace-nowrap transition-colors ${isActive ? 'bg-accent-bg text-accent font-semibold' : 'text-muted hover:bg-accent-bg hover:text-accent'}`}>
      {!mobile && <span className="font-mono text-[10px] opacity-60">0{index + 1}</span>}{label}
    </NavLink>
  ));
  const themeButton = <button type="button" className="btn btn-sm" aria-label={`Switch to ${dark ? 'light' : 'dark'} theme`} aria-pressed={dark} onClick={() => setDark(v => !v)}>{dark ? 'Light mode' : 'Dark mode'}</button>;
  const accountButton = <button type="button" onClick={isAdmin ? logout : () => setLoginOpen(true)} className="text-xs text-muted hover:text-accent">{isAdmin ? 'Sign out' : 'Admin login'}</button>;
  return <>
    <header className="lg:hidden sticky top-0 z-40 bg-surface border-b border-border px-4 pt-4">
      <div className="flex items-center justify-between gap-3"><NavLink to="/" className="font-semibold tracking-tight">Suhaeb Shaik<span className="text-accent">.</span></NavLink><div className="flex gap-3 items-center">{themeButton}{accountButton}</div></div>
      <nav className="flex gap-1 overflow-x-auto py-3" aria-label="Primary navigation">{navigation(true)}</nav>
    </header>
    <aside className="w-[256px] shrink-0 bg-surface border-r border-border px-7 py-10 sticky top-0 h-screen overflow-y-auto hidden lg:flex flex-col">
      <NavLink to="/" className="mb-12"><span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-accent text-surface font-semibold mb-5">S.</span><span className="block text-xl font-semibold tracking-tight">Suhaeb Shaik<span className="text-accent">.</span></span><span className="text-xs text-muted">Personal portfolio</span></NavLink>
      <nav className="flex flex-col gap-1" aria-label="Primary navigation">{navigation()}</nav>
      <div className="mt-auto pt-10 space-y-5"><p className="flex gap-2 items-center text-xs text-muted"><span className="w-1.5 h-1.5 rounded-full bg-accent" />Open to opportunities</p><div className="flex items-center gap-4 border-t border-border pt-5">{themeButton}{accountButton}</div></div>
    </aside>
    {loginOpen && <Suspense fallback={null}><LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} /></Suspense>}
  </>;
}
