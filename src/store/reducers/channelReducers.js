import * as actionTypes from '../actions/actionTypes';

const initState = {
  currentChannel: null,
  isPrivateChannel: false,
  isActiveChannel: null,
  userPosts: null,
};

const channelReducers = (state = initState, action) => {
  switch (action.type) {
    case actionTypes.SET_CURRENT_CHANNEL:
      return {
        ...state,
        currentChannel: action.payload.currentChannel,
      };
    case actionTypes.SET_PRIVATE_CHANNEL:
      return {
        ...state,
        isPrivateChannel: action.payload.isPrivateChannel,
      };
    case actionTypes.SET_ACTIVE_CHANNEL:
      return {
        ...state,
        isActiveChannel: action.payload.isActiveChannel,
      };
    case actionTypes.SET_USER_POSTS:
      return {
        ...state,
        userPosts: action.payload.userPosts,
      };
    default:
      return state;
  }
};

export default channelReducers;
