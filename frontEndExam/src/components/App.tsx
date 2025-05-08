import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './common/Header';
import NotFound from './NotFound';

function App() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className={darkMode ? 'dark' : 'light'}>
      <Router>
        <Header toggleTheme={() => setDarkMode(!darkMode)} />
        <Routes>
          {/* Inserisci qui le tue rotte reali */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
