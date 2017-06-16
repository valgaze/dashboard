// A reducer enhancer that takes the output of a reducer and sticks it in local storage.
// An example use of this is with the `sessionToken` reducer, to keep the logged in token in
// localStorage.
export default function localStorageReducerEnhancer(localStorageProperty) {
  return reducer => (state, props) => {
    const result = reducer(state, props);
    window.localStorage[localStorageProperty] = JSON.stringify(result);
    return result;
  }
}
