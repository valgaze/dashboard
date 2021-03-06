import { getCurrentLocalTimeAtSpace } from '../../../../helpers/space-time-utilities/index';
import colorVariables from '@density/ui/variables/colors.json';

export function convertTimeRangeToDaysAgo(space, timeRange) {
  const TODAY = getCurrentLocalTimeAtSpace(space).startOf('day');
  switch (timeRange) {
  case 'LAST_WEEK':
    return {
      start: getCurrentLocalTimeAtSpace(space).subtract(7, 'days').startOf('week'),
      end: getCurrentLocalTimeAtSpace(space).startOf('week'),
    };
  case 'LAST_4_WEEKS':
    return {
      start: getCurrentLocalTimeAtSpace(space).subtract(28, 'days').startOf('week'),
      end: getCurrentLocalTimeAtSpace(space).startOf('week'),
    };
  case 'WEEK_TO_DATE':
    return {
      start: getCurrentLocalTimeAtSpace(space).startOf('week'),
      end: TODAY,
    };
  case 'LAST_7_DAYS':
    return {
      start: getCurrentLocalTimeAtSpace(space).subtract(7, 'days').startOf('day'),
      end: TODAY,
    };
  case 'LAST_28_DAYS':
    return {
      start: getCurrentLocalTimeAtSpace(space).subtract(28, 'days').startOf('day'),
      end: TODAY,
    };
  default:
    throw new Error(`Unknown time range in report: ${timeRange}`);
  }
}

export function convertColorToHex(color) {
  return ({
    BLUE: colorVariables.brandPrimaryNew,
    BLUE_LIGHT: colorVariables.reportBlueLight,
    GREEN: colorVariables.reportGreen,
    YELLOW: colorVariables.reportYellow,
    ORANGE: colorVariables.reportOrange,
    RED: colorVariables.reportRed,
  })[color] || color;
}

