# VisualizationSpaceDetailDailyMetricsCard

This component manages data fetching for and rendering of the daily metrics chart. A date range
picker is rendered and used to choose the length of time that the daily metrics card shows on the
screen. It is stateful.

## Component Props
- `space: DensitySpace` - Space to fetch data for in the component.
- `startDate: string` - A timestamp representing the start of the date range to display.
- `endDate: string` - A timestamp representing the end of the date range to display.
