import * as actionTypes from '../actions/actionTypes';

const initState = {
  currentUser: null,
  isLoading: true,
};

const userReducers = (state = initState, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        currentUser: action.payload.currentUser,
        isLoading: false,
      };
    case actionTypes.CLEAR_USER:
      return {
        ...state,
        currentUser: null,
        isLoading: false,
      };
    default:
      return state;
  }
};

export default userReducers;
