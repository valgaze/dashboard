import * as React from 'react';
import { mount } from 'enzyme';
import assert from 'assert';
import sinon from 'sinon';

import { Provider } from 'react-redux';
import storeFactory from '../../store';

import showModal from '../../actions/modal/show';
import hideModal from '../../actions/modal/hide';
import collectionSpacesSet from '../../actions/collection/spaces/set';
import collectionSpacesError from '../../actions/collection/spaces/error';
import collectionDoorwaysSet from '../../actions/collection/doorways/set';
import collectionDoorwaysError from '../../actions/collection/doorways/error';
import collectionLinksSet from '../../actions/collection/links/set';
import collectionLinksError from '../../actions/collection/links/error';

import ConnectedEnvionment, { Environment } from './index';

function timeout(delay) {
  return new Promise(r => setTimeout(r, delay));
}

// In order for the drag-drop studd to properly work, create a drag-drop context wrapper that can be
// used to inject a drag-drop context.
import { DragDropContext } from 'react-dnd';
import TestBackend from 'react-dnd-test-backend';
const DragDropWrapper = DragDropContext(TestBackend)(props => <div {...props} />);

describe('Environment page', function() {
  it('should render the page (smoke test)', function() {
    const component = mount(<DragDropWrapper>
      <Environment
        activeModal={{name: null, data: {}}}
        spaces={{
          data: [
            {
              id: 'spc_0',
              name: 'my space',
              description: '',
              timeZone: 'America/New_York',
              dailyReset: '12:00',
              currentCount: 0,
              capacity: null,
            },
          ],
          loading: false,
          filters: {
            search: '',
          },
        }}
        doorways={{
          data: [
            {
              id: 'drw_1',
              name: 'my doorway',
              description: '',
              spaces: [
                {id: 'spc_0', name: 'my space', sensorPlacement: 1},
              ],
            },
          ],
          loading: false,
          filters: {
            search: '',
          },
        }}
        links={{
          data: [
            {
              id: 'lnk_3',
              spaceId: 'spc_0',
              doorwayId: 'drw_1',
              spaceName: 'my space',
              doorwayName: 'my doorway',
              sensorPlacement: 1,
            },
          ],
          loading: false,
        }}
      />
    </DragDropWrapper>);

    // Should render one space (with the doorway linked) and one doorway
    assert.equal(component.find('.environment-space-item').length, 1);
    assert.equal(component.find('.environment-space-item .environment-space-item-doorways li').length, 1);
    assert.equal(component.find('.environment-doorway-item').length, 1);
  });
});

