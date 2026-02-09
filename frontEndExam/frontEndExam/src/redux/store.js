import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';
import authReducer from './reducers/authReducer';
import cansReducer from './reducers/cansReducer';
const rootReducer = combineReducers({
  auth: authReducer,
  cans: cansReducer
});

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

export default store;