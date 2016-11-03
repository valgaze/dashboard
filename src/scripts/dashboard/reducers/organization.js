import update from 'react-addons-update';

const initialState = {
  sandboxToken: "initial",
  liveToken: "nope"
}

export default function organization(state=initialState, action) {
  switch(action.type) {
    default:
      return state;
  }
}
