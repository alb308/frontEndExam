// src/pages/CanDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CanDetailPage.css';

function CanDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [can, setCan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [showRating, setShowRating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showCommentForm, setShowCommentForm] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    fetch('/lattine.json')
      .then((res) => res.json())
      .then((data) => {
        const foundCan = data.find((item) => item.id === parseInt(id));
        setCan(foundCan);
        setLoading(false);
      });

    // Carica i commenti
    fetch(`/api/comments?canId=${id}`)
      .then(res => res.json())
      .then(data => setComments(data))
      .catch(console.error);
  }, [id]);

  const handleRatingClick = () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    setShowRating(!showRating);
  };

  const handleRate = (star) => {
    setRating(star);
    fetch('/api/ratings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({ canId: id, rating: star })
    })
    .then(response => {
      if (!response.ok) throw new Error('Errore nel salvataggio del voto');
      return response.json();
    })
    .catch(error => {
      console.error("Errore:", error);
    });
    setShowRating(false);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    fetch('/api/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({ 
        canId: id, 
        text: newComment,
        userId: localStorage.getItem('userId')
      })
    })
    .then(response => {
      if (!response.ok) throw new Error('Errore nel salvataggio del commento');
      return response.json();
    })
    .then(comment => {
      setComments([...comments, comment]);
      setNewComment('');
      setShowCommentForm(false);
    })
    .catch(error => {
      console.error("Errore:", error);
    });
  };

  const navigateToAuth = (isLogin) => {
    navigate(isLogin ? '/login' : '/register', { 
      state: { from: `/can/${id}` } 
    });
  };

  const handleAddCommentClick = () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    setShowCommentForm(true);
  };

  if (loading) return (
    <div className="fullscreen-loading">
      <div className="spinner"></div>
    </div>
  );

  if (!can) return (
    <div className="fullscreen-error">
      <h2>Lattina non trovata</h2>
      <button onClick={() => navigate('/')}>Torna alla Home</button>
    </div>
  );

  return (
    <div className="fullscreen-detail">
      <button className="back-button" onClick={() => navigate(-1)}>
        &larr; Indietro
      </button>

      <div className="can-content">
        <div className="can-image-container">
          <img 
            src={can.img} 
            alt={can.nome} 
            className="can-image"
          />
        </div>
        
        <div className="can-info">
          <h1 className="can-title">{can.nome}</h1>

          <div className="rating-section">
            <button 
              className="rate-button"
              onClick={handleRatingClick}
            >
              {rating > 0 ? `Il tuo voto: ${rating}` : 'Vota questa lattina'}
            </button>
            
            {showRating && (
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span 
                    key={star}
                    className={`star ${star <= rating ? 'active' : ''}`}
                    onClick={() => handleRate(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="comments-section">
            <h3>Commenti</h3>
            <button 
              className="add-comment-button"
              onClick={handleAddCommentClick}
            >
              Aggiungi un commento
            </button>

            {showCommentForm && (
              <form className="comment-form" onSubmit={handleCommentSubmit}>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Scrivi il tuo commento..."
                  required
                />
                <div className="comment-form-buttons">
                  <button type="submit" className="submit-comment">
                    Invia
                  </button>
                  <button 
                    type="button" 
                    className="cancel-comment"
                    onClick={() => setShowCommentForm(false)}
                  >
                    Annulla
                  </button>
                </div>
              </form>
            )}

            {comments.length > 0 ? (
              <div className="comments-list">
                {comments.map((comment) => (
                  <div key={comment.id} className="comment">
                    <div className="comment-header">
                      <span className="comment-author">{comment.userName}</span>
                      <span className="comment-date">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="comment-text">{comment.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-comments">Nessun commento ancora...</p>
            )}
          </div>

          {showLoginPrompt && (
            <div className="auth-prompt">
              <p>Devi essere registrato per interagire</p>
              <div className="auth-buttons">
                <button 
                  className="auth-button login"
                  onClick={() => navigateToAuth(true)}
                >
                  Accedi
                </button>
                <button 
                  className="auth-button register"
                  onClick={() => navigateToAuth(false)}
                >
                  Registrati
                </button>
                <button 
                  className="auth-button cancel"
                  onClick={() => setShowLoginPrompt(false)}
                >
                  Annulla
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CanDetailPage;
 