import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Home from './pages/Home';
import Collection from './pages/Collection';
import CanPage from './pages/CanPage';
import Ranking from './pages/Ranking';
import AuthPage from './pages/AuthPage';
import NotFound from './pages/NotFound';

export default function App() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  return (
    <>
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collezione" element={<Collection />} />
          <Route path="/lattina/:id" element={<CanPage />} />
          <Route path="/classifica" element={<Ranking />} />
          <Route path="/accedi" element={<AuthPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
