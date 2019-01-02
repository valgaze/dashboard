import moment from 'moment';
import fetchAllPages from '../../../../helpers/fetch-all-pages/index';
import objectSnakeToCamel from '../../../../helpers/object-snake-to-camel/index';
import {
  formatInISOTimeAtSpace,
} from '../../../../helpers/space-time-utilities/index';
import { core } from '../../../../client';

import { convertTimeRangeToDaysAgo } from './helpers';

const MOST_VISITED = 'MOST_VISITED', LEAST_VISITED = 'LEAST_VISITED';

const REPORT_SETTINGS_MODE_TO_COMPONENT_MODE = {
  'MOST_VISITED': MOST_VISITED,
  'LEAST_VISITED': LEAST_VISITED,
};

export default async function totalVisitsRollup(report) {
  const allSpaces = (await fetchAllPages(page => (
    core.spaces.list({page, page_size: 5000})
  ))).map(objectSnakeToCamel);

  const spaces = allSpaces.filter(space => report.settings.spaceIds.indexOf(space.id) >= 0);

  // For each space, fetch counts data for the given time range. A single bucket should be returned
  // for each request, as the interval should be the same size as the time range requested.
  const visitsBySpace = {
    /* 'spc_xxx': [{timestamp: "...", interval: {...}, count: 100}], */
  };
  await Promise.all(spaces.map(async (space, index) => {
    const timeRange = convertTimeRangeToDaysAgo(space, report.settings.timeRange);
    const responseData = await fetchAllPages(page => {
      return core.spaces.counts({
        id: space.id,
        // Calculate an `interval` parameter that guarantees a single count bucket be returned
        // between the start and end times.
        interval: `${Math.ceil(
          moment.duration(timeRange.end.diff(timeRange.start)).asSeconds()
        )}s`,
        start_time: formatInISOTimeAtSpace(timeRange.start, space),
        end_time: formatInISOTimeAtSpace(timeRange.end, space),
        time_segment_group_ids: report.settings.timeSegmentGroupId,
        page,
        page_size: 5000,
      });
    });
    visitsBySpace[space.id] = {responseData, space};
  }));

  const visits: any[] = [];
  for (const spaceId in visitsBySpace) {
    const space = visitsBySpace[spaceId].space;

    if (visitsBySpace[spaceId].responseData.length === 0) {
      const timeRange = convertTimeRangeToDaysAgo(space, report.settings.timeRange);
      throw new Error([
        `Space ${space.name} did not return count data when queried for the time range of `,
        `${report.settings.timeRange} (${formatInISOTimeAtSpace(timeRange.start, space)} `,
        `- ${formatInISOTimeAtSpace(timeRange.end, space)})`,
      ].join(''));
    }

    visits.push({
      id: space.id,
      name: space.name,
      visits: visitsBySpace[spaceId].responseData[0].interval.analytics.entrances,
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

    mode: REPORT_SETTINGS_MODE_TO_COMPONENT_MODE[report.settings.mode],
    visits: visits,
  };
}
