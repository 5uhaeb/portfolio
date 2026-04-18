import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useState } from 'react';
import LoginModal from './LoginModal.jsx';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/skills', label: 'Skills' },
  { to: '/experience', label: 'Experience' },
  { to: '/certificates', label: 'Certificates' },
];

export default function Sidebar() {
  const { isAdmin, logout } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <>
      <aside className="w-[240px] min-h-screen bg-white border-r border-border p-10 flex flex-direction-column gap-0 sticky top-0 h-screen overflow-hidden hidden lg:flex flex-col">
        <div className="logo font-serif text-[22px] leading-[1.1] mb-8 text-text">
          Suhaeb<br /><span className="text-accent italic">Shaik</span>
        </div>

        <nav className="flex flex-col gap-[2px]">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `font-mono text-[12px] tracking-[0.05em] py-[9px] px-[14px] rounded-[7px] transition-all duration-200 flex items-center gap-2 group ${
                  isActive
                    ? 'bg-accent-bg text-accent'
                    : 'bg-transparent text-muted hover:bg-accent-bg hover:text-accent'
                }`
              }
            >
              <span className="dot w-[5px] height-[5px] rounded-full bg-current shrink-0" />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto pt-8 border-t border-border space-y-4">
          <div className="flex items-center gap-2 text-[12px] text-accent2">
            <span className="w-[7px] h-[7px] rounded-full bg-accent2 animate-blink" />
            Open to opportunities
          </div>

          <div className="flex flex-col gap-2">
            {isAdmin ? (
              <>
                <div className="font-mono text-[10px] uppercase tracking-widest text-accent flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  Admin Mode
                </div>
                <button
                  onClick={logout}
                  className="font-mono text-[11px] text-left text-muted hover:text-accent transition-colors"
                >
                  → Sign out
                </button>
              </>
            ) : (
              <button
                onClick={() => setLoginOpen(true)}
                className="font-mono text-[11px] text-left text-muted hover:text-accent transition-colors"
              >
                → Admin Login
              </button>
            )}
          </div>
        </div>
      </aside>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
