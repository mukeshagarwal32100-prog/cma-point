import { createStore, combineReducers } from 'redux';

const initialState = {
  cart: {
    items: [],
  },
  user: null,
};

const cartReducer = (state = initialState.cart, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
      };
    default:
      return state;
  }
};

const userReducer = (state = initialState.user, action) => {
  switch (action.type) {
    case 'LOGIN':
      return action.payload;
    case 'LOGOUT':
      return null;
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  cart: cartReducer,
  user: userReducer,
});

const store = createStore(rootReducer);

export default store;
