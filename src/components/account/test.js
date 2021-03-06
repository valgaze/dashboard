import * as React from 'react';
import { mount } from 'enzyme';
import assert from 'assert';
import sinon from 'sinon';

import { Provider } from 'react-redux';
import storeFactory from '../../store';

import ConnectedAccount, { Account, NORMAL, EDIT, PASSWORD_RESET } from './index';

const user = {
  data: {
    fullName: 'foo',
    nickname: 'bar',
    email: 'foo@density.io',
    organization: {
      name: 'baz',
    },
    marketingConsent: true,
  },
};

describe('Accounts page', function() {
  it('by default shows the name, email, and password reset links', function() {
    const component = mount(<Account
      user={user}
      activeModal={{name: null}}
    />);

    // Always show name, email, and consent inputs
    assert.notStrictEqual(component.find('.account-full-name-container').length, 0);
    assert.notStrictEqual(component.find('.account-nickname-container').length, 0);
    assert.notStrictEqual(component.find('.account-email-container').length, 0);
    assert.notStrictEqual(component.find('.account-deactivate-container').length, 0);
    assert.notStrictEqual(component.find('.account-consent-container').length, 0);

    // Show change password link
    assert.notStrictEqual(component.find('.account-change-password-value').length, 0);

    // Don't show change password form
    assert.strictEqual(component.find('.account-change-password-form-container').length, 0);

    // Don't show submit user details button
    assert.strictEqual(component.find('.account-submit-user-details button').length, 0);
  });
  it('shows the password reset form after clicking the password reset link', function() {
    const component = mount(<Account
      user={user}
      activeModal={{name: null}}
    />);

    // Click change password
    component.find('.account-change-password-value span').simulate('click');

    // Always show name and email inputs
    assert.notStrictEqual(component.find('.account-full-name-container').length, 0);
    assert.notStrictEqual(component.find('.account-nickname-container').length, 0);
    assert.notStrictEqual(component.find('.account-email-container').length, 0);
    assert.notStrictEqual(component.find('.account-consent-container').length, 0);

    // Don't show change password link
    assert.strictEqual(component.find('.account-change-password-value span').length, 0);

    // Show change password form
    assert.notStrictEqual(component.find('.account-change-password-form-container').length, 0);

    // Don't show submit user details button
    assert.strictEqual(component.find('.account-submit-user-details button').length, 0);
  });
  it('makes the name, email, and marketing consent editable when the user clicks the edit button', function() {
    const component = mount(<Account
      user={user}
      activeModal={{name: null}}
    />);

    // Click change password
    component.find('.account-edit-button').first().simulate('click');

    // Always show full-name and nickname inputs
    assert.strictEqual(component.find('.account-full-name-container input').prop('disabled'), false);
    assert.strictEqual(component.find('.account-nickname-container input').prop('disabled'), false);
    assert.strictEqual(component.find('.account-full-name-container input').prop('disabled'), false);
    assert.strictEqual(component.find('#account-marketing-consent').prop('disabled'), false);

    // Don't show change password link
    assert.strictEqual(component.find('.account-change-password-value span').length, 0);

    // Don't show change password form
    assert.strictEqual(component.find('.account-change-password-form-container').length, 0);

    // Don't show deactivate account blurb
    assert.strictEqual(component.find('.account-deactivate-container').length, 0);

    // Show submit user details button
    assert.notStrictEqual(component.find('.account-submit-user-details button').length, 0);
  });
  it('resets the state of name back to original state when cancel is clicked', function() {
    const component = mount(<Account
      user={user}
      activeModal={{name: null}}
    />);

    // Click "edit" link
    component.find('.account-edit-button').first().simulate('click');

    // Ensure fullname and nickname inputs are visible
    assert.strictEqual(component.find('.account-full-name-container input').prop('disabled'), false);
    assert.strictEqual(component.find('.account-nickname-container input').prop('disabled'), false);

    // Change contents of nickname
    component.find('.account-nickname-container input').simulate('change', {
      target: {value: 'something else'},
    });

    // Click cancel
    component.find('.account-edit-button').first().simulate('click');

    // Ensure that the original value is in the box
    assert.strictEqual(component.find('.account-nickname-container input').prop('value'), user.data.nickname);
  });
  it('sets the nickname to the best guess from the full name', function() {
    const component = mount(<Account
      user={user}
      activeModal={{name: null}}
    />);

    // Name defaults to 'Nickname'
    assert.strictEqual(component.find('.account-nickname-container input').prop('placeholder'), 'Nickname');

    // Nickname changes depending on full name
    component.setState({fullName: 'Foo Bar'});
    assert.strictEqual(component.find('.account-nickname-container input').prop('placeholder'), 'Foo');
  });
  it('handles errors when changing password request fails', function() {
    const component = mount(<Account
      user={user}
      activeModal={{name: null}}
    />);

    // Click "edit" link
    component.find('.account-edit-button').first().simulate('click');

    // Ensure fullname and nickname inputs are visible
    assert.strictEqual(component.find('.account-full-name-container input').prop('disabled'), false);
    assert.strictEqual(component.find('.account-nickname-container input').prop('disabled'), false);

    // Change contents of nickname
    component.find('.account-nickname-container input').simulate('change', {
      target: {value: 'something else'},
    });

    // Mock out fetch to ensure that an error is returned when the ajax call is made.
    // For example, simulate a permission denied error.
    global.fetch = sinon.stub().resolves({
      ok: true,
      status: 403,
      clone() { return this; },
      json: () => Promise.resolve({error: 'something went wrong'}),
    });

    // Click submit
    component.find('.account-edit-button').first().simulate('click');

    // Ensure that the error was reported
    assert.strictEqual(component.find('.error-bar').length, 1);
  });


  it(`shows a loading state when the user isn't loaded`, function() {
    // Mount the connected version of the component.
    const store = storeFactory();
    const component = mount(<Provider store={store}><ConnectedAccount /></Provider>);

    // Make sure a loading indicator is visible.
    assert.strictEqual(component.find('.card-loading').length, 1);
  });
  it('shows a error bar when there is an error', function() {
    const component = mount(<Account
      user={user}
      activeModal={{name: null}}
    />);

    // Set an error.
    component.setState({error: 'boom!'});

    // Make sure an error bar is visible.
    assert.strictEqual(component.find('.error-bar').length, 1);
  });
});
