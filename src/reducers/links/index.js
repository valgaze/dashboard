import objectSnakeToCamel from '../../helpers/object-snake-to-camel/index';
import { COLLECTION_LINKS_SET } from '../../actions/collection/links-set';
import { COLLECTION_LINKS_PUSH } from '../../actions/collection/links-push';
import { COLLECTION_LINKS_DELETE } from '../../actions/collection/links-delete';

const initialState = {
  filters: {
    spaceId: null,
    doorwayId: null,
  },
  loading: false,
  data: [],
};

export default function links(state=initialState, action) {
  switch (action.type) {

  // Update the whole link collection.
  case COLLECTION_LINKS_SET:
    return {
      ...state,
      loading: false,
      data: action.data.map(objectSnakeToCamel),
    };

  // Push an update to a link.
  case COLLECTION_LINKS_PUSH:
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

  // Delete a link from the collection.
  case COLLECTION_LINKS_DELETE:
    return {
      ...state,
      data: state.data.filter(item => action.item.id !== item.id),
    };

  default:
    return state;
  }
}
