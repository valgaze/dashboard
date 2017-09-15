export default function getTimeZoneGeneralizedShortName(timezone) {
  switch (timezone) {
  case 'America/New_York':
    return 'ET';
  case 'America/Chicago':
    return 'CT';
  case 'America/Denver':
    return 'MT';
  case 'America/Los_Angeles':
    return 'PT';
  default:
    return timezone;
  }
}
