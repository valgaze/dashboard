import React from 'react';

export default function AppBar({
  title,
}) {
  return <div className="app-bar">
    <div className="app-bar-title">{title}</div>
  </div>;
}
