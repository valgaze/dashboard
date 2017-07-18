// Given abitrary data, encode it as url-safe base64
export function encode(data) {
  const base64 = btoa(JSON.stringify(data));
  return base64.replace(/\//, '_').replace(/\+/, '-')
}

// Given a url-safe base64, decode into a JSON object
export function decode(slug) {
  const realBase64Slug = slug.replace(/_/, '/').replace(/-/, '+');
  return JSON.parse(atob(realBase64Slug))
}
