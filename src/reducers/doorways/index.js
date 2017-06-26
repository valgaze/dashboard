import objectSnakeToCamel from '../../helpers/object-snake-to-camel/index';
import { COLLECTION_DOORWAYS_SET } from '../../actions/collection/doorways-set';
import { COLLECTION_DOORWAYS_PUSH } from '../../actions/collection/doorways-push';

const initialState = {
  filters: {
    spaceId: null,
  },
  loading: false,
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

  default:
    return state;
  }
}
