import update from 'react-addons-update';

const initialState = {
  cvc: null,
  exp: null,
  number: null,
  lastFour: null
}

export default function billing(state=initialState, action) {
  switch(action.type) {
    case 'BILLING_SET_CVC':
      return Object.assign({}, state, {
        cvc: action.value
      });
    case 'BILLING_SET_NUMBER':
      return Object.assign({}, state, {
        number: action.value
      });
    case 'BILLING_SET_EXP':
      return Object.assign({}, state, {
        exp: action.value
      });
    case 'BILLING_SUCCESS':
      return Object.assign({}, state, {
        exp: null,
        cvc: null,
        number: null
      });
    case 'BILLING_CUSTOMER_SUCCESS':
      return Object.assign({}, state, {
        lastFour: action.data.last_four
      });
    default:
      return state;
  }
}
