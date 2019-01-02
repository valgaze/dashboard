import React from 'react';

interface AppBarProps {
  leftSpan?: JSX.Element,
  rightSpan?: JSX.Element,
  title?: string
}

export default function AppBar({
  leftSpan,
  rightSpan,
  title,
}: AppBarProps) {
  return <div className="app-bar">
    {leftSpan}
    <div className="app-bar-title">{title}</div>
    {rightSpan}
  </div>;
}
