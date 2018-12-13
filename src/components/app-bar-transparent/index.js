import React from 'react';

export default function AppBarTransparent({
  leftSpan,
  rightSpan,
  title,
}) {
  return <div className="app-bar-transparent">
    {leftSpan}
    <div className="app-bar-transparent-title">{title}</div>
    {rightSpan}
  </div>;
}
