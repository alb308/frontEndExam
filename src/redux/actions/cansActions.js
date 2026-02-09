import db from '../../data/db.json';

const getAllCans = () => db.cans;

export const fetchCans = (filters = {}, page = 1, limit = 1000) => {
  return async (dispatch) => {
    dispatch({ type: 'FETCH_CANS_REQUEST' });

    try {
      let cans = getAllCans();

      // Apply filters
      if (filters.category) {
        cans = cans.filter(can => can.category === filters.category);
      }
      if (filters.year) {
        cans = cans.filter(can => can.year?.toString() === filters.year?.toString());
      }
      if (filters.country) {
        cans = cans.filter(can => can.country === filters.country);
      }
      if (filters.search) {
        const query = filters.search.toLowerCase();
        cans = cans.filter(can => can.nome?.toLowerCase().includes(query));
      }

      // Pagination
      const total = cans.length;
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedCans = cans.slice(start, end);

      console.log(`✅ Redux fetchCans - Lattine caricate: ${paginatedCans.length}`);

      dispatch({
        type: 'FETCH_CANS_SUCCESS',
        payload: { cans: paginatedCans, total }
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
      const cans = getAllCans();

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
      const cans = getAllCans();
      const can = cans.find(c => c.id.toString() === id.toString());

      if (!can) throw new Error('Lattina non trovata');

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
    return { success: false, error: 'Funzionalità disabilitata nella modalità vetrina' };
  };
};

export const updateCan = (id, updates) => {
  return async (dispatch, getState) => {
    return { success: false, error: 'Funzionalità disabilitata nella modalità vetrina' };
  };
};

export const deleteCan = (id) => {
  return async (dispatch, getState) => {
    return { success: false, error: 'Funzionalità disabilitata nella modalità vetrina' };
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