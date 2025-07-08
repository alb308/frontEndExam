// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ProtectedRoute({ children, requiredRole = null }) {
  const { user, isAuthenticated } = useSelector(state => state.auth);

  // Se l'utente non è autenticato, reindirizza al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se è richiesto un ruolo specifico, verifica che l'utente ce l'abbia
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // Se tutto è ok, renderizza il componente figlio
  return children;
}

export default ProtectedRoute;