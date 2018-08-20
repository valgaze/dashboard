import React from 'react';
import { connect } from 'react-redux';

import moment from 'moment';
import 'moment-timezone';

import InputBox from '@density/ui-input-box';
import { isInclusivelyBeforeDay } from '@density/react-dates';

import Subnav, { SubnavItem } from '../subnav/index';
import InsightsFilterBar, { InsightsFilterBarItem } from '../insights-filter-bar/index';
import InsightsSpaceHeader from '../insights-space-header/index';
import FootTrafficCard from '../insights-space-detail-foot-traffic-card/index';
import RawEventsCard from '../insights-space-detail-raw-events-card/index';

import DatePicker from '@density/ui-date-picker';

import collectionSpacesFilter from '../../actions/collection/spaces/filter';

import { TIME_SEGMENTS } from '../../helpers/space-utilization/index';

export function InsightsSpaceDaily({
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
        <SubnavItem href={`#/spaces/insights/${spaces.selected}/trends`}>Trends</SubnavItem>
        <SubnavItem active href={`#/spaces/insights/${spaces.selected}/daily`}>Daily</SubnavItem>
        <SubnavItem href={`#/spaces/insights/${spaces.selected}/data-export`}>Data Export</SubnavItem>
      </Subnav>

      <InsightsFilterBar>
        <InsightsFilterBarItem label="Day">
          <DatePicker
            date={moment.utc(spaces.filters.date).tz(space.timeZone).startOf('day').tz('UTC')}
            onChange={date => onChangeSpaceFilter('date', date.format())}

            focused={spaces.filters.datePickerFocused}
            onFocusChange={({focused}) => onChangeSpaceFilter('datePickerFocused', focused)}
            arrowRightDisabled={
              moment.utc(spaces.filters.date).tz(space.timeZone).format('MM/DD/YYYY') === moment.utc().tz(space.timeZone).format('MM/DD/YYYY')
            }

            isOutsideRange={day => !isInclusivelyBeforeDay(day, moment.utc().tz(space.timeZone).startOf('day').tz('UTC'))}
          />
        </InsightsFilterBarItem>
        <InsightsFilterBarItem label="Time Segment">
          <InputBox
            type="select"
            className="insights-space-daily-time-segment-box"
            value={timeSegmentArray.find(i => i.id === spaces.filters.timeSegmentId)}
            choices={timeSegmentArray}
            onChange={value => onChangeSpaceFilter('timeSegmentId', value.id)}
          />
        </InsightsFilterBarItem>
      </InsightsFilterBar>

      <InsightsSpaceHeader space={space} />

      <div className="insights-space-daily-container">
        <div className="insights-space-daily">
          <div className="insights-space-daily-item">
            <FootTrafficCard
              space={space}
              date={spaces.filters.date}
              timeSegmentId={spaces.filters.timeSegmentId}
            />
          </div>
          <div className="insights-space-daily-item">
            <RawEventsCard
              space={space}
              date={spaces.filters.date}
              timeSegmentId={spaces.filters.timeSegmentId}
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
})(InsightsSpaceDaily);
