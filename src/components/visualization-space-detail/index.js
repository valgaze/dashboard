import * as React from 'react';
import { connect } from 'react-redux';

import TwentyFourHourCard from '../visualization-space-detail-24-hour-chart/index';
import DailyMetricsCard from '../visualization-space-detail-daily-metrics-card/index';
import RawEventsCard from '../visualization-space-detail-raw-events-card/index';
import UtilizationCard from '../insights-space-detail-utilization-card/index';
import SetCapacityModal from '../insights-set-capacity-modal/index';

import collectionSpacesUpdate from '../../actions/collection/spaces/update';

import { getParentsOfSpace } from '../../helpers/filter-hierarchy/index';

import { IconChevronRight } from '@density/ui-icons';

import showModal from '../../actions/modal/show';
import hideModal from '../../actions/modal/hide';

export function SpaceDetail({
  space,
  spaces,
  activeModal,

  onOpenModal,
  onCloseModal,
  onSetCapacity,
}) {
  if (space) {
    return <div className="visualization-space-detail">

      {/* Modal that is used to let the user set the capacity of a space. Shown when the user clicks
      on a 'set capacity' link within a space row if the space capacity isn't set. If the capacity
      is already set, the capacity can be adjusted from within the detail page. */}
      {activeModal.name === 'set-capacity' ? <SetCapacityModal
        space={activeModal.data.space}
        onSubmit={capacity => onSetCapacity(activeModal.data.space, capacity)}
        onDismiss={onCloseModal}
      /> : null}

      <div className="visualization-space-detail-container">
        {/* Page header */}
        <div className="visualization-space-detail-header">
          <div className="visualization-space-detail-header-row">
            <h1 className="visualization-space-detail-header-text-container">
              <a href="#/spaces/insights" className="visualization-space-detail-header-back-section">
                &#xe90e;
              </a>
              <span className="visualization-space-detail-header-title">{space.name}</span>
              <div className="visualization-space-detail-capacity">
                {space.capacity ? <span>
                  Capacity: {space.capacity} <a
                    className="visualization-space-detail-capacity-update-link"
                    onClick={() => {
                      return onOpenModal('set-capacity', {space});
                    }}
                  >Edit</a>
                </span> : <span>
                  <a
                    className="visualization-space-detail-capacity-set-link"
                    onClick={() => {
                      return onOpenModal('set-capacity', {space});
                    }}
                  >Set Capacity</a>
                </span>}
              </div>
            </h1>

            {/* Attempt to display a nicer representation of the time zone, but fall back on the time zone name */}
            <div className="visualization-space-detail-header-time-zone">
              Time Zone: <span className="visualization-space-detail-header-time-zone-label">
                {({
                  'America/New_York': 'Eastern',
                  'America/Chicago': 'Central',
                  'America/Denver': 'Mountain',
                  'America/Los_Angeles': 'Pacific',
                })[space.timeZone] || space.timeZone}
              </span>
            </div>
          </div>

          <div className="visualization-space-detail-header-hierarchy">
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
                      className="visualization-space-detail-header-hierarchy-level"
                      key={name}
                    >{name}</span>,
                  ];
                }, [])
                .slice(1)
            }
          </div>
        </div>

        <UtilizationCard space={space} />

        {/* Daily Metrics chart card */}
        <DailyMetricsCard space={space} />

        {/* 24 hour chart card */}
        <TwentyFourHourCard space={space} />

        {/* Raw Events chart card */}
        <RawEventsCard space={space} />
      </div>
    </div>;
  } else if (spaces.loading) {
    return <div className="visualization-space-detail-loading">Loading Space...</div>;
  } else if (!space && !spaces.loading) {
    return <div className="visualization-space-detail-loading">This space doesn't exist.</div>;
  } else {
    return <div className="visualization-space-detail-loading">{spaces.error}</div>;
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
})(SpaceDetail);
