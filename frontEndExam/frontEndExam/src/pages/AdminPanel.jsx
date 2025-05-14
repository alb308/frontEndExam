import React, { useState } from 'react';
import { useUser } from "../components/UserContext";

import { Navigate } from 'react-router-dom';

function AdminPanel() {
  const { user } = useUser();
  const [cans, setCans] = useState([]);
  const [name, setName] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  const handleSave = () => {
    if (editingIndex !== null) {
      const updated = [...cans];
      updated[editingIndex] = name;
      setCans(updated);
      setEditingIndex(null);
    } else {
      setCans([...cans, name]);
    }
    setName('');
  };

  const handleEdit = (index) => {
    setName(cans[index]);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    const updated = [...cans];
    updated.splice(index, 1);
    setCans(updated);
  };

  return (
    <div>
      <h2>Gestione Lattine (Admin)</h2>
      <input
        placeholder="Nome lattina"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleSave}>
        {editingIndex !== null ? 'Modifica' : 'Aggiungi'}
      </button>

      <ul>
        {cans.map((can, index) => (
          <li key={index}>
            {can}
            <button onClick={() => handleEdit(index)}>✏️</button>
            <button onClick={() => handleDelete(index)}>🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminPanel;
