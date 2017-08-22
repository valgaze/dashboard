import * as React from 'react';
import { connect } from 'react-redux';

import EnvironmentSpaceItem from '../environment-space-item/index';
import EnvironmentDoorwayItem from '../environment-doorway-item/index';
import EnvironmentModalCreateSpace from '../environment-modal-create-space/index';
import EnvironmentModalCreateDoorway from '../environment-modal-create-doorway/index';
import EnvironmentModalSensorPlacement from '../environment-modal-sensor-placement/index';
import EnvironmentModalSensorPlacementAssignment from '../environment-modal-sensor-placement-assignment/index';
import EnvironmentModalUpdateDoorway from '../environment-modal-update-doorway/index';
import EnvironmentModalUpdateSpace from '../environment-modal-update-space/index';
import LoadingSpinner from '../loading-spinner/index';
import ErrorBar from '../error-bar/index';

import filterCollection from '../../helpers/filter-collection/index';
import sortCollection, { SORT_A_Z, SORT_NEWEST } from '../../helpers/sort-collection/index';

import collectionLinksCreate from '../../actions/collection/links/create';
import collectionLinksDestroy from '../../actions/collection/links/destroy';
import collectionLinksUpdateSensorPlacement from '../../actions/collection/links/update-sensor-placement';
import collectionDoorwaysFilter from '../../actions/collection/doorways/filter';
import collectionSpacesFilter from '../../actions/collection/spaces/filter';
import collectionSpacesCreate from '../../actions/collection/spaces/create';
import collectionDoorwaysCreate from '../../actions/collection/doorways/create';
import collectionDoorwaysUpdate from '../../actions/collection/doorways/update';
import collectionDoorwaysDestroy from '../../actions/collection/doorways/destroy';
import collectionSpacesUpdate from '../../actions/collection/spaces/update';
import collectionSpacesDestroy from '../../actions/collection/spaces/destroy';

import showModal from '../../actions/modal/show';
import hideModal from '../../actions/modal/hide';

import Fab from '@density/ui-fab';
import Toast from '@density/ui-toast';
import ContextMenu, { ContextMenuItem } from '@density/ui-context-menu';
import InputBox from '@density/ui-input-box';

import Subnav, { SubnavItem } from '../subnav/index';

// Given a space, use links to determine all doorways in the space and return them.
function allDoorwaysInSpace(doorways, links, space) {
  const linksForSpace = links.filter(link => link.spaceId === space.id);
  const doorwaysInLinks = linksForSpace.map(link => link.doorwayId);
  return {
    doorways: doorways.filter(doorway => doorwaysInLinks.indexOf(doorway.id) >= 0),
    links: linksForSpace,
  }
}

// Used for filtering spaces / doorways in the `Environment` component below.
const spaceFilter = filterCollection({fields: ['name']});
const doorwayFilter = filterCollection({fields: ['name']});

