import { EVENT_PUSHER_STATUS_CHANGE } from '../../actions/event-pusher/status-change';

const initialState = {status: 'unknown'};
export default function eventPusherStatus(state=initialState, action) {
  switch (action.type) {
  case EVENT_PUSHER_STATUS_CHANGE:
    return {status: action.status};
  default:
    return state;
  }
}
