# PercentageBar

This component renders a horizontal bar with a percentage on the right side of the bar. It's used on
the insights list and detail pages when rendering a space's utilization. It's a stateless component.

If the `percentageFormatter` prop below returns `null`, the component renders its "empty" state.
When in this state, the bar is rendered ampty and a gray dash is rendered instead of the percentage.

## Component Props
- `percentage: Number` - One-hot encoded percentage to (0...1)
- `percentageFormatter: (Number) => String` - A function to convert a numerical percentage into the
  string representation of the percentage that is drawn to the right of the percentage bar. Defaults
  to `n => n.toFixed(2)+'%'`
