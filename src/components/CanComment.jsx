import React, { useState } from 'react';
import { useUser } from '../UserContext';

function CanComment({ onAdd }) {
  const { user } = useUser();
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (!text.trim()) return;
    onAdd({ author: user.name, content: text });
    setText('');
  };

  if (!user) {
    return <p>🔒 Devi essere loggato per commentare.</p>;
  }

  return (
    <div>
      <textarea
        placeholder="Scrivi un commento..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <br />
      <button onClick={handleSubmit}>Commenta</button>
    </div>
  );
}

export default CanComment;
