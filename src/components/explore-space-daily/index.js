import React from 'react';
import { connect } from 'react-redux';

import InputBox from '@density/ui-input-box';
import { isInclusivelyBeforeDay } from '@density/react-dates';

import {
  getCurrentLocalTimeAtSpace,
  parseISOTimeAtSpace,
  parseFromReactDates,
  formatInISOTime,
  formatForReactDates,
  prettyPrintHoursMinutes,
} from '../../helpers/space-time-utilities/index';
import { calculate as calculateDailyModules } from '../../actions/route-transition/explore-space-daily';

import Subnav, { SubnavItem } from '../subnav/index';
import ExploreFilterBar, { ExploreFilterBarItem } from '../explore-filter-bar/index';
import ExploreSpaceHeader from '../explore-space-header/index';
import FootTrafficCard from '../explore-space-detail-foot-traffic-card/index';
import RawEventsCard from '../explore-space-detail-raw-events-card/index';
import ErrorBar from '../error-bar/index';

import DatePicker from '@density/ui-date-picker';

import collectionSpacesFilter from '../../actions/collection/spaces/filter';

import {
  DEFAULT_TIME_SEGMENT_GROUP,
  findTimeSegmentInTimeSegmentGroupForSpace,
  parseTimeInTimeSegmentToSeconds,
} from '../../helpers/time-segments/index';

export function ExploreSpaceDaily({
  spaces,
  space,
  timeSegmentGroups,
  activeModal,
  onChangeSpaceFilter,
  onChangeDate,
  onChangeTimeSegmentGroup,
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
        <SubnavItem href={`#/spaces/explore/${spaces.selected}/trends`}>Trends</SubnavItem>
        <SubnavItem active href={`#/spaces/explore/${spaces.selected}/daily`}>Daily</SubnavItem>
        <SubnavItem href={`#/spaces/explore/${spaces.selected}/data-export`}>Data Export</SubnavItem>
      </Subnav>

      <ExploreFilterBar>
        <ExploreFilterBarItem label="Day">
          <DatePicker
            date={formatForReactDates(parseISOTimeAtSpace(spaces.filters.date, space), space)}
            onChange={date => onChangeDate(space, formatInISOTime(parseFromReactDates(date, space)))}

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
        </ExploreFilterBarItem>
        <ExploreFilterBarItem label="Time Segment">
          <InputBox
            type="select"
            className="explore-space-daily-time-segment-box"
            value={selectedTimeSegmentGroup.id}
            choices={timeSegmentGroupArray.map(ts => {
              const applicableTimeSegmentForGroup = findTimeSegmentInTimeSegmentGroupForSpace(
                ts,
                space,
              );
              return {
                id: ts.id,
                label: `${ts.name} (${prettyPrintHoursMinutes(
                  getCurrentLocalTimeAtSpace(space)
                  .startOf('day')
                  .add(parseTimeInTimeSegmentToSeconds(applicableTimeSegmentForGroup.start), 'seconds')
                )} - ${prettyPrintHoursMinutes(
                  getCurrentLocalTimeAtSpace(space)
                  .startOf('day')
                  .add(parseTimeInTimeSegmentToSeconds(applicableTimeSegmentForGroup.end), 'seconds')
                )})`,
              };
            })}
            width={300}
            onChange={value => onChangeTimeSegmentGroup(space, value.id)}
          />
        </ExploreFilterBarItem>
      </ExploreFilterBar>

      <ErrorBar
        message={spaces.error || timeSegmentGroups.error}
        modalOpen={activeModal.name !== null}
      />

      <ExploreSpaceHeader space={space} />

      <div className="explore-space-daily-container">
        <div className="explore-space-daily">
          <div className="explore-space-daily-item">
            <FootTrafficCard
              space={space}
              date={spaces.filters.date}
              timeSegmentGroup={selectedTimeSegmentGroup}
              timeSegment={applicableTimeSegment}
            />
          </div>
          <div className="explore-space-daily-item">
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
    onChangeTimeSegmentGroup(space, value) {
      dispatch(collectionSpacesFilter('timeSegmentGroupId', value));
      dispatch(calculateDailyModules(space));
    },
    onChangeDate(space, value) {
      dispatch(collectionSpacesFilter('date', value));
      dispatch(calculateDailyModules(space));
    },
  };
})(ExploreSpaceDaily);