describe('Space workflows', function() {
  it('should create a space', async function() {
    // Mount the connected version of the component.
    const store = storeFactory();
    const component = mount(<Provider store={store}>
      <DragDropWrapper>
        <ConnectedEnvionment />
      </DragDropWrapper>
    </Provider>);
    store.dispatch(collectionSpacesSet([]));
    store.dispatch(collectionDoorwaysSet([]));
    store.dispatch(collectionLinksSet([]));

    // Click on the new button
    component.find('.fab-primary').simulate('click');

    // The context menu should be visible.
    assert.equal(store.getState().activeModal.name, 'space-doorway-popup');
    assert.equal(component.find('.environment-creation-context-menu').length, 1);

    // Click on 'create space'
    component.find('.environment-creation-context-menu .context-menu-item').first().simulate('click');

    // The modal should be visible.
    assert.equal(store.getState().activeModal.name, 'create-space');
    assert.equal(component.find('.environment-modal-create-space').length, 1);

    // But the button in the modal should be disabled by default.
    assert.equal(component.find('.create-space-submit button').prop('disabled'), true);

    // Also, the reset time picker should be disabled by default.
    assert.equal(component.find('.create-space-reset-time-container select').prop('disabled'), true);

    // Add a space name and time zone 
    component.find('.create-space-name-container input').simulate('change', {target: {value: 'space name'}});
    component.find('.create-space-time-zone-container select').simulate('change', {target: {value: 'America/New_York'}});

    // Now, reset tiem picker should be enabled.
    assert.equal(component.find('.create-space-reset-time-container select').prop('disabled'), false);

    // Choose a reset time.
    component.find('.create-space-reset-time-container select').simulate('change', {target: {value: '12:00'}});

    // The button in the modal should now be enabled.
    assert.equal(component.find('.create-space-submit button').prop('disabled'), false);

    // Click the button in the modal, which should create a new space on the server.
    global.fetch = sinon.stub().resolves({
      ok: true,
      status: 201,
      clone() { return this; },
      json: () => Promise.resolve({
        id: 'spc_1',
        name: 'space name',
        description: '',
        time_zone: 'America/New_York',
        daily_reset: '12:00',
        current_count: 0,
        capacity: null,
      }),
    });
    component.find('.create-space-submit button').simulate('click');

    // Ensure that loading spinner is visible.
    assert.equal(store.getState().spaces.loading, true);

    // Wait a bit for the promises to settle. FIXME: Not ideal.
    await timeout(25);

    // Ensure that the space was added.
    const newSpace = store.getState().spaces.data.find(i => i.name === 'space name');
    assert.notEqual(newSpace, undefined);

    // The modal should no longer be visible.
    assert.equal(store.getState().activeModal.name, null);
    assert.equal(component.find('.environment-modal-create-space').length, 0);
  });
  it('should try to create a space, but instead display an error', async function() {
    // Mount the connected version of the component.
    const store = storeFactory();
    const component = mount(<Provider store={store}>
      <DragDropWrapper>
        <ConnectedEnvionment />
      </DragDropWrapper>
    </Provider>);
    store.dispatch(collectionSpacesSet([]));
    store.dispatch(collectionDoorwaysSet([]));
    store.dispatch(collectionLinksSet([]));

    // Click on the new button
    component.find('.fab-primary').simulate('click');

    // The context menu should be visible.
    assert.equal(store.getState().activeModal.name, 'space-doorway-popup');
    assert.equal(component.find('.environment-creation-context-menu').length, 1);

    // Click on 'create space'
    component.find('.environment-creation-context-menu .context-menu-item').first().simulate('click');

    // The modal should be visible.
    assert.equal(store.getState().activeModal.name, 'create-space');
    assert.equal(component.find('.environment-modal-create-space').length, 1);

    // But the button in the modal should be disabled by default.
    assert.equal(component.find('.create-space-submit button').prop('disabled'), true);

    // Add a space name, time zone and reset time
    component.find('.create-space-name-container input').simulate('change', {target: {value: 'space name'}});
    component.find('.create-space-time-zone-container select').simulate('change', {target: {value: 'America/New_York'}});
    component.find('.create-space-reset-time-container select').simulate('change', {target: {value: '12:00'}});

    // The button in the modal should now be enabled.
    assert.equal(component.find('.create-space-submit button').prop('disabled'), false);

    // Click the button in the modal, which should attempt to create a new space on the server but
    // fail.
    global.fetch = sinon.stub().resolves({
      ok: false,
      status: 403,
      clone() { return this; },
      json: () => Promise.resolve({}),
    });
    component.find('.create-space-submit button').simulate('click');

    // Ensure that loading spinner is visible.
    assert.equal(store.getState().spaces.loading, true);

    // Wait a bit for the promises to settle. FIXME: Not ideal.
    await timeout(25);

    // Ensure that the space was not created, and an error is visible.
    assert.equal(store.getState().spaces.data.length, 0);
    assert.notEqual(store.getState().spaces.error, null);

    // The modal should still be visible.
    assert.equal(store.getState().activeModal.name, 'create-space');
    assert.equal(component.find('.environment-modal-create-space').length, 1);
  });
  it('should update a space', async function() {
    // Mount the connected version of the component.
    const store = storeFactory();
    const component = mount(<Provider store={store}>
      <DragDropWrapper>
        <ConnectedEnvionment />
      </DragDropWrapper>
    </Provider>);
    store.dispatch(collectionSpacesSet([
      {
        id: 'spc_1',
        name: 'my space',
        description: '',
        timeZone: 'America/New_York',
        dailyReset: '12:00',
        currentCount: 0,
        capacity: null,
      },
    ]));
    store.dispatch(collectionDoorwaysSet([]));
    store.dispatch(collectionLinksSet([]));

    // Click on the edit for the space
    component.find('.environment-space-item-details').simulate('click');

    // The popover should be visible.
    assert.equal(store.getState().activeModal.name, 'update-space');
    assert.equal(component.find('.environment-modal-update-space').length, 1);

    // Click on the edit button
    component.find('.update-space-edit-button').first().simulate('click');

    // The button in the modal should be enabled, since the space details were already correct.
    assert.equal(component.find('.environment-modal-update-space-submit button').prop('disabled'), false);

    // Clear the space name
    component.find('.update-space-name-container input').simulate('change', {target: {value: ''}});

    // Verify the button is disabled.
    assert.equal(component.find('.environment-modal-update-space-submit button').prop('disabled'), true);

    // Then, update the space name, timezone, and reset time
    component.find('.update-space-name-container input').simulate('change', {target: {value: 'foo!'}});
    component.find('.update-space-time-zone-container select').simulate('change', {target: {value: 'America/Denver'}});
    component.find('.update-space-daily-reset-container select').simulate('change', {target: {value: '16:00'}});

    // The button in the modal should be enabled again.
    assert.equal(component.find('.environment-modal-update-space-submit button').prop('disabled'), false);

    // Click the button in the modal, which should update the space on the server.
    global.fetch = sinon.stub().resolves({
      ok: true,
      status: 201,
      clone() { return this; },
      json: () => Promise.resolve({
        id: 'spc_1',
        name: 'foo!',
        description: '',
        time_zone: 'America/Denver',
        daily_reset: '16:00',
        current_count: 0,
        capacity: null,
      }),
    });
    component.find('.environment-modal-update-space-submit button').simulate('click');

    // Ensure that loading spinner is visible.
    assert.equal(store.getState().spaces.loading, true);

    // Wait a bit for the promises to settle. FIXME: Not ideal.
    await timeout(25);

    // Ensure that the space was updated.
    const newSpace = store.getState().spaces.data.find(i => i.name === 'foo!');
    assert.notEqual(newSpace, undefined);
    assert.equal(newSpace.timeZone, 'America/Denver');
    assert.equal(newSpace.dailyReset, '16:00');

    // Ensure that the fetch call was made correctly.
    assert.deepEqual(global.fetch.firstCall.args, [
        'https://api.density.io/v1//spaces/spc_1/',
      { method: 'PUT',
        url: 'https://api.density.io/v1//spaces/spc_1/',
        desc: 'Update a space.',
        headers: 
         { 'Content-Type': 'application/json',
           Accept: 'application/json',
           Authorization: 'Bearer ' },
        body: '{"name":"foo!","time_zone":"America/Denver","daily_reset":"16:00"}' }
    ]);

    // The popover should no longer be visible
    assert.equal(store.getState().activeModal.name, null);
    assert.equal(component.find('.environment-modal-update-space').length, 0);
  });
  it('should try to update a space, but instead display an error', async function() {
    // Mount the connected version of the component.
    const store = storeFactory();
    const component = mount(<Provider store={store}>
      <DragDropWrapper>
        <ConnectedEnvionment />
      </DragDropWrapper>
    </Provider>);
    store.dispatch(collectionSpacesSet([
      {
        id: 'spc_1',
        name: 'my space',
        description: '',
        timeZone: 'America/New_York',
        dailyReset: '12:00',
        currentCount: 0,
        capacity: null,
      },
    ]));
    store.dispatch(collectionDoorwaysSet([]));
    store.dispatch(collectionLinksSet([]));

    // Click on the edit for the space
    component.find('.environment-space-item-details').simulate('click');

    // The popover should be visible.
    assert.equal(store.getState().activeModal.name, 'update-space');
    assert.equal(component.find('.environment-modal-update-space').length, 1);

    // Click on the edit button
    component.find('.update-space-edit-button').first().simulate('click');

    // The button in the modal should be enabled, since the space details were already correct.
    assert.equal(component.find('.environment-modal-update-space-submit button').prop('disabled'), false);

    // Clear the space name
    component.find('.update-space-name-container input').simulate('change', {target: {value: ''}});

    // Verify the button is disabled.
    assert.equal(component.find('.environment-modal-update-space-submit button').prop('disabled'), true);

    // Then, update the space name
    component.find('.update-space-name-container input').simulate('change', {target: {value: 'foo!'}});

    // The button in the modal should be enabled again.
    assert.equal(component.find('.environment-modal-update-space-submit button').prop('disabled'), false);

    // Click the button in the modal, which should update the space on the server.
    global.fetch = sinon.stub().resolves({
      ok: false,
      status: 403,
      clone() { return this; },
      json: () => Promise.resolve({
        id: 'spc_1',
        name: 'foo!',
        description: '',
        time_zone: 'America/New_York',
        daily_reset: '12:00',
        current_count: 0,
        capacity: null,
      }),
    });
    component.find('.environment-modal-update-space-submit button').simulate('click');

    // Ensure that loading spinner is visible.
    assert.equal(store.getState().spaces.loading, true);

    // Wait a bit for the promises to settle. FIXME: Not ideal.
    await timeout(25);

    // Ensure that the space was not updated, and an error is visible.
    const newSpace = store.getState().spaces.data.find(i => i.name === 'foo!');
    assert.equal(newSpace, undefined);
    assert.notEqual(store.getState().spaces.error, null);

    // The popover should still be visible.
    assert.equal(store.getState().activeModal.name, 'update-space');
    assert.equal(component.find('.environment-modal-update-space').length, 1);
  });
  it('should destroy a space', async function() {
    // Mount the connected version of the component.
    const store = storeFactory();
    const component = mount(<Provider store={store}>
      <DragDropWrapper>
        <ConnectedEnvionment />
      </DragDropWrapper>
    </Provider>);
    store.dispatch(collectionSpacesSet([
      {
        id: 'spc_1',
        name: 'my space',
        description: '',
        timeZone: 'America/New_York',
        dailyReset: '12:00',
        currentCount: 0,
        capacity: null,
      },
    ]));
    store.dispatch(collectionDoorwaysSet([]));
    store.dispatch(collectionLinksSet([]));

    // Click on the edit for the space
    component.find('.environment-space-item-details').simulate('click');

    // The popover should be visible.
    assert.equal(store.getState().activeModal.name, 'update-space');
    assert.equal(component.find('.environment-modal-update-space').length, 1);

    // Click on the edit button
    component.find('.update-space-edit-button').first().simulate('click');

    // Click on the delete button, which makes an ajax request to delete the space.
    global.fetch = sinon.stub().resolves({
      ok: true,
      status: 204,
      clone() { return this; },
      json: () => Promise.resolve({}),
    });
    component.find('.update-space-delete-button').simulate('click');

    // Ensure that loading spinner is visible.
    assert.equal(store.getState().spaces.loading, true);

    // Wait a bit for the promises to settle. FIXME: Not ideal.
    await timeout(25);

    // Ensure that the space was deleted.
    assert.equal(store.getState().spaces.data.length, 0);

    // The popover should no longer visible.
    assert.equal(store.getState().activeModal.name, null);
    assert.equal(component.find('.environment-modal-update-space').length, 0);
  });
  it('should try to destroy a space, but instead display an error', async function() {
    // Mount the connected version of the component.
    const store = storeFactory();
    const component = mount(<Provider store={store}>
      <DragDropWrapper>
        <ConnectedEnvionment />
      </DragDropWrapper>
    </Provider>);
    store.dispatch(collectionSpacesSet([
      {
        id: 'spc_1',
        name: 'my space',
        description: '',
        timeZone: 'America/New_York',
        dailyReset: '12:00',
        currentCount: 0,
        capacity: null,
      },
    ]));
    store.dispatch(collectionDoorwaysSet([]));
    store.dispatch(collectionLinksSet([]));

    // Click on the edit for the space
    component.find('.environment-space-item-details').simulate('click');

    // The popover should be visible.
    assert.equal(store.getState().activeModal.name, 'update-space');
    assert.equal(component.find('.environment-modal-update-space').length, 1);

    // Click on the edit button
    component.find('.update-space-edit-button').first().simulate('click');

    // Click on the delete button, which tries to make a request to delete the space. However, this
    // isn't successful.
    global.fetch = sinon.stub().resolves({
      ok: false,
      status: 403,
      clone() { return this; },
      json: () => Promise.resolve({}),
    });
    component.find('.update-space-delete-button').simulate('click');

    // Ensure that loading spinner is visible.
    assert.equal(store.getState().spaces.loading, true);

    // Wait a bit for the promises to settle. FIXME: Not ideal.
    await timeout(25);

    // Ensure that the space was not deleted
    assert.equal(store.getState().spaces.data.length, 1);
    assert.notEqual(store.getState().spaces.error, null);

    // The popover should still be visible.
    assert.equal(store.getState().activeModal.name, 'update-space');
    assert.equal(component.find('.environment-modal-update-space').length, 1);
  });
  it('should show an error bar on a space error', async function() {
    // Mount the connected version of the component.
    const store = storeFactory();
    const component = mount(<Provider store={store}>
      <DragDropWrapper>
        <ConnectedEnvionment />
      </DragDropWrapper>
    </Provider>);
    store.dispatch(collectionSpacesError('boom!'));
    store.dispatch(collectionDoorwaysSet([]));
    store.dispatch(collectionLinksSet([]));

    // The error bar should be shown.
    assert.equal(component.find('.error-bar-visible').length, 1);
  });
  it('should show a loading state when no spaces are loaded', async function() {
    // Mount the connected version of the component.
    const store = storeFactory();
    const component = mount(<Provider store={store}>
      <DragDropWrapper>
        <ConnectedEnvionment activeModal={{type: null}} />
      </DragDropWrapper>
    </Provider>);

    // Loading spinner is visible.
    assert.equal(component.find('.space-column .loading-spinner').length, 1);
  });
});

