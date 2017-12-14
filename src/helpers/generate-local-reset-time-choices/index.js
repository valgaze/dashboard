import moment from 'moment';
import 'moment-timezone';

// Generate reset time options
export default function generateLocalResetTimeChoices(zone) {
  let resetTimeOptions = [];
  const startOfDay = moment.utc().tz(zone).startOf('day').subtract(1, 'hour');
  for (let i = 0; i < 24; i++) {
    const time = startOfDay.add(1, 'hours');

    // Add the option to the selectbox.
    resetTimeOptions.push({
      localTime: time.tz(zone).format('h:mm a'), // 12 hour, include am/pm
      utc: time.utc().format('H:mm'), // 24 hour, no am/pm
    });
  }

  return resetTimeOptions;
}