export function Environment({
  spaces,
  doorways,
  links,
  activeModal,

  onOpenModal,
  onCloseModal,

  onLinkDoorwayToSpace,
  onUnlinkDoorwayToSpace,
  onChangeSensorPlacement,
  onDoorwaySearch,
  onSpaceSearch,
  onDoorwaySort,
  onSpaceSort,
  onCreateSpace,
  onCreateDoorway,
  onChangeDoorway,
  onDeleteDoorway,
  onChangeSpace,
  onDeleteSpace,
}) {
  return <div className="environment">
    <Subnav>
      <SubnavItem active href="#/environment/spaces">Spaces</SubnavItem>
      <SubnavItem>Sensors</SubnavItem>
    </Subnav>

    {/* Render any errors for the spaces or doorways collections. */}
    <ErrorBar message={spaces.error} showRefresh />
    <ErrorBar message={doorways.error} showRefresh />
    <ErrorBar message={links.error} showRefresh />

    <div className="environment-container">
      {/* The Fab triggers the space doorway context menu to make a new space or doorway */}
      <Fab
        type="primary"
        onClick={() => {
          if (activeModal.name) {
            return onCloseModal();
          } else {
            return onOpenModal('space-doorway-popup');
          }
        }}
        aria-label="Add Space or Doorway"
      >&#xe92b;</Fab>

      {/************
      ** MODALS
      **************/}

      {/* Create spaces and doorways */}
      {activeModal.name === 'create-space' ? <EnvironmentModalCreateSpace
        error={spaces.error}
        loading={spaces.loading}
        onSubmit={onCreateSpace}
        onDismiss={onCloseModal}
      /> : null}
      {activeModal.name === 'create-doorway' ? <EnvironmentModalCreateDoorway
        error={doorways.error}
        loading={doorways.loading}
        onSubmit={onCreateDoorway}
        onDismiss={onCloseModal}
      /> : null}
      {activeModal.name === 'space-doorway-popup' ? <ContextMenu className="environment-creation-context-menu">
        <ContextMenuItem onClick={() => onOpenModal('create-space')}>
          <span className="environment-creation-context-menu-icon">&#xe92c;</span>
          Create Space
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onOpenModal('create-doorway')}>
          <span className="environment-creation-context-menu-icon">&#xe92c;</span>
          Create Doorway
        </ContextMenuItem>
      </ContextMenu> : null}

      {/* When a sensor placement is clicked, open a modal to warn the user prior to changing things. */}
      {activeModal.name === 'confirm-sensor-placement-change' ? <EnvironmentModalSensorPlacement
        error={links.error}
        loading={links.loading}
        onSubmit={() => onChangeSensorPlacement(activeModal.data.link)}
        onDismiss={onCloseModal}
      /> : null}

      {/* When a user drags a doorway into a space, prompt the user for the doorway direction with a modal. */}
      {activeModal.name === 'assign-sensor-placement' ? <EnvironmentModalSensorPlacementAssignment
        error={links.error}
        loading={links.loading}
        onSubmit={sensorPlacement => onLinkDoorwayToSpace(activeModal.data.doorway, activeModal.data.space, sensorPlacement)}
        onDismiss={onCloseModal}
      /> : null}

      {/* Updating spaces and doorways */}
      {activeModal.name === 'update-doorway' ? <EnvironmentModalUpdateDoorway
        error={doorways.error}
        loading={doorways.loading}
        initialDoorway={activeModal.data.doorway}
        onSubmit={fields => onChangeDoorway(activeModal.data.doorway, fields)}
        onDelete={() => onDeleteDoorway(activeModal.data.doorway)}
        onDismiss={onCloseModal}
        /* Add a key so that if a new doorway is selected without deselecting the last one, a new
         * component instance will still be created. */
        key={activeModal.data.doorway.id}

        /* The dom node to use when positioning the popover - the "target" dom node of the popover */
        popoverPositionTarget={activeModal.data.popoverPositionTarget}
      /> : null}
      {activeModal.name === 'update-space' ? <EnvironmentModalUpdateSpace
        error={spaces.error}
        loading={spaces.loading}
        initialSpace={activeModal.data.space}
        onSubmit={fields => onChangeSpace(activeModal.data.space, fields)}
        onDelete={() => onDeleteSpace(activeModal.data.space)}
        onDismiss={onCloseModal}
        doorways={activeModal.data.doorways}
        /* Add a key so that if a new space is selected without deselecting the last one, a new
         * component instance will still be created. */
        key={activeModal.data.space.id}

        /* The dom node to use when positioning the popover - the "target" dom node of the popover */
        popoverPositionTarget={activeModal.data.popoverPositionTarget}
      /> : null}

      <div className="environment-row">
        <div className="space-column">
          <h2 className="environment-space-header-text">Spaces</h2>
          {/* Header above the column. Allows searching and ordering of data. */}
          <div className="environment-space-column-header">
            <InputBox
              className="environment-space-search-box"
              type="text"
              placeholder="Search ..."
              value={spaces.filters.search}
              onChange={e => onSpaceSearch(e.target.value)}
            />
            <InputBox
              className="environment-space-order-box"
              type="select"
              value={spaces.filters.order}
              onChange={e => onSpaceSort(e.target.value)}
            >
              <option value={SORT_NEWEST}>Newest</option>
              <option value={SORT_A_Z}>A - Z</option>
            </InputBox>
          </div>
          <div className="column-body">
            <Toast className="environment-space-header" icon="&#xe91e;">
              Edit space details and remove doorways below.
            </Toast>
            {spaces.loading ? <LoadingSpinner /> : null}
            {!spaces.loading && spaces.data.length === 0 ? <p>No Spaces</p> : null}
            <ul>
              {sortCollection(spaceFilter(spaces.data, spaces.filters.search), spaces.filters.sort).map(space => {
                return <EnvironmentSpaceItem
                  key={space.id}
                  space={space}
                  doorways={allDoorwaysInSpace(doorways.data, links.data, space).doorways}
                  links={links.data}
                  onDoorwayDropped={doorway => onOpenModal('assign-sensor-placement', {doorway, space})}
                  onDoorwayLinkDeleted={onUnlinkDoorwayToSpace}
                  onSensorPlacementChange={link => onOpenModal(`confirm-sensor-placement-change`, {link})}
                  onClickDetails={e => onOpenModal(`update-space`, {
                    space,
                    doorways: allDoorwaysInSpace(doorways.data, links.data, space).doorways,
                    popoverPositionTarget: e.target,
                  })}
                />;
              })}
            </ul>
          </div>
        </div>
        <div className="doorway-column">
          <h2 className="environment-doorway-header-text">Doorways</h2>
          {/* Header above the column. Allows searching and ordering of data. */}
          <div className="environment-doorway-column-header">
            <InputBox
              className="environment-doorway-search-box"
              type="text"
              placeholder="Search ..."
              value={doorways.filters.search}
              onChange={e => onDoorwaySearch(e.target.value)}
            />
            <InputBox
              className="environment-doorway-order-box"
              type="select"
              value={doorways.filters.order}
              onChange={e => onDoorwaySort(e.target.value)}
            >
              <option value={SORT_NEWEST}>Newest</option>
              <option value={SORT_A_Z}>A - Z</option>
            </InputBox>
          </div>

          <div className="column-body">
            <Toast className="environment-doorway-header" icon="&#xe91e;">
              To link a doorway to a space, drag the doorway
              from below to a space on the left.
            </Toast>
            {doorways.loading ? <LoadingSpinner /> : null}
            {!doorways.loading && doorways.data.length === 0 ? <p>No Doorways</p> : null}
            {sortCollection(doorwayFilter(doorways.data, doorways.filters.search), doorways.filters.sort).map(doorway => {
              return <EnvironmentDoorwayItem
                key={doorway.id}
                doorway={doorway}
                onClickDetails={e => onOpenModal('update-doorway', {
                  doorway,
                  popoverPositionTarget: e.target,
                })}
              />;
            })}
          </div>
        </div>
      </div>
    </div>
  </div>;
}

