const initialState = {
  cans: [],
  currentCan: null,
  loading: false,
  error: null,
  filters: {
    category: '',
    year: '',
    country: '',
    search: ''
  },
  pagination: {
    page: 1,
    limit: 12,
    total: 0
  }
};

const cansReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_CANS_REQUEST':
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case 'FETCH_CANS_SUCCESS':
      return {
        ...state,
        cans: action.payload.cans,
        pagination: {
          ...state.pagination,
          total: action.payload.total
        },
        loading: false
      };
    
    case 'FETCH_CANS_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    case 'FETCH_CAN_DETAIL_REQUEST':
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case 'FETCH_CAN_DETAIL_SUCCESS':
      return {
        ...state,
        currentCan: action.payload,
        loading: false
      };
    
    case 'FETCH_CAN_DETAIL_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    case 'ADD_CAN_SUCCESS':
      return {
        ...state,
        cans: [...state.cans, action.payload]
      };
    
    case 'UPDATE_CAN_SUCCESS':
      return {
        ...state,
        cans: state.cans.map(can => 
          can.id === action.payload.id ? action.payload : can
        )
      };
    
    case 'DELETE_CAN_SUCCESS':
      return {
        ...state,
        cans: state.cans.filter(can => can.id !== action.payload)
      };
    
    case 'SET_FILTERS':
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload
        }
      };
    
    case 'SET_PAGE':
      return {
        ...state,
        pagination: {
          ...state.pagination,
          page: action.payload
        }
      };
    
    default:
      return state;
  }
};

export default cansReducer;