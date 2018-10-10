import React from 'react';
import { DensityLogo } from '@density/ui-density-mark';

// TODO (GC 2017-12-19): Make the Density UI Navbar component work for this case
export default function NavLoggedOut() {
  return <div className="navbar">
    <div className="navbar-container">
      <button className="navbar-sidebar-button navbar-sidebar-button-disabled"></button>
      <div className="navbar-brand">
        <DensityLogo size={20} />
      </div>
    </div>
  </div>;
}
