// src/pages/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCans, addCan, updateCan, deleteCan } from '../redux/actions/cansActions';

function AdminPanel() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { cans } = useSelector(state => state.cans);
  
  const [formData, setFormData] = useState({
    nome: '',
    category: '',
    year: new Date().getFullYear(),
    country: 'USA',
    size: '500ml'
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(fetchCans());
  }, [dispatch]);

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  const handleSave = async () => {
    if (editingId !== null) {
      const result = await dispatch(updateCan(editingId, formData));
      if (result.success) {
        setEditingId(null);
      }
    } else {
      await dispatch(addCan(formData));
    }
    setFormData({
      nome: '',
      category: '',
      year: new Date().getFullYear(),
      country: 'USA',
      size: '500ml'
    });
  };

  const handleEdit = (can) => {
    setFormData({
      nome: can.nome,
      category: can.category,
      year: can.year,
      country: can.country,
      size: can.size
    });
    setEditingId(can.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questa lattina?')) {
      await dispatch(deleteCan(id));
    }
  };

  return (
    <div style={{ padding: '2rem', color: '#fff' }}>
      <h2>Gestione Lattine (Admin)</h2>
      
      <div style={{ marginBottom: '2rem', background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px' }}>
        <input
          placeholder="Nome lattina"
          value={formData.nome}
          onChange={(e) => setFormData({...formData, nome: e.target.value})}
          style={{ marginRight: '1rem', padding: '0.5rem' }}
        />
        <input
          placeholder="Categoria"
          value={formData.category}
          onChange={(e) => setFormData({...formData, category: e.target.value})}
          style={{ marginRight: '1rem', padding: '0.5rem' }}
        />
        <input
          type="number"
          placeholder="Anno"
          value={formData.year}
          onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
          style={{ marginRight: '1rem', padding: '0.5rem', width: '100px' }}
        />
        <select 
          value={formData.country}
          onChange={(e) => setFormData({...formData, country: e.target.value})}
          style={{ marginRight: '1rem', padding: '0.5rem' }}
        >
          <option value="USA">USA</option>
          <option value="UK">UK</option>
          <option value="Italy">Italy</option>
        </select>
        <button onClick={handleSave} style={{ padding: '0.5rem 1rem', background: '#00ff00', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {editingId !== null ? 'Modifica' : 'Aggiungi'}
        </button>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {cans.map((can) => (
          <div key={can.id} style={{ 
            background: 'rgba(255,255,255,0.1)', 
            padding: '1rem', 
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <strong>{can.nome}</strong> - {can.category} ({can.year})
            </div>
            <div>
              <button 
                onClick={() => handleEdit(can)}
                style={{ marginRight: '0.5rem', padding: '0.3rem 0.8rem', cursor: 'pointer' }}
              >
                ✏️
              </button>
              <button 
                onClick={() => handleDelete(can.id)}
                style={{ padding: '0.3rem 0.8rem', cursor: 'pointer' }}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPanel;