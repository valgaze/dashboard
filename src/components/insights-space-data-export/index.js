import React from 'react';
import { connect } from 'react-redux';

import moment from 'moment';
import 'moment-timezone';

import { isInclusivelyBeforeDay, isInclusivelyAfterDay } from '@density/react-dates';

import Subnav, { SubnavItem } from '../subnav/index';
import InsightsFilterBar, { InsightsFilterBarItem } from '../insights-filter-bar/index';
import InsightsSpaceHeader from '../insights-space-header/index';

import RawEventsExportCard from '../insights-space-detail-raw-events-export-card/index';

import DateRangePicker from '@density/ui-date-range-picker';
import gridVariables from '@density/ui/variables/grid.json'

import collectionSpacesFilter from '../../actions/collection/spaces/filter';

import getCommonRangesForSpace from '../../helpers/common-ranges';

import {
  parseISOTimeAtSpace,
  parseFromReactDates,
  formatInISOTime,
  formatForReactDates,
} from '../../helpers/space-time-utilities/index';

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

function InsightsSpaceDataExport({
  spaces,
  space,
  onChangeSpaceFilter,
}) {
  if (space) {
    return <div>
      <Subnav visible>
        <SubnavItem href={`#/spaces/insights/${spaces.selected}/trends`}>Trends</SubnavItem>
        <SubnavItem href={`#/spaces/insights/${spaces.selected}/daily`}>Daily</SubnavItem>
        <SubnavItem active href={`#/spaces/insights/${spaces.selected}/data-export`}>Data Export</SubnavItem>
      </Subnav>

      {spaces.filters.startDate && spaces.filters.endDate ? (
        <InsightsFilterBar>
          <InsightsFilterBarItem label="Date Range">
            <DateRangePicker
              startDate={formatForReactDates(
                parseISOTimeAtSpace(spaces.filters.startDate, space),
                space,
              )}
              endDate={formatForReactDates(
                parseISOTimeAtSpace(spaces.filters.endDate, space),
                space,
              )}
              onChange={({startDate, endDate}) => {
                startDate = parseFromReactDates(startDate, space);
                endDate = parseFromReactDates(endDate, space);

                // If the user selected over 14 days, then clamp them back to 14 days.
                if (startDate && endDate && endDate.diff(startDate, 'days') > MAXIMUM_DAY_LENGTH) {
                  endDate = startDate.clone().add(INITIAL_RANGE_SELECTION-1, 'days');
                }

                onChangeSpaceFilter('startDate', formatInISOTime(startDate));
                onChangeSpaceFilter('endDate', formatInISOTime(endDate));
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
              commonRanges={getCommonRangesForSpace(space)}
              onSelectCommonRange={({startDate, endDate}) => {
                onChangeSpaceFilter('startDate', startDate);
                onChangeSpaceFilter('endDate', endDate);
              }}
            />
          </InsightsFilterBarItem>
        </InsightsFilterBar>
      ) : null}

      <InsightsSpaceHeader space={space} />

      {spaces.filters.startDate && spaces.filters.endDate ? (
        <div className="insights-space-data-export-container">
          <div className="insights-space-data-export">
            <div className="insights-space-data-export-item">
              <RawEventsExportCard
                space={space}
                startDate={spaces.filters.startDate}
                endDate={spaces.filters.endDate}
              />
            </div>
          </div>
        </div>
      ) : null}
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
})(InsightsSpaceDataExport);
