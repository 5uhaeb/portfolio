import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import LoginModal from './LoginModal.jsx';

const LINKS = [
  { to: '/', label: 'Home', index: '01' },
  { to: '/skills', label: 'My Skills', index: '02' },
  { to: '/projects', label: 'My Projects', index: '03' },
  { to: '/experience', label: 'My Experience', index: '04' },
  { to: '/certificates', label: 'Certificates & Achievements', index: '05' },
];

export default function Navbar() {
  const { isAdmin, logout } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-paper/85 backdrop-blur-md border-b border-ink/15">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex items-center justify-between h-16">
            <NavLink
              to="/"
              className="font-display text-xl tracking-tightest"
              onClick={() => setMobileOpen(false)}
            >
              Portfolio<span className="text-ember">.</span>
            </NavLink>

            {/* Desktop menu */}
            <nav className="hidden lg:flex items-center gap-7">
              {LINKS.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === '/'}
                  className={({ isActive }) =>
                    `group flex items-baseline gap-2 text-sm transition-colors ${
                      isActive ? 'text-ink' : 'text-ink/60 hover:text-ink'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className="font-mono text-[10px] tracking-widest">{l.index}</span>
                      <span className={`font-body ${isActive ? 'border-b border-ember pb-0.5' : ''}`}>
                        {l.label}
                      </span>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              {isAdmin ? (
                <>
                  <span className="hidden md:inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-ember">
                    <span className="h-1.5 w-1.5 rounded-full bg-ember animate-pulse" />
                    Admin
                  </span>
                  <button onClick={logout} className="btn-ghost text-xs">
                    Sign out
                  </button>
                </>
              ) : (
                <button onClick={() => setLoginOpen(true)} className="btn-ghost text-xs">
                  Sign in
                </button>
              )}
              <button
                className="lg:hidden inline-flex items-center justify-center w-9 h-9 border border-ink/20"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Menu"
              >
                <span className="font-mono text-xs">{mobileOpen ? '✕' : '≡'}</span>
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileOpen && (
            <nav className="lg:hidden pb-4 space-y-2">
              {LINKS.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-baseline gap-3 py-2 border-b border-ink/10 ${
                      isActive ? 'text-ink' : 'text-ink/70'
                    }`
                  }
                >
                  <span className="font-mono text-[10px] tracking-widest">{l.index}</span>
                  <span>{l.label}</span>
                </NavLink>
              ))}
            </nav>
          )}
        </div>
      </header>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