export default connect(state => {
  return {
    spaces: state.spaces,
    doorways: state.doorways,
    links: state.links,
    activeModal: state.activeModal,
  };
}, dispatch => {
  return {
    onLinkDoorwayToSpace(doorway, space, sensorPlacement) {
      dispatch(collectionLinksCreate(space.id, doorway.id, sensorPlacement)).then(ok => {
        ok && dispatch(hideModal());
      });
    },
    onUnlinkDoorwayToSpace(link) {
      dispatch(collectionLinksDestroy(link));
    },
    onDoorwaySearch(searchQuery) {
      dispatch(collectionDoorwaysFilter('search', searchQuery));
    },
    onSpaceSearch(searchQuery) {
      dispatch(collectionSpacesFilter('search', searchQuery));
    },
    onDoorwaySort(sortQuery) {
      dispatch(collectionDoorwaysFilter('sort', sortQuery));
    },
    onSpaceSort(sortQuery) {
      dispatch(collectionSpacesFilter('sort', sortQuery));
    },

    onOpenModal(name, data) {
      dispatch(showModal(name, data));
    },
    onCloseModal() {
      dispatch(hideModal());
    },

    onCreateSpace(space) {
      dispatch(collectionSpacesCreate(space)).then(ok => {
        ok && dispatch(hideModal());
      });
    },
    onCreateDoorway(doorway) {
      dispatch(collectionDoorwaysCreate(doorway)).then(ok => {
        ok && dispatch(hideModal());
      });
    },
    onChangeSensorPlacement(link) {
      const sensorPlacement = link.sensorPlacement === 1 ? -1 : 1;
      dispatch(collectionLinksUpdateSensorPlacement({id: link.id, sensorPlacement})).then(ok => {
        ok && dispatch(hideModal());
      });
    },
    onChangeDoorway(doorway, {name, description}) {
      dispatch(collectionDoorwaysUpdate(Object.assign({}, doorway, {name, description}))).then(ok => {
        ok && dispatch(hideModal());
      });
    },
    onDeleteDoorway(doorway) {
      dispatch(collectionDoorwaysDestroy(doorway)).then(ok => {
        ok && dispatch(hideModal());
      });
    },
    onChangeSpace(space, {name, timezone, dailyReset}) {
      dispatch(collectionSpacesUpdate(Object.assign({}, space, {name, timezone, dailyReset}))).then(ok => {
        ok && dispatch(hideModal());
      });
    },
    onDeleteSpace(space) {
      dispatch(collectionSpacesDestroy(space)).then(ok => {
        ok && dispatch(hideModal());
      });
    },
  };
})(Environment);
