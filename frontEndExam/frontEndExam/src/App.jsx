// src/App.jsx
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { checkAuth } from "./redux/actions/authActions";
import AdminPanel from "./pages/AdminPanel";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import CanDetailPage from './pages/CanDetailPage';
import AuthPage from "./pages/AuthPage";
import Prodotti from "./pages/Prodotti";
import Promo from "./pages/Promo";
import Recensioni from "./pages/Recensioni";
import Contatti from "./pages/Contatti";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";

function Layout() {
  const location = useLocation();
  const dispatch = useDispatch();
  const hideNavbar = ["/login", "/register"].includes(location.pathname);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminPanel />
          </ProtectedRoute>
        } />
        <Route path="/prodotti" element={<Prodotti />} />
        <Route path="/promo" element={<Promo />} />
        <Route path="/recensioni" element={<Recensioni />} />
        <Route path="/cans/:id" element={<CanDetailPage />} />
        <Route path="/contatti" element={<Contatti />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;