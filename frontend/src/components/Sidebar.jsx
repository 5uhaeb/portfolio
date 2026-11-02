import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useEffect, useState, lazy, Suspense } from 'react';
import Icon from './Icon.jsx';
const LoginModal = lazy(() => import('./LoginModal.jsx'));
const LINKS = [['/', 'Overview'], ['/projects', 'Projects'], ['/skills', 'Skills'], ['/education', 'Education'], ['/certificates', 'Credentials']];
export default function Sidebar() {
  const { isAdmin, logout } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  const { pathname } = useLocation();
  useEffect(() => { setMenuOpen(false); }, [pathname]);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch {}
  }, [dark]);
  return <>
    <header className="site-header">
      <div className="header-inner">
        <NavLink to="/" className="wordmark" aria-label="Suhaeb Shaik home"><span className="monogram">s<span>.</span></span><span>suhaeb shaik<span className="wordmark-role">SOFTWARE ENGINEERING</span></span></NavLink>
        <nav id="primary-nav" className={`primary-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Primary navigation">
          {LINKS.map(([to,label]) => <NavLink key={to} to={to} end={to === '/'}>{label}</NavLink>)}
          {isAdmin && <NavLink to="/experience">Activities</NavLink>}
        </nav>
        <div className="header-actions">
          <button className="icon-button" type="button" aria-label={`Switch to ${dark ? 'light' : 'dark'} theme`} aria-pressed={dark} onClick={() => setDark(v => !v)}><Icon name={dark ? 'sun' : 'moon'} size={19}/></button>
          <a className="header-contact" href="mailto:suhaebn.shaik@gmail.com">Let’s talk <Icon name="external" size={17}/></a>
          <button className="icon-button mobile-menu" type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="primary-nav" onClick={() => setMenuOpen(v => !v)}><Icon name={menuOpen ? 'close' : 'menu'}/></button>
        </div>
      </div>
    </header>
    <div className="admin-access"><button type="button" onClick={isAdmin ? logout : () => setLoginOpen(true)}>{isAdmin ? 'Sign out of admin' : 'Admin login'}</button></div>
    {loginOpen && <Suspense fallback={null}><LoginModal open={loginOpen} onClose={() => setLoginOpen(false)}/></Suspense>}
  </>;
}
