import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Home from './pages/Home.jsx';
const Skills = lazy(() => import('./pages/Skills.jsx'));
const Projects = lazy(() => import('./pages/Projects.jsx'));
const Experience = lazy(() => import('./pages/Experience.jsx'));
const Certificates = lazy(() => import('./pages/Certificates.jsx'));

export default function App() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    const section = pathname === '/' ? 'Overview' : pathname.slice(1).replace(/^./, c => c.toUpperCase());
    document.title = `${section} | Suhaeb Shaik`;
  }, [pathname]);
  return (
    <div className="layout lg:flex min-h-screen bg-bg">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Sidebar />
      <main id="main-content" tabIndex={-1} className="main flex-1 px-5 py-10 md:px-10 lg:px-16 lg:py-14">
        <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[.16em] text-muted mb-12"><span>Portfolio / {pathname === '/' ? 'Overview' : pathname.slice(1)}</span><span>Suhaeb Shaik</span></div>
        <Suspense fallback={<div role="status" className="text-muted py-12">Loading section…</div>}><Routes>
          <Route path="/" element={<Home />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/education" element={<Experience kind="education" />} />
          <Route path="/experience" element={<Experience kind="experience" />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="*" element={<NotFound />} />
        </Routes></Suspense>
        <footer className="mt-16 pt-6 border-t border-border text-xs text-muted flex flex-wrap justify-between gap-3"><span>Suhaeb Shaik</span><span>Code. Learn. Build.</span></footer>
      </main>
    </div>
  );
}

function NotFound() {
  return (
    <div className="page-in py-24">
      <div className="sec-label mb-4">§ 404</div>
      <h1 className="text-7xl mb-4">Not here.</h1>
      <p className="text-muted">The page you were looking for doesn’t exist.</p>
    </div>
  );
}

