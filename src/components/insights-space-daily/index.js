import React from 'react';
import { connect } from 'react-redux';

import moment from 'moment';
import 'moment-timezone';

import InputBox from '@density/ui-input-box';
import { isInclusivelyBeforeDay } from '@density/react-dates';

import {
  getCurrentLocalTimeAtSpace,
  parseISOTimeAtSpace,
  parseFromReactDates,
  formatInISOTime,
  formatForReactDates,
  formatTimeSegmentBoundaryTimeForHumans,
} from '../../helpers/space-time-utilities/index';

import Subnav, { SubnavItem } from '../subnav/index';
import InsightsFilterBar, { InsightsFilterBarItem } from '../insights-filter-bar/index';
import InsightsSpaceHeader from '../insights-space-header/index';
import FootTrafficCard from '../insights-space-detail-foot-traffic-card/index';
import RawEventsCard from '../insights-space-detail-raw-events-card/index';
import ErrorBar from '../error-bar/index';

import DatePicker from '@density/ui-date-picker';

import collectionSpacesFilter from '../../actions/collection/spaces/filter';

import {
  DEFAULT_TIME_SEGMENT_GROUP,
  findTimeSegmentInTimeSegmentGroupForSpace,
  parseTimeInTimeSegmentToSeconds,
} from '../../helpers/time-segments/index';

export function InsightsSpaceDaily({
  spaces,
  space,
  timeSegmentGroups,
  activeModal,
  onChangeSpaceFilter,
}) {
  if (space) {
    const timeSegmentGroupArray = [DEFAULT_TIME_SEGMENT_GROUP, ...space.timeSegmentGroups];

    // Which time segment group was selected?
    const selectedTimeSegmentGroup = timeSegmentGroupArray.find(i => i.id === spaces.filters.timeSegmentGroupId);

    // And, with the knowlege of the selected space, which time segment within that time segment
    // group is applicable to this space?
    const applicableTimeSegment = findTimeSegmentInTimeSegmentGroupForSpace(
      selectedTimeSegmentGroup,
      space,
    );

    return <div>
      <Subnav visible>
        <SubnavItem href={`#/spaces/insights/${spaces.selected}/trends`}>Trends</SubnavItem>
        <SubnavItem active href={`#/spaces/insights/${spaces.selected}/daily`}>Daily</SubnavItem>
        <SubnavItem href={`#/spaces/insights/${spaces.selected}/data-export`}>Data Export</SubnavItem>
      </Subnav>

      <InsightsFilterBar>
        <InsightsFilterBarItem label="Day">
          <DatePicker
            date={formatForReactDates(parseISOTimeAtSpace(spaces.filters.date, space))}
            onChange={date => onChangeSpaceFilter('date', formatInISOTime(parseFromReactDates(date)))}

            focused={spaces.filters.datePickerFocused}
            onFocusChange={({focused}) => onChangeSpaceFilter('datePickerFocused', focused)}
            arrowRightDisabled={
              parseISOTimeAtSpace(spaces.filters.date, space).format('MM/DD/YYYY') ===
              getCurrentLocalTimeAtSpace(space).format('MM/DD/YYYY')
            }

            isOutsideRange={day => !isInclusivelyBeforeDay(
              day,
              getCurrentLocalTimeAtSpace(space).startOf('day'),
            )}
          />
        </InsightsFilterBarItem>
        <InsightsFilterBarItem label="Time Segment">
          <InputBox
            type="select"
            className="insights-space-daily-time-segment-box"
            value={selectedTimeSegmentGroup.id}
            choices={timeSegmentGroupArray.map(ts => {
              const applicableTimeSegmentForGroup = findTimeSegmentInTimeSegmentGroupForSpace(
                ts,
                space,
              );
              return {
                id: ts.id,
                label: `${ts.name} (${formatTimeSegmentBoundaryTimeForHumans(
                  getCurrentLocalTimeAtSpace(space)
                  .startOf('day')
                  .add(parseTimeInTimeSegmentToSeconds(applicableTimeSegmentForGroup.start), 'seconds')
                )} - ${formatTimeSegmentBoundaryTimeForHumans(
                  getCurrentLocalTimeAtSpace(space)
                  .startOf('day')
                  .add(parseTimeInTimeSegmentToSeconds(applicableTimeSegmentForGroup.end), 'seconds')
                )})`,
              };
            })}
            width={300}
            onChange={value => onChangeSpaceFilter('timeSegmentGroupId', value.id)}
          />
        </InsightsFilterBarItem>
      </InsightsFilterBar>

      <ErrorBar
        message={spaces.error || timeSegmentGroups.error}
        modalOpen={activeModal.name !== null}
      />

      <InsightsSpaceHeader space={space} />

      <div className="insights-space-daily-container">
        <div className="insights-space-daily">
          <div className="insights-space-daily-item">
            <FootTrafficCard
              space={space}
              date={spaces.filters.date}
              timeSegmentGroup={selectedTimeSegmentGroup}
              timeSegment={applicableTimeSegment}
            />
          </div>
          <div className="insights-space-daily-item">
            <RawEventsCard
              space={space}
              date={spaces.filters.date}
              timeSegmentGroup={selectedTimeSegmentGroup}
              timeSegment={applicableTimeSegment}
            />
          </div>
        </div>
      </div>
    </div>;
  } else {
    return <p>Loading</p>;
  }
}

export default connect(state => {
  return {
    spaces: state.spaces,
    space: state.spaces.data.find(space => space.id === state.spaces.selected),
    timeSegmentGroups: state.timeSegmentGroups,
    activeModal: state.activeModal,
  };
}, dispatch => {
  return {
    onChangeSpaceFilter(key, value) {
      dispatch(collectionSpacesFilter(key, value));
    },
  };
})(InsightsSpaceDaily);
