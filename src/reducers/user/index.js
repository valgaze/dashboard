import { USER_SET } from '../../actions/user/set';
import { USER_PUSH } from '../../actions/user/push';
import { USER_ERROR } from '../../actions/user/error';

import objectSnakeToCamel from '../../helpers/object-snake-to-camel/index';
import mixpanelUserReducerEnhancer from '../../helpers/mixpanel-user-reducer-enhancer/index';

const initialState = {
  data: null,
  loading: true,
  error: false,
};

export function user(state=initialState, action) {
  switch (action.type) {
  case USER_SET:
    return {...state, loading: false, data: objectSnakeToCamel(action.data)};
  case USER_PUSH:
    return {...state, loading: false, data: {...state.data, ...objectSnakeToCamel(action.item)}};
  case USER_ERROR:
    return {...state, loading: false, error: action.error};
  default:
    return state;
  }
}

export default mixpanelUserReducerEnhancer(user);
