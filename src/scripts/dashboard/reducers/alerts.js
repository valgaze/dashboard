import update from 'react-addons-update';

const initialState = {
  results: [{id: 1, enabled: true}, {id: 2, enabled: false}]
}

export default function alerts(state=initialState, action) {
  switch(action.type) {
    default:
      return state;
  }
}