describe('Doorway workflows', function() {
  it('should create a doorway', async function() {
    // Mount the connected version of the component.
    const store = storeFactory();
    const component = mount(<Provider store={store}>
      <DragDropWrapper>
        <ConnectedEnvionment />
      </DragDropWrapper>
    </Provider>);
    store.dispatch(collectionDoorwaysSet([]));
    store.dispatch(collectionDoorwaysSet([]));
    store.dispatch(collectionLinksSet([]));

    // Click on the new button
    component.find('.fab-primary').simulate('click');

    // The context menu should be visible.
    assert.equal(store.getState().activeModal.name, 'space-doorway-popup');
    assert.equal(component.find('.environment-creation-context-menu').length, 1);

    // Click on 'create doorway'
    component.find('.environment-creation-context-menu .context-menu-item').last().simulate('click');

    // The modal should be visible.
    assert.equal(store.getState().activeModal.name, 'create-doorway');
    assert.equal(component.find('.environment-modal-create-doorway').length, 1);

    // But the button in the modal should be disabled by default.
    assert.equal(component.find('.create-doorway-submit button').prop('disabled'), true);

    // Add a doorway name and description
    component.find('.create-doorway-name-container input').simulate('change', {target: {value: 'doorway name'}});
    component.find('.create-doorway-description-container textarea').simulate('change', {target: {value: 'doorway desc'}});

    // The button in the modal should now be enabled.
    assert.equal(component.find('.create-doorway-submit button').prop('disabled'), false);

    // Click the button in the modal, which should create a new doorway on the server.
    global.fetch = sinon.stub().resolves({
      ok: true,
      status: 201,
      clone() { return this; },
      json: () => Promise.resolve({
        id: 'drw_1',
        name: 'doorway name',
        description: 'doorway desc',
        spaces: [],
      }),
    });
    component.find('.create-doorway-submit button').simulate('click');

    // Ensure that loading spinner is visible.
    assert.equal(store.getState().doorways.loading, true);

    // Wait a bit for the promises to settle. FIXME: Not ideal.
    await timeout(25);

    // Ensure that the doorway was added.
    const newDoorway = store.getState().doorways.data.find(i => i.name === 'doorway name');
    assert.notEqual(newDoorway, undefined);
    assert.equal(newDoorway.description, 'doorway desc');
  });
  it('should try to create a doorway, but instead display an error', async function() {
    // Mount the connected version of the component.
    const store = storeFactory();
    const component = mount(<Provider store={store}>
      <DragDropWrapper>
        <ConnectedEnvionment />
      </DragDropWrapper>
    </Provider>);
    store.dispatch(collectionDoorwaysSet([]));
    store.dispatch(collectionDoorwaysSet([]));
    store.dispatch(collectionLinksSet([]));

    // Click on the new button
    component.find('.fab-primary').simulate('click');

    // The context menu should be visible.
    assert.equal(store.getState().activeModal.name, 'space-doorway-popup');
    assert.equal(component.find('.environment-creation-context-menu').length, 1);

    // Click on 'create doorway'
    component.find('.environment-creation-context-menu .context-menu-item').last().simulate('click');

    // The modal should be visible.
    assert.equal(store.getState().activeModal.name, 'create-doorway');
    assert.equal(component.find('.environment-modal-create-doorway').length, 1);

    // But the button in the modal should be disabled by default.
    assert.equal(component.find('.create-doorway-submit button').prop('disabled'), true);

    // Add a doorway name and description
    component.find('.create-doorway-name-container input').simulate('change', {target: {value: 'doorway name'}});
    component.find('.create-doorway-description-container textarea').simulate('change', {target: {value: 'doorway desc'}});

    // The button in the modal should now be enabled.
    assert.equal(component.find('.create-doorway-submit button').prop('disabled'), false);

    // Click the button in the modal, which should attempt to create a new doorway on the server but
    // fail.
    global.fetch = sinon.stub().resolves({
      ok: false,
      status: 403,
      clone() { return this; },
      json: () => Promise.resolve({}),
    });
    component.find('.create-doorway-submit button').simulate('click');

    // Ensure that loading spinner is visible.
    assert.equal(store.getState().doorways.loading, true);

    // Wait a bit for the promises to settle. FIXME: Not ideal.
    await timeout(25);

    // Ensure that the doorway was not created, and an error is visible.
    assert.equal(store.getState().doorways.data.length, 0);
    assert.notEqual(store.getState().doorways.error, null);
  });
  it('should update a doorway', async function() {
    // Mount the connected version of the component.
    const store = storeFactory();
    const component = mount(<Provider store={store}>
      <DragDropWrapper>
        <ConnectedEnvionment />
      </DragDropWrapper>
    </Provider>);
    store.dispatch(collectionSpacesSet([]));
    store.dispatch(collectionDoorwaysSet([
      {
        id: 'drw_1',
        name: 'my doorway',
        description: '',
      },
    ]));
    store.dispatch(collectionLinksSet([]));

    // Click on the edit for the doorway
    component.find('.environment-doorway-item-details').simulate('click');

    // The popover should be visible.
    assert.equal(store.getState().activeModal.name, 'update-doorway');
    assert.equal(component.find('.environment-modal-update-doorway').length, 1);

    // Click on the edit button
    component.find('.update-doorway-edit-button').first().simulate('click');

    // The button in the modal should be enabled, since the doorway details were already correct.
    assert.equal(component.find('.environment-modal-update-doorway-submit button').prop('disabled'), false);

    // Clear the doorway name
    component.find('.update-doorway-name-container input').simulate('change', {target: {value: ''}});

    // Verify the button is disabled.
    assert.equal(component.find('.environment-modal-update-doorway-submit button').prop('disabled'), true);

    // Then, update the doorway name
    component.find('.update-doorway-name-container input').simulate('change', {target: {value: 'foo!'}});

    // Also update the space description
    component.find('.update-doorway-description-container textarea').simulate('change', {target: {value: 'bar'}});

    // The button in the modal should be enabled again.
    assert.equal(component.find('.environment-modal-update-doorway-submit button').prop('disabled'), false);

    // Click the button in the modal, which should update the doorway on the server.
    global.fetch = sinon.stub().resolves({
      ok: true,
      status: 201,
      clone() { return this; },
      json: () => Promise.resolve({
        id: 'drw_1',
        name: 'foo!',
        description: 'bar',
        time_zone: 'America/New_York',
        daily_reset: '12:00',
        current_count: 0,
        capacity: null,
      }),
    });
    component.find('.environment-modal-update-doorway-submit button').simulate('click');

    // Ensure that loading spinner is visible.
    assert.equal(store.getState().doorways.loading, true);

    // Wait a bit for the promises to settle. FIXME: Not ideal.
    await timeout(25);

    // Ensure that loading spinner is no longer visible.
    assert.equal(store.getState().doorways.loading, false);

    // Ensure that the doorway was updated.
    const newDoorway = store.getState().doorways.data.find(i => i.name === 'foo!');
    assert.notEqual(newDoorway, undefined);
    assert.equal(newDoorway.description, 'bar');

    // The popover should still be visible.
    assert.equal(store.getState().activeModal.name, null);
    assert.equal(component.find('.environment-modal-update-space').length, 0);
  });
  it('should try to update a doorway, but instead display an error', async function() {
    // Mount the connected version of the component.
    const store = storeFactory();
    const component = mount(<Provider store={store}>
      <DragDropWrapper>
        <ConnectedEnvionment />
      </DragDropWrapper>
    </Provider>);
    store.dispatch(collectionSpacesSet([]));
    store.dispatch(collectionDoorwaysSet([
      {
        id: 'drw_1',
        name: 'my doorway',
        description: '',
      },
    ]));
    store.dispatch(collectionLinksSet([]));

    // Click on the edit for the doorway
    component.find('.environment-doorway-item-details').simulate('click');

    // The popover should be visible.
    assert.equal(store.getState().activeModal.name, 'update-doorway');
    assert.equal(component.find('.environment-modal-update-doorway').length, 1);

    // Click on the edit button
    component.find('.update-doorway-edit-button').first().simulate('click');

    // The button in the modal should be enabled, since the doorway details were already correct.
    assert.equal(component.find('.environment-modal-update-doorway-submit button').prop('disabled'), false);

    // Clear the doorway name
    component.find('.update-doorway-name-container input').simulate('change', {target: {value: ''}});

    // Verify the button is disabled.
    assert.equal(component.find('.environment-modal-update-doorway-submit button').prop('disabled'), true);

    // Then, update the doorway name
    component.find('.update-doorway-name-container input').simulate('change', {target: {value: 'foo!'}});

    // The button in the modal should be enabled again.
    assert.equal(component.find('.environment-modal-update-doorway-submit button').prop('disabled'), false);

    // Click the button in the modal, which should update the doorway on the server.
    global.fetch = sinon.stub().resolves({
      ok: false,
      status: 403,
      clone() { return this; },
      json: () => Promise.resolve({
        id: 'drw_1',
        name: 'foo!',
        description: '',
        time_zone: 'America/New_York',
        daily_reset: '12:00',
        current_count: 0,
        capacity: null,
      }),
    });
    component.find('.environment-modal-update-doorway-submit button').simulate('click');

    // Ensure that loading spinner is visible.
    assert.equal(store.getState().doorways.loading, true);

    // Wait a bit for the promises to settle. FIXME: Not ideal.
    await timeout(25);

    // Ensure that the doorway was not updated, and an error is visible.
    const newDoorway = store.getState().doorways.data.find(i => i.name === 'foo!');
    assert.equal(newDoorway, undefined);
    assert.notEqual(store.getState().doorways.error, null);

    // The popover should still be visible.
    assert.equal(store.getState().activeModal.name, 'update-doorway');
    assert.equal(component.find('.environment-modal-update-doorway').length, 1);
  });
  it('should destroy a doorway', async function() {
    // Mount the connected version of the component.
    const store = storeFactory();
    const component = mount(<Provider store={store}>
      <DragDropWrapper>
        <ConnectedEnvionment />
      </DragDropWrapper>
    </Provider>);
    store.dispatch(collectionSpacesSet([]));
    store.dispatch(collectionDoorwaysSet([
      {
        id: 'drw_1',
        name: 'my doorway',
        description: '',
      },
    ]));
    store.dispatch(collectionLinksSet([]));

    // Click on the edit for the doorway
    component.find('.environment-doorway-item-details').simulate('click');

    // The popover should be visible.
    assert.equal(store.getState().activeModal.name, 'update-doorway');
    assert.equal(component.find('.environment-modal-update-doorway').length, 1);

    // Click on the edit button
    component.find('.update-doorway-edit-button').first().simulate('click');

    // Click on the delete button, which makes an ajax request to delete the doorway.
    global.fetch = sinon.stub().resolves({
      ok: true,
      status: 204,
      clone() { return this; },
      json: () => Promise.resolve({}),
    });
    component.find('.update-doorway-delete-button').simulate('click');

    // Ensure that loading spinner is visible.
    assert.equal(store.getState().doorways.loading, true);

    // Wait a bit for the promises to settle. FIXME: Not ideal.
    await timeout(25);

    // Ensure that the doorway was deleted.
    assert.equal(store.getState().doorways.data.length, 0);

    // Popover should no longer be visible.
    assert.equal(store.getState().activeModal.name, null);
    assert.equal(component.find('.environment-modal-update-doorway').length, 0);
  });
  it('should try to destroy a doorway, but instead display an error', async function() {
    // Mount the connected version of the component.
    const store = storeFactory();
    const component = mount(<Provider store={store}>
      <DragDropWrapper>
        <ConnectedEnvionment />
      </DragDropWrapper>
    </Provider>);
    store.dispatch(collectionSpacesSet([]));
    store.dispatch(collectionDoorwaysSet([
      {
        id: 'drw_1',
        name: 'my doorway',
        description: '',
      },
    ]));
    store.dispatch(collectionLinksSet([]));

    // Click on the edit for the doorway
    component.find('.environment-doorway-item-details').simulate('click');

    // The popover should be visible.
    assert.equal(store.getState().activeModal.name, 'update-doorway');
    assert.equal(component.find('.environment-modal-update-doorway').length, 1);

    // Click on the edit button
    component.find('.update-doorway-edit-button').first().simulate('click');

    // Click on the delete button, which tries to make a request to delete the doorway. However, this
    // isn't successful.
    global.fetch = sinon.stub().resolves({
      ok: false,
      status: 403,
      clone() { return this; },
      json: () => Promise.resolve({}),
    });
    component.find('.update-doorway-delete-button').simulate('click');

    // Ensure that loading spinner is visible.
    assert.equal(store.getState().doorways.loading, true);

    // Wait a bit for the promises to settle. FIXME: Not ideal.
    await timeout(25);

    // Ensure that the doorway was not deleted
    assert.equal(store.getState().doorways.data.length, 1);
    assert.notEqual(store.getState().doorways.error, null);

    // Popover should still be visible.
    assert.equal(store.getState().activeModal.name, 'update-doorway');
    assert.equal(component.find('.environment-modal-update-doorway').length, 1);
  });
  it('should show an error bar on a doorway error', async function() {
    // Mount the connected version of the component.
    const store = storeFactory();
    const component = mount(<Provider store={store}>
      <DragDropWrapper>
        <ConnectedEnvionment />
      </DragDropWrapper>
    </Provider>);
    store.dispatch(collectionSpacesSet([]));
    store.dispatch(collectionDoorwaysError('boom!'));
    store.dispatch(collectionLinksSet([]));

    // The error bar should be shown.
    assert.equal(component.find('.error-bar-visible').length, 1);
  });
  it('should show a loading state when no doorways are loaded', async function() {
    // Mount the connected version of the component.
    const store = storeFactory();
    const component = mount(<Provider store={store}>
      <DragDropWrapper>
        <ConnectedEnvionment activeModal={{type: null}} />
      </DragDropWrapper>
    </Provider>);

    // Loading spinner is visible.
    assert.equal(component.find('.doorway-column .loading-spinner').length, 1);
  });
});

