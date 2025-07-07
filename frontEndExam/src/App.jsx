// src/App.jsx
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { checkAuth } from "./redux/actions/authActions";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminPanel from "./pages/AdminPanel";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import CanDetailPage from './pages/CanDetailPage';
import AuthPage from "./pages/AuthPage";
import TestMeteo from "./pages/TestMeteo";
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