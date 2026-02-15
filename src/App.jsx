import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { checkAuth } from "./redux/actions/authActions";
import AdminPanel from "./pages/AdminPanel";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import CanDetailPage from './pages/CanDetailPage';

import Prodotti from "./pages/Prodotti";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";

function Layout() {
  const location = useLocation();
  const dispatch = useDispatch();
  const hideNavbar = ["/login"].includes(location.pathname);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminPanel />
          </ProtectedRoute>
        } />
        <Route path="/prodotti" element={<Prodotti />} />
        <Route path="/cans/:id" element={<CanDetailPage />} />
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