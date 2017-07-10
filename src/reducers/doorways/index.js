import objectSnakeToCamel from '../../helpers/object-snake-to-camel/index';
import { COLLECTION_DOORWAYS_SET } from '../../actions/collection/doorways/set';
import { COLLECTION_DOORWAYS_PUSH } from '../../actions/collection/doorways/push';
import { COLLECTION_DOORWAYS_FILTER } from '../../actions/collection/doorways/filter';
import { COLLECTION_DOORWAYS_DELETE } from '../../actions/collection/doorways/delete';

const initialState = {
  filters: {
    spaceId: null,
    search: '',
  },
  loading: true,
  data: [],
};

export default function doorways(state=initialState, action) {
  switch (action.type) {

  // Update the whole doorway collection.
  case COLLECTION_DOORWAYS_SET:
    return {
      ...state,
      loading: false,
      data: action.data.map(objectSnakeToCamel),
    };

  // Push an update to a doorway.
  case COLLECTION_DOORWAYS_PUSH:
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
      data: state.data.filter(item => action.item.id !== item.id),
    };

  default:
    return state;
  }
}