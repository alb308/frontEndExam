
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ProtectedRoute({ children, requiredRole = null }) {
  const { user, isAuthenticated } = useSelector(state => state.auth);

  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  
  return children;
}

export default ProtectedRoute;