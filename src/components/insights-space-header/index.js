import React from 'react';
import { connect } from 'react-redux';

import SetCapacityModal from '../insights-set-capacity-modal/index';

import collectionSpacesUpdate from '../../actions/collection/spaces/update';

import { getParentsOfSpace } from '../../helpers/filter-hierarchy/index';

import { IconChevronRight } from '@density/ui-icons';

import showModal from '../../actions/modal/show';
import hideModal from '../../actions/modal/hide';

export function InsightsSpaceHeader({
  spaces,
  space,
  activeModal,

  onOpenModal,
  onCloseModal,
  onSetCapacity,
}) {
  if (space) {
    return <div>
      {/* Modal that is used to let the user set the capacity of a space. Shown when the user clicks
      on a 'set capacity' link within a space row if the space capacity isn't set. If the capacity
      is already set, the capacity can be adjusted from within the detail page. */}
      {activeModal.name === 'set-capacity' ? <SetCapacityModal
        space={activeModal.data.space}
        onSubmit={capacity => onSetCapacity(activeModal.data.space, capacity)}
        onDismiss={onCloseModal}
      /> : null}

      <div className="insights-space-header-container">
        <div className="insights-space-header">
          <h1 className="insights-space-header-text">{space.name}</h1>

          {/* Attempt to display a nicer representation of the time zone, but fall back on the time zone name */}
          <div className="insights-space-header-row">
            <div className="insights-space-header-capacity">
              {space.capacity ? <span>
                Capacity: {space.capacity} <a
                  className="insights-space-header-capacity-update-link"
                  onClick={() => {
                    return onOpenModal('set-capacity', {space});
                  }}
                >Edit</a>
              </span> : <span>
                <a
                  className="insights-space-header-capacity-set-link"
                  onClick={() => {
                    return onOpenModal('set-capacity', {space});
                  }}
                >Set Capacity</a>
              </span>}
            </div>
            <div className="insights-space-header-time-zone">
              Time Zone: <span className="visualization-space-detail-header-time-zone-label">
                {({
                  'America/New_York': 'US Eastern',
                  'America/Chicago': 'US Central',
                  'America/Denver': 'US Mountain',
                  'America/Los_Angeles': 'US Pacific',
                })[space.timeZone] || space.timeZone}
              </span>
            </div>
          </div>

          <div className="insights-space-header-hierarchy">
            {
              getParentsOfSpace(spaces.data, space).reverse()
                .slice(0, -1) /* Remove the final space */
                .map(id => spaces.data.find(s => s.id === id))
                .map(space => space.name)
                .reduce((acc, name) => {
                  return [
                    ...acc,
                    <IconChevronRight color="cinder" width={10} height={10} key={`${name}-arrow`} />,
                    <span
                      className="insights-space-header-hierarchy-level"
                      key={name}
                    >{name}</span>,
                  ];
                }, [])
                .slice(1)
            }
          </div>
        </div>
      </div>
    </div>;
  } else {
    return null;
  }
}

export default connect(state => {
  return {
    spaces: state.spaces,
    space: state.spaces.data.find(space => space.id === state.spaces.selected),
    activeModal: state.activeModal,
  };
}, dispatch => {
  return {
    onOpenModal(name, data) {
      dispatch(showModal(name, data));
    },
    onCloseModal() {
      dispatch(hideModal());
    },
    onSetCapacity(space, capacity) {
      dispatch(collectionSpacesUpdate({...space, capacity})).then(ok => {
        ok && dispatch(hideModal());
      });
    },
  };
})(InsightsSpaceHeader);
