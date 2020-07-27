import { combineReducers } from 'redux';

import userReducers from './userReducers';
import channelReducers from './channelReducers';

export default combineReducers({
  user: userReducers,
  channel: channelReducers,
});