describe('Empty state, without doorways or spaces', function() {
  it('should render correctly', function() {
    const component = mount(<DragDropWrapper>
      <Environment
        activeModal={{name: null, data: {}}}
        spaces={{data: [], loading: false, filters: {search: ''}}}
        doorways={{data: [], loading: false, filters: {search: ''}}}
        links={{data: [], loading: false}}
      />
    </DragDropWrapper>);

    // Should render the empty state for the space
    assert.equal(component.find('.environment-space-empty').length, 1);

    // Should disable the search and filter box for the space
    assert.equal(component.find('.environment-space-search-box').prop('disabled'), true);
    assert.equal(component.find('.environment-space-order-box').prop('disabled'), true);

    // Should render the empty state for the doorway
    assert.equal(component.find('.environment-doorway-empty').length, 1);

    // Should disable the search and filter box for the doorway
    assert.equal(component.find('.environment-space-search-box').prop('disabled'), true);
    assert.equal(component.find('.environment-space-order-box').prop('disabled'), true);
  });
});

// Find a doorway source and space target to use for the drag operation.
function getDragSourceAndTarget(backend, registry) {
  return {
    sourceId: Object.keys(registry.handlers).reverse().find(k => k[0] === 'S'),
    targetId: Object.keys(registry.handlers).reverse().find(k => k[0] === 'T'),
  };
}

