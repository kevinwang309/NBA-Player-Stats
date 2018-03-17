import { combineReducers } from 'redux';
import headerReducer from './headerReducer';
import playerReducer from './playerReducer';

const rootReducer = combineReducers({
  header: headerReducer,
  player: playerReducer
});

export default rootReducer;
