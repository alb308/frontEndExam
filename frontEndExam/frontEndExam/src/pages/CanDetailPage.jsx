import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCanDetail } from '../redux/actions/cansActions';
import { fetchComments, addComment } from '../redux/actions/commentsActions';
import './CanDetailPage.css';

function CanDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentCan: can } = useSelector(state => state.cans);
  const { comments } = useSelector(state => state.comments);
  const { isAuthenticated, user } = useSelector(state => state.auth);
  
  const [rating, setRating] = useState(0);
  const [showRating, setShowRating] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showCommentForm, setShowCommentForm] = useState(false);

  useEffect(() => {
    dispatch(fetchCanDetail(id));
    dispatch(fetchComments(id));
  }, [dispatch, id]);

  const handleRatingClick = () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    setShowRating(!showRating);
  };

  const handleRate = async (star) => {
    setRating(star);
    try {
      const response = await fetch('http://localhost:3001/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          canId: parseInt(id), 
          userId: user.id,
          rating: star,
          createdAt: new Date().toISOString()
        })
      });
    } catch (error) {}
    setShowRating(false);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const result = await dispatch(addComment(id, newComment));
    if (result.success) {
      setNewComment('');
      setShowCommentForm(false);
    }
  };

  const navigateToAuth = (isLogin) => {
    navigate(isLogin ? '/login' : '/register', { 
      state: { from: `/cans/${id}` } 
    });
  };

  const handleAddCommentClick = () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    setShowCommentForm(true);
  };

  if (!can) return null;

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