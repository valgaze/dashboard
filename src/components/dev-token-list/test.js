import * as React from 'react';
import { mount } from 'enzyme';
import assert from 'assert';
import sinon from 'sinon';

import { Provider } from 'react-redux';
import storeFactory from '../../store';

import showModal from '../../actions/modal/show';
import hideModal from '../../actions/modal/hide';
import collectionTokensPush from '../../actions/collection/tokens/push';
import collectionTokensSet from '../../actions/collection/tokens/set';
import collectionTokensCreate from '../../actions/collection/tokens/create';
import collectionTokensUpdate from '../../actions/collection/tokens/update';
import collectionTokensFilter from '../../actions/collection/tokens/filter';
import collectionTokensDestroy from '../../actions/collection/tokens/destroy';

import ConnectedTokenList, { TokenList } from './index';

const TOKEN = {
  name: 'foo!',
  description: 'bar baz',
  key: 'tok_ABC',
  tokenType: 'readonly',
};

function timeout(delay) {
  return new Promise(r => setTimeout(r, delay));
}

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

  it('should create a new token', async function() {
    // Mount the connected version of the component.
    const store = storeFactory();
    const component = mount(<Provider store={store}><ConnectedTokenList /></Provider>);
    store.dispatch(collectionTokensSet([]));

    // Click on the new button
    component.find('.fab').simulate('click');

    // The modal should be visible.
    assert.equal(store.getState().activeModal.name, 'token-create');
    assert.equal(component.find('.token-create').length, 1);

    // The button in the modal should be disabled by default.
    assert.equal(component.find('.token-create-modal-submit').prop('disabled'), true);

    // Add a token name
    component.find('.token-create-name-container input').simulate('change', {target: {value: 'token name'}});

    // The button in the modal should now be enabled.
    assert.equal(component.find('.token-create-modal-submit').prop('disabled'), false);

    // Click the button in the modal, which should create a new token on the server.
    global.fetch = sinon.stub().resolves({
      status: 201,
      clone() { return this; },
      json: () => Promise.resolve({
        name: 'token name',
        description: '',
        key: 'tok_XXX',
        token_type: 'readonly',
      }),
    });
    component.find('.token-create-modal-submit').simulate('click');

    // Wait a bit for the promises to settle. FIXME: Not ideal.
    await timeout(50);

    // Ensure that the token was added.
    const newToken = store.getState().tokens.data.find(i => i.name === 'token name');
    assert.notEqual(newToken, undefined);
  });
  it('should update an existing token', async function() {
    // Mount the connected version of the component, with a token.
    const store = storeFactory();
    const component = mount(<Provider store={store}><ConnectedTokenList /></Provider>);
    store.dispatch(collectionTokensSet([TOKEN]));

    // Click on the edit button for the token.
    component.find('.token-card-edit').simulate('click');

    // The modal should be visible.
    assert.equal(store.getState().activeModal.name, 'token-update');
    assert.equal(component.find('.token-update-modal').length, 1);

    // The button in the modal should be enabled.
    assert.equal(component.find('.token-update-modal-submit').prop('disabled'), false);

    // Empty the token name box
    component.find('.update-token-name-container input').simulate('change', {target: {value: ''}});

    // The button in the modal should now be disabled.
    assert.equal(component.find('.token-update-modal-submit').prop('disabled'), true);

    // Enter a new name.
    component.find('.update-token-name-container input').simulate('change', {target: {value: 'token name'}});
    assert.equal(component.find('.token-update-modal-submit').prop('disabled'), false);

    // Click the button in the modal, which should create a new token on the server.
    global.fetch = sinon.stub().resolves({
      status: 200,
      clone() { return this; },
      json: () => Promise.resolve({
        name: 'token name',
        description: '',
        key: 'tok_XXX',
        token_type: 'readonly',
      }),
    });
    component.find('.token-update-modal-submit').simulate('click');

    // Wait a bit for the promises to settle. FIXME: Not ideal.
    await timeout(50);

    // Ensure that the token was added.
    const newToken = store.getState().tokens.data.find(i => i.name === 'token name');
    assert.notEqual(newToken, undefined);
  });
  it('should copy a token', async function() {
    // Mount the connected version of the component, with a token.
    const store = storeFactory();
    const component = mount(<Provider store={store}><ConnectedTokenList /></Provider>);
    store.dispatch(collectionTokensSet([TOKEN]));

    // Click the copy button for the token.
    document.execCommand = sinon.spy();
    component.find('.token-card-copy-token-button').simulate('click');
    assert.equal(document.execCommand.firstCall.args, 'copy');
  });
  it('should filter the token list page', async function() {
    // Mount the connected version of the component, with a token.
    const store = storeFactory();
    store.dispatch(collectionTokensSet([
      {
        name: 'pineapple',
        description: 'bar baz',
        key: 'tok_ABC',
        tokenType: 'readonly',
      },
      {
        name: 'apple',
        description: 'bar baz',
        key: 'tok_IJK',
        tokenType: 'readonly',
      },
      {
        name: 'foo',
        description: 'bar baz',
        key: 'tok_XYZ',
        tokenType: 'readonly',
      },
    ]));
    const component = mount(<Provider store={store}><ConnectedTokenList /></Provider>);

    // All three are visible.
    assert.equal(component.find('.token-list-item').length, 3);

    // Enter a search query to filter the tokens
    component.find('.token-list-search input').simulate('change', {target: {value: 'apple'}});

    // Only `apple` and `pineapple` show up
    assert.equal(component.find('.token-list-item').length, 2);
  });
});
