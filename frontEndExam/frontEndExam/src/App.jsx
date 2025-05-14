import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";

import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';


function App() {
  return (
    <Router>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminPanel />} />
          {/* altre route */}
        </Routes>
      </main>
    </Router>
  );
}
export default App;