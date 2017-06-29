import { SHOW_MODAL } from '../../actions/modal/show';
import { HIDE_MODAL } from '../../actions/modal/hide';

const initialState = null;
export default function activeModal(state=initialState, action) {
  switch (action.type) {
  case SHOW_MODAL:
    return action.name;
  case HIDE_MODAL:
    return null;
  default:
    return state;
  }
}
