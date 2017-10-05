import * as React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import EnvironmentSpaceItem from '../environment-space-item/index';
import EnvironmentDoorwayItem from '../environment-doorway-item/index';
import EnvironmentModalCreateSpace from '../environment-modal-create-space/index';
import EnvironmentModalCreateDoorway from '../environment-modal-create-doorway/index';
import EnvironmentModalSensorPlacement from '../environment-modal-sensor-placement/index';
import EnvironmentModalSensorPlacementAssignment from '../environment-modal-sensor-placement-assignment/index';
import EnvironmentModalUpdateDoorway from '../environment-modal-update-doorway/index';
import EnvironmentModalUpdateSpace from '../environment-modal-update-space/index';
import EnvironmentModalDoorwayAlreadyInSpace from '../environment-modal-doorway-already-in-space/index';
import LoadingSpinner from '../loading-spinner/index';
import ErrorBar from '../error-bar/index';
import DismissableToast from '../environment-space-dismissable-toast/index';

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
import ContextMenu, { ContextMenuItem } from '@density/ui-context-menu';
import InputBox from '@density/ui-input-box';
import Button from '@density/ui-button';

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
      {/* <SubnavItem>Sensors</SubnavItem> */}
    </Subnav>

    {/* Render any errors for the spaces or doorways collections. */}
    <ErrorBar message={spaces.error} showRefresh modalOpen={Boolean(activeModal.name)} />
    <ErrorBar message={doorways.error} showRefresh modalOpen={Boolean(activeModal.name)} />
    <ErrorBar message={links.error} showRefresh modalOpen={Boolean(activeModal.name)} />

    <div className="environment-container">
      <div className="environment-center-wrapper">
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
          link={activeModal.data.link}
          space={activeModal.data.space}
          onSubmit={() => onChangeSensorPlacement(activeModal.data.link)}
          onDismiss={onCloseModal}
        /> : null}

        {/* When a user drags a doorway into a space, prompt the user for the doorway direction with a modal. */}
        {activeModal.name === 'assign-sensor-placement' ? <EnvironmentModalSensorPlacementAssignment
          error={links.error}
          loading={links.loading}
          space={activeModal.data.space}
          onSubmit={sensorPlacement => onLinkDoorwayToSpace(activeModal.data.doorway, activeModal.data.space, sensorPlacement)}
          onDismiss={onCloseModal}
        /> : null}

        {/* Dropping a doorway into a space where the doorway is already linked to the space should show an error. */}
        {activeModal.name === 'doorway-already-in-space' ? <EnvironmentModalDoorwayAlreadyInSpace
          doorway={activeModal.data.doorway}
          space={activeModal.data.space}
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
                placeholder="Filter spaces ..."
                value={spaces.filters.search}
                onChange={e => onSpaceSearch(e.target.value)}
                disabled={spaces.data.length === 0}
              />
              <InputBox
                className="environment-space-order-box"
                type="select"
                value={spaces.filters.sort}
                onChange={e => onSpaceSort(e.target.value)}
                disabled={spaces.data.length === 0}
              >
                <option value={SORT_A_Z}>A - Z</option>
                <option value={SORT_NEWEST}>Newest</option>
              </InputBox>
            </div>
            <div className={classnames('column-body', {'column-body-locked': activeModal.name})}>
              <DismissableToast
                storageKey="environment-space-space-column"
                className="environment-space-header"
                icon="&#xe91e;"
              >
                Edit space details and remove doorways below.
              </DismissableToast>

              {/* Space column, empty state */}
              {!spaces.loading && spaces.data.length === 0 ? <div className="environment-space-empty">
                <div className="environment-space-empty-label">Here is where you manage spaces</div>
                <Button onClick={() => onOpenModal('create-space')}>Create a Space</Button>
              </div> : null}

              <ul>
                {sortCollection(spaceFilter(spaces.data, spaces.filters.search), spaces.filters.sort).map(space => {
                  return <EnvironmentSpaceItem
                    key={space.id}
                    space={space}
                    doorways={allDoorwaysInSpace(doorways.data, links.data, space).doorways}
                    links={links.data}

                    // Called when the user drags a space into a doorway.
                    onDoorwayDropped={doorway => onOpenModal('assign-sensor-placement', {doorway, space})}

                    // If the user drops a doorway into a space that that doorway is already linked
                    // to, show an error.
                    onDoorwayDroppedAlreadyInSpace={doorway => onOpenModal('doorway-already-in-space', {doorway, space})}

                    onDoorwayLinkDeleted={onUnlinkDoorwayToSpace}
                    onSensorPlacementChange={link => onOpenModal(`confirm-sensor-placement-change`, {link, space})}
                    onClickDetails={e => {
                      // When the details button on a space is clicked, toggle the state of the
                      // popover.
                      if (!activeModal.name) {
                        onOpenModal(`update-space`, {
                          space,
                          doorways: allDoorwaysInSpace(doorways.data, links.data, space).doorways,
                          popoverPositionTarget: e.target,
                        });
                      } else {
                        onCloseModal();
                      }
                    }}
                  />;
                })}
              </ul>

              {/* Show a loading spinner on the page when the collection is loading and no modal popup is visible. */}
              {spaces.loading && activeModal.name === null ? <LoadingSpinner /> : null}
            </div>
          </div>
          <div className="doorway-column">
            <h2 className="environment-doorway-header-text">Doorways</h2>
            {/* Header above the column. Allows searching and ordering of data. */}
            <div className="environment-doorway-column-header">
              <InputBox
                className="environment-doorway-search-box"
                type="text"
                placeholder="Filter doorways ..."
                value={doorways.filters.search}
                onChange={e => onDoorwaySearch(e.target.value)}
                disabled={doorways.data.length === 0}
              />
              <InputBox
                className="environment-doorway-order-box"
                type="select"
                value={doorways.filters.sort}
                onChange={e => onDoorwaySort(e.target.value)}
                disabled={doorways.data.length === 0}
              >
                <option value={SORT_A_Z}>A - Z</option>
                <option value={SORT_NEWEST}>Newest</option>
              </InputBox>
            </div>

            <div className={classnames('column-body', {'column-body-locked': activeModal.name})}>
              <DismissableToast
                storageKey="environment-space-doorway-column"
                className="environment-doorway-header"
                icon="&#xe91e;"
              >
                To link a doorway to a space, drag the doorway
                from below to a space on the left.
              </DismissableToast>
              {/* Doorway column, empty state */}
              {!doorways.loading && doorways.data.length === 0 ? <div className="environment-doorway-empty">
                <div className="environment-doorway-empty-label">Here is where you manage doorways</div>
                <Button onClick={() => onOpenModal('create-doorway')}>Create a Doorway</Button>
              </div> : null}

              {sortCollection(doorwayFilter(doorways.data, doorways.filters.search), doorways.filters.sort).map(doorway => {
                return <EnvironmentDoorwayItem
                  key={doorway.id}
                  doorway={doorway}
                  onClickDetails={e => {
                    // When the details button on a doorway is clicked, toggle the state of the
                    // popover.
                    if (!activeModal.name) {
                      onOpenModal('update-doorway', {
                        doorway,
                        popoverPositionTarget: e.target,
                      })
                    } else {
                      onCloseModal();
                    }
                  }}
                />;
              })}

              {/* Show a loading spinner on the page when the collection is loading and no modal popup is visible. */}
              {doorways.loading && activeModal.name === null ? <LoadingSpinner /> : null}
            </div>
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
      dispatch(collectionLinksUpdateSensorPlacement({...link, sensorPlacement})).then(ok => {
        ok && dispatch(hideModal());
      });
    },
    onChangeDoorway(doorway, fields) {
      dispatch(collectionDoorwaysUpdate({...doorway, ...fields})).then(ok => {
        ok && dispatch(hideModal());
      });
    },
    onDeleteDoorway(doorway) {
      dispatch(collectionDoorwaysDestroy(doorway)).then(ok => {
        ok && dispatch(hideModal());
      });
    },
    onChangeSpace(space, fields) {
      dispatch(collectionSpacesUpdate({...space, ...fields})).then(ok => {
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
