import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Home from './pages/Home.jsx';
import Skills from './pages/Skills.jsx';
import Projects from './pages/Projects.jsx';
import Experience from './pages/Experience.jsx';
import Certificates from './pages/Certificates.jsx';

export default function App() {
  return (
    <div className="layout flex min-h-screen bg-[#f5f3ef]">
      <Sidebar />
      <main className="main flex-1 p-12 lg:p-12 lg:pb-24 max-w-[920px]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
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

