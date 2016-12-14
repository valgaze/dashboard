export default function fetchParam(location) {
  return location.pathname.split("/").slice(-1)[0];
}
