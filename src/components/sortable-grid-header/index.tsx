import * as React from 'react';
import classnames from 'classnames';

export default function SortableGridHeader({className, children}) {
  return <tr className={`sortable-grid-header ${className}`}>{children}</tr>;
}

export const SORT_ASC = 'SORT_ASC',
             SORT_DESC = 'SORT_DESC';

const CARET_POINTING_UP = String.fromCharCode(59659);

export function SortableGridHeaderItem({className, children, active, sort, onActivate, onFlipSortOrder}) {
  return <td
    className={classnames('sortable-grid-header-item', {active}, className)}
    onClick={() => {
      if (active) {
        // If already active, flip the sort order.
        return onFlipSortOrder(sort === SORT_ASC ? SORT_DESC : SORT_ASC);
      } else {
        // If not active, make this the active header item.
        return onActivate();
      }
    }}
  >
    <span className="sortable-grid-header-item-label">{children}</span>
    {active ? <span
      className={classnames('sortable-grid-header-item-icon', {
        'sortable-grid-header-item-icon-asc': sort === SORT_ASC,
        'sortable-grid-header-item-icon-desc': sort === SORT_DESC,
      })}
    >{CARET_POINTING_UP}</span> : null}
  </td>;
}
