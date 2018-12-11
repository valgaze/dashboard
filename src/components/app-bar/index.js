import React from 'react';

export default function AppBar({
  leftSpan,
  title,
}) {
  return <div className="app-bar">
    {leftSpan}
    <div className="app-bar-title">{title}</div>
  </div>;
}
