import objectSnakeToCamel from '../../helpers/object-snake-to-camel/index';
import { COLLECTION_SPACES_SET } from '../../actions/collection/spaces/set';
import { COLLECTION_SPACES_PUSH } from '../../actions/collection/spaces/push';
import { COLLECTION_SPACES_FILTER } from '../../actions/collection/spaces/filter';
import { COLLECTION_SPACES_CREATE } from '../../actions/collection/spaces/create';
import { COLLECTION_SPACES_DESTROY } from '../../actions/collection/spaces/destroy';
import { COLLECTION_SPACES_UPDATE } from '../../actions/collection/spaces/update';
import { COLLECTION_SPACES_DELETE } from '../../actions/collection/spaces/delete';
import { COLLECTION_SPACES_ERROR } from '../../actions/collection/spaces/error';

import { COLLECTION_SPACES_COUNT_CHANGE } from '../../actions/collection/spaces/count-change';
import { COLLECTION_SPACES_SET_EVENTS } from '../../actions/collection/spaces/set-events';

import { ROUTE_TRANSITION_VISUALIZATION_SPACE_DETAIL } from '../../actions/route-transition/visualization-space-detail';

const initialState = {
  data: [],
  loading: true,
  error: null,
  selected: null,
  filters: {
    doorwayId: null,
    search: '',
  },

  // An object that maps space id to an array of events
  events: {
    /* For example:
    'spc_XXXX': [{timestamp: '2017-07-24T12:37:42.946Z', direction: 1}],
    */
  },
};

export default function spaces(state=initialState, action) {
  switch (action.type) {

  // Update the whole space collection.
  case COLLECTION_SPACES_SET:
    return {
      ...state,
      loading: false,
      data: action.data.map(objectSnakeToCamel),
    }

  // Push an update to a space.
  case COLLECTION_SPACES_PUSH:
    return {
      ...state,
      loading: false,
      data: [
        // Update existing items
        ...state.data.map(item => {
          if (action.item.id === item.id) {
            return {...item, ...objectSnakeToCamel(action.item)};
          } else {
            return item;
          }
        }),

        // Add new items
        ...(
          state.data.find(i => i.id === action.item.id) === undefined ?
            [objectSnakeToCamel(action.item)] :
            []
        ),
      ],
    };

  // An async operation is starting.
  case COLLECTION_SPACES_CREATE:
  case COLLECTION_SPACES_DESTROY:
  case COLLECTION_SPACES_UPDATE:
    return {...state, loading: true};

  // When an error happens in the collection, define an error.
  case COLLECTION_SPACES_ERROR:
    return {...state, error: action.error, loading: false};

  // Add a filter to a space
  case COLLECTION_SPACES_FILTER:
    return {
      ...state,
      filters: {
        ...state.filters,
        [action.filter]: action.value,
      },
    };

  // Delete a space from the collection.
  case COLLECTION_SPACES_DELETE:
    return {
      ...state,
      loading: false,
      data: state.data.filter(item => action.item.id !== item.id),
    };

  // When the user changes the active space, update it in the store.
  case ROUTE_TRANSITION_VISUALIZATION_SPACE_DETAIL:
    return {...state, selected: action.id};

// ----------------------------------------------------------------------------
// EVENTS COLLECTION
// Store and append to seperate events collections. Each is associated with a space.
// ------------------------------------------------------------------------------

  // Map an initial set of events into a space.
  case COLLECTION_SPACES_SET_EVENTS:
    return {
      ...state,
      events: {
        ...state.events,
        [action.item.id]: action.events,
      },
    };

  // The count on a given space changed. Update the count in the space and add events into the
  // events set.
  case COLLECTION_SPACES_COUNT_CHANGE:
    return {
      ...state,
      data: [
        // Update existing items
        ...state.data.map(item => {
          if (action.id === item.id) {
            return {...item, currentCount: item.currentCount + action.countChange};
          } else {
            return item;
          }
        }),
      ],

      // Add a new event to the events collection
      events: {
        ...state.events,
        [action.id]: [...(state.events[action.id] || []), {
          timestamp: action.timestamp,
          countChange: action.countChange,
        }],
      },
    };

  default:
    return state;
  }
}
