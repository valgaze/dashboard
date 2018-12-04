import React from 'react';

export default function AppFrameColumn({title, children}) {
  return (
    <div className="app-frame-column">
      <div className="app-frame-column-header">
        <span className="app-frame-column-header-title">{title}</span>
      </div>
      <div className="app-frame-column-body">
        {children}
      </div>
    </div>
  );
}
