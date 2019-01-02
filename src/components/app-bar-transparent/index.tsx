import React from 'react';

interface AppBarTransparentProps {
  leftSpan?: JSX.Element,
  rightSpan?: JSX.Element,
  title?: string
}

export default function AppBarTransparent({
  leftSpan,
  rightSpan,
  title,
}: AppBarTransparentProps) {
  return <div className="app-bar-transparent">
    {leftSpan}
    <div className="app-bar-transparent-title">{title}</div>
    {rightSpan}
  </div>;
}