describe('Link workflows (aka, dragging doorways to spaces)', function() {
  it('should link a doorway to a space when the doorway is dragged into the space', async function() {
    // Mount the connected version of the component.
    const store = storeFactory();
    let root;
    const component = mount(<Provider store={store}>
      <DragDropWrapper ref={ref => { root = ref; }}>
        <ConnectedEnvionment />
      </DragDropWrapper>
    </Provider>);
    store.dispatch(collectionDoorwaysSet([
      {
        id: 'drw_1',
        name: 'my doorway',
        description: '',
      },
    ]));
    store.dispatch(collectionSpacesSet([
      {
        id: 'spc_0',
        name: 'my space',
        description: '',
        timeZone: 'America/New_York',
        dailyReset: '12:00',
        currentCount: 0,
        capacity: null,
      },
    ]));
    store.dispatch(collectionLinksSet([]));

    // Get reference to introspection handles within react-dnd.
    const backend = root.getManager().getBackend();
    const registry = root.getManager().getRegistry();
    const {sourceId, targetId} = getDragSourceAndTarget(backend, registry);

    // Initially, there should be no doorways in the space.
    assert.equal(component.find('.environment-space-item-body .environment-space-item-doorways li').length, 0);

    // Start dragging the doorway.
    backend.simulateBeginDrag([sourceId]);

    // The doorway should be styled like it is being dragged.
    assert(component.find('.environment-doorway-item').hasClass('environment-doorway-item-dragging'));

    // Hover over the space to drop the doorway into.
    backend.simulateHover([targetId]);

    // The space should change style to indicate that it can accept the doorway.
    assert(component.find('.environment-space-item-body').hasClass('is-dropping'));

    // Drop the doorway onto the space.
    backend.simulateDrop();

    // Now, the sensor direction assignment modal should pop up.
    assert.equal(store.getState().activeModal.name, 'assign-sensor-placement');
    assert.equal(component.find('.environment-modal-sensor-placement-assignment').length, 1);

    // Click the 'Inside the space' button, which kicks off an ajax request to the server.
    global.fetch = sinon.stub().resolves({
      ok: true,
      status: 201,
      clone() { return this; },
      json: () => Promise.resolve({
        id: 'lnk_1',
        space_id: 'spc_0',
        doorway_id: 'drw_1',
      }),
    });
    component.find('.environment-modal-sensor-placement-assignment-button-group button').first().simulate('click');

    // Wait a bit for the promises to settle. FIXME: Not ideal.
    await timeout(25);

    // There should be a doorway in the space at this point, created by the drag operation.
    assert.equal(component.find('.environment-space-item-body .environment-space-item-doorways li').length, 1);

    // Complete the drag operation.
    backend.simulateEndDrag();
  });
  it('should not link a doorway to a space when the doorway is already in the space', async function() {
    // Mount the connected version of the component.
    const store = storeFactory();
    let root;
    const component = mount(<Provider store={store}>
      <DragDropWrapper ref={ref => { root = ref; }}>
        <ConnectedEnvionment />
      </DragDropWrapper>
    </Provider>);
    store.dispatch(collectionDoorwaysSet([
      {
        id: 'drw_1',
        name: 'my doorway',
        description: '',
      },
    ]));
    store.dispatch(collectionSpacesSet([
      {
        id: 'spc_0',
        name: 'my space',
        description: '',
        timeZone: 'America/New_York',
        dailyReset: '12:00',
        currentCount: 0,
        capacity: null,
      },
    ]));
    store.dispatch(collectionLinksSet([
      {
        id: 'lnk_2',
        space_id: 'spc_0',
        doorway_id: 'drw_1',
      },
    ]));

    // Get reference to introspection handles within react-dnd.
    const backend = root.getManager().getBackend();
    const registry = root.getManager().getRegistry();
    const {sourceId, targetId} = getDragSourceAndTarget(backend, registry);

    // Initially, there should be a single doorway in the space.
    assert.equal(component.find('.environment-space-item-body .environment-space-item-doorways li').length, 1);

    // Start dragging the same doorway.
    backend.simulateBeginDrag([sourceId]);

    // The doorway should be styled like it is being dragged.
    assert(component.find('.environment-doorway-item').hasClass('environment-doorway-item-dragging'));

    // Hover over the space to drop the doorway into.
    backend.simulateHover([targetId]);

    // The space should change style to indicate that it can not accept the doorway.
    assert(component.find('.environment-space-item-body').hasClass('is-dropping-invalid'));

    // Drop the doorway onto the space.
    backend.simulateDrop();

    // No modal should show up.
    assert.equal(store.getState().activeModal.name, null);

    // Complete the drag operation.
    backend.simulateEndDrag();
  });
  it('should unlink a doorway from a space when the x is clicked on the doorway', async function() {
    // Mount the connected version of the component.
    const store = storeFactory();
    let root;
    const component = mount(<Provider store={store}>
      <DragDropWrapper ref={ref => { root = ref; }}>
        <ConnectedEnvionment />
      </DragDropWrapper>
    </Provider>);
    store.dispatch(collectionDoorwaysSet([
      {
        id: 'drw_1',
        name: 'my doorway',
        description: '',
      },
    ]));
    store.dispatch(collectionSpacesSet([
      {
        id: 'spc_0',
        name: 'my space',
        description: '',
        timeZone: 'America/New_York',
        dailyReset: '12:00',
        currentCount: 0,
        capacity: null,
      },
    ]));
    store.dispatch(collectionLinksSet([
      {
        id: 'lnk_2',
        space_id: 'spc_0',
        doorway_id: 'drw_1',
      },
    ]));

    // Initially, there should be a single doorway in the space.
    assert.equal(component.find('.environment-space-item-body .environment-space-item-doorways li').length, 1);

    // Click the delete button on the doorway.
    global.fetch = sinon.stub().resolves({
      ok: true,
      status: 204,
      clone() { return this; },
      json: () => Promise.resolve({}),
    });
    component.find('.environment-space-item-doorways-delete').simulate('click');

    // Wait a bit for the promises to settle. FIXME: Not ideal.
    await timeout(25);

    // There should no longer be a doorway linked to the space.
    assert.equal(component.find('.environment-space-item-body .environment-space-item-doorways li').length, 0);
  });
  it('should swap sensor placement on a doorway in a space by deleting then creating a link', async function() {
    // Mount the connected version of the component.
    const store = storeFactory();
    let root;
    const component = mount(<Provider store={store}>
      <DragDropWrapper ref={ref => { root = ref; }}>
        <ConnectedEnvionment />
      </DragDropWrapper>
    </Provider>);
    store.dispatch(collectionDoorwaysSet([
      {
        id: 'drw_1',
        name: 'my doorway',
        description: '',
      },
    ]));
    store.dispatch(collectionSpacesSet([
      {
        id: 'spc_0',
        name: 'my space',
        description: '',
        timeZone: 'America/New_York',
        dailyReset: '12:00',
        currentCount: 0,
        capacity: null,
      },
    ]));
    store.dispatch(collectionLinksSet([
      {
        id: 'lnk_2',
        space_id: 'spc_0',
        doorway_id: 'drw_1',
        sensor_placement: -1,
      },
    ]));

    // Initially, there should be a single doorway in the space.
    assert.equal(component.find('.environment-space-item-body .environment-space-item-doorways li').length, 1);

    // Click the swap sensor placement button
    component.find('.environment-space-item-doorways-placement-button').simulate('click');

    // The modal to swap the sensor placement should show up.
    assert.equal(store.getState().activeModal.name, 'confirm-sensor-placement-change');
    assert.equal(component.find('.environment-modal-sensor-placement').length, 1);

    // Click the yes button in the modal, and kick off the operation.
    global.fetch = sinon.stub();
    global.fetch.onCall(0).resolves({ /* First, the delete */
      ok: true,
      status: 204,
      clone() { return this; },
      json: () => Promise.resolve({}),
    });
    global.fetch.onCall(1).resolves({ /* Then, the add */
      ok: true,
      status: 201,
      clone() { return this; },
      json: () => Promise.resolve({
        id: 'lnk_999',
        space_id: 'spc_0',
        doorway_id: 'drw_1',
        sensor_placement: 1,
      }),
    });
    component.find('.environment-modal-sensor-placement-button-yes').simulate('click');

    // Wait a bit for the promises to settle. FIXME: Not ideal.
    await timeout(25);

    // Verify the link was changed and the sensor placement was swapped.
    assert.equal(store.getState().links.data[0].id, 'lnk_999');
    assert.equal(store.getState().links.data[0].sensorPlacement, 1);
  });
});
