import * as React from 'react';

export default function UnknownPage({
  invalidUrl,
}) {
  return <div className="unknown-page">
    <h1>We've never heard of {invalidUrl || 'this page'}.</h1>
    <a href="#tokens">Go back home.</a>
  </div>;
}
