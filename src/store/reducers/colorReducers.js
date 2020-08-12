import * as actionTypes from '../actions/actionTypes';

const initState = {
  primaryColor: '#4c3c4c',
  secondaryColor: '#eee',
};

const colorReducers = (state = initState, actions) => {
  switch (actions.type) {
    case actionTypes.SET_COLORS:
      return {
        ...state,
        primaryColor: actions.payload.primaryColor,
        secondaryColor: actions.payload.secondaryColor,
      };
    default:
      return state;
  }
};

export default colorReducers;
