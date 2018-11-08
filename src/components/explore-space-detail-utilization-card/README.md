# ExploreSpaceDetailUtilizationChart

This component implements a chart that lived on the explore detail page. The chart allows the user
to pick a date range and a time segment and see average utilizations for each day, the time within
the specified time range of peak utilization, and an average day's utilization.

## Component Props
- `space: DensitySpace` - The space to fetch data from to display in the chart.
- `startDate: string` - A timestamp representing the start of the date range to display.
- `endDate: string` - A timestamp representing the end of the date range to display.
- `timeSegmentId: string` - A time segment id representing a time segment to scope utilization data
  to.
