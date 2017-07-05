import { USER_SET } from '../../actions/user/set';
import { USER_PUSH } from '../../actions/user/push';
import objectSnakeToCamel from '../../helpers/object-snake-to-camel/index';

const initialState = null;

export default function user(state=initialState, action) {
  switch (action.type) {
  case USER_SET:
    return objectSnakeToCamel(action.data);
  case USER_PUSH:
    return {...state, ...objectSnakeToCamel(action.item)};
  default:
    return state;
  }
}
