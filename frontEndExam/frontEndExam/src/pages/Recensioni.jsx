import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './recensioni.css';

function Recensioni() {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  
  const [allCans, setAllCans] = useState([]);
  const [reviews, setReviews] = useState([]);
  
  const [formData, setFormData] = useState({
    canId: '',
    rating: 5,
    title: '',
    review: '',
    pros: '',
    cons: '',
    wouldRecommend: true
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/cans?_start=0&_end=1000')
      .then(res => res.json())
      .then(data => setAllCans(data))
      .catch(() => {});

    fetch('http://localhost:3001/reviews')
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(() => {});
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.canId) {
      newErrors.canId = 'Seleziona una lattina';
    }
    
    if (!formData.title.trim()) {
      newErrors.title = 'Il titolo è obbligatorio';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Il titolo deve avere almeno 5 caratteri';
    }
    
    if (!formData.review.trim()) {
      newErrors.review = 'La recensione è obbligatoria';
    } else if (formData.review.length < 20) {
      newErrors.review = 'La recensione deve avere almeno 20 caratteri';
    }
    
    if (!formData.pros.trim()) {
      newErrors.pros = 'Indica almeno un aspetto positivo';
    }
    
    if (!formData.cons.trim()) {
      newErrors.cons = 'Indica almeno un aspetto negativo';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setSubmitMessage('Devi essere loggato per lasciare una recensione');
      return;
    }
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      const selectedCan = allCans.find(can => can.id === parseInt(formData.canId));
      const reviewData = {
        ...formData,
        canId: parseInt(formData.canId),
        canName: selectedCan?.nome || 'Sconosciuta',
        userId: user.id,
        userName: user.name,
        date: new Date().toISOString(),
        id: Date.now()
      };
      
      const response = await fetch('http://localhost:3001/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });
      
      if (response.ok) {
        setSubmitMessage('Recensione inviata con successo!');
        setFormData({
          canId: '',
          rating: 5,
          title: '',
          review: '',
          pros: '',
          cons: '',
          wouldRecommend: true
        });
        
        const updatedReviews = await fetch('http://localhost:3001/reviews').then(res => res.json());
        setReviews(updatedReviews);
      }
    } catch (error) {
      setSubmitMessage('Errore nell\'invio della recensione');
    } finally {
      setIsSubmitting(false);
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

  const getRatingStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className="recensioni-page">
      <div className="recensioni-container">
        <h1>Recensioni Monster Energy</h1>
        <p className="subtitle">Condividi la tua esperienza con le lattine Monster Energy</p>
        
        {!isAuthenticated && (
          <div className="auth-warning">
            <p>⚠️ Devi essere loggato per lasciare una recensione</p>
          </div>
        )}
        
        <div className="review-form-container">
          <h2>Scrivi una recensione</h2>
          <form onSubmit={handleSubmit} className="review-form">
            <div className="form-group">
              <label>Lattina *</label>
              <select
                name="canId"
                value={formData.canId}
                onChange={handleInputChange}
                className={errors.canId ? 'error' : ''}
              >
                <option value="">Seleziona una lattina</option>
                {allCans.map(can => (
                  <option key={can.id} value={can.id}>
                    {can.nome} - {can.category}
                  </option>
                ))}
              </select>
              {errors.canId && <span className="error-message">{errors.canId}</span>}
            </div>
            
            <div className="form-group">
              <label>Valutazione *</label>
              <div className="rating-container">
                {[1, 2, 3, 4, 5].map(num => (
                  <label key={num} className="rating-label">
                    <input
                      type="radio"
                      name="rating"
                      value={num}
                      checked={formData.rating === num}
                      onChange={(e) => setFormData(prev => ({...prev, rating: parseInt(e.target.value)}))}
                    />
                    <span className="star">{num <= formData.rating ? '★' : '☆'}</span>
                  </label>
                ))}
                <span className="rating-text">({formData.rating}/5)</span>
              </div>
            </div>
            
            <div className="form-group">
              <label>Titolo recensione *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Riassumi la tua esperienza"
                className={errors.title ? 'error' : ''}
                maxLength={100}
              />
              <div className="char-count">{formData.title.length}/100</div>
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>
            
            <div className="form-group">
              <label>Recensione dettagliata *</label>
              <textarea
                name="review"
                value={formData.review}
                onChange={handleInputChange}
                placeholder="Descrivi la tua esperienza con questa lattina Monster Energy..."
                className={errors.review ? 'error' : ''}
                rows={6}
                maxLength={1000}
              />
              <div className="char-count">{formData.review.length}/1000</div>
              {errors.review && <span className="error-message">{errors.review}</span>}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Aspetti positivi *</label>
                <textarea
                  name="pros"
                  value={formData.pros}
                  onChange={handleInputChange}
                  placeholder="Cosa ti è piaciuto di più?"
                  className={errors.pros ? 'error' : ''}
                  rows={3}
                  maxLength={300}
                />
                <div className="char-count">{formData.pros.length}/300</div>
                {errors.pros && <span className="error-message">{errors.pros}</span>}
              </div>
              
              <div className="form-group">
                <label>Aspetti negativi *</label>
                <textarea
                  name="cons"
                  value={formData.cons}
                  onChange={handleInputChange}
                  placeholder="Cosa potrebbe essere migliorato?"
                  className={errors.cons ? 'error' : ''}
                  rows={3}
                  maxLength={300}
                />
                <div className="char-count">{formData.cons.length}/300</div>
                {errors.cons && <span className="error-message">{errors.cons}</span>}
              </div>
            </div>
            
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="wouldRecommend"
                  checked={formData.wouldRecommend}
                  onChange={handleInputChange}
                />
                Raccomanderei questo prodotto
              </label>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting || !isAuthenticated}
              className="submit-btn"
            >
              {isSubmitting ? 'Invio in corso...' : 'Invia recensione'}
            </button>
            
            {submitMessage && (
              <div className={`submit-message ${submitMessage.includes('successo') ? 'success' : 'error'}`}>
                {submitMessage}
              </div>
            )}
          </form>
        </div>
        
        <div className="reviews-list">
          <h2>Recensioni recenti</h2>
          {reviews.length === 0 ? (
            <p>Nessuna recensione disponibile. Sii il primo a recensire!</p>
          ) : (
            <div className="reviews-grid">
              {reviews.slice(0, 6).map(review => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <h3>{review.title}</h3>
                    <div className="review-rating">{getRatingStars(review.rating)}</div>
                  </div>
                  <p className="review-can">{review.canName}</p>
                  <p className="review-text">{review.review}</p>
                  <div className="review-pros-cons">
                    <div className="pros">
                      <strong>Pro:</strong> {review.pros}
                    </div>
                    <div className="cons">
                      <strong>Contro:</strong> {review.cons}
                    </div>
                  </div>
                  <div className="review-footer">
                    <span className="review-author">Di {review.userName}</span>
                    <span className="review-date">{new Date(review.date).toLocaleDateString()}</span>
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

export default Recensioni;