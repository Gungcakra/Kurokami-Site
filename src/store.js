import { createStore } from 'redux';

// Definisikan action types
const SET_MANHWA_ID = 'SET_MANHWA_ID';

// Definisikan action creators
export const setManhwaId = (id) => ({
  type: SET_MANHWA_ID,
  payload: id,
});

// Definisikan reducer
const initialState = {
  manhwaId: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MANHWA_ID:
      return {
        ...state,
        manhwaId: action.payload,
      };
    default:
      return state;
  }
};

// Buat store
const store = createStore(reducer);

export default store;
