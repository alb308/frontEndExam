import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminPanel from "./pages/AdminPanel";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import CanDetailPage from './pages/CanDetailPage';
import { useEffect } from "react";
import AuthPage from "./pages/AuthPage";
import TestMeteo from "./pages/TestMeteo"

function Layout() {
  const location = useLocation();
  const hideNavbar = ["/login", "/register"].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/test-meteo" element={<TestMeteo />} />
        <Route path="/cans/:id" element={<CanDetailPage />} />

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
