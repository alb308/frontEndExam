// src/pages/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './adminPanel.css';

function AdminPanel() {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const [cans, setCans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  
  // State del form - più semplice
  const [nome, setNome] = useState('');
  const [category, setCategory] = useState('');
  const [year, setYear] = useState(2025);
  const [img, setImg] = useState('');
  const [limited, setLimited] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Carica le lattine
  useEffect(() => {
    loadCans();
  }, []);

  async function loadCans() {
    try {
      const response = await fetch('http://localhost:3001/cans?_start=0&_end=1000');
      const data = await response.json();
      setCans(data);
    } catch (error) {
      setMessage('Errore caricamento');
    } finally {
      setLoading(false);
    }
  }

  // Controllo accesso
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  // Salva lattina
  async function saveCan() {
    if (!nome || !category || !img) {
      setMessage('Compila i campi obbligatori');
      return;
    }

    const canData = { nome, category, year, img, limited };
    const url = editingId 
      ? `http://localhost:3001/cans/${editingId}`
      : 'http://localhost:3001/cans';
    const method = editingId ? 'PATCH' : 'POST';

    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? canData : { ...canData, id: Date.now() })
      });

      setMessage(editingId ? 'Aggiornato!' : 'Aggiunto!');
      clearForm();
      loadCans();
    } catch (error) {
      setMessage('Errore salvataggio');
    }
  }

  // Modifica lattina
  function editCan(can) {
    setNome(can.nome);
    setCategory(can.category);
    setYear(can.year);
    setImg(can.img);
    setLimited(can.limited || false);
    setEditingId(can.id);
  }

  // Elimina lattina
  async function deleteCan(id) {
    if (!confirm('Eliminare?')) return;

    try {
      await fetch(`http://localhost:3001/cans/${id}`, { method: 'DELETE' });
      setMessage('Eliminato!');
      loadCans();
    } catch (error) {
      setMessage('Errore eliminazione');
    }
  }

  // Pulisci form
  function clearForm() {
    setNome('');
    setCategory('');
    setYear(2025);
    setImg('');
    setLimited(false);
    setEditingId(null);
  }

  return (
    <div className="admin-panel">
      <div className="admin-container">
        <h1 className="admin-title">🛠️ Admin Panel</h1>
        
        {message && (
          <div className={`operation-message ${message.includes('!') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
        
        <div className="form-section">
          <h2>{editingId ? 'Modifica' : 'Aggiungi'} Lattina</h2>
          
          <div style={{ display: 'grid', gap: '1rem', maxWidth: '500px' }}>
            <input 
              placeholder="Nome lattina *" 
              value={nome} 
              onChange={(e) => setNome(e.target.value)}
              style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.1)', border: '1px solid #333', color: '#fff', borderRadius: '4px' }}
            />
            
            <input 
              placeholder="Categoria *" 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.1)', border: '1px solid #333', color: '#fff', borderRadius: '4px' }}
            />
            
            <input 
              type="number" 
              placeholder="Anno" 
              value={year} 
              onChange={(e) => setYear(Number(e.target.value))}
              style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.1)', border: '1px solid #333', color: '#fff', borderRadius: '4px' }}
            />
            
            <input 
              placeholder="URL Immagine *" 
              value={img} 
              onChange={(e) => setImg(e.target.value)}
              style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.1)', border: '1px solid #333', color: '#fff', borderRadius: '4px' }}
            />
            
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff' }}>
              <input 
                type="checkbox" 
                checked={limited} 
                onChange={(e) => setLimited(e.target.checked)} 
              />
              Edizione Limitata
            </label>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button 
              onClick={saveCan} 
              style={{ background: '#00ff00', color: '#000', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '4px', cursor: 'pointer' }}
            >
              {editingId ? 'Modifica' : 'Aggiungi'}
            </button>
            
            {editingId && (
              <button 
                onClick={clearForm}
                style={{ background: '#ff3333', color: '#fff', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '4px', cursor: 'pointer' }}
              >
                Annulla
              </button>
            )}
          </div>
        </div>
        
        <div className="cans-section">
          <h2>Lattine ({cans.length})</h2>
          
          {loading ? (
            <div style={{ textAlign: 'center', color: '#00ff00' }}>Caricamento...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              {cans.map(can => (
                <div key={can.id} style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', textAlign: 'center', border: '1px solid #333' }}>
                  <img src={can.img} alt={can.nome} style={{ width: 80, height: 120, objectFit: 'contain' }} />
                  <h3 style={{ color: '#00ff00', margin: '0.5rem 0' }}>{can.nome}</h3>
                  <p style={{ color: '#ccc', margin: '0.5rem 0' }}>{can.category} • {can.year}</p>
                  {can.limited && (
                    <span style={{ background: '#ffd700', color: '#000', padding: '0.2rem 0.5rem', borderRadius: '3px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      Limited
                    </span>
                  )}
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '0.5rem' }}>
                    <button 
                      onClick={() => editCan(can)}
                      style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid #333', color: '#fff', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => deleteCan(can.id)}
                      style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid #333', color: '#fff', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;