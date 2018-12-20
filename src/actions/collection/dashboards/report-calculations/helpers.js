import { getCurrentLocalTimeAtSpace } from '../../../../helpers/space-time-utilities/index';
import colorVariables from '@density/ui/variables/colors.json';

export function convertTimeRangeToDaysAgo(space, timeRange) {
  const TODAY = getCurrentLocalTimeAtSpace(space).startOf('day');
  switch (timeRange) {
  case 'YESTERDAY':
    return {
      start: TODAY.clone().subtract(1, 'day').startOf('day'),
      end: TODAY.clone().subtract(1, 'day').endOf('day'),
    };
  case 'LAST_WEEK':
    return {
      start: getCurrentLocalTimeAtSpace(space).subtract(7, 'days').startOf('week'),
      end: getCurrentLocalTimeAtSpace(space).startOf('week'),
    };
  case 'LAST_7_DAYS':
    return {
      start: getCurrentLocalTimeAtSpace(space).subtract(7, 'days'),
      end: TODAY,
    };
  case 'WEEK_TO_DATE':
    return {
      start: getCurrentLocalTimeAtSpace(space).startOf('week'),
      end: TODAY,
    };
  default:
    throw new Error(`Unknown time range in report: ${timeRange}`);
  }
}

export function convertColorToHex(color) {
  return ({
    BLUE: colorVariables.reportBlue,
    BLUE_LIGHT: colorVariables.reportBlueLight,
    GREEN: colorVariables.reportGreen,
    YELLOW: colorVariables.reportYellow,
    ORANGE: colorVariables.reportOrange,
    RED: colorVariables.reportRed,
  })[color] || color;
}

