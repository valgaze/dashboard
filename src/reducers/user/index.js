import { USER_SET } from '../../actions/user/set';
import objectSnakeToCamel from '../../helpers/object-snake-to-camel/index';

const initialState = null;

export default function user(state=initialState, action) {
  switch (action.type) {
  case USER_SET:
    return objectSnakeToCamel(action.data);
  default:
    return state;
  }
}
