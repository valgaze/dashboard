import React from 'react';

export default function AppFrameHeader({children, color}) {
  return (
    <div className="app-frame-header" style={{backgroundColor: color}}>
      {children}
    </div>
  );
}

export function AppFrameHeaderItem({children}) {
  return (
    <div className="app-frame-header-item">
      {children}
    </div>
  );
}

export function AppFrameHeaderText({children}) {
  return (
    <span className="app-frame-header-text">
      {children}
    </span>
  );
}
