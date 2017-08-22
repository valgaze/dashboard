import moment from 'moment';
import 'moment-timezone';

// Generate reset time options
export default function generateLocalResetTimeChoices(zone) {
  // Calculate the number of hours away the current timemzone is from UTC.
  const hoursOffsetFromUtc = parseInt(moment.tz(zone).format('Z').split(':')[0], 10);

  function formatTime(hour) {
    if (hour === 0) {
      return '12:00 am';
    } else if (hour > 0 && hour < 12) {
      return `${hour}:00 am`;
    } else if (hour === 12) {
      return '12:00 pm';
    } else {
      return `${hour % 12}:00 pm`;
    }
  }

  let resetTimeOptions = [];
  for (let i = 0; i < (24 - hoursOffsetFromUtc); i++) {
    const timeZoneHour = i + hoursOffsetFromUtc;
    if (timeZoneHour < 0) { continue; }

    // Add the option to the selectbox.
    resetTimeOptions.push({localTime: formatTime(timeZoneHour), utc: `${i % 24}:00`});
  }

  return resetTimeOptions;
}
