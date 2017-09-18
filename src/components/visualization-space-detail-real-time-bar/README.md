# VisualizationSpaceDetailRealTimeBar

A bar showing real time count and capacity information on the top of the historical counts page.
Users can click the `Update Count` link to open a modal to updat the count of the space or reset it
to zero. It's connected to the store so that it can set `activeModal` when the `Update Count` link
is clicked.

## Component Props
- `space: DensitySpace` - The space to show count information for and to adjust the count of when
  the update link is pressed.
