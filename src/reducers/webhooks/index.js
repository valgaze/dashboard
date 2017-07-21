import objectSnakeToCamel from '../../helpers/object-snake-to-camel/index';
import { COLLECTION_WEBHOOKS_SET } from '../../actions/collection/webhooks/set';
import { COLLECTION_WEBHOOKS_PUSH } from '../../actions/collection/webhooks/push';
import { COLLECTION_WEBHOOKS_DELETE } from '../../actions/collection/webhooks/delete';
import { COLLECTION_WEBHOOKS_FILTER } from '../../actions/collection/webhooks/filter';

const initialState = {
  data: [],
  loading: false,
  error: false,
  filters: {
    search: '',
  },
};
export default function webhooks(state=initialState, action) {
  switch (action.type) {

  // Update the whole space collection.
  case COLLECTION_WEBHOOKS_SET:
    return {
      ...state,
      loading: false,
      data: action.data.map(objectSnakeToCamel),
    }

  // Push an update to a space.
  case COLLECTION_WEBHOOKS_PUSH:
    return {
      ...state,
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

  // Delete a space from the collection.
  case COLLECTION_WEBHOOKS_DELETE:
    return {
      ...state,
      data: state.data.filter(item => action.item.id !== item.id),
    };

  // Add a filter to a webhook.
  case COLLECTION_WEBHOOKS_FILTER:
    return {
      ...state,
      filters: {
        ...state.filters,
        [action.filter]: action.value,
      },
    };

  default:
    return state;
  }
}
