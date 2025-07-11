const initialState = {
  comments: [],
  loading: false,
  error: null
};

const commentsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_COMMENTS_REQUEST':
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case 'FETCH_COMMENTS_SUCCESS':
      return {
        ...state,
        comments: action.payload,
        loading: false
      };
    
    case 'FETCH_COMMENTS_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    case 'ADD_COMMENT_SUCCESS':
      return {
        ...state,
        comments: [...state.comments, action.payload]
      };
    
    case 'DELETE_COMMENT_SUCCESS':
      return {
        ...state,
        comments: state.comments.filter(comment => comment.id !== action.payload)
      };
    
    default:
      return state;
  }
};

export default commentsReducer;