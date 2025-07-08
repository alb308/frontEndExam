// src/pages/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCans, addCan, updateCan, deleteCan } from '../redux/actions/cansActions';
import './adminPanel.css';

function AdminPanel() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { cans } = useSelector(state => state.cans);
  
  const [formData, setFormData] = useState({
    nome: '',
    category: '',
    year: new Date().getFullYear(),
    country: 'USA',
    size: '500ml',
    img: '',
    limited: false
  });
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [operationMessage, setOperationMessage] = useState('');

  useEffect(() => {
    dispatch(fetchCans());
  }, [dispatch]);

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome lattina è obbligatorio';
    } else if (formData.nome.length < 2) {
      newErrors.nome = 'Nome deve avere almeno 2 caratteri';
    }
    
    if (!formData.category.trim()) {
      newErrors.category = 'Categoria è obbligatoria';
    }
    
    if (!formData.year || formData.year < 1980 || formData.year > new Date().getFullYear() + 1) {
      newErrors.year = 'Anno deve essere tra 1980 e ' + (new Date().getFullYear() + 1);
    }
    
    if (!formData.img.trim()) {
      newErrors.img = 'URL immagine è obbligatoria';
    } else if (!isValidImageUrl(formData.img)) {
      newErrors.img = 'URL immagine non valida (deve terminare con .jpg, .jpeg, .png, .gif)';
    }
    
    return newErrors;
  };

  const isValidImageUrl = (url) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    return imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  const handleSave = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    setErrors({});
    setOperationMessage('');
    
    try {
      if (editingId !== null) {
        const result = await dispatch(updateCan(editingId, formData));
        if (result.success) {
          setOperationMessage('Lattina aggiornata con successo!');
          setEditingId(null);
        } else {
          setOperationMessage('Errore nell\'aggiornamento della lattina');
        }
      } else {
        const result = await dispatch(addCan(formData));
        if (result.success) {
          setOperationMessage('Lattina aggiunta con successo!');
        } else {
          setOperationMessage('Errore nell\'aggiunta della lattina');
        }
      }
      
      setFormData({
        nome: '',
        category: '',
        year: new Date().getFullYear(),
        country: 'USA',
        size: '500ml',
        img: '',
        limited: false
      });
    } catch (error) {
      setOperationMessage('Errore di connessione');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (can) => {
    setFormData({
      nome: can.nome,
      category: can.category,
      year: can.year,
      country: can.country,
      size: can.size,
      img: can.img || '',
      limited: can.limited || false
    });
    setEditingId(can.id);
    setErrors({});
    setOperationMessage('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questa lattina?')) {
      setIsSubmitting(true);
      setOperationMessage('');
      
      try {
        const result = await dispatch(deleteCan(id));
        if (result.success) {
          setOperationMessage('Lattina eliminata con successo!');
        } else {
          setOperationMessage('Errore nell\'eliminazione della lattina');
        }
      } catch (error) {
        setOperationMessage('Errore di connessione');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-container">
        <h1 className="admin-title">🛠️ Gestione Lattine Monster Energy</h1>
        <p className="admin-subtitle">Pannello di amministrazione per la gestione del catalogo</p>
        
        {operationMessage && (
          <div className={`operation-message ${operationMessage.includes('successo') ? 'success' : 'error'}`}>
            {operationMessage}
          </div>
        )}
        
        <div className="form-section">
          <h2>{editingId !== null ? 'Modifica Lattina' : 'Aggiungi Nuova Lattina'}</h2>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Nome lattina *</label>
              <input
                type="text"
                name="nome"
                placeholder="Es. Monster Energy Original"
                value={formData.nome}
                onChange={handleInputChange}
                className={errors.nome ? 'error' : ''}
              />
              {errors.nome && <span className="error-message">{errors.nome}</span>}
            </div>
            
            <div className="form-group">
              <label>Categoria *</label>
              <input
                type="text"
                name="category"
                placeholder="Es. Original, Zero Sugar, Ultra"
                value={formData.category}
                onChange={handleInputChange}
                className={errors.category ? 'error' : ''}
              />
              {errors.category && <span className="error-message">{errors.category}</span>}
            </div>
            
            <div className="form-group">
              <label>Anno *</label>
              <input
                type="number"
                name="year"
                min="1980"
                max={new Date().getFullYear() + 1}
                value={formData.year}
                onChange={handleInputChange}
                className={errors.year ? 'error' : ''}
              />
              {errors.year && <span className="error-message">{errors.year}</span>}
            </div>
            
            <div className="form-group">
              <label>Paese</label>
              <select 
                name="country"
                value={formData.country}
                onChange={handleInputChange}
              >
                <option value="USA">USA</option>
                <option value="UK">UK</option>
                <option value="Italy">Italy</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
                <option value="Japan">Japan</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Dimensione</label>
              <select 
                name="size"
                value={formData.size}
                onChange={handleInputChange}
              >
                <option value="250ml">250ml</option>
                <option value="355ml">355ml</option>
                <option value="500ml">500ml</option>
                <option value="710ml">710ml</option>
              </select>
            </div>
            
            <div className="form-group full-width">
              <label>URL Immagine *</label>
              <input
                type="url"
                name="img"
                placeholder="https://example.com/image.jpg"
                value={formData.img}
                onChange={handleInputChange}
                className={errors.img ? 'error' : ''}
              />
              {errors.img && <span className="error-message">{errors.img}</span>}
            </div>
            
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="limited"
                  checked={formData.limited}
                  onChange={handleInputChange}
                />
                Edizione limitata
              </label>
            </div>
          </div>
          
          {formData.img && (
            <div className="image-preview">
              <h3>Anteprima immagine:</h3>
              <img 
                src={formData.img} 
                alt="Anteprima" 
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
          
          <div className="form-actions">
            <button 
              className="save-btn"
              onClick={handleSave}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Salvataggio...' : (editingId !== null ? '✏️ Modifica' : '➕ Aggiungi')}
            </button>
            
            {editingId !== null && (
              <button 
                className="cancel-btn"
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    nome: '',
                    category: '',
                    year: new Date().getFullYear(),
                    country: 'USA',
                    size: '500ml',
                    img: '',
                    limited: false
                  });
                  setErrors({});
                }}
              >
                Annulla
              </button>
            )}
          </div>
        </div>
        
        <div className="cans-section">
          <h2>Lattine nel Catalogo ({cans.length})</h2>
          
          <div className="cans-grid">
            {cans.map((can) => (
              <div key={can.id} className="can-card">
                <div className="can-image">
                  <img 
                    src={can.img ? `/lattine/${can.img}` : '/lattine/placeholder.jpg'} 
                    alt={can.nome}
                    onError={(e) => {
                      e.target.src = '/lattine/placeholder.jpg';
                    }}
                  />
                  {can.limited && <span className="limited-badge">Limited</span>}
                </div>
                
                <div className="can-info">
                  <h3>{can.nome}</h3>
                  <p className="can-category">{can.category}</p>
                  <div className="can-details">
                    <span>📅 {can.year}</span>
                    <span>🌍 {can.country}</span>
                    <span>📏 {can.size}</span>
                  </div>
                </div>
                
                <div className="can-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => handleEdit(can)}
                    disabled={isSubmitting}
                  >
                    ✏️
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(can.id)}
                    disabled={isSubmitting}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;