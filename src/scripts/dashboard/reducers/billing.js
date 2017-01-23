import update from 'react-addons-update';

const initialState = {
  cvc: null,
  exp: null,
  number: null
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
    default:
      return state;
  }
}
