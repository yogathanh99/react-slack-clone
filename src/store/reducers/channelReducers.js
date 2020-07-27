import * as actionTypes from '../actions/actionTypes';

const initState = {
  currentChannel: null,
};

const channelReducers = (state = initState, action) => {
  switch (action.type) {
    case actionTypes.SET_CURRENT_CHANNEL:
      return {
        ...state,
        currentChannel: action.payload.currentChannel,
      };
    default:
      return state;
  }
};

export default channelReducers;
