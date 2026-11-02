import { Routes, Route, useLocation, Link } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Home from './pages/Home.jsx';
import Icon from './components/Icon.jsx';
const Skills = lazy(() => import('./pages/Skills.jsx'));
const Projects = lazy(() => import('./pages/Projects.jsx'));
const Experience = lazy(() => import('./pages/Experience.jsx'));
const Certificates = lazy(() => import('./pages/Certificates.jsx'));
export default function App() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    const section = pathname === '/' ? 'Software Engineer' : pathname.slice(1).replace(/^./, c => c.toUpperCase());
    document.title = `Suhaeb Nawab Shaik | ${section}`;
  }, [pathname]);
  return <div className="layout">
    <a href="#main-content" className="skip-link">Skip to content</a><Sidebar/>
    <main id="main-content" tabIndex={-1} className="main">
      <Suspense fallback={<div role="status" className="section-loading">Loading section…</div>}><Routes>
        <Route path="/" element={<Home/>}/><Route path="/skills" element={<Skills/>}/><Route path="/projects" element={<Projects/>}/>
        <Route path="/education" element={<Experience kind="education"/>}/><Route path="/experience" element={<Experience kind="experience"/>}/><Route path="/certificates" element={<Certificates/>}/>
        <Route path="*" element={<div className="page-in section-page"><p className="eyebrow">404 / PAGE NOT FOUND</p><h1>Let’s get you back.</h1><Link to="/" className="btn btn-ember">Back to overview <Icon/></Link></div>}/>
      </Routes></Suspense>
    </main>
    <footer className="site-footer"><div><Link to="/" className="footer-name">Suhaeb Shaik<span>.</span></Link><p>Thoughtful code. Useful software.</p></div><div className="footer-links"><a href="https://github.com/5uhaeb" target="_blank" rel="noreferrer">GitHub <Icon name="external" size={15}/></a><a href="https://www.linkedin.com/in/suhaeb-shaik-89a16734a/" target="_blank" rel="noreferrer">LinkedIn <Icon name="external" size={15}/></a><a href="mailto:suhaebn.shaik@gmail.com">Email <Icon name="external" size={15}/></a></div><span className="footer-note">© {new Date().getFullYear()} · Built with intent</span></footer>
  </div>;
}
