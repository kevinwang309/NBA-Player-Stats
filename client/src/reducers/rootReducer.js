import { combineReducers } from 'redux';
import headerReducer from './headerReducer';

const rootReducer = combineReducers({
  header: headerReducer
});

export default rootReducer;
