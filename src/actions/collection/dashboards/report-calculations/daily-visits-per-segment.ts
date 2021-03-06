import objectSnakeToCamel from '../../../../helpers/object-snake-to-camel/index';
import fetchAllPages from '../../../../helpers/fetch-all-pages/index';
import { formatInISOTimeAtSpace, parseISOTimeAtSpace, requestCountsForLocalRange } from '../../../../helpers/space-time-utilities/index';
import { core } from '../../../../client';

import { convertTimeRangeToDaysAgo } from './helpers';

export default async function dailyVisitsPerSegment(report) {
  const space: any = objectSnakeToCamel(await core.spaces.get({ id: report.settings.spaceId }));
  const timeRange = convertTimeRangeToDaysAgo(space, report.settings.timeRange);

  // Get all time segment names
  const timeSegmentGroupsPromise = fetchAllPages(
    page => core.time_segment_groups.list({page, page_size: 5000})
  );


  // For each time segment group, make a request to the spaces/:id/counts endpoint for a
  // single space with an interval of a day, passing the given time range, and the given time
  // segment group.
  const countsPerTimeSegmentPromise = Promise.all(report.settings.timeSegmentGroupIds.map(tsgId => {
    return requestCountsForLocalRange(
      space,
      formatInISOTimeAtSpace(timeRange.start, space),
      formatInISOTimeAtSpace(timeRange.end, space),
      {
        interval: '1d',
        order: 'desc',
        page_size: 5000,
        time_segment_groups: tsgId,
      }
    )
  }));

  const [countsPerTimeSegment, timeSegmentGroupsUnprocessed]: [any, any] = await Promise.all([
    countsPerTimeSegmentPromise,
    timeSegmentGroupsPromise,
  ]);
  const timeSegmentGroups = timeSegmentGroupsUnprocessed.map(objectSnakeToCamel);

  // For each cell at a date represented by D and a time segment group represented by G:
  // - Find the request made with the given time segment group G
  // - Find the count bucket that has a date within the day D
  // - Extract the entrances value, and assign this value to the cell.
  // - Store this into data[G][D]
  const data = report.settings.timeSegmentGroupIds.map((timeSegmentGroupId, index) => {
    const timeSegmentGroupData: number[] = [];
    for (let day = timeRange.start.clone(); day.isBefore(timeRange.end); day = day.clone().add(1, 'day')) {
      const todaysBucket = countsPerTimeSegment[index].find(bucket => {
        const localBucketTimestamp = parseISOTimeAtSpace(bucket.timestamp, space);
        return localBucketTimestamp.format('YYYY-MM-DD') === day.format('YYYY-MM-DD');
      });
      timeSegmentGroupData.push(todaysBucket ? todaysBucket.interval.analytics.entrances : null);
    }
    return timeSegmentGroupData;
  });

  const timeSegmentNames = report.settings.timeSegmentGroupIds.map(id => timeSegmentGroups.find(t => t.id === id).name);

  return {
    title: report.name,
    startDate: timeRange.start,
    endDate: timeRange.end,
    spaces: [space.name],
    timeSegmentNames,
    data,
  };
}
