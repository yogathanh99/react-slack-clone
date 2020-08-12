import { combineReducers } from 'redux';

import userReducers from './userReducers';
import channelReducers from './channelReducers';
import colorReducers from './colorReducers';

export default combineReducers({
  user: userReducers,
  channel: channelReducers,
  color: colorReducers,
});
