
const API_URL = 'http://localhost:3001';


export const fetchCans = (filters = {}, page = 1, limit = 1000) => { 
  return async (dispatch) => {
    dispatch({ type: 'FETCH_CANS_REQUEST' });
    
    try {
      
      const start = (page - 1) * limit;
      const end = start + limit;
      
      let queryParams = new URLSearchParams({
        _start: start,
        _end: end
      });
      
      
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.year) queryParams.append('year', filters.year);
      if (filters.country) queryParams.append('country', filters.country);
      if (filters.search) queryParams.append('q', filters.search);
      
      const response = await fetch(`${API_URL}/cans?${queryParams}`);
      const cans = await response.json();
      
      console.log(`✅ Redux fetchCans - Lattine caricate: ${cans.length}`);
      
      
      const total = response.headers.get('X-Total-Count') || cans.length;
      
      dispatch({
        type: 'FETCH_CANS_SUCCESS',
        payload: { cans, total: parseInt(total) }
      });
    } catch (error) {
      dispatch({
        type: 'FETCH_CANS_FAILURE',
        payload: error.message
      });
    }
  };
};


export const fetchAllCans = () => {
  return async (dispatch) => {
    dispatch({ type: 'FETCH_CANS_REQUEST' });
    
    try {
      
      const response = await fetch(`${API_URL}/cans?_start=0&_end=1000`);
      const cans = await response.json();
      
      dispatch({
        type: 'FETCH_CANS_SUCCESS',
        payload: { cans, total: cans.length }
      });
    } catch (error) {
      dispatch({
        type: 'FETCH_CANS_FAILURE',
        payload: error.message
      });
    }
  };
};


export const fetchCanDetail = (id) => {
  return async (dispatch) => {
    dispatch({ type: 'FETCH_CAN_DETAIL_REQUEST' });
    
    try {
      const response = await fetch(`${API_URL}/cans/${id}`);
      if (!response.ok) throw new Error('Lattina non trovata');
      
      const can = await response.json();
      
      dispatch({
        type: 'FETCH_CAN_DETAIL_SUCCESS',
        payload: can
      });
    } catch (error) {
      dispatch({
        type: 'FETCH_CAN_DETAIL_FAILURE',
        payload: error.message
      });
    }
  };
};


export const addCan = (canData) => {
  return async (dispatch, getState) => {
    const { auth } = getState();
    
    if (!auth.user || auth.user.role !== 'admin') {
      return { success: false, error: 'Non autorizzato' };
    }
    
    try {
      const response = await fetch(`${API_URL}/cans`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...canData,
          id: Date.now(),
          createdAt: new Date().toISOString()
        })
      });
      
      const newCan = await response.json();
      
      dispatch({
        type: 'ADD_CAN_SUCCESS',
        payload: newCan
      });
      
      return { success: true, data: newCan };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
};


export const updateCan = (id, updates) => {
  return async (dispatch, getState) => {
    const { auth } = getState();
    
    if (!auth.user || auth.user.role !== 'admin') {
      return { success: false, error: 'Non autorizzato' };
    }
    
    try {
      const response = await fetch(`${API_URL}/cans/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...updates,
          updatedAt: new Date().toISOString()
        })
      });
      
      const updatedCan = await response.json();
      
      dispatch({
        type: 'UPDATE_CAN_SUCCESS',
        payload: updatedCan
      });
      
      return { success: true, data: updatedCan };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
};


export const deleteCan = (id) => {
  return async (dispatch, getState) => {
    const { auth } = getState();
    
    if (!auth.user || auth.user.role !== 'admin') {
      return { success: false, error: 'Non autorizzato' };
    }
    
    try {
      await fetch(`${API_URL}/cans/${id}`, {
        method: 'DELETE'
      });
      
      dispatch({
        type: 'DELETE_CAN_SUCCESS',
        payload: id
      });
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
};


export const setFilters = (filters) => ({
  type: 'SET_FILTERS',
  payload: filters
});


export const setPage = (page) => ({
  type: 'SET_PAGE',
  payload: page
});