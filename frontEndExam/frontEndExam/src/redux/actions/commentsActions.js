
const API_URL = 'http://localhost:3001';


export const fetchComments = (canId) => {
  return async (dispatch) => {
    dispatch({ type: 'FETCH_COMMENTS_REQUEST' });
    
    try {
      const response = await fetch(`${API_URL}/comments?canId=${canId}`);
      const comments = await response.json();
      
      dispatch({
        type: 'FETCH_COMMENTS_SUCCESS',
        payload: comments
      });
    } catch (error) {
      dispatch({
        type: 'FETCH_COMMENTS_FAILURE',
        payload: error.message
      });
    }
  };
};


export const addComment = (canId, text) => {
  return async (dispatch, getState) => {
    const { auth } = getState();
    
    if (!auth.user) {
      return { success: false, error: 'Devi essere loggato per commentare' };
    }
    
    try {
      const response = await fetch(`${API_URL}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          canId: parseInt(canId),
          userId: auth.user.id,
          userName: auth.user.name,
          text,
          createdAt: new Date().toISOString()
        })
      });
      
      const newComment = await response.json();
      
      dispatch({
        type: 'ADD_COMMENT_SUCCESS',
        payload: newComment
      });
      
      return { success: true, data: newComment };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
};


export const deleteComment = (commentId) => {
  return async (dispatch, getState) => {
    const { auth, comments } = getState();
    const comment = comments.comments.find(c => c.id === commentId);
    
    if (!auth.user || (comment.userId !== auth.user.id && auth.user.role !== 'admin')) {
      return { success: false, error: 'Non autorizzato' };
    }
    
    try {
      await fetch(`${API_URL}/comments/${commentId}`, {
        method: 'DELETE'
      });
      
      dispatch({
        type: 'DELETE_COMMENT_SUCCESS',
        payload: commentId
      });
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
};