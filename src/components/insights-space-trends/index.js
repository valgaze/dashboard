import React from 'react';
import { connect } from 'react-redux';

import moment from 'moment';
import 'moment-timezone';

import InputBox from '@density/ui-input-box';
import { isInclusivelyBeforeDay, isInclusivelyAfterDay } from '@density/react-dates';

import Subnav, { SubnavItem } from '../subnav/index';
import InsightsFilterBar, { InsightsFilterBarItem } from '../insights-filter-bar/index';
import InsightsSpaceHeader from '../insights-space-header/index';
import UtilizationCard from '../insights-space-detail-utilization-card/index';
import ErrorBar from '../error-bar/index';

import DailyMetricsCard from '../insights-space-detail-daily-metrics-card/index';

import DateRangePicker from '@density/ui-date-range-picker';
import gridVariables from '@density/ui/variables/grid.json'

import collectionSpacesFilter from '../../actions/collection/spaces/filter';

import commonRanges from '../../helpers/common-ranges';
import {
  DEFAULT_TIME_SEGMENT_GROUP,
  findTimeSegmentInTimeSegmentGroupForSpace,
  parseTimeInTimeSegmentToSeconds,
} from '../../helpers/time-segments/index';

// The maximum number of days that can be selected by the date range picker
const MAXIMUM_DAY_LENGTH = 3 * 31; // Three months of data

// When the user selects a start date, select a range that's this long. THe user can stil ladjust
// the range up to a maximum length of `MAXIMUM_DAY_LENGTH` though.
const INITIAL_RANGE_SELECTION = MAXIMUM_DAY_LENGTH / 2;

// Given a day on the calendar and the current day, determine if the square on the calendar should
// be grayed out or not.
export function isOutsideRange(startISOTime, datePickerInput, day) {
  const startDate = moment.utc(startISOTime);
  if (day.isAfter(moment.utc())) {
    return true;
  }

  if (datePickerInput === 'endDate') {
    return datePickerInput === 'endDate' && startDate &&
      !( // Is the given `day` within `MAXIMUM_DAY_LENGTH` days from the start date?
        isInclusivelyAfterDay(day, startDate) &&
        isInclusivelyBeforeDay(day, startDate.clone().add(MAXIMUM_DAY_LENGTH - 1, 'days'))
      );
  }
  return false;
}

function InsightsSpaceTrends({
  spaces,
  space,
  activeModal,
  timeSegmentGroups,
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
        <SubnavItem active href={`#/spaces/insights/${spaces.selected}/trends`}>Trends</SubnavItem>
        <SubnavItem href={`#/spaces/insights/${spaces.selected}/daily`}>Daily</SubnavItem>
        <SubnavItem href={`#/spaces/insights/${spaces.selected}/data-export`}>Data Export</SubnavItem>
      </Subnav>

      <InsightsFilterBar>
        <InsightsFilterBarItem label="Time Segment">
          <InputBox
            type="select"
            className="insights-space-trends-time-segment-box"
            value={selectedTimeSegmentGroup.id}
            choices={timeSegmentGroupArray.map(ts => {
              const applicableTimeSegmentForGroup = findTimeSegmentInTimeSegmentGroupForSpace(
                ts,
                space,
              );
              return {
                id: ts.id,
                label: `${ts.name} (${(
                  moment.utc()
                    .tz(space.timeZone)
                    .startOf('day')
                    .add(parseTimeInTimeSegmentToSeconds(applicableTimeSegmentForGroup.start), 'seconds')
                    .format('h:mma')
                    .slice(0, -1) /* am -> a */
                )} - ${(
                  moment.utc()
                    .tz(space.timeZone)
                    .startOf('day')
                    .add(parseTimeInTimeSegmentToSeconds(applicableTimeSegmentForGroup.end), 'seconds')
                    .format('h:mma')
                    .slice(0, -1) /* am -> a */
                )})`,
              };
            })}
            width={300}
            onChange={value => onChangeSpaceFilter('timeSegmentGroupId', value.id)}
          />
        </InsightsFilterBarItem>
        <InsightsFilterBarItem label="Date Range">
          <DateRangePicker
            startDate={moment.utc(spaces.filters.startDate).tz(space.timeZone).startOf('day')}
            endDate={moment.utc(spaces.filters.endDate).tz(space.timeZone).startOf('day')}
            onChange={({startDate, endDate}) => {
              // If the user selected over 14 days, then clamp them back to 14 days.
              if (startDate && endDate && endDate.diff(startDate, 'days') > MAXIMUM_DAY_LENGTH) {
                endDate = startDate.clone().add(INITIAL_RANGE_SELECTION-1, 'days');
              }

              onChangeSpaceFilter('startDate', startDate.format());
              onChangeSpaceFilter('endDate', endDate.format());
            }}
            // Within the component, store if the user has selected the start of end date picker
            // input
            focusedInput={spaces.filters.datePickerInput}
            onFocusChange={(focused, a) => {
              onChangeSpaceFilter('datePickerInput', focused);
            }}

            // On mobile, make the calendar one month wide and left aligned.
            // On desktop, the calendar is two months wide and right aligned.
            numberOfMonths={document.body && document.body.clientWidth > gridVariables.screenSmMin ? 2 : 1}

            isOutsideRange={day => isOutsideRange(
              spaces.filters.startDate,
              spaces.filters.datePickerInput,
              day
            )}

            // common ranges functionality
            commonRanges={commonRanges}
            onSelectCommonRange={({startDate, endDate}) => {
              onChangeSpaceFilter('startDate', startDate.format());
              onChangeSpaceFilter('endDate', endDate.format());
            }}
          />
        </InsightsFilterBarItem>
      </InsightsFilterBar>

      <ErrorBar
        message={spaces.error || timeSegmentGroups.error}
        modalOpen={activeModal.name !== null}
      />

      <InsightsSpaceHeader space={space} />

      <div className="insights-space-trends-container">
        <div className="insights-space-trends">
          <div className="insights-space-trends-item">
            <UtilizationCard
              space={space}
              startDate={spaces.filters.startDate}
              endDate={spaces.filters.endDate}
              timeSegmentGroup={selectedTimeSegmentGroup}
              timeSegment={applicableTimeSegment}
            />
          </div>
          <div className="insights-space-trends-item">
            <DailyMetricsCard
              space={space}
              startDate={spaces.filters.startDate}
              endDate={spaces.filters.endDate}
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
    activeModal: state.activeModal,
    timeSegmentGroups: state.timeSegmentGroups,
  };
}, dispatch => {
  return {
    onChangeSpaceFilter(key, value) {
      dispatch(collectionSpacesFilter(key, value));
    },
  };
})(InsightsSpaceTrends);
