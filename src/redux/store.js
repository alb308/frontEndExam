// src/redux/store.js
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';
import authReducer from './reducers/authReducer';
import cansReducer from './reducers/cansReducer';
import commentsReducer from './reducers/commentsReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  cans: cansReducer,
  comments: commentsReducer
});

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

export default store;