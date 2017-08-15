import * as React from 'react';
import { mount } from 'enzyme';
import assert from 'assert';
import sinon from 'sinon';

import { Provider } from 'react-redux';
import storeFactory from '../../store';

import showModal from '../../actions/modal/show';
import hideModal from '../../actions/modal/hide';
import collectionSpacesSet from '../../actions/collection/spaces/set';
import collectionDoorwaysSet from '../../actions/collection/doorways/set';
import collectionLinksSet from '../../actions/collection/links/set';

import ConnectedEnvionment, { Environment } from './index';

function timeout(delay) {
  return new Promise(r => setTimeout(r, delay));
}

// In order for the drag-drop studd to properly work, create a drag-drop context wrapper that can be
// used to inject a drag-drop context.
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
const DragDropWrapper = DragDropContext(HTML5Backend)(props => <div {...props} />);

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
    component.find('.fab').simulate('click');

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
    component.find('.create-space-reset-time-container input').simulate('change', {target: {value: '12:00'}});

    // The button in the modal should now be enabled.
    assert.equal(component.find('.create-space-submit button').prop('disabled'), false);

    // Click the button in the modal, which should create a new space on the server.
    global.fetch = sinon.stub().resolves({
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
    component.find('.fab').simulate('click');

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
    component.find('.create-space-reset-time-container input').simulate('change', {target: {value: '12:00'}});

    // The button in the modal should now be enabled.
    assert.equal(component.find('.create-space-submit button').prop('disabled'), false);

    // Click the button in the modal, which should attempt to create a new space on the server but
    // fail.
    global.fetch = sinon.stub().resolves({
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

    // Then, update the space name
    component.find('.update-space-name-container input').simulate('change', {target: {value: 'foo!'}});

    // The button in the modal should be enabled again.
    assert.equal(component.find('.environment-modal-update-space-submit button').prop('disabled'), false);

    // Click the button in the modal, which should update the space on the server.
    global.fetch = sinon.stub().resolves({
      status: 201,
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

    // Ensure that the space was updated.
    const newSpace = store.getState().spaces.data.find(i => i.name === 'foo!');
    assert.notEqual(newSpace, undefined);

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
    component.find('.fab').simulate('click');

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
    component.find('.create-doorway-description-container input').simulate('change', {target: {value: 'doorway desc'}});

    // The button in the modal should now be enabled.
    assert.equal(component.find('.create-doorway-submit button').prop('disabled'), false);

    // Click the button in the modal, which should create a new doorway on the server.
    global.fetch = sinon.stub().resolves({
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
    component.find('.fab').simulate('click');

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

    // Add a doorway name, time zone and reset time
    component.find('.create-doorway-name-container input').simulate('change', {target: {value: 'doorway name'}});
    component.find('.create-doorway-description-container input').simulate('change', {target: {value: 'doorway desc'}});

    // The button in the modal should now be enabled.
    assert.equal(component.find('.create-doorway-submit button').prop('disabled'), false);

    // Click the button in the modal, which should attempt to create a new doorway on the server but
    // fail.
    global.fetch = sinon.stub().resolves({
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

    // The button in the modal should be enabled again.
    assert.equal(component.find('.environment-modal-update-doorway-submit button').prop('disabled'), false);

    // Click the button in the modal, which should update the doorway on the server.
    global.fetch = sinon.stub().resolves({
      status: 201,
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
    component.find('.environment-modal-update-doorway-submit button').simulate('click');

    // Ensure that loading spinner is visible.
    assert.equal(store.getState().doorways.loading, true);

    // Wait a bit for the promises to settle. FIXME: Not ideal.
    await timeout(25);

    // Ensure that the doorway was updated.
    const newDoorway = store.getState().doorways.data.find(i => i.name === 'foo!');
    assert.notEqual(newDoorway, undefined);

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
});
