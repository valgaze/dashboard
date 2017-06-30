import * as React from 'react';
import { connect } from 'react-redux';

import EnvironmentSpaceItem from '../environment-space-item/index';
import EnvironmentDoorwayItem from '../environment-doorway-item/index';
import EnvironmentModalCreateSpace from '../environment-modal-create-space/index';
import EnvironmentModalCreateDoorway from '../environment-modal-create-doorway/index';
import EnvironmentModalSensorPlacement from '../environment-modal-sensor-placement/index';
import EnvironmentModalSensorPlacementAssignment from '../environment-modal-sensor-placement-assignment/index';

import filterCollection from '../../helpers/filter-collection/index';

import collectionLinksCreate from '../../actions/collection/links/create';
import collectionLinksDestroy from '../../actions/collection/links/destroy';
import collectionLinksUpdateSensorPlacement from '../../actions/collection/links/update-sensor-placement';
import collectionDoorwaysFilter from '../../actions/collection/doorways/filter';
import collectionSpacesFilter from '../../actions/collection/spaces/filter';
import collectionSpacesCreate from '../../actions/collection/spaces/create';
import collectionDoorwaysCreate from '../../actions/collection/doorways/create';

import showModal from '../../actions/modal/show';
import hideModal from '../../actions/modal/hide';

import Fab from '@density/ui-fab';
import ContextMenu, { ContextMenuItem } from '@density/ui-context-menu';

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
  onCreateSpace,
  onCreateDoorway,
}) {
  return <div className="environment">
    {/* The Fab triggers the space doorway context menu to make a new space or doorway */}
    <Fab onClick={() => {
      if (activeModal.name) {
        return onCloseModal();
      } else {
        return onOpenModal('space-doorway-popup');
      }
    }}>+</Fab>

    {/************
    ** MODALS
    **************/}

    {/* Create spaces and doorways */}
    {activeModal.name === 'create-space' ? <EnvironmentModalCreateSpace
      onSubmit={onCreateSpace}
      onDismiss={onCloseModal}
    /> : null}
    {activeModal.name === 'create-doorway' ? <EnvironmentModalCreateDoorway
      onSubmit={onCreateDoorway}
      onDismiss={onCloseModal}
    /> : null}
    {activeModal.name === 'space-doorway-popup' ? <ContextMenu className="environment-creation-context-menu">
      <ContextMenuItem onClick={() => onOpenModal('create-space')}>Create Space</ContextMenuItem>
      <ContextMenuItem onClick={() => onOpenModal('create-doorway')}>Create Doorway</ContextMenuItem>
    </ContextMenu> : null}

    {/* When a sensor placement is clicked, open a modal to warn the user prior to changing things. */}
    {activeModal.name === 'confirm-sensor-placement-change' ? <EnvironmentModalSensorPlacement
      onSubmit={() => onChangeSensorPlacement(activeModal.data.link)}
      onDismiss={onCloseModal}
    /> : null}

  {/* When a user drags a doorway into a space, prompt the user for the doorway direction with a modal. */}
    {activeModal.name === 'assign-sensor-placement' ? <EnvironmentModalSensorPlacementAssignment
      onSubmit={sensorPlacement => {
        onLinkDoorwayToSpace(activeModal.data.doorway, activeModal.data.space, sensorPlacement);
        onCloseModal();
      }}
      onDismiss={onCloseModal}
    /> : null}

    <div className="environment-row">
      <div className="space-column">
        <input
          type="text"
          placeholder="Search spaces"
          value={spaces.filters.search}
          onChange={e => onSpaceSearch(e.target.value)}
        />
        <div className="column-body">
          {spaces.loading ? <p>Loading...</p> : null}
          {!spaces.loading && spaces.data.length === 0 ? <p>No Spaces</p> : null}
          <ul>
            {spaceFilter(spaces.data, spaces.filters.search).map(space => {
              return <EnvironmentSpaceItem
                key={space.id}
                space={space}
                doorways={allDoorwaysInSpace(doorways.data, links.data, space).doorways}
                links={links.data}
                onDoorwayDropped={doorway => onOpenModal('assign-sensor-placement', {doorway, space})}
                onDoorwayLinkDeleted={onUnlinkDoorwayToSpace}
                onSensorPlacementChange={link => onOpenModal(`confirm-sensor-placement-change`, {link})}
              />;
            })}
          </ul>
        </div>
      </div>
      <div className="doorway-column">
        <input
          type="text"
          placeholder="Search doorways"
          value={doorways.filters.search}
          onChange={e => onDoorwaySearch(e.target.value)}
        />
        <div className="column-body">
          {spaces.loading ? <p>Loading...</p> : null}
          {!spaces.loading && doorways.data.length === 0 ? <p>No Doorways</p> : null}
          {doorwayFilter(doorways.data, doorways.filters.search).map(doorway => {
            return <EnvironmentDoorwayItem key={doorway.id} doorway={doorway} />;
          })}
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
      dispatch(collectionLinksCreate(space.id, doorway.id, sensorPlacement));
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

    onOpenModal(name, data) {
      dispatch(showModal(name, data));
    },
    onCloseModal() {
      dispatch(hideModal());
    },

    onCreateSpace(space) {
      dispatch(collectionSpacesCreate(space));
      dispatch(hideModal());
    },
    onCreateDoorway(doorway) {
      dispatch(collectionDoorwaysCreate(doorway));
      dispatch(hideModal());
    },
    onChangeSensorPlacement(link) {
      const sensorPlacement = link.sensorPlacement === 1 ? -1 : 1;
      dispatch(collectionLinksUpdateSensorPlacement({id: link.id, sensorPlacement}));
      dispatch(hideModal());
    },
  };
})(Environment);
