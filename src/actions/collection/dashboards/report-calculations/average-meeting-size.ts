import fetchAllPages from '../../../../helpers/fetch-all-pages/index';
import objectSnakeToCamel from '../../../../helpers/object-snake-to-camel/index';
import {
  formatInISOTimeAtSpace,
} from '../../../../helpers/space-time-utilities/index';
import { core } from '../../../../client';

import { convertTimeRangeToDaysAgo } from './helpers';

const BEST = 'BEST', WORST = 'WORST';

const REPORT_SETTINGS_MODE_TO_COMPONENT_MODE = {
  'BEST': BEST,
  'WORST': WORST,
};

export default async function averageMeetingSize(report) {
  const allSpaces = (await fetchAllPages(page => (
    core.spaces.list({page, page_size: 5000})
  ))).map(objectSnakeToCamel);

  const spaces = allSpaces.filter(space => space.capacity && report.settings.spaceIds.indexOf(space.id) >= 0);

  // For each space, fetch the count at a 5 minute interval using the given start time, end time,
  // and time segment group ids.
  const countsBySpace: {[spaceId: string]: any} = {
    /* 'spc_xxx': [{timestamp: "...", interval: {...}, count: 100}, ...], */
  };

  await Promise.all(spaces.map(async (space, index) => {
    const timeRange = convertTimeRangeToDaysAgo(space, report.settings.timeRange);
    const responseData = await fetchAllPages(page => {
      return core.spaces.counts({
        id: space.id,
        interval: '5m',
        start_time: formatInISOTimeAtSpace(timeRange.start, space),
        end_time: formatInISOTimeAtSpace(timeRange.end, space),
        time_segment_group_ids: report.settings.timeSegmentGroupId,
        page,
        page_size: 5000,
      });
    });
    countsBySpace[space.id] = {responseData, space};
  }));

  const data: any[] = [];
  for (const spaceId in countsBySpace) {
    const meetingSeats: number[] = [];
    let lastMeetingSize = 0;
    while (countsBySpace[spaceId].responseData.length > 0) {
      const nextCount = countsBySpace[spaceId].responseData.shift();
      if (nextCount.interval.analytics.max > 0) {
        lastMeetingSize = Math.max(lastMeetingSize, nextCount.interval.analytics.max);
      } else if (lastMeetingSize > 0) {
        meetingSeats.push(lastMeetingSize);
        lastMeetingSize = 0;
      }
    }
    const averageMeetingSeats = meetingSeats.length ? 
      Math.ceil(meetingSeats.reduce((a, b) => a + b, 0) / meetingSeats.length) : 
      0;
    data.push({
      id: spaceId,
      spaceName: countsBySpace[spaceId].space.name,
      availableSeats: countsBySpace[spaceId].space.capacity,
      averageMeetingSeats: averageMeetingSeats
    });
  }

  // XXX
  // How do we determine which time range to display in the header of the report, given that the
  // time range to be rendered requires a space to be provided?
  // Answer: at the moment, display the time range for the first space.
  const displayedTimeRange = convertTimeRangeToDaysAgo(spaces[0], report.settings.timeRange);
  // XXX

  return {
    title: report.name,
    startDate: displayedTimeRange.start,
    endDate: displayedTimeRange.end,

    sortOrder: REPORT_SETTINGS_MODE_TO_COMPONENT_MODE[report.settings.mode],
    data: data,
  };
}
