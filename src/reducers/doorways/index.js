import objectSnakeToCamel from '../../helpers/object-snake-to-camel/index';
import { COLLECTION_DOORWAYS_SET } from '../../actions/collection/doorways/set';
import { COLLECTION_DOORWAYS_PUSH } from '../../actions/collection/doorways/push';
import { COLLECTION_DOORWAYS_FILTER } from '../../actions/collection/doorways/filter';
import { COLLECTION_DOORWAYS_DELETE } from '../../actions/collection/doorways/delete';
import { COLLECTION_DOORWAYS_ERROR } from '../../actions/collection/doorways/error';
import { COLLECTION_DOORWAYS_CREATE } from '../../actions/collection/doorways/create';
import { COLLECTION_DOORWAYS_UPDATE } from '../../actions/collection/doorways/update';
import { COLLECTION_DOORWAYS_DESTROY } from '../../actions/collection/doorways/destroy';

const initialState = {
  filters: {
    spaceId: null,
    search: '',
  },
  loading: true,
  error: null,
  data: [],
};

export default function doorways(state=initialState, action) {
  switch (action.type) {

  // Update the whole doorway collection.
  case COLLECTION_DOORWAYS_SET:
    return {
      ...state,
      loading: false,
      error: null,
      data: action.data.map(objectSnakeToCamel),
    };

  // Push an update to a doorway.
  case COLLECTION_DOORWAYS_PUSH:
    return {
      ...state,
      loading: false,
      error: null,
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

  // An async action has started.
  case COLLECTION_DOORWAYS_CREATE:
  case COLLECTION_DOORWAYS_UPDATE:
  case COLLECTION_DOORWAYS_DESTROY:
    return {...state, loading: true};

  // An error occurred.
  case COLLECTION_DOORWAYS_ERROR:
    return {...state, loading: false, error: action.error};

  // Add a filter to a space
  case COLLECTION_DOORWAYS_FILTER:
    return {
      ...state,
      filters: {
        ...state.filters,
        [action.filter]: action.value,
      },
    };

  // Delete a doorway from the collection.
  case COLLECTION_DOORWAYS_DELETE:
    return {
      ...state,
      loading: false,
      error: null,
      data: state.data.filter(item => action.item.id !== item.id),
    };

  default:
    return state;
  }
}
