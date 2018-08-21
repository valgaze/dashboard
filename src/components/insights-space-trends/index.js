import React from 'react';
import { connect } from 'react-redux';

import moment from 'moment';
import 'moment-timezone';

import InputBox from '@density/ui-input-box';
import InfoPopup from '@density/ui-info-popup';
import { IconInfo } from '@density/ui-icons';
import { isInclusivelyBeforeDay, isInclusivelyAfterDay } from '@density/react-dates';

import Subnav, { SubnavItem } from '../subnav/index';
import InsightsFilterBar, { InsightsFilterBarItem } from '../insights-filter-bar/index';
import InsightsSpaceHeader from '../insights-space-header/index';
import IncludeWeekendsSwitch from '../include-weekends-switch/index';
import UtilizationCard from '../insights-space-detail-utilization-card/index';

import DailyMetricsCard from '../insights-space-detail-daily-metrics-card/index';

import DateRangePicker from '@density/ui-date-range-picker';
import gridVariables from '@density/ui/variables/grid.json'

import collectionSpacesFilter from '../../actions/collection/spaces/filter';

import commonRanges from '../../helpers/common-ranges';
import { TIME_SEGMENTS } from '../../helpers/space-utilization/index';

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
  onChangeSpaceFilter,
}) {
  if (space) {
    const timeSegmentArray = Object.entries(TIME_SEGMENTS).map(([key, {start, end, name}]) => {
      return {
        id: key,
        label: <span>
          {name} (
          {start > 12 ? `${start-12}p` : `${start === 0 ? '12' : start}a`} -{' '}
          {end > 12 ? `${end-12}p` : `${end}a`}
        ) </span>,
      };
    });

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
            value={timeSegmentArray.find(i => i.id === spaces.filters.timeSegmentId)}
            choices={timeSegmentArray}
            onChange={value => onChangeSpaceFilter('timeSegmentId', value.id)}
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
              onChangeSpaceFilter('startDate', startDate);
              onChangeSpaceFilter('endDate', endDate);
            }}
          />
        </InsightsFilterBarItem>
        <InsightsFilterBarItem label={<span className="insights-space-trends-include-weekends-info">
          Include Weekends
          <InfoPopup target={<IconInfo width={12} height={12} color="primary" />}>
            Include weekend data in <strong>An Average week</strong> and <strong>An Average
            Day</strong> charts. Daily metrics will always include weekends.
          </InfoPopup>
        </span>}>
          <IncludeWeekendsSwitch
            value={spaces.filters.includeWeekends}
            onChange={e => onChangeSpaceFilter('includeWeekends', e.target.checked)}
          />
        </InsightsFilterBarItem>
      </InsightsFilterBar>

      <InsightsSpaceHeader space={space} />

      <div className="insights-space-trends-container">
        <div className="insights-space-trends">
          <div className="insights-space-trends-item">
            <UtilizationCard
              space={space}
              startDate={spaces.filters.startDate}
              endDate={spaces.filters.endDate}
              timeSegmentId={spaces.filters.timeSegmentId}
              includeWeekends={spaces.filters.includeWeekends}
            />
          </div>
          <div className="insights-space-trends-item">
            <DailyMetricsCard
              space={space}
              startDate={spaces.filters.startDate}
              endDate={spaces.filters.endDate}
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
  };
}, dispatch => {
  return {
    onChangeSpaceFilter(key, value) {
      dispatch(collectionSpacesFilter(key, value));
    },
  };
})(InsightsSpaceTrends);
