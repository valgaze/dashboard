import { SHOW_MODAL } from '../../actions/modal/show';
import { HIDE_MODAL } from '../../actions/modal/hide';

const initialState = {name: null, data: {}};
export default function activeModal(state=initialState, action) {
  switch (action.type) {
  case SHOW_MODAL:
    return {name: action.name, data: action.data};
  case HIDE_MODAL:
    return {name: null, data: {}};
  default:
    return state;
  }
}
