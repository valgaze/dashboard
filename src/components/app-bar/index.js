import React from 'react';

export default function AppBar({
  leftSpan,
  rightSpan,
  title,
}) {
  return <div className="app-bar">
    {leftSpan}
    <div className="app-bar-title">{title}</div>
    {rightSpan}
  </div>;
}
