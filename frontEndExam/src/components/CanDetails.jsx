import React, { useState } from 'react';
import CanComment from './CanComment';

function CanDetails({ name }) {
  const [comments, setComments] = useState([]);

  const handleAddComment = (newComment) => {
    setComments([...comments, newComment]);
  };

  return (
    <div>
      <h2>{name}</h2>
      <p>Descrizione fittizia della lattina...</p>

      <h3>Commenti</h3>
      {comments.length === 0 ? (
        <p>Nessun commento ancora.</p>
      ) : (
        <ul>
          {comments.map((c, i) => (
            <li key={i}>
              <strong>{c.author}:</strong> {c.content}
            </li>
          ))}
        </ul>
      )}

      <CanComment onAdd={handleAddComment} />
    </div>
  );
}

export default CanDetails;
