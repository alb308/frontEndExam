// src/redux/actions/authActions.js
const API_URL = 'http://localhost:3001';

// Action creators
export const loginRequest = () => ({
  type: 'LOGIN_REQUEST'
});

export const loginSuccess = (user, token) => ({
  type: 'LOGIN_SUCCESS',
  payload: { user, token }
});

export const loginFailure = (error) => ({
  type: 'LOGIN_FAILURE',
  payload: error
});

export const logout = () => ({
  type: 'LOGOUT'
});

// Thunk actions
export const login = (email, password) => {
  return async (dispatch) => {
    dispatch(loginRequest());
    
    try {
      // Simulazione login - in produzione useresti una vera API
      const response = await fetch(`${API_URL}/users?email=${email}`);
      const users = await response.json();
      
      if (users.length > 0 && users[0].password === password) {
        const user = users[0];
        const token = 'fake-jwt-token-' + user.id;
        
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        dispatch(loginSuccess(user, token));
        return { success: true };
      } else {
        throw new Error('Email o password non validi');
      }
    } catch (error) {
      dispatch(loginFailure(error.message));
      return { success: false, error: error.message };
    }
  };
};

export const register = (userData) => {
  return async (dispatch) => {
    dispatch({ type: 'REGISTER_REQUEST' });
    
    try {
      // Controlla se l'email esiste già
      const checkResponse = await fetch(`${API_URL}/users?email=${userData.email}`);
      const existingUsers = await checkResponse.json();
      
      if (existingUsers.length > 0) {
        throw new Error('Email già registrata');
      }
      
      // Crea nuovo utente
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...userData,
          role: 'user',
          createdAt: new Date().toISOString()
        })
      });
      
      const newUser = await response.json();
      const token = 'fake-jwt-token-' + newUser.id;
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: { user: newUser, token }
      });
      
      return { success: true };
    } catch (error) {
      dispatch({
        type: 'REGISTER_FAILURE',
        payload: error.message
      });
      return { success: false, error: error.message };
    }
  };
};

export const checkAuth = () => {
  return (dispatch) => {
    const token = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      const user = JSON.parse(userStr);
      dispatch(loginSuccess(user, token));
    }
  };
};

export const logoutUser = () => {
  return (dispatch) => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    dispatch(logout());
  };
};