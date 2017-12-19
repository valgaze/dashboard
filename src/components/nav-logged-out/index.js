import * as React from 'react';

// TODO (GC 2017-12-19): Make the Density UI Navbar component work for this case
export default function NavLoggedOut() {
  return <div className="navbar">
    <div className="navbar-container">
      <button className="navbar-sidebar-button navbar-sidebar-button-disabled"></button>
      <div className="navbar-brand">
        <img src="http://style-guide.density.io/assets/images/app_bar_logo.png" alt="Density Logo" />
      </div>
    </div>
  </div>;
}
