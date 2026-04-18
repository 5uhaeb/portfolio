import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Skills from './pages/Skills.jsx';
import Projects from './pages/Projects.jsx';
import Experience from './pages/Experience.jsx';
import Certificates from './pages/Certificates.jsx';

export default function App() {
  return (
    <div className="min-h-full flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-ink/15 mt-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-10 flex flex-wrap items-center justify-between gap-6">
        <div className="font-display text-lg tracking-tightest">
          Portfolio<span className="text-ember">.</span>
        </div>
        <div className="font-mono text-[11px] uppercase tracking-widest text-ink/50">
          © {new Date().getFullYear()} — Built with React · MongoDB · Socket.io
        </div>
      </div>
    </footer>
  );
}

function NotFound() {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-10 py-24 page-in">
      <div className="eyebrow mb-4">§ 404</div>
      <h1 className="font-display text-7xl tracking-tightest">Not here.</h1>
      <p className="mt-4 text-ink/70">The page you were looking for doesn’t exist.</p>
    </div>
  );
}
