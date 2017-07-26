import * as React from 'react';
import { mount } from 'enzyme';
import assert from 'assert';

import { TokenList } from './index';

describe('Token list page', function() {
  it('should render a tokens (smoke test)', function() {
    const component = mount(<TokenList
      activeModal={{name: null, data: {}}}
      tokens={{
        data: [
          {tokenType: 'readonly', key: 'tok_ABC'},
          {tokenType: 'readwrite', key: 'tok_XXX'},
        ],
        filters: {
          search: '',
        },
      }}
    />);

    // Should render two tokens
    assert.equal(component.find('.token-list-item').length, 2);
  });
});
